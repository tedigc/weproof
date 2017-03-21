import express from 'express';
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
    .then((user) => {
      res.json({ success: true });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });

});

// Get all excerpts for the logged in user
//
router.get('/:excerptId', authenticate, (req, res) => {

  Excerpt
    .query({
      where: { id: req.params.excerptId }
    })
    .fetch()
    .then((excerpt) => {
      if(!excerpt) {
        res.status(404).json({ error: "No such excerpt" });
      } else {
        res.status(200).json({
          excerpt: excerpt.attributes
        });
      }
    });

});

router.get('/:excerptId/min', authenticate, (req, res) => {

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

export default router;