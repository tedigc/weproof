var bcrypt = require('bcrypt');
var password_digest = bcrypt.hashSync("test", 10);

var N_USERS = 40;

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {

      var promises = [];
      for(var i=1; i<=N_USERS; i++) {
        promises.push(knex('users').insert({ username: 'user' + i, email: 'user' + i + '@test.com', password_digest: password_digest}));
      }

      // Inserts seed entries
      return Promise.all(promises);
    });
};
