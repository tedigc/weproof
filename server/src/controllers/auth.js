import express  from 'express';
import bcrypt   from 'bcrypt';
import jwt      from 'jsonwebtoken';
import config   from '../config';
import { User } from '../db/models';

let router = express.Router();
let jwtSecret = process.env.JWT_SECRET || config.jwtSecret;

router.post('/', (req, res) => {
  let identifier = req.body.identifier;
  let password   = req.body.password;
  User
    .query({
      where: { username : identifier },
      orWhere: { email : identifier }
    })
    .fetch()
    .then(user => {
      if(user) {
        if(bcrypt.compareSync(password, user.get('password_digest'))){

          let token = jwt.sign({
            id       : user.get('id'),
            username : user.get('username')
          }, jwtSecret);
          res.json({ token });

        } else {
          res.status(401).json({ errors: { form : "Incorrect Password" } });
        }
      } else {
        res.status(401).json({ errors: { form : "We couldn't find a user with that Username / Email" } });
      }
    });
});

export default router;