import { Task } from '../../db/models';

const findPairs = [
    [ [10, 30], [50, 100], [110, 140] ],
    [ [20, 40], [50, 100], [110, 140] ],
    [ [10, 30], [50, 100], [110, 140] ]
];


let promises = [];

// Save  find tasks
//
for(let i=0; i<findPairs.length; i++) {
  let pair = findPairs[i];
  promises.push(new Promise((resolve, reject) => {

    return Task
      .forge({
        owner_id   : i+2,
        excerpt_id : 1,
        type       : 'find',
        pairs      : pair
      }, { hasTimestamps: true })
      .save(null, { method: 'insert' })
      .then(data => {
        console.log('[task] ' + i + ' saved to database.');
        resolve();
      })
      .catch(err => {
        console.error(err);
        reject();
      });  

  }));
  
}

Promise.all(promises)
  .then(() => { process.exit() });