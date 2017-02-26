import bcrypt from 'bcrypt';
import { User } from '../../db/models';

const users = [
  {
    username : 'tedigc',
    email    : 'tedigc@gmail.com',
    password : 'test'
  },
  {
    username : 'jimqbob',
    email    : 'jimqbob@gmail.com',
    password : 'test'
  },
  {
    username : 'lukeag',
    email    : 'lukeag@gmail.com',
    password : 'test'
  },
  {
    username : 'gcjensen',
    email    : 'gcjensen@gmail.com',
    password : 'test'
  }
];

let promises = [];

// Save users
//
for(let i=0; i<users.length; i++) {
  let user = users[i];
  let password_digest = bcrypt.hashSync(user.password, 10);
  promises.push(new Promise((resolve, reject) => {

    return User
      .forge({
        username        : user.username,
        email           : user.email,
        password_digest : password_digest
      }, { hasTimestamps: true })
      .save(null, { method: 'insert' })
      .then(newUser => {
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