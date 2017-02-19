import { Excerpt, Task, TaskFind, TaskFix } from '../../db/models';

export function submitFindTask(req, res, excerpt) {

  console.log('find');

  TaskFind
    .forge({
        excerpt_id : req.body.excerptId,
        owner_id   : req.currentUser.attributes.id,
        pairs      : req.body.pairs
      }, { hasTimestamps: true })
    .save(null, { method: 'insert' })
    .then((data) => {

      // algorithm to determine the best pairs for recommendation
      //
      // * for now, just use the pairs from the first submission
      let recommended_edits = req.body.pairs;

      // update the excerpt's stage and recommended edits
      //
      excerpt
        .save({
          stage             : 'fix',
          recommended_edits : recommended_edits
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

};

export function submitFixTask(req, res, excerpt) {

  TaskFix
    .forge({
      excerpt_id : req.body.excerptId,
      owner_id   : req.currentUser.attributes.id,
      chosen_edit: req.body.chosenEdit,
      correction : req.body.correction
    }, { hasTimestamps: true })
    .save(null, { method: 'insert'})
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

    });

};