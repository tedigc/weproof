import { Excerpt, Task, TaskFind, TaskFix, TaskVerify } from '../../db/models';
import aggregate from '../../util/aggregation/aggregate';
import merge from '../../util/aggregation/merge';
import knex from 'knex';
import config from '../../db/knexfile';

let db = knex(config.development);

const MINIMUM_FIX_TASK_SUBMISSIONS = 3;
const MINIMUM_VERIFICATIONS_NEEDED = 1;

export function submitFindTask(req, res, excerpt) {

  return TaskFind
    .forge({
        excerpt_id : req.body.excerptId,
        owner_id   : req.currentUser.attributes.id,
        pairs      : req.body.pairs
      }, { hasTimestamps: true })
    .save(null, { method: 'insert' })
    .then((task) => {

      return db('tasks_find').where('excerpt_id', excerpt.id).countDistinct('id')
        .then(result => {

          let recommended_edits;
          let pairs   = task.attributes.pairs;
          let stage   = 'find';
          let heatmap = excerpt.attributes.heatmap;
          let body    = excerpt.attributes.body;
          let nTasks  = parseInt(result[0].count);

          // for each patch the user has submitted, increment the heatmap within the patch's range
          for(let i=0; i<pairs.length; i++) {
            let pair = pairs[i];
            for(let j=pair[0]; j<pair[1]; j++) {
              heatmap[j]++;
            }
          }

          recommended_edits = aggregate(nTasks, body, heatmap);
          if(recommended_edits.length > 0) stage = 'fix';

          // update the excerpt's stage and recommended edits
          return excerpt
            .save({
              stage,
              recommended_edits,
              heatmap
            })
            .then(result => {
              res.json(result);
            })
            .catch(err => {
              console.error(err);
              res.status(500).json(err);
            });

        });

    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });

}

export function submitFixTask(req, res, excerpt) {

  return TaskFix
    .forge({
      excerpt_id  : req.body.excerptId,
      owner_id    : req.currentUser.attributes.id,
      chosen_edit : req.body.chosenEdit,
      correction  : req.body.correction
    }, { hasTimestamps: true })
    .save(null, { method: 'insert' })
    .then(submittedTask => {

      return TaskFix
        .query({
          where : { excerpt_id : req.body.excerptId },
          select: [ 'id', 'chosen_edit' ]
        })
        .fetchAll()
        .then(tasks => {

          // count the number of submissions for each recommended edits
          let submissionCounter = new Array(excerpt.attributes.recommended_edits.length).fill(0);
          for(let task of tasks.models) {
            let idx = task.attributes.chosen_edit;
            submissionCounter[idx]++;
          }
          
          // if there are at least N fixes for each recommended edit, progress to the 'verify' stage
          let minCount = Math.min.apply(Math, submissionCounter);
          let stage = (minCount >= MINIMUM_FIX_TASK_SUBMISSIONS) ? 'verify' : 'fix';
          
          return excerpt
            .save({ stage })
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
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });

}

export function submitVerifyTask(req, res, excerpt) {

  return TaskVerify
    .forge({
      excerpt_id   : req.body.excerptId,
      owner_id     : req.currentUser.attributes.id,
      tasks_fix_id : req.body.taskFixId,
      accepted     : req.body.accepted
    }, { hasTimestamps: true })
    .save(null, { method: 'insert' })
    .then(() => {

      return TaskFix
        .query({
          where : { excerpt_id : req.body.excerptId }
        })
        .fetchAll({
          withRelated: ['verifications']
        })
        .then(tasks => {

          // check if all the other
          let allCorrectionsVerified = true;
          for(let task of tasks.models) {
            let verifications = task.relations.verifications;
            if(verifications.length < MINIMUM_VERIFICATIONS_NEEDED) {
              allCorrectionsVerified = false;
              break;
            }
          }

          if(allCorrectionsVerified) {
            // close contributions
            return excerpt
              .save({ stage : 'complete' })
              .then()
              .error(err => {
                console.error(err);
                res.status(500).json(err);
              });
          }

          res.json({ success : true });

        })
        .catch(err => {
          console.error(err);
          res.status(500).json(err);
        });

    });

}