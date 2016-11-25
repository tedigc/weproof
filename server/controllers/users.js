var express       = require('express');
var bcrypt        = require('bcrypt');
var validateInput = require('../shared/validations/signup');

var User = require('../models/user');

var router = express.Router();

router.post('/', function(req, res) {
  var validation = validateInput(req.body);
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

module.exports = router;