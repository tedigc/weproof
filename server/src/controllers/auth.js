var express = require('express');
var bcrypt  = require('bcrypt');
var jwt     = require('jsonwebtoken');

var User = require('../models/user');

var router = express.Router();

var jwtSecret = process.env.JWT_SECRET || 'mysecretkey';

router.post('/', function(req, res) {
  var identifier = req.body.identifier;
  var password   = req.body.password;
  User.query({
    where: { username : identifier },
    orWhere: { email : identifier }
  }).fetch().then(function(user) {
    if(user) {
      if(bcrypt.compareSync(password, user.get('password_digest'))){
        var token = jwt.sign({
          id       : user.get('id'),
          username : user.get('username')
        }, jwtSecret);
        res.json({ token });
      } else {
        res.status(401).json({ errors: { form: "Incorrect Password" } });
      }
    } else {
      res.status(401).json({ errors: { form: "We couldn't find a user with that Username / Email" } });
    }
  });
});

module.exports = router;