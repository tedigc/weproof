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
import findData   from './data/find';
import fixData    from './data/fix';
import verifyData from './data/verify';

let expect = chai.expect;
chai.use(chaiHttp);


function runSequence(taskData, userIndex) {

  let sequence = Promise.resolve();
  for(let i=0; i<findData.length; i++) {
    let data = taskData[i];

    let token = jwt.sign({
      id       : i+userIndex,
      username : 'user' + (i+userIndex)
    }, config.jwtSecret);

    let tempAuthHeader = `Bearer ${token}`;

    sequence = sequence.then(() => {
      return new Promise((resolve, reject) => {
        return chai.request(server)
        .post('/api/tasks')
        .send(data)
        .set('Authorization', tempAuthHeader)
        .end((err, res) => {
          resolve();
        });
      });
    });

  }

  // This will resolve after the entire chain is resolved
  return sequence;
}

// console.info('API routes - tasks');

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

describe('API routes - tasks', () => {

  describe('GET /api/tasks', () => {
    it('Gets all of a user\'s submitted tasks', (done) => {

      chai.request(server)
        .post('/api/tasks')
        .send(findData[0])
        .set('Authorization', authHeader)
        .end((err, res) => {
          chai.request(server)
            .get('/api/tasks')
            .set('Authorization', authHeader)
            .end((err, res) => {

              // check response properties
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('tasks');
              expect(res.body.tasks).to.be.an('array');
              expect(res.body.tasks.length).to.equal(1);

              let task = res.body.tasks[0];

              expect(task).to.have.property('id');
              expect(task).to.have.property('owner_id');
              expect(task).to.have.property('excerpt_id');
              expect(task).to.have.property('type');
              expect(task).to.have.property('created_at');
              expect(task).to.have.property('updated_at');
              expect(task).to.have.property('excerpt');

              done();
            });
        });

    });
  });

  describe('POST /api/tasks (find)', () => {
    it('Submits a "find" task and returns the task\'s details', (done) => {

      chai.request(server)
        .post('/api/tasks')
        .send(findData[0])
        .set('Authorization', authHeader)
        .end((err, res) => {

          expect(res).to.have.status(200);
          expect(res.body).to.have.property('result');
          expect(res.body.result).to.be.an('object');

          let result = res.body.result;
          expect(result).to.have.property('task');
          expect(result).to.have.property('excerpt');

          let task = result.task;
          expect(task).to.be.an('object');
          expect(task).to.have.property('id');
          expect(task).to.have.property('excerpt_id');
          expect(task).to.have.property('owner_id');
          expect(task).to.have.property('patches');
          expect(task).to.have.property('updated_at');
          expect(task).to.have.property('created_at');

          let excerpt = result.excerpt;
          expect(excerpt).to.be.an('object');
          expect(excerpt).to.have.property('id');
          expect(excerpt).to.have.property('title');
          expect(excerpt).to.have.property('body');
          expect(excerpt).to.have.property('stage');
          expect(excerpt).to.have.property('heatmap');
          expect(excerpt).to.have.property('recommended_edits');

          done();

        });

    });
  });

  describe('POST /api/tasks (fix)', () => {
    it('Submits the prerequisite "find" tasks followed by a single "fix" task and returns the task\'s details', (done) => {

      runSequence(findData, 2)
        .then(() => {

          chai.request(server)
            .post('/api/tasks')
            .send(fixData[0])
            .set('Authorization', authHeader)
            .end((err, res) => {

              expect(res).to.have.status(200);
              expect(res.body).to.have.property('result');
              expect(res.body.result).to.be.an('object');

              let result = res.body.result;
              expect(result).to.have.property('task');
              expect(result).to.have.property('excerpt');

              let task = result.task;
              expect(task).to.be.an('object');
              expect(task).to.have.property('id');
              expect(task).to.have.property('excerpt_id');
              expect(task).to.have.property('owner_id');
              expect(task).to.have.property('chosen_edit');
              expect(task).to.have.property('correction');
              expect(task).to.have.property('updated_at');
              expect(task).to.have.property('created_at');

              let excerpt = result.excerpt;
              expect(excerpt).to.be.an('object');
              expect(excerpt).to.have.property('id');
              expect(excerpt).to.have.property('title');
              expect(excerpt).to.have.property('body');
              expect(excerpt).to.have.property('stage');
              expect(excerpt).to.have.property('heatmap');
              expect(excerpt).to.have.property('recommended_edits');

              done();

            });
      });

    });
  });

  describe('POST /api/tasks (verify)', () => {
    it('Submits the prerequisite "find" & "fix" tasks followed by a single "verify" task and returns the task\'s details', (done) => {

      runSequence(findData, 2)
        .then(() => {
          runSequence(fixData, 12)
            .then(() => {
              chai.request(server)
                .post('/api/tasks')
                .send(verifyData[0])
                .set('Authorization', authHeader)
                .end((err, res) => {

                  expect(res).to.have.status(200);
                  expect(res.body).to.have.property('result');
                  expect(res.body.result).to.be.an('object');

                  let result = res.body.result;
                  expect(result).to.have.property('task');
                  expect(result).to.have.property('excerpt');

                  let task = result.task;
                  expect(task).to.be.an('object');
                  expect(task).to.have.property('id');
                  expect(task).to.have.property('excerpt_id');
                  expect(task).to.have.property('owner_id');
                  expect(task).to.have.property('chosen_edit');
                  expect(task).to.have.property('votes');
                  expect(task).to.have.property('updated_at');
                  expect(task).to.have.property('created_at');

                  let excerpt = result.excerpt;
                  expect(excerpt).to.be.an('object');
                  expect(excerpt).to.have.property('id');
                  expect(excerpt).to.have.property('title');
                  expect(excerpt).to.have.property('body');
                  expect(excerpt).to.have.property('stage');
                  expect(excerpt).to.have.property('heatmap');
                  expect(excerpt).to.have.property('recommended_edits');

                  done();

                });
            });
      });

    });
  });

  describe('POST /api/tasks (incorrect stage)', () => {
    it('Submits a fix task for a find-stage excerpt and returns the appropriate error message', (done) => {

      chai.request(server)
        .post('/api/tasks')
        .send(fixData[0])
        .set('Authorization', authHeader)
        .end((err, res) => {

          expect(res).to.have.status(403);
          expect(res.error.text).to.equal("{\"error\":\"The excerpt is not currently in this stage.\"}");
          done();

        });

    });
  });

  describe('POST /api/tasks (already submitted)', () => {
    it('Submits a fix task for a find-stage excerpt and returns the appropriate error message', (done) => {

      chai.request(server)
        .post('/api/tasks')
        .send(findData[0])
        .set('Authorization', authHeader)
        .end((err, res) => {

          chai.request(server)
            .post('/api/tasks')
            .send(findData[0])
            .set('Authorization', authHeader)
            .end((err, res) => {

              expect(res).to.have.status(403);
              expect(res.error.text).to.equal("{\"error\":\"You have already submitted a task for this excerpt\"}");
              done();

            });
        });
    });
  });

  describe('POST /api/tasks/1/fix', () => {
    it('Gets all the information needed for a fix task', (done) => {

      runSequence(findData, 2)
        .then(() => {

          chai.request(server)
            .get('/api/tasks/1/fix')
            .set('Authorization', authHeader)
            .end((err, res) => {

              expect(res).to.have.status(200);
              expect(res.body).to.have.property('taskInfo');
              expect(res.body.taskInfo).to.be.an('object');

              let taskInfo = res.body.taskInfo;

              expect(taskInfo).to.have.property('chosenEdit');
              expect(taskInfo).to.have.property('patch');
              expect(taskInfo).to.have.property('excerpt');

              expect(taskInfo.chosenEdit).to.be.a('number');
              expect(taskInfo.patch).to.be.an('array');
              expect(taskInfo.excerpt).to.be.an('object');

              let excerpt = taskInfo.excerpt;
              expect(excerpt).to.have.property('id');
              expect(excerpt).to.have.property('body');
              expect(excerpt).to.have.property('recommended_edits');
              expect(excerpt).to.have.property('stage');

              done();

            });
      });

    });
  });

  describe('POST /api/tasks/1/verify', () => {
    it('Gets all the information needed for a verify task', (done) => {

      runSequence(findData, 2)
        .then(() => {
          runSequence(fixData, 12)
          .then(() => {
            chai.request(server)
              .get('/api/tasks/1/verify')
              .set('Authorization', authHeader)
              .end((err, res) => {

                expect(res).to.have.status(200);
                expect(res.body).to.have.property('taskInfo');
                expect(res.body.taskInfo).to.be.an('object');

                let taskInfo = res.body.taskInfo;

                expect(taskInfo).to.have.property('chosenEdit');
                expect(taskInfo).to.have.property('corrections');
                expect(taskInfo).to.have.property('patch');
                expect(taskInfo).to.have.property('excerpt');

                expect(taskInfo.chosenEdit).to.be.a('number');
                expect(taskInfo.corrections).to.be.an('array');
                expect(taskInfo.patch).to.be.an('array');
                expect(taskInfo.excerpt).to.be.an('object');

                let excerpt = taskInfo.excerpt;
                expect(excerpt).to.have.property('id');
                expect(excerpt).to.have.property('body');
                expect(excerpt).to.have.property('recommended_edits');
                expect(excerpt).to.have.property('stage');
                expect(excerpt).to.have.property('accepted');
                expect(excerpt).to.have.property('tasks_verify');

                done();

              });
          });
      });

    });
  });

  describe('GET /api/tasks/available', () => {
    it('Gets all the tasks available to the logged in user', (done) => {

      chai.request(server)
        .get('/api/tasks/available')
        .set('Authorization', authHeader)
        .end((err, res) => {

          // check response properties
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(4);

          for(let i=0; i<res.body.length; i++) {
            let task = res.body[i];
            expect(task).to.be.an('object');
            expect(task).to.have.property('id');
            expect(task).to.have.property('body');
            expect(task).to.have.property('stage');
            expect(task).to.have.property('created_at');
          }

          done();
        });

    });
  });

});

