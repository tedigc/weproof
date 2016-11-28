var express = require('express');
var bcrypt = require('bcrypt');
var isEmpty = require('lodash/isEmpty');
var commonValidations = require('../shared/validations/signup');

var User = require('../models/user');

var router = express.Router();

function validateInput(data, otherValidations) {
  var validation = otherValidations(data);
  return User.query({
    where  : { username: data.username },
    orWhere: { email: data.email }
  }).fetch().then(function(user) {
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

router.post('/', function(req, res) {
  validateInput(req.body, commonValidations)
    .then(function(validation) {
      if(validation.isValid) {
        var username = req.body.username;
        var email    = req.body.email;
        var password = req.body.password;
        var password_digest = bcrypt.hashSync(password, 10);

        User.forge({
          username, email, password_digest
        }, { hasTimestamps: true })
          .save(null, {method: 'insert'})
          .then(function(user) {
            res.json({ success: true });
          })
          .catch(function(err) {
            console.log(err);
            res.status(500).json({ error: err });
          });
      } else {
        res.status(400).json(validation.errors);    
      }
    });

  // var validation = validateInput(req.body);
});

module.exports = router;