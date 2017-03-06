import express from 'express';
import authenticate from '../middlewares/authenticate';
import { Excerpt, Task } from '../db/models';

var router = express.Router();

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
      select : [ 'id', 'excerpt', 'stage' ]
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
          .then((taskSubmissions) => {
            
            // If there exists a submission for this excerpt with the current user's ID, let the client know they
            // have already contributed.
            let contributed = taskSubmissions.models.length > 0; 
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

// Get all excerpts for the logged in user
//
router.get('/', authenticate, (req, res) => {

  Excerpt
    .where({owner_id: req.currentUser.id})
    .fetchAll()
    .then((results) => {
      var excerpts = [];
      for(var i=0; i<results.models.length; i++) {
        excerpts.push(results.models[i].attributes);
      }
      res.status(200).json(excerpts);
    });

});

// Submit an excerpt and write it to the database
//
router.post('/', authenticate, (req, res) => {

  var title = req.body.title;
  var excerpt = req.body.excerpt;

  // Write the excerpt to the database
  Excerpt
    .forge({
      title  : title,
      excerpt: excerpt,
      owner_id: req.currentUser.attributes.id
    }, { hasTimestamps: true })
    .save(null, { method: 'insert'})
    .then((user) => {
      res.json({ success: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });

});

export default router;