var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/user');

module.exports = function(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  var token;
  if(authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  }

  if(token) {
    jwt.verify(token, config.jwtSecret, function(err, decoded) {
      if(err) {
        res.status(401).json({ error: "Failed to authenticate" });
      } else {
        // Token is valid
        new User({ id: decoded.id }).fetch().then(function(user) {
          if(!user) {
            res.status(404).json({ error: "No such user" });
          } else {
            // Attach the found user to the request, then call next();
            req.currentUser = user;
            next();
          }
        });
      }
    });
  } else {
    res.status(403).json({ error: "No auth token"});
  }
};