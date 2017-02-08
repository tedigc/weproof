import express from 'express';
import bcrypt  from 'bcrypt';
import isEmpty from 'lodash/isEmpty';
import commonValidations from '../shared/validations/signup';
import { User } from '../db/models';

var router = express.Router();

function validateInput(data, otherValidations) {
  var validation = otherValidations(data);
  return User
    .query({
      where  : { username: data.username },
      orWhere: { email: data.email }
    })
    .fetch()
    .then((user) => {
      if(user) {
        if(user.get('username') === data.username) {
          validation.errors.username = "A user with that username already exists.";
        }
        if(user.get('email') === data.email) {
          validation.errors.email = "A user with that Email already exists.";
        }
      }
      return {
        errors: validation.errors,
        isValid: isEmpty(validation.errors)
      };
    });
}

router.post('/', (req, res) => {
  validateInput(req.body, commonValidations)
    .then((validation) => {
      if(validation.isValid) {
        var username = req.body.username;
        var email    = req.body.email;
        var password = req.body.password;
        var password_digest = bcrypt.hashSync(password, 10);

        User
          .forge({
            username, email, password_digest
          }, { hasTimestamps: true })
          .save(null, {method: 'insert'})
          .then((user) => {
            res.json({ success: true });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err });
          });
      } else {
        res.status(400).json(validation.errors);    
      }
    });
});

export default router;