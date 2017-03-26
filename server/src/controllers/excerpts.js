import express from 'express';
import bookshelf from 'bookshelf';
import when from 'when';
import authenticate from '../middlewares/authenticate';
import { Excerpt, Task } from '../db/models';

let router = express.Router();

// Get all excerpts for the logged in user
//
router.get('/', authenticate, (req, res) => {

  Excerpt
    .where({owner_id: req.currentUser.id})
    .fetchAll({ withRelated: [
      'tasks_find',
      'tasks_fix',
      'tasks_verify'
    ]})
    .then((results) => {
      let excerpts = [];
      for(let i=0; i<results.models.length; i++) {

        let singleExcerpt = {
          attributes : results.models[i].attributes,
          tasksFind   : results.models[i].relations.tasks_find,
          tasksFix    : results.models[i].relations.tasks_fix,
          tasksVerify : results.models[i].relations.tasks_verify
        };
        
        excerpts.push(singleExcerpt);
      }

      res.status(200).json(excerpts);
    });

});

// Submit an excerpt and write it to the database
//
router.post('/', authenticate, (req, res) => {

  let title = req.body.title;
  let body  = req.body.body;
  let heatmap = new Array(req.body.body.length).fill(0);

  // Write the excerpt to the database
  Excerpt
    .forge({
      title    : title,
      body     : body,
      owner_id : req.currentUser.attributes.id,
      heatmap
    }, { hasTimestamps: true })
    .save(null, { method: 'insert'})
    .then(excerpt => {
      res.json({ 
        success : true,
        excerpt
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });

});

// Get an excerpt by its ID
//
router.get('/:excerptId', authenticate, (req, res) => {

  Excerpt
    .query({
      where: { id: req.params.excerptId }
    })
    .fetch()
    .then(excerpt => {

      if(!excerpt) {
        res.status(404).json({ error: "No such excerpt" });
        return;
      }

      let ownerId = parseInt(excerpt.get('owner_id'), 10);
      if(ownerId !== req.currentUser.id) {
        res.status(403).json({ error : "That excerpt does not belong to the current user." });
        return;
      }

      res.status(200).json({
        excerpt: excerpt.attributes
      });

    });

});

// Get an excerpt by its ID and select the bare minimum attributes needed for a task
router.get('/:excerptId/minified', authenticate, (req, res) => {

  Excerpt
    .query({
      where  : { id: req.params.excerptId },
      select : [ 'id', 'body', 'stage' ]
    })
    .fetch()
    .then((excerpt) => {
      if(!excerpt) {
        res.status(404).json({ error: "No such excerpt" });
      } else {

        // check if the user has already contributed to this excerpt's revision
        Task
          .query({
            where : { 
              owner_id : req.currentUser.id,
              excerpt_id : req.params.excerptId
            }
          })
          .fetchAll()
          .then(tasks => {
            
            // If there exists a submission for this excerpt with the current user's ID, let the client know they
            // have already contributed.
            let contributed = tasks.models.length > 0; 
            if(contributed) {
              res.status(403).json({
                contributed
              });
            } else {
              res.status(200).json({
                excerpt: excerpt.attributes,
              });
            }
                   
          });

      }
    });

});

// Set an excerpt's 'accepted' status to 'true'
router.post('/accept', (req, res) => {

  Excerpt
    .query({
      where : { id : req.body.excerptId }
    })
    .fetch({ withRelated: [
      'tasks_find',
      'tasks_fix',
      'tasks_verify'
    ]})
    .then(excerpt => {

      return excerpt
        .save({ accepted : true })
        .then(updatedExcerpt => {

          let excerptToReturn = {
            attributes  : updatedExcerpt.attributes,
            tasksFind   : excerpt.relations.tasks_find,
            tasksFix    : excerpt.relations.tasks_fix,
            tasksVerify : excerpt.relations.tasks_verify
          };

          res.status(200).json({ excerptToReturn, success : true });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json(err);
        });

    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });

});

export default router;