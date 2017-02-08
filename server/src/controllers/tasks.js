import express from 'express';
import authenticate from '../middlewares/authenticate';
import { Excerpt, TaskSubmission } from '../db/models';
import knex from 'knex';

var router = express.Router();

// Fetch all tasks submitted by the current user
//
router.get('/', authenticate, (req, res) => {

  TaskSubmission
    .query({
      where: { owner_id: req.currentUser.attributes.id }
    })
    .fetchAll({
      withRelated: [ { 'excerpt' : qb => {
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

  var excerptId = req.body.excerptId;
  var excerpt = req.body.excerpt;
  var pairs = req.body.pairs;

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

        // If the excerpt exists, forge a new task submission
        TaskSubmission
          .forge({
            pairs      : pairs,
            owner_id   : req.currentUser.attributes.id,
            excerpt_id : excerpt.id,
            }, { hasTimestamps: true })
          .save(null, { method: 'insert' })
          .then((data) => {
            res.json({ success: true });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err });
          });

      }
    });

});

// Get all tasks available to the logged in user
//
router.get('/available', authenticate, (req, res) => {

  // Find all the excerpt ids of task submissions the user has made
  
  TaskSubmission
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

export default router;