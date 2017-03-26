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

describe('API routes', () => {

  describe('GET /api/excerpts', () => {
    it('should return all a user\'s excerpts', (done) => {
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
            let attributes = res.body[i].attributes;

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
            expect()
          }
          done();
        });
    });

  });

});