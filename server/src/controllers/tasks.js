import express from 'express';
import authenticate from '../middlewares/authenticate';
import { Excerpt, Task, TaskFind, TaskFix } from '../db/models';
import { submitFindTask, submitFixTask } from './util/tasksubmit';

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
      console.log(taskSubmissions.models[0].attributes);
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
        // if(taskType === "verify") submitFindTask(req, res, excerpt);

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

// Get all the necessary information needed for a new verify task
//
router.get('/:excerptId/verify', authenticate, (req, res) => {

  TaskFix
    .query({
      where  : { excerpt_id : req.params.excerptId }
    })
    .fetchAll({
      withRelated: [{ 'excerpt' : qb => {
        qb.column('id', 'excerpt', 'status'); 
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

      let data = {
        chosenEdit : attributes.chosen_edit,
        correction : attributes.correction,
        excerpt    : relations.excerpt
      };

      res.json({ data });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });

});

export default router;