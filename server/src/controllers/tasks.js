import express from 'express';
import authenticate from '../middlewares/authenticate';
import { Excerpt, Task, TaskFind, TaskFix } from '../db/models';
import { submitFindTask, submitFixTask, submitVerifyTask } from './util/tasksubmit';
import aggregate from '../util/aggregation/aggregate';

import knex from 'knex';
import config from '../db/knexfile';

let db = knex(config.development);

var router = express.Router();

// Fetch all tasks submitted by the current user
//
router.get('/:filter', authenticate, (req, res) => {

  let filter = req.params.filter;
  let status = (filter === 'all') ? undefined : filter;

  Task
    .query({
      where: { owner_id: req.currentUser.attributes.id }
    })
    .fetchAll({
      withRelated: [{ 'excerpt' : qb => {
        qb.column('id', 'title', 'body', 'status'); 
      }}],
    })
    .then(tasks => {
      let tasksFiltered = [];
      for(let i=0; i<tasks.models.length; i++) {
        let item = tasks.models[i];
        if(filter === 'all' || item.relations.excerpt.attributes.status === status) {
          tasksFiltered.push(item);
        }
      }
      res.json({ tasksFiltered });
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
      select: ['id', 'title', 'body', 'heatmap']
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
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });

});

// Get all tasks available for completion to the logged in user
//
router.get('/available/:filter', authenticate, (req, res) => {

  // Find all the excerpt ids of task submissions the user has made
  Task
    .query({
      where : { owner_id : req.currentUser.id },
      select: [ 'excerpt_id' ]
    })
    .fetchAll()
    .then((taskSubmissions) => {

      var submittedTaskExcerptIDs = [];
      for(var j=0; j<taskSubmissions.models.length; j++) {
        submittedTaskExcerptIDs.push(taskSubmissions.models[j].attributes.excerpt_id);
      }

      // exclude any excerpts that the user has already submitted a task for

      let filter = req.params.filter;
      let stage = (filter === 'all') ? undefined : filter;

      Excerpt
        .query((qb) => {
          if(stage !== undefined) {
            qb
              .where('id', 'not in', submittedTaskExcerptIDs)
              .andWhere('owner_id', '!=', req.currentUser.id )
              .andWhere('stage', stage);
          } else {
            qb
              .where('id', 'not in', submittedTaskExcerptIDs)
              .andWhere('owner_id', '!=', req.currentUser.id );
          }
          
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

  /**
   * 
   * HERE is where changes need to be made. The test data is in the database
   * and now you just need to set up the algorithm for choosing one of the recommended recommended_edits
   * and sending it to the client for the fix task.
   * 
   * This may be wrong, but at first glance, it looks like you will need both the TaskFind query AND an Excerpt query
   * 
   * Excerpt - needed to get access to the recommended edits. Can be done with a 'withRelated' join (already there)
   * 
   * TaskFind (maybe TaskFix instead) - to see which recommended edits already have contributions, so we can ask users to contribute
   * towards recommended_edits with fewer.
   * 
   */


  TaskFind
    .query({
      where  : { excerpt_id : req.params.excerptId }
    })
    .fetchAll({
      withRelated: [{ 'excerpt' : qb => {
        qb.column('id', 'body', 'status', 'recommended_edits'); 
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

      console.log(tasks);

      let attributes = tasks.models[0].attributes;
      let relations  = tasks.models[0].relations;

      // here, use an algorithm to determine which recommended edit to use.
      let chosenEdit = 1;
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
        qb.column('id', 'body', 'status', 'recommended_edits'); 
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
      select: ['id', 'title', 'body', 'heatmap']
    })
    .fetch()
    .then((excerpt) => {
      if(!excerpt) {
        res.status(500).json({ error: "No such excerpt" });
      } else {

        let { body, heatmap } = excerpt.attributes;
        let patches = aggregate(10, body, heatmap);

        let patch1Rough  = body.slice(patches.roughPatches[0][0], patches.roughPatches[0][1]);
        let patch1Merged = body.slice(patches.mergedPatches[0][0], patches.mergedPatches[0][1]);

        let patch2Rough  = body.slice(patches.roughPatches[1][0], patches.roughPatches[1][1]);
        let patch2Merged = body.slice(patches.mergedPatches[1][0], patches.mergedPatches[1][1]);
        

        res.json({ patch1Rough, patch1Merged, patch2Rough, patch2Merged });

      }
    });

});




router.post('/testsubmit', (req, res) => {

  let excerptId = req.body.excerptId;
  let taskType = req.body.taskType;

  req.currentUser = { attributes : { id : req.body.userID }};

  console.log(excerptId);
  console.log(taskType);
  console.log(req.currentUser);

  Excerpt
    .query({
      where: { id: excerptId },
      select: ['id', 'title', 'body', 'heatmap']
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
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });

}); 







export default router;