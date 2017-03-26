var bcrypt = require('bcrypt');
var password_digest = bcrypt.hashSync("test", 10);

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({id: 1, username: 'user1', email: 'user1@test.com', password_digest: password_digest}),
        knex('users').insert({id: 2, username: 'user2', email: 'user2@test.com', password_digest: password_digest}),
        knex('users').insert({id: 3, username: 'user3', email: 'user3@test.com', password_digest: password_digest}),
      ]);
    });
};
