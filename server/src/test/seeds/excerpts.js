import { Excerpt } from '../../db/models';

const excerpts = [
  {
    title             : 'Interim Report - Section 0',
    excerpt           : 'This project aims to produce a web application that uses crowdsourcing to assist non-native English speakers with their written English. This is a demo- graphic common to many British universities with a large international student population',
    owner_id          : 1,
  },
  {
    title             : 'Dissertation Excerpt',
    excerpt           : 'and by taking advantage of a universitys untapped crowdsourcing workforce in the form of students and staff, this project will provide a service useful to thousands of students across the UK.',
    owner_id          : 1,
  },
  {
    title             : 'Blog Draft',
    excerpt           : 'Formally speaking, the project has two groups of primary stakeholders. The first group is made up of primarily non-native English speakers seeking assistance with their written English who, in the final product, should be able to:',
    owner_id          : 1,
  },
  {
    title             : 'Culinary Review - Section 8',
    excerpt           : 'Both target audiences will be able to view a summary of their individual use of the application. For example; workers will have a dashboard showing tasks they can complete and a history of their submissions, while users seeking assistance should be able to review any verified corrections they have received.',
    owner_id          : 1,
  },
  {
    title             : 'Final Report - Abstract',
    excerpt           : 'This project will also implement the Find-Fix-Verify pattern (discussed in an- other section) as a way of mitigating the problem of poor-quality corrections made by workers.',
    owner_id          : 2,
  },
  {
    title             : 'Final Report - Conclusion',
    excerpt           : 'Secondary to these points, the project aims to provide a maintainable code base for future work, explore and effectively use contemporary web technologies, and provide a positive user experience by focusing on implementing an intuitive and responsive UI.',
    owner_id          : 2,
  },
  {
    title             : 'Bird Watching Discussion',
    excerpt           : 'Crowdsourcing is a relatively new phenomenon with a broad range of applica- tions in many fields. It is based on the idea that work can be out-sourced and distributed to be completed by internet users rather than in-ho',
    owner_id          : 2,
  },
  {
    title             : 'Short Story Draft',
    excerpt           : 'Estell ́s-Arolas and Gonz ́alez-Ladr ́on-de-Guevara [7] attempt to address this ques- tion and others like it by attempting to form an exhaustive and global definition of crowdsourcing. They do this by providing an overview of crowdsourcing def- initions found in literature,',
    owner_id          : 2,
  },
];


let promises = [];

// Save excerpts
//
for(let i=0; i<excerpts.length; i++) {
  let excerpt = excerpts[i];
  let heatmap = new Array(excerpt.excerpt.length).fill(0);
  promises.push(new Promise((resolve, reject) => {
    return Excerpt
      .forge({
        title    : excerpt.title,
        excerpt  : excerpt.excerpt,
        owner_id : excerpt.owner_id,
        heatmap
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
  .then(() => { process.exit() });