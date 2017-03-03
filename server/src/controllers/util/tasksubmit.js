import { Excerpt, Task, TaskFind, TaskFix, TaskVerify } from '../../db/models';

export function submitFindTask(req, res, excerpt) {

  TaskFind
    .forge({
        excerpt_id : req.body.excerptId,
        owner_id   : req.currentUser.attributes.id,
        pairs      : req.body.pairs
      }, { hasTimestamps: true })
    .save(null, { method: 'insert' })
    .then((data) => {

      // Find all other task submissions, and calculate whether or not there are sufficient overlapping
      // highlights to proceed to the fix stage
      TaskFind
        .query({
          where  : { excerpt_id : req.body.excerptId },
          select : ['id', 'pairs'] 
        })
        .fetchAll()
        .then(allTaskSubmissions => {

          let stage = 'find';
          let recommended_edits;

          // find all highlights
          // sort by left index
          // 

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

    });

};

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

};