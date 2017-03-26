process.env.NODE_ENV = 'test';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';
import config from '../config';

import knex from 'knex';
import dbconfig from '../db/knexfile';
let db = knex(dbconfig.test);

let expect = chai.expect;
chai.use(chaiHttp);

let token = jwt.sign({
  id       : '1',
  username : 'user1'
}, config.jwtSecret);

let authHeader = `Bearer ${token}`;

describe('API routes - excerpts', () => {

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

  afterEach(done => {
    db.migrate.rollback()
    .then(() => {
      done();
    });
  });

  describe('GET /api/excerpts', () => {
    it('Returns all a user\'s excerpts all of their attributes, and all the respective tasks', (done) => {
      chai.request(server)
        .get('/api/excerpts/')
        .set('Authorization', authHeader)
        .end((err, res) => {

          // check response properties
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(2);

          // check contents of each excerpt
          for(let i=0; i<res.body.length; i++) {

            expect(res.body[i]).to.have.property('attributes');
            expect(res.body[i]).to.have.property('tasksFind');
            expect(res.body[i]).to.have.property('tasksFix');
            expect(res.body[i]).to.have.property('tasksVerify');

            let attributes = res.body[i].attributes;
            let { tasksFind, tasksFix, tasksVerify } = res.body[i];

            expect(attributes).to.have.property('id');
            expect(attributes).to.have.property('title');
            expect(attributes).to.have.property('body');
            expect(attributes).to.have.property('owner_id');
            expect(attributes).to.have.property('created_at');
            expect(attributes).to.have.property('updated_at');
            expect(attributes).to.have.property('accepted');
            expect(attributes).to.have.property('stage');
            expect(attributes).to.have.property('recommended_edits');
            expect(attributes).to.have.property('heatmap');

            expect(tasksFind.length).to.equal(0);
            expect(tasksFix.length).to.equal(0);
            expect(tasksVerify.length).to.equal(0);
          }
          done();
        });
    });
  });

  describe('GET /api/excerpts/:excerptId', () => {
    it('Returns all information for an excerpt the user owns', (done) => {

      chai.request(server)
        .get('/api/excerpts/1')
        .set('Authorization', authHeader)
        .end((err, res) => {

          // check response properties
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('excerpt');
          expect(res.body.excerpt).to.have.property('id');
          expect(res.body.excerpt).to.have.property('title');
          expect(res.body.excerpt).to.have.property('body');
          expect(res.body.excerpt).to.have.property('owner_id');
          expect(res.body.excerpt).to.have.property('created_at');
          expect(res.body.excerpt).to.have.property('updated_at');
          expect(res.body.excerpt).to.have.property('accepted');
          expect(res.body.excerpt).to.have.property('stage');
          expect(res.body.excerpt).to.have.property('recommended_edits');
          expect(res.body.excerpt).to.have.property('heatmap');

          done();
        });

    });
  });

  describe('GET /api/excerpts/:excerptId (not owned)', () => {
    it('Returns 403 (Forbidden) because the user does not own the excerpt', (done) => {

      chai.request(server)
        .get('/api/excerpts/3')
        .set('Authorization', authHeader)
        .end((err, res) => {

          // check response properties
          expect(res).to.have.status(403);
          expect(res.error.text).to.equal("{\"error\":\"That excerpt does not belong to the current user.\"}");
          expect(res.body).to.not.have.property('excerpt');
          
          done();
        });

    });
  });

  describe('GET /api/excerpts/:excerptId (no excerpt)', () => {
    it('Returns 404 (Not found) because the excerpt does not exist', (done) => {

      chai.request(server)
        .get('/api/excerpts/10')
        .set('Authorization', authHeader)
        .end((err, res) => {

          // check response properties
          expect(res).to.have.status(404);
          expect(res.error.text).to.equal("{\"error\":\"No such excerpt\"}");
          expect(res.body).to.not.have.property('excerpt');
          
          done();
        });

    });
  });

  describe('GET /api/excerpts/:excerptId/minified', () => {
    it('Returns the minified collection of excerpt attributes', (done) => {

      chai.request(server)
        .get('/api/excerpts/1/minified')
        .set('Authorization', authHeader)
        .end((err, res) => {

          // check response properties
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('excerpt');

          let excerpt = res.body.excerpt;
          expect(excerpt).to.be.an('object');
          expect(excerpt).to.have.property('id');
          expect(excerpt).to.have.property('body');
          expect(excerpt).to.have.property('stage');
          expect(excerpt).to.not.have.property('title');
          expect(excerpt).to.not.have.property('created_at');
          expect(excerpt).to.not.have.property('updated_at');
          expect(excerpt).to.not.have.property('owner_id');
          expect(excerpt).to.not.have.property('accepted');
          expect(excerpt).to.not.have.property('recommended_edits');
          expect(excerpt).to.not.have.property('heatmap');
          
          done();
        });

    });
  });

  describe('GET /api/excerpts/:excerptId/minified (not owned)', () => {
    it('Returns the minified collection of excerpt attributes, despite not owning the excerpt', (done) => {

      chai.request(server)
        .get('/api/excerpts/3/minified')
        .set('Authorization', authHeader)
        .end((err, res) => {

          // check response properties
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('excerpt');

          let excerpt = res.body.excerpt;
          expect(excerpt).to.be.an('object');
          expect(excerpt).to.have.property('id');
          expect(excerpt).to.have.property('body');
          expect(excerpt).to.have.property('stage');
          expect(excerpt).to.not.have.property('title');
          expect(excerpt).to.not.have.property('created_at');
          expect(excerpt).to.not.have.property('updated_at');
          expect(excerpt).to.not.have.property('owner_id');
          expect(excerpt).to.not.have.property('accepted');
          expect(excerpt).to.not.have.property('recommended_edits');
          expect(excerpt).to.not.have.property('heatmap');
          
          done();
        });

    });
  });

  describe('POST /api/excerpts', () => {
    it('Writes a new excerpt to the database', (done) => {
      chai.request(server)
        .post('/api/excerpts')
        .send({
          title : 'post test title',
          body  : 'post test body'
        })
        .set('Authorization', authHeader)
        .end((err, res) => {

          expect(res).to.have.status(200);
          expect(res.body).to.have.property('excerpt');

          let excerpt = res.body.excerpt;
          expect(excerpt).to.be.an('object');
          expect(excerpt).to.have.property('id');
          expect(excerpt).to.have.property('title');
          expect(excerpt).to.have.property('body');
          expect(excerpt).to.have.property('owner_id');
          expect(excerpt).to.have.property('heatmap');
          expect(excerpt).to.have.property('created_at');
          expect(excerpt).to.have.property('updated_at');
          expect(excerpt).to.not.have.property('stage');
          expect(excerpt).to.not.have.property('accepted');
          expect(excerpt).to.not.have.property('recommended_edits');

          done();
        });
    });

  });

  describe('POST /api/excerpts/accept', () => {
    it('Updates an excerpt\'s "accepted" attribute to "true"', (done) => {

      // first, check that the excerpt's "accepted" status is false
      chai.request(server)
        .get('/api/excerpts/1')
        .set('Authorization', authHeader)
        .end((err, res) => {

          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('excerpt');
          expect(res.body.excerpt).to.have.property('accepted');
          expect(res.body.excerpt.accepted).to.equal(false);

          // then, make a request to update the "accepted" attribute
          chai.request(server)
            .post('/api/excerpts/accept')
            .send({
              excerptId : 1
            })
            .set('Authorization', authHeader)
            .end((err, res) => {

              expect(res).to.have.status(200);
              expect(res.body).to.have.property('excerptToReturn');

              let excerpt = res.body.excerptToReturn;
              expect(excerpt).to.have.property('attributes');
              expect(excerpt).to.have.property('tasksFix');
              expect(excerpt).to.have.property('tasksFind');
              expect(excerpt).to.have.property('tasksVerify');

              let attributes = excerpt.attributes;
              expect(attributes).to.be.an('object');
              expect(attributes).to.have.property('id');
              expect(attributes).to.have.property('title');
              expect(attributes).to.have.property('body');
              expect(attributes).to.have.property('owner_id');
              expect(attributes).to.have.property('heatmap');
              expect(attributes).to.have.property('created_at');
              expect(attributes).to.have.property('updated_at');
              expect(attributes).to.have.property('stage');
              expect(attributes).to.have.property('accepted');
              expect(attributes).to.have.property('recommended_edits');
              expect(attributes.accepted).to.equal(true);

              done();
            });
        });

    });

  });

});