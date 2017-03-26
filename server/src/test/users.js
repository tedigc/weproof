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

/**
 * [x] successful new user
 * [x] username taken
 * [x] email taken
 * [x] passwords dont match
 * [x] empty username
 * [x] empty email
 * [x] empty password field
 * [x] empty passwordConfirm field
 * [ ] invalid email
 */

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

  afterEach((done) => {
    db.migrate.rollback()
    .then(() => {
      done();
    });
  });

  describe('POST /api/users', () => {
    it('Creates a new user in the database and returns it', (done) => {
      chai.request(server)
        .post('/api/users')
        .send({
          username        : 'newuser',
          email           : 'newuser@test.com',
          password        : 'newpassword',
          passwordConfirm : 'newpassword'
        })
        .end((err, res) => {

          expect(res).to.have.status(200);
          expect(res.body).to.have.property('user');

          let user = res.body.user;
          expect(user).to.be.an('object');
          expect(user).to.have.property('id');
          expect(user).to.have.property('username');
          expect(user).to.have.property('email');
          expect(user).to.have.property('password_digest');
          expect(user).to.have.property('created_at');
          expect(user).to.have.property('updated_at');

          expect(user.id).to.equal(4);
          expect(user.username).to.equal('newuser');
          expect(user.email).to.equal('newuser@test.com');
          expect(bcrypt.compareSync('newpassword', user.password_digest)).to.equal(true);

          done();
        });
    });
  });

  describe('POST /api/users (username taken)', () => {
    it('Returns 400 (Bad request) when username is already taken', (done) => {
      chai.request(server)
        .post('/api/users')
        .send({
          username        : 'user1',
          email           : 'newuser@test.com',
          password        : 'newpassword',
          passwordConfirm : 'newpassword'
        })
        .end((err, res) => {

          expect(res).to.have.status(400);
          expect(res.body).to.have.property('username');
          expect(res.body.username).to.be.a('string');
          expect(res.body.username).to.equal('A user with that username already exists.');

          done();
        });
    });
  });

  describe('POST /api/users (username taken)', () => {
    it('Returns 400 (Bad Request) when email is already taken', (done) => {
      chai.request(server)
        .post('/api/users')
        .send({
          username        : 'newuser',
          email           : 'user1@test.com',
          password        : 'newpassword',
          passwordConfirm : 'newpassword'
        })
        .end((err, res) => {

          expect(res).to.have.status(400);
          expect(res.body).to.have.property('email');
          expect(res.body.email).to.be.a('string');
          expect(res.body.email).to.equal('A user with that Email already exists.');

          done();
        });
    });
  });

  describe('POST /api/users (passwords dont match)', () => {
    it('Returns 400 (Bad request) when password and password confirmation don\'t match', (done) => {
      chai.request(server)
        .post('/api/users')
        .send({
          username        : 'newuser',
          email           : 'user1@test.com',
          password        : 'newpassword',
          passwordConfirm : 'newpassworddifferent'
        })
        .end((err, res) => {

          expect(res).to.have.status(400);
          expect(res.body).to.have.property('passwordConfirm');
          expect(res.body.passwordConfirm).to.be.a('string');
          expect(res.body.passwordConfirm).to.equal('Passwords must match');

          done();
        });
    });
  });

  describe('POST /api/users (empty username)', () => {
    it('Returns 400 (Bad request) when username field is left empty', (done) => {
      chai.request(server)
        .post('/api/users')
        .send({
          username        : '',
          email           : 'user1@test.com',
          password        : 'newpassword',
          passwordConfirm : 'newpassworddifferent'
        })
        .end((err, res) => {

          expect(res).to.have.status(400);
          expect(res.body).to.have.property('username');
          expect(res.body.username).to.be.a('string');
          expect(res.body.username).to.equal('Username is required.');

          done();
        });
    });
  });

  describe('POST /api/users (empty email)', () => {
    it('Returns 400 (Bad request) when email field is left empty', (done) => {
      chai.request(server)
        .post('/api/users')
        .send({
          username        : 'user4',
          email           : '',
          password        : 'newpassword',
          passwordConfirm : 'newpassworddifferent'
        })
        .end((err, res) => {

          expect(res).to.have.status(400);
          expect(res.body).to.have.property('email');
          expect(res.body.email).to.be.a('string');
          expect(res.body.email).to.equal('E-mail is required.');

          done();
        });
    });
  });

  describe('POST /api/users (empty password)', () => {
    it('Returns 400 (Bad request) when password field is left empty', (done) => {
      chai.request(server)
        .post('/api/users')
        .send({
          username        : 'user4',
          email           : 'user4@test.com',
          password        : '',
          passwordConfirm : 'newpassworddifferent'
        })
        .end((err, res) => {

          expect(res).to.have.status(400);
          expect(res.body).to.have.property('password');
          expect(res.body.password).to.be.a('string');
          expect(res.body.password).to.equal('Password is required.');

          done();
        });
    });
  });

  describe('POST /api/users (empty password confirmation)', () => {
    it('Returns 400 (Bad request) when password confirmation field is left empty', (done) => {
      chai.request(server)
        .post('/api/users')
        .send({
          username        : 'user4',
          email           : 'user4@test.com',
          password        : 'newpassword',
          passwordConfirm : ''
        })
        .end((err, res) => {

          expect(res).to.have.status(400);
          expect(res.body).to.have.property('passwordConfirm');
          expect(res.body.passwordConfirm).to.be.a('string');
          expect(res.body.passwordConfirm).to.equal('Password Confirmation is required.');

          done();
        });
    });
  });

  describe('POST /api/users (invalid email)', () => {
    it('Returns 400 (Bad request) when email is invalid', (done) => {
      chai.request(server)
        .post('/api/users')
        .send({
          username        : 'user4',
          email           : 'user4notanemail',
          password        : 'newpassword',
          passwordConfirm : 'newpassword'
        })
        .end((err, res) => {

          expect(res).to.have.status(400);
          expect(res.body).to.have.property('email');
          expect(res.body.email).to.be.a('string');
          expect(res.body.email).to.equal('E-mail is invalid.');

          done();
        });
    });
  });

});
