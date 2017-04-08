// import axios from 'axios';
// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import server from '../../index';
// import authHeader from '../../test/_header';
// import knex from 'knex';
// import dbconfig from '../knexfile';
// let db = knex(dbconfig.test);

// let expect = chai.expect;
// chai.use(chaiHttp);

// // let test_data = [
// //   {
// //     "excerptId" : 1,
// //     "taskType"  : "find",
// //     "patches"   : [ [10, 60], [70, 140] ],
// //   },
// //   {
// //     "excerptId" : 1,
// //     "taskType"  : "find",
// //     "patches"   : [ [15, 55], [75, 135] ],
// //   },
// //   {
// //     "excerptId" : 1,
// //     "taskType"  : "find",
// //     "patches"   : [ [20, 50], [80, 130] ],
// //   },
// //   {
// //     "excerptId" : 1,
// //     "taskType"  : "find",
// //     "patches"   : [ [25, 45], [85, 125] ],
// //   },
// //   {
// //     "excerptId" : 1,
// //     "taskType"  : "find",
// //     "patches"   : [ [30, 40], [85, 120] ],
// //   },
// //   {
// //     "excerptId" : 1,
// //     "taskType"  : "find",
// //     "patches"   : [ [90, 115] ],
// //   },
// //   {
// //     "excerptId" : 1,
// //     "taskType"  : "find",
// //     "patches"   : [ [95, 110] ],
// //   },
// //   {
// //     "excerptId" : 1,
// //     "taskType"  : "find",
// //     "patches"   : [],
// //   },
// //   {
// //     "excerptId" : 1,
// //     "taskType"  : "find",
// //     "patches"   : [],
// //   },
// //   {
// //     "excerptId" : 1,
// //     "taskType"  : "find",
// //     "patches"   : [],
// //   }
// // ];

// // let promises = [];
// // for(let taskData of test_data) {
// //   promises.push(
// //     new Promise((resolve, reject) => {
// //       return server.listen(8080, () => {
// //         return axios.post('/api/tasks', taskData)
// //         .then((res) => {
// //           server.close();        
// //           resolve();
// //         })
// //         .catch((error) => {
// //           reject();
// //         });
// //       });

// //     })
// //   );
// // }

export function seed(knex, Promise) {
  // Deletes ALL existing entries
  return knex('tasks_find').del()
    .then(function () {
      return Promise.all([]);
    });
}
