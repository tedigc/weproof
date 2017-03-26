import bookshelf from '../../db/bookshelf';
import { Excerpt, Task, TaskFind, TaskFix, TaskVerify } from '../../db/models';
import aggregate from '../../util/aggregation/aggregate';
import merge from '../../util/aggregation/merge';

import knex from 'knex';
import config from '../../db/knexfile';
let db = knex(config.development);

const MINIMUM_FIX_TASK_SUBMISSIONS = 3;
const MINIMUM_VERIFICATIONS_NEEDED = 1;

export function submitFindTask(req, res, excerpt) {

  return bookshelf.transaction(t => {

    return TaskFind
      .forge({
        excerpt_id : req.body.excerptId,
        owner_id   : req.currentUser.attributes.id,
        patches    : req.body.patches
      }, { hasTimestamps: true })
      .save(null, { transacting : t, method: 'insert' })
      .then(task => {

        return new Promise((resolve, reject) => {

            return db('tasks_find').where('excerpt_id', excerpt.id).countDistinct('id')
                .then(result => {

                  let recommended_edits;
                  let patches = task.get('patches');
                  let stage   = 'find';
                  let heatmap = excerpt.get('heatmap');
                  let body    = excerpt.get('body');
                  let nTasks  = parseInt(result[0].count, 10) + 1; // add one, because the TaskFind.forge changes haven't been committed

                  // for each patch the user has submitted, increment the heatmap within the patch's range
                  for(let i=0; i<patches.length; i++) {
                    let patch = patches[i];
                    for(let j=patch[0]; j<patch[1]; j++) {
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
                    }, { transacting : t })
                    .then(result => {
                      resolve(result);
                    })
                    .catch(err => {
                      reject(err);
                    });

                });
        });
      });
  })
  .then(excerpt => {
    res.json({ success : true });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  });

}

export function submitFixTask(req, res, excerpt) {

  return bookshelf.transaction(t => {
    return TaskFix
      .forge({
        excerpt_id  : req.body.excerptId,
        owner_id    : req.currentUser.attributes.id,
        chosen_edit : req.body.chosenEdit,
        correction  : req.body.correction
      }, { hasTimestamps: true })
      .save(null, { transacting : t, method: 'insert' })
      .then(submittedTask => {

        return new Promise((resolve, reject) => {

          return TaskFix
            .query({
              where : { excerpt_id : req.body.excerptId },
              select: [ 'id', 'chosen_edit' ]
            })
            .fetchAll({ transacting : t })
            .then(tasks => {

              // count the number of submissions for each recommended edits

              let submissionCounter = new Array(excerpt.get('recommended_edits').length).fill(0);
              for(let task of tasks.models) {
                let idx = task.get('chosen_edit');
                submissionCounter[idx]++;
              }
              
              // if there are at least N fixes for each recommended edit, progress to the 'verify' stage
              let minCount = Math.min.apply(Math, submissionCounter);
              let stage = (minCount >= MINIMUM_FIX_TASK_SUBMISSIONS) ? 'verify' : 'fix';

              return excerpt
                .save({ 
                  stage 
                }, { transacting : t })
                .then(result => {
                  resolve(result);
                })
                .catch(err => {
                  reject(err);
                });

            });
        }); // promise
      }); // forge

  })
  .then(excerpt => {
    res.json({ success : true });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  });

}

export function submitVerifyTask(req, res, excerpt) {

  return bookshelf.transaction(t => {

    return TaskVerify
      .forge({
        excerpt_id   : req.body.excerptId,
        owner_id     : req.currentUser.attributes.id,
        tasks_fix_id : req.body.taskFixId,
        accepted     : req.body.accepted
      }, { hasTimestamps: true })
      .save(null, { transacting : t, method: 'insert' })
      .then(() => {
        return new Promise((resolve, reject) => {

          return TaskFix
            .query({
              where : { excerpt_id : req.body.excerptId }
            })
            .fetchAll({
              transacting : t,
              withRelated : ['verifications']
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
                  .save({ 
                    stage : 'complete' 
                  }, { transacting : t })
                  .then(updatedExcerpt => { 
                    resolve(updatedExcerpt) ;
                  })
                  .catch(err => { 
                    reject(err); 
                  });
              } else {
                resolve(excerpt);
              }

            });
        }); // promise;
      }); // forge;
  })
  .then(excerpt => {
    res.json({ success : true });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  });

}