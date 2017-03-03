import express from 'express';
import authenticate from '../middlewares/authenticate';
import { Excerpt, Task, TaskFind, TaskFix } from '../db/models';
import { submitFindTask, submitFixTask, submitVerifyTask } from './util/tasksubmit';

var router = express.Router();

// Fetch all tasks submitted by the current user
//
router.get('/', authenticate, (req, res) => {

  Task
    .query({
      where: { owner_id: req.currentUser.attributes.id }
    })
    .fetchAll({
      withRelated: [{ 'excerpt' : qb => {
        qb.column('id', 'title', 'excerpt', 'status'); 
      }}],
    })
    .then(taskSubmissions => {
      res.json({ taskSubmissions });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });

});

// Submit a task and write it to the database
//
router.post('/', authenticate, (req, res) => {

  let excerptId = req.body.excerptId;
  let taskType = req.body.taskType;

  Excerpt
    .query({
      where: { id: excerptId },
      select: ['id', 'title', 'excerpt']
    })
    .fetch()
    .then((excerpt) => {
      if(!excerpt) {
        res.status(500).json({ error: "No such excerpt" });
      } else {

        if(taskType === "find")   submitFindTask(req, res, excerpt);
        if(taskType === "fix")    submitFixTask(req, res, excerpt);
        if(taskType === "verify") submitVerifyTask(req, res, excerpt);

      }
    });

});

// Get all tasks available for completion to the logged in user
//
router.get('/available', authenticate, (req, res) => {

  // Find all the excerpt ids of task submissions the user has made
  
  Task
    .query({
      where : { owner_id : req.currentUser.id },
      select: [ 'excerpt_id' ]
    })
    .fetchAll()
    .then((taskSubmissions) => {

      var submittedTaskExcerptIDs = []
      for(var j=0; j<taskSubmissions.models.length; j++) {
        submittedTaskExcerptIDs.push(taskSubmissions.models[j].attributes.excerpt_id);
      }

      // exclude any excerpts that the user has already submitted a task for

      Excerpt
        .query((qb) => {
          qb
            .where('id', 'not in', submittedTaskExcerptIDs)
            .andWhere('owner_id', '!=', req.currentUser.id );
        })
        .fetchAll()
        .then((excerpts) => {
          var tasks = [];
          for(var i=0; i<excerpts.models.length; i++) {
            tasks.push(excerpts.models[i].attributes);
          }
          res.status(200).json(tasks);
        });

    });
});

// Get all the necessary information needed for a new fix task
//
router.get('/:excerptId/fix', authenticate, (req, res) => {

  TaskFind
    .query({
      where  : { excerpt_id : req.params.excerptId }
    })
    .fetchAll({
      withRelated: [{ 'excerpt' : qb => {
        qb.column('id', 'excerpt', 'status', 'recommended_edits'); 
      }}],
    })
    .then(tasks => {

      // let chosenEdit = -1;
      // let correction = '';
      // for each (model in tasks.models) {
      //
      //   /* here is where the chosen_edit and correction would be made */
      // 
      // }

      let attributes = tasks.models[0].attributes;
      let relations  = tasks.models[0].relations;

      // here, use an algorithm to determine which recommended edit to use.
      let chosenEdit = 0;
      let pair = relations.excerpt.attributes.recommended_edits[chosenEdit];
      let excerpt = relations.excerpt.attributes;

      let taskInfo = {
        chosenEdit,
        pair,
        excerpt
      };

      res.json({ taskInfo });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });

});

// Get all the necessary information needed for a new verify task
//
router.get('/:excerptId/verify', authenticate, (req, res) => {

  TaskFix
    .query({
      where  : { excerpt_id : req.params.excerptId }
    })
    .fetchAll({
      withRelated: [{ 'excerpt' : qb => {
        qb.column('id', 'excerpt', 'status', 'recommended_edits'); 
      }}],
    })
    .then(tasks => {

      // let chosenEdit = -1;
      // let correction = '';
      // for each (model in tasks.models) {
      //
      //   /* here is where the chosen_edit and correction would be made */
      // 
      // }

      let attributes = tasks.models[0].attributes;
      let relations  = tasks.models[0].relations;

      let taskInfo = {
        chosenEdit : attributes.chosen_edit,
        correction : attributes.correction,
        excerpt    : relations.excerpt,
        pair       : relations.excerpt.attributes.recommended_edits[attributes.chosen_edit]
      };

      res.json({ taskInfo });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });

});

router.post('/aggregate', (req, res) => {

  let excerptId = req.body.excerptId;
  let taskType = req.body.taskType;

  Excerpt
    .query({
      where: { id: excerptId },
      select: ['id', 'title', 'excerpt']
    })
    .fetch()
    .then((excerpt) => {
      if(!excerpt) {
        res.status(500).json({ error: "No such excerpt" });
      } else {

      // Find all other task submissions, and calculate whether or not there are sufficient overlapping
      // highlights to proceed to the fix stage
      TaskFind
        .query({
          where  : { excerpt_id : req.body.excerptId },
          select : ['id', 'pairs'] 
        })
        .fetchAll()
        .then(allTaskSubmissions => {

          let stage = 'find';
          let recommended_edits;

          // find all highlights
          // sort by left index
          // check for overlaps
          // remember that two basic (unmerged) pairs *must* be from different user submissions

          // rather than merging two pairs, save the intersection between them
          // for each pass, increment some counter indicating the depth

          // with the final intersections, move the ends of each pair to the beginning and end of the word so they appear sensible

          let allPairs = [];
          for(let i=0; i<allTaskSubmissions.models.length; i++) {
            console.log(allTaskSubmissions.models[i].attributes);
          }

          res.json(allTaskSubmissions);

          // update the excerpt's stage and recommended edits
          // excerpt
          //   .save({
          //     stage,
          //     recommended_edits
          //   })
          //   .then(result => {
          //     res.json(result);
          //   })
          //   .catch(err => {
          //     console.error(err);
          //     res.status(500).json(err);
          //   });

        })
        .catch(err => {
          console.error(err);
          res.status(500).json(err);
        });

      }
    });

});

export default router;