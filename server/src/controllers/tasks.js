import express from 'express';
import authenticate from '../middlewares/authenticate';
import Excerpt from '../models/excerpts';
import TaskSubmission from '../models/task-submissions';

var router = express.Router();

// Get all excerpts for the logged in user
//
// router.get('/', authenticate, (req, res) => {

//   Excerpt.where({ownerId: req.currentUser.id}).fetchAll().then((results) => {
//     var excerpts = [];
//     for(var i=0; i<results.models.length; i++) {
//       excerpts.push(results.models[i].attributes);
//     }
//     res.status(200).json(results);
//   });

// });

// Submit an excerpt and write it to the database
//
router.post('/', authenticate, (req, res) => {

  var excerptId = req.body.excerptId;
  var excerpt = req.body.excerpt;
  var pairs = req.body.pairs;

  console.log(excerpt);
  console.log(pairs);

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
        ownerId: req.currentUser.attributes.id,
        excerptId: excerpt.id, // TODO replace this placeholder
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