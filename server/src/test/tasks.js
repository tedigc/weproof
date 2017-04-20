
/**
 * GET '/'
 * 
 * [x] successfully get tasks
 * 
 */

/**
 * POST '/'
 * 
 * [x] successful find
 * [ ] successful fix
 * [ ] successful verify
 * [ ] no such excerpt
 * [ ] excerpt has progressed to next stage
 * [ ] already submitted for this excerpt
 * 
 */

/**
 * GET '/available'
 * 
 * [x] successful
 * 
 */

/**
 * GET '/:excerptId/fix'
 * 
 * [ ] successful
 * [ ] excerpt in wrong stage
 * [ ] no such excerpt
 * 
 */

/**
 * GET '/:excerptId/verify'
 * 
 * [ ] successful
 * [ ] excerpt in wrong stage
 * [ ] no such excerpt
 * 
 */

process.env.NODE_ENV = 'test';

import bcrypt from 'bcrypt';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';

// auth
import authHeader from './_header';
import config from '../config';
import jwt from 'jsonwebtoken';

// database
import knex from 'knex';
import dbconfig from '../db/knexfile';
let db = knex(dbconfig.test);

// test data
import findData from './data/find';
import fixData from './data/fix';

let expect = chai.expect;
chai.use(chaiHttp);

console.info('API routes - tasks');

beforeEach((done) => {
  db.migrate.rollback()
    .then(() => {
      db.migrate.latest()
        .then(() => {
            return db.seed.run()
              .then(() => {
                done();
              });
        });
    });
});

afterEach((done) => {
  db.migrate.rollback()
  .then(() => {
    done();
  });
});

// describe('GET /api/tasks', () => {
//   it('Gets all of a user\'s submitted tasks', (done) => {

//     chai.request(server)
//       .post('/api/tasks')
//       .send(findData[0])
//       .set('Authorization', authHeader)
//       .end((err, res) => {
//         chai.request(server)
//           .get('/api/tasks')
//           .set('Authorization', authHeader)
//           .end((err, res) => {

//             // check response properties
//             expect(res).to.have.status(200);
//             expect(res.body).to.have.property('tasks');
//             expect(res.body.tasks).to.be.an('array');
//             expect(res.body.tasks.length).to.equal(1);

//             let task = res.body.tasks[0];

//             expect(task).to.have.property('id');
//             expect(task).to.have.property('owner_id');
//             expect(task).to.have.property('excerpt_id');
//             expect(task).to.have.property('type');
//             expect(task).to.have.property('created_at');
//             expect(task).to.have.property('updated_at');
//             expect(task).to.have.property('excerpt');

//             done();
//           });
//       });

//   });
// });

// describe('POST /api/tasks (find)', () => {
//   it('Submits a "find" task and returns the task\'s details', (done) => {

//     chai.request(server)
//       .post('/api/tasks')
//       .send(findData[0])
//       .set('Authorization', authHeader)
//       .end((err, res) => {

//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property('result');
//         expect(res.body.result).to.be.an('object');

//         let result = res.body.result;
//         expect(result).to.have.property('task');
//         expect(result).to.have.property('excerpt');

//         let task = result.task;
//         expect(task).to.be.an('object');
//         expect(task).to.have.property('id');
//         expect(task).to.have.property('excerpt_id');
//         expect(task).to.have.property('owner_id');
//         expect(task).to.have.property('patches');
//         expect(task).to.have.property('updated_at');
//         expect(task).to.have.property('created_at');

//         let excerpt = result.excerpt;
//         expect(excerpt).to.be.an('object');
//         expect(excerpt).to.have.property('id');
//         expect(excerpt).to.have.property('title');
//         expect(excerpt).to.have.property('body');
//         expect(excerpt).to.have.property('stage');
//         expect(excerpt).to.have.property('heatmap');
//         expect(excerpt).to.have.property('recommended_edits');

//         done();

//       });

//   });
// });

describe('POST /api/tasks (fix)', () => {
  it('Submits the prerequisite "find" tasks followed by a single "fix" task and returns the task\'s details', (done) => {

    function runSequence(taskData) {

      var sequence = Promise.resolve();
      for(let i=0; i<findData.length; i++) {
        let data = taskData[i];

        let token = jwt.sign({
          id       : i+2,
          username : 'user' + (i+2)
        }, config.jwtSecret);

        let tempAuthHeader = `Bearer ${token}`;

        sequence = sequence.then(() => {
          return new Promise((resolve, reject) => {
            return chai.request(server)
            .post('/api/tasks')
            .send(data)
            .set('Authorization', tempAuthHeader)
            .end((err, res) => {
              console.log(i);
              setTimeout(() => { resolve(); }, 600);
              // resolve();
            });
          });
        });

      }

      // This will resolve after the entire chain is resolved
      return sequence;
    }

    runSequence(findData)
      .then(() => {
        console.log('finished');
        chai.request(server)
          .get('/api/excerpts/')
          .set('Authorization', authHeader)
          .end((err, res) => {

            console.log(res.body[0].attributes.stage);

            done();
          });
    });



    // chai.request(server)
    //   .post('/api/tasks')
    //   .send(findData[0])
    //   .set('Authorization', authHeader)
    //   .end((err, res) => {

    //     expect(res).to.have.status(200);
    //     expect(res.body).to.have.property('result');
    //     expect(res.body.result).to.be.an('object');

    //     let result = res.body.result;
    //     expect(result).to.have.property('task');
    //     expect(result).to.have.property('excerpt');

    //     let task = result.task;
    //     expect(task).to.be.an('object');
    //     expect(task).to.have.property('id');
    //     expect(task).to.have.property('excerpt_id');
    //     expect(task).to.have.property('owner_id');
    //     expect(task).to.have.property('patches');
    //     expect(task).to.have.property('updated_at');
    //     expect(task).to.have.property('created_at');

    //     let excerpt = result.excerpt;
    //     expect(excerpt).to.be.an('object');
    //     expect(excerpt).to.have.property('id');
    //     expect(excerpt).to.have.property('title');
    //     expect(excerpt).to.have.property('body');
    //     expect(excerpt).to.have.property('stage');
    //     expect(excerpt).to.have.property('heatmap');
    //     expect(excerpt).to.have.property('recommended_edits');

    //     done();

    //   });

  });
});

// describe('GET /api/tasks/available', () => {
//   it('Gets all the tasks available to the logged in user', (done) => {

//     chai.request(server)
//       .get('/api/tasks/available')
//       .set('Authorization', authHeader)
//       .end((err, res) => {

//         // check response properties
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('array');
//         expect(res.body.length).to.equal(4);

//         for(let i=0; i<res.body.length; i++) {
//           let task = res.body[i];
//           expect(task).to.be.an('object');
//           expect(task).to.have.property('id');
//           expect(task).to.have.property('body');
//           expect(task).to.have.property('stage');
//           expect(task).to.have.property('created_at');
//         }

//         done();
//       });

//   });
// });
