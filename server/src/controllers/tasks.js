import express from 'express';
import authenticate from '../middlewares/authenticate';
import Excerpt from '../models/excerpts';
import TaskSubmission from '../models/task-submissions';
import knex from 'knex';

var router = express.Router();

// Get all tasks available to the logged in user
//
router.get('/', authenticate, (req, res) => {

  // Find all the excerpt ids of task submissions the user has made
  
  TaskSubmission
    .query({
      where : { owner_id : req.currentUser.id },
      select: [ 'excerpt_id' ]
    })
    .fetchAll()
    .then((taskResults) => {

      var submittedTaskExcerptIDs = []
      for(var j=0; j<taskResults.models.length; j++) {
        submittedTaskExcerptIDs.push(taskResults.models[j].attributes.excerpt_id);
      }

      // exclude any excerpts that the user has already submitted a task for

      Excerpt
        .query((qb) => {
          qb
            .where('id', 'not in', submittedTaskExcerptIDs)
            .andWhere('owner_id', '!=', req.currentUser.id );
        })
        .fetchAll()
        .then((excerptResults) => {
          var tasks = [];
          for(var i=0; i<excerptResults.models.length; i++) {
            tasks.push(excerptResults.models[i].attributes);
          }
          res.status(200).json(tasks);
        });


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

export default router;