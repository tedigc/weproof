import { Excerpt, Task, TaskFind, TaskFix, TaskVerify } from '../../db/models';

export function submitFindTask(req, res, excerpt) {

  TaskFind
    .forge({
        excerpt_id : req.body.excerptId,
        owner_id   : req.currentUser.attributes.id,
        pairs      : req.body.pairs
      }, { hasTimestamps: true })
    .save(null, { method: 'insert' })
    .then((task) => {

      let pairs = task.attributes.pairs;
      let stage = 'find';
      let recommended_edits;
      let heatmap = excerpt.attributes.heatmap;

      // for each patch the user has submitted, increment the heatmap within the patch's range
      for(let i=0; i<pairs.length; i++) {
        let pair = pairs[i];
        for(let j=pair[0]; j<pair[1]; j++) {
          heatmap[j]++;
        }
      }

      // here, check if it is time to move onto the fix stage

      // . . .

      // update the excerpt's stage and recommended edits
      excerpt
        .save({
          stage,
          recommended_edits
        })
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json(err);
        });

    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });

}

export function submitFixTask(req, res, excerpt) {

  TaskFix
    .forge({
      excerpt_id : req.body.excerptId,
      owner_id   : req.currentUser.attributes.id,
      chosen_edit: req.body.chosenEdit,
      correction : req.body.correction
    }, { hasTimestamps: true })
    .save(null, { method: 'insert' })
    .then(data => {

      // only move onto verify stage once some criteria has been met
      // e.g. at least 3 corrections for each error

      excerpt
        .save({
          stage : 'verify'
        })
        .then(result => {
          res.json(result);
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

}

export function submitVerifyTask(req, res, excerpt) {

  TaskVerify
    .forge({
      excerpt_id  : req.body.excerptId,
      owner_id    : req.currentUser.attributes.id,
      chosen_edit : req.body.chosenEdit,
      correction  : req.body.correction,
      accepted    : req.body.accepted
    }, { hasTimestamps: true })
    .save(null, { method: 'insert' })
    .then(data => {

      res.json({ success : true });

    });

}