import express from 'express';
import authenticate from '../middlewares/authenticate';
import Excerpt from '../models/excerpts';
import TaskSubmission from '../models/task-submissions';

var router = express.Router();

// Get all tasks available to the logged in user
//
router.get('/', authenticate, (req, res) => {

  Excerpt.where('owner_id', '<>', req.currentUser.id).fetchAll().then((results) => {
    var tasks = [];
    for(var i=0; i<results.models.length; i++) {
      tasks.push(results.models[i].attributes);
    }
    res.status(200).json(results);
  });

});

// Submit an excerpt and write it to the database
//
router.post('/', authenticate, (req, res) => {

  var excerptId = req.body.excerptId;
  var excerpt = req.body.excerpt;
  var pairs = req.body.pairs;

  Excerpt.query({
    where: {id: excerptId},
    select: ['id', 'title', 'excerpt']
  }).fetch().then((excerpt) => {
    if(!excerpt) {
      res.status(500).json({ error: "No such excerpt" });
    } else {

      // If the excerpt exists, forge a new task submission
      TaskSubmission.forge({
        pairs: pairs,
        owner_id: req.currentUser.attributes.id,
        excerpt_id: excerpt.id,
        }, { hasTimestamps: true })
          .save(null, { method: 'insert' })
          .then((data) => {
            res.json({ success: true });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
          });

    }
  });

});

export default router;