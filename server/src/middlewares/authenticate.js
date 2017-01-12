import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/user';

var jwtSecret = process.env.JWT_SECRET || config.jwtSecret;

export default function(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  var token;
  if(authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  }

  if(token) {
    jwt.verify(token, jwtSecret, function(err, decoded) {
      if(err) {
        res.status(401).json({ error: "Failed to authenticate" });
      } else {
        // Token is valid
        User.query({
          where: { id: decoded.id },
          select: ['id', 'username', 'email']
        }).fetch().then((user) => {
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