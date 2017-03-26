import bcrypt from 'bcrypt';
let password_digest = bcrypt.hashSync("test", 10);

let N_USERS = 40;

export function seed(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {

      let promises = [];
      for(let i=1; i<=N_USERS; i++) {
        promises.push(knex('users').insert({ username: 'user' + i, email: 'user' + i + '@test.com', password_digest: password_digest}));
      }

      // Inserts seed entries
      return Promise.all(promises);
    });
}
