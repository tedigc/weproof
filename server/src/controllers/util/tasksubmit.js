import { Excerpt, Task, TaskFind, TaskFix } from '../../db/models';

export function submitFindTask(req, res, excerpt) {

  TaskFind
    .forge({
        excerpt_id : req.body.excerptId,
        owner_id   : req.currentUser.attributes.id,
        pairs      : req.body.pairs,
      }, { hasTimestamps: true })
    .save(null, { method: 'insert' })
    .then((data) => {

      // update the excerpt's stage
      excerpt
        .save({
          stage: 'fix'
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