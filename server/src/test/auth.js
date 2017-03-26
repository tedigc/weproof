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

describe('API routes - auth', () => {

  describe('GET /api/excerpts (Unauthorized)', () => {
    it('Return a 403 (Forbidden) status code.', (done) => {
      chai.request(server)
        .get('/api/excerpts/')
        .end((err, res) => {
          expect(err.status).to.equal(403);
          expect(err.response.error.text).to.equal("{\"error\":\"No auth token\"}");
          done();
        });
    });
  });

});
