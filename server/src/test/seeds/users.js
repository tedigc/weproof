import bcrypt from 'bcrypt';
import { User } from '../../db/models';

const N_EXTRA_USERS = 40;
const PASSWORD_DIGEST = bcrypt.hashSync("test", 10);

const users = [
  {
    username : 'tedigc',
    email    : 'tedigc@test.com',
    password : 'test'
  },
  {
    username : 'jimqbob',
    email    : 'jimqbob@test.com',
    password : 'test'
  },
  {
    username : 'lukeag',
    email    : 'lukeag@test.com',
    password : 'test'
  },
  {
    username : 'gcjensen',
    email    : 'gcjensen@test.com',
    password : 'test'
  }
];

let promises = [];

// Save known users
//
for(let i=0; i<users.length; i++) {
  let user = users[i];
  promises.push(new Promise((resolve, reject) => {

    return User
      .forge({
        username        : user.username,
        email           : user.email,
        password_digest : PASSWORD_DIGEST
      }, { hasTimestamps: true })
      .save(null, { method: 'insert' })
      .then(data => {
        console.log('[user] ' + user.username + ' saved to database.');
        resolve();
      })
      .catch(err => {
        console.error(err);
        reject();
      });

  }));
}

for(let i=0; i<N_EXTRA_USERS; i++) {
  let user = {
    username : 'user' + i,
    email    : 'user' + i + '@test.com',
    password : PASSWORD_DIGEST
  };

    promises.push(new Promise((resolve, reject) => {

    return User
      .forge({
        username        : user.username,
        email           : user.email,
        password_digest : PASSWORD_DIGEST
      }, { hasTimestamps: true })
      .save(null, { method: 'insert' })
      .then(data => {
        console.log('[user] ' + user.username + ' saved to database.');
        resolve();
      })
      .catch(err => {
        console.error(err);
        reject();
      });

  }));
}

Promise.all(promises)
  .then(() => { process.exit() });