process.env.NODE_ENV = 'test';

import jwtDecode from 'jwt-decode';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';
import authHeader from './_header';

import knex from 'knex';
import dbconfig from '../db/knexfile';
let db = knex(dbconfig.test);

let expect = chai.expect;
chai.use(chaiHttp);

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

describe('API routes - auth', () => {

  describe('GET /api/excerpts (no auth header)', () => {
    it('Returns 403 (Forbidden) for no authorization header', (done) => {
      chai.request(server)
        .get('/api/excerpts')
        .end((err, res) => {

          expect(res).to.have.status(403);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.equal('No auth token');

          done();
        });
    });
  });

  describe('POST /api/auth (username)', () => {
    it('Returns new auth token', (done) => {
      chai.request(server)
        .post('/api/auth')
        .send({
          identifier : 'user1',
          password   : 'test'
        })
        .end((err, res) => {

          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');

          let token = res.body.token;
          expect(token).to.be.a('string');

          let decoded = jwtDecode(token);
          expect(decoded).to.be.an('object');
          expect(decoded).to.have.property('id');
          expect(decoded).to.have.property('username');
          expect(decoded).to.have.property('iat');
          
          expect(decoded.id).to.equal(1);
          expect(decoded.username).to.equal('user1');

          done();
        });
    });
  });

  describe('POST /api/auth (email)', () => {
    it('Returns new auth token', (done) => {
      chai.request(server)
        .post('/api/auth')
        .send({
          identifier : 'user1@test.com',
          password   : 'test'
        })
        .end((err, res) => {

          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');

          let token = res.body.token;
          expect(token).to.be.a('string');

          let decoded = jwtDecode(token);
          expect(decoded).to.be.an('object');
          expect(decoded).to.have.property('id');
          expect(decoded).to.have.property('username');
          expect(decoded).to.have.property('iat');
          
          expect(decoded.id).to.equal(1);
          expect(decoded.username).to.equal('user1');

          done();
        });
    });
  });

  describe('POST /api/auth (username)', () => {
    it('Returns 401 (Unauthorized) for incorrect password', (done) => {
      chai.request(server)
        .post('/api/auth')
        .send({
          identifier : 'user1',
          password   : 'wrongpassword'
        })
        .end((err, res) => {

          expect(res).to.have.status(401);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.have.property('form');
          expect(res.body.errors.form).to.be.a('string');
          expect(res.body.errors.form).to.equal('Incorrect Password');
          done();
        });
    });
  });

  describe('POST /api/auth (no such user)', () => {
    it('Returns 401 (Unauthorized) for non-existent user', (done) => {
      chai.request(server)
        .post('/api/auth')
        .send({
          identifier : 'nonexistentuser',
          password   : 'nonexistentpassword'
        })
        .end((err, res) => {

          expect(res).to.have.status(401);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.have.property('form');
          expect(res.body.errors.form).to.be.a('string');
          expect(res.body.errors.form).to.equal('We couldn\'t find a user with that Username / Email');
          done();
        });
    });
  });

});
