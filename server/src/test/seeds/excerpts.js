import { Excerpt } from '../../db/models';
import { aggregateTest } from '../../util/aggregation/aggregate';

const excerpts = [
  {
    title    : 'Interim Report - Section 0',
    body     : 'This project aims to produce a web application that uses crowdsourcing to assist non-native English speakers with their written English. This is a demo- graphic common to many British universities with a large international student population',
    owner_id : 1,
  },
  {
    title    : 'Dissertation Excerpt',
    body     : 'and by taking advantage of a universitys untapped crowdsourcing workforce in the form of students and staff, this project will provide a service useful to thousands of students across the UK.',
    owner_id : 1,
  },
  {
    title    : 'Blog Draft',
    body     : 'Formally speaking, the project has two groups of primary stakeholders. The first group is made up of primarily non-native English speakers seeking assistance with their written English who, in the final product, should be able to:',
    owner_id : 1,
  },
  {
    title    : 'Culinary Review - Section 8',
    body     : 'Both target audiences will be able to view a summary of their individual use of the application. For example; workers will have a dashboard showing tasks they can complete and a history of their submissions, while users seeking assistance should be able to review any verified corrections they have received.',
    owner_id : 1,
  },
  {
    title    : 'Final Report - Abstract',
    body     : 'This project will also implement the Find-Fix-Verify pattern (discussed in an- other section) as a way of mitigating the problem of poor-quality corrections made by workers.',
    owner_id : 2,
  },
  {
    title    : 'Final Report - Conclusion',
    body     : 'Secondary to these points, the project aims to provide a maintainable code base for future work, explore and effectively use contemporary web technologies, and provide a positive user experience by focusing on implementing an intuitive and responsive UI.',
    owner_id : 2,
  },
  {
    title    : 'Bird Watching Discussion',
    body     : 'Crowdsourcing is a relatively new phenomenon with a broad range of applica- tions in many fields. It is based on the idea that work can be out-sourced and distributed to be completed by internet users rather than in-ho',
    owner_id : 2,
  },
  {
    title    : 'Short Story Draft',
    body     : 'Estell ́s-Arolas and Gonz ́alez-Ladr ́on-de-Guevara [7] attempt to address this ques- tion and others like it by attempting to form an exhaustive and global definition of crowdsourcing. They do this by providing an overview of crowdsourcing def- initions found in literature,',
    owner_id : 2,
  },
];

let promises = [];
let allTestPatches = [
  [ [10, 30], [80, 120] ],
  [ [20, 40] ],
  [ [60, 90], [110, 130] ],
  [ [15, 45], [100, 140] ],
  [ [10, 20] ],
  [ [50, 60] ],
  [ [60, 90], [110, 130] ],
  [ [15, 45], [100, 140] ],
  [ [10, 20] ],
  [ [50, 60] ]
];

// Save excerpts
//
for(let i=0; i<excerpts.length; i++) {
  let excerpt = excerpts[i];

  let recommended_edits;
  let heatmap = new Array(excerpt.body.length).fill(0);
  let stage   = 'find';
  // if(i === 0) {
  //   stage = 'fix';
  //   // build test heatmap for first excerpt
  //   for(let setOfPatches of allTestPatches) {
  //     for(let patch of setOfPatches) {
  //       for(let j=patch[0]; j<patch[1]; j++) {
  //         heatmap[j] += 1;
  //       }
  //     }
  //   }
  //   let recommended_edits = aggregateTest(excerpt.body, heatmap);
  // }
  
  promises.push(new Promise((resolve, reject) => {
    return Excerpt
      .forge({
        title    : excerpt.title,
        body     : excerpt.body,
        owner_id : excerpt.owner_id,
        stage,
        heatmap,
        recommended_edits
      }, { hasTimestamps: true })
      .save(null, { method: 'insert' })
      .then(data => {
        console.log('[excerpt] ' + excerpt.title + ' saved to database.');
        resolve();
      })
      .catch(err => {
        console.error(err);
        reject();
      });  

  }));
  
}

Promise.all(promises)
  .then(() => { process.exit(); });