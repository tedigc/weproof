import express from 'express';
import authenticate from '../middlewares/authenticate';
import { Excerpt, Task, TaskFind, TaskFix } from '../db/models';
import { submitFindTask, submitFixTask, submitVerifyTask } from '../util/submission/tasksubmit';
import aggregate from '../util/aggregation/aggregate';

import knex from 'knex';
import config from '../db/knexfile';
let db = knex(config.development);

let router = express.Router();

/**
 * Fetch all tasks submitted by the current user
 */
router.get('/', authenticate, (req, res) => {

  Task
    .query({
      where: { owner_id: req.currentUser.attributes.id }
    })
    .fetchAll({
      withRelated: [{ 'excerpt' : qb => {
        qb.column('id', 'body', 'accepted'); 
      }}],
    })
    .then(tasks => {

      res.json({ tasks });

    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });

});

/**
 * Submit a task and write it to the database
 */
router.post('/', authenticate, (req, res) => {

  let { excerptId, taskType } = req.body;

  Excerpt
    .query({
      where: { id : excerptId },
      select: ['id', 'title', 'body', 'stage', 'heatmap', 'recommended_edits']
    })
    .fetch()
    .then(excerpt => {
      if(!excerpt) {
        res.status(500).json({ error : "No such excerpt" });
      } else {

        // check that the excerpt stage and task type match
        if(excerpt.get('stage') !== taskType) {
          res.status(403).json({ error : 'The excerpt has progressed to the next stage and is no longer accepting ' + taskType + ' tasks.'});
          return;
        }

        // check if the user has already submitted a task for this excerpt
        db('tasks').where('excerpt_id', excerptId).andWhere('owner_id', req.currentUser.attributes.id).countDistinct('id')
          .then(result => {
            let nTasks = parseInt(result[0].count, 10);
            if(nTasks === 0) {
              if(taskType === "find")   return submitFindTask(req, res, excerpt);
              if(taskType === "fix")    return submitFixTask(req, res, excerpt);
              if(taskType === "verify") return submitVerifyTask(req, res, excerpt);
            } else {
              res.status(403).json({ error : 'You have already submitted a task for this excerpt' });
              return;
            }
          })
          .catch(err => {
            console.error(err);
            res.status(500).json(err);
          });

      }
    })
    .catch(err => {
      console.error(err);      
      res.status(500).json(err);
    });

});

/**
 * Get all tasks available for completion to the logged in user
 */
router.get('/available', authenticate, (req, res) => {

  // Find all the excerpt ids of task submissions the user has made
  Task
    .query({
      where : { owner_id : req.currentUser.id },
      select: [ 'excerpt_id' ]
    })
    .fetchAll()
    .then(tasks => {

      let submittedTaskExcerptIDs = [];
      for(let j=0; j<tasks.models.length; j++) {
        submittedTaskExcerptIDs.push(tasks.models[j].attributes.excerpt_id);
      }

      // exclude any excerpts that the user has already submitted a task for, and exclude tasks that are completed

      Excerpt
        .query((qb) => {

          qb
            .where('id', 'not in', submittedTaskExcerptIDs)
            .andWhere('owner_id', '!=', req.currentUser.id )
            .andWhere('stage', '<>', 'complete');
          
        })
        .fetchAll()
        .then(excerpts => {

          let taskAttributes = [];
          for(let i=0; i<excerpts.models.length; i++) {
            taskAttributes.push(excerpts.models[i].attributes);
          }
          res.status(200).json(taskAttributes);

        });

    });
});

/**
 * Get all the necessary information needed for a new fix task
 */
router.get('/:excerptId/fix', authenticate, (req, res) => {

  TaskFix
    .query({
      where : { excerpt_id : req.params.excerptId }
    })
    .fetchAll()
    .then(tasks => {

      return Excerpt
        .query({
          where : { id : req.params.excerptId },
          select: [ 'id', 'body', 'recommended_edits', 'stage' ]
        })
        .fetch()
        .then(excerpt => {

          if(excerpt.get('stage') !== 'fix') {
            res.status(400).json({ error : 'The excerpt is not currently in this stage.' });
            return;
          }

          let chosenEdit = 0;

          /* algorithm for determining chosen edits */
          if(tasks.models.length === 0) {
            // if there are no fix tasks submitted yet, just choose a random patch to edit
            chosenEdit = Math.floor(Math.random() * excerpt.attributes.recommended_edits.length);
          } else {
            // if edits exist, then choose the edit with the least submissions

            // count the number of submissions for each chosen edit
            let submissionCounter = new Array(excerpt.attributes.recommended_edits.length).fill(0);
            for(let task of tasks.models) {
              let idx = task.attributes.chosen_edit;
              submissionCounter[idx]++;
            }

            // choose the one with the least
            let minIdx = -1;
            let minCount = Number.MAX_SAFE_INTEGER;
            let allValuesTheSame = true;
            for(let i=0; i<submissionCounter.length; i++) {
              let count = submissionCounter[i];

              // check if a different value appears.
              if(allValuesTheSame) {
                allValuesTheSame = count === submissionCounter[0];
              }

              if(count < minCount) {
                minCount = count;
                minIdx = i;
              }
            }

            chosenEdit = (allValuesTheSame) ? Math.floor(Math.random() * excerpt.attributes.recommended_edits.length) : minIdx;
          }

          let patch    = excerpt.attributes.recommended_edits[chosenEdit];
          let taskInfo = {
            chosenEdit,
            patch,
            excerpt : excerpt.attributes
          };

          res.json({ taskInfo });
        })
        .catch(err => {
          res.status(500).json(err);
        });

    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });

});

/**
 * Get all the necessary information needed for a new verify task
 */
router.get('/:excerptId/verify', authenticate, (req, res) => {

  TaskVerify
    .query({
      where : {
        excerpt_id : req.params.excerptId
      }
    })
    .fetchAll({
      withRelated: [
        {'excerpt' : qb => {
          qb.column('id', 'body', 'accepted', 'stage', 'recommended_edits'); 
        }}
      ],
    })
    .then((tasks) => {

      if(excerpt.get('stage') !== 'verify') {
        res.status(400).json({ error : 'The excerpt is not currently in this stage.' });
        return;
      } 

      let recommended_edits  = excerpt.get('recommended_edits');     
      let verifyTasksPerEdit = new Array(recommended_edits.length).fill(0);
      let chosenEdit = -1;

      // if there are no verify tasks submitted, pick a random edit to vote on
      if(tasks.models.length === 0) {
        chosenEdit = (Math.floor(Math.random() * recommended_edits.length));
      } else {
        // else, pick the edit with the fewest verify tasks
        for(let task of tasks.models) {
          verifyTasksPerEdit[task.get('chosen_edit')] += 1;
        }

        console.log(verifyTasksPerEdit);
      }

    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });


  // TaskFix
  //   .query({
  //     where  : { 
  //       excerpt_id : req.params.excerptId,
  //     }
  //   })
  //   .fetchAll({
  //     withRelated: [
  //       {'excerpt' : qb => {
  //         qb.column('id', 'body', 'accepted', 'stage', 'recommended_edits'); 
  //       }},
  //       'verifications'
  //     ],
  //   })
  //   .then(tasks => {

  //     if(excerpt.get('stage') !== 'verify') {
  //       res.status(400).json({ error : 'The excerpt is not currently in this stage.' });
  //       return;
  //     }

  //     let recommended_edits = excerpt.get('recommended_edits');


      // // check which task has the least verifications
      // let fewestVerifications = Number.MAX_SAFE_INTEGER;
      // let selectedTask = null;

      // for(let task of tasks.models) {
      //   let nVerifications = task.relations.verifications.models.length;
      //   if(nVerifications < fewestVerifications) {
      //     fewestVerifications = nVerifications;
      //     selectedTask = task;
      //   }
      // }

      // let attributes = selectedTask.attributes;
      // let relations  = selectedTask.relations;

      // let taskInfo = {
      //   taskFixId  : attributes.id,
      //   chosenEdit : attributes.chosen_edit,
      //   correction : attributes.correction,
      //   excerpt    : relations.excerpt,
      //   patch      : relations.excerpt.attributes.recommended_edits[attributes.chosen_edit]
      // };

      // res.json({ taskInfo });

    // })
    // .catch(err => {
    //   console.error(err);
    //   res.status(500).json({ error: err });
    // });

});

router.post('/testsubmit', (req, res) => {

  let excerptId = req.body.excerptId;
  let taskType  = req.body.taskType;

  req.currentUser = { attributes : { id : req.body.userID }};

  Excerpt
    .query({
      where: { id: excerptId },
      select: ['id', 'title', 'body', 'heatmap', 'recommended_edits']
    })
    .fetch()
    .then((excerpt) => {
      if(!excerpt) {
        res.status(500).json({ error: "No such excerpt" });
      } else {

        if(taskType === "find")   return submitFindTask(req, res, excerpt);
        if(taskType === "fix")    return submitFixTask(req, res, excerpt);
        if(taskType === "verify") return submitVerifyTask(req, res, excerpt);

      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });

}); 

export default router;