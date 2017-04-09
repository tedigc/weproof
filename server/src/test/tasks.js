
/**
 * GET '/'
 * 
 * [ ] successfully get tasks
 * [ ] no such user
 * 
 */

/**
 * POST '/'
 * 
 * [ ] successful find
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
 * [ ] successful
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
import authHeader from './_header';
import testData from './data/find';

import knex from 'knex';
import dbconfig from '../db/knexfile';
let db = knex(dbconfig.test);

let expect = chai.expect;
chai.use(chaiHttp);

console.info('API routes - users');

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

describe('GET /api/tasks', () => {
  it('Returns all of a user\'s submitted tasks', (done) => {

    chai.request(server)
      .post('/api/tasks')
      .send(testData[0])
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
