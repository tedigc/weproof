import jwt from 'jsonwebtoken';
import config from '../config';

let token = jwt.sign({
  id       : '1',
  username : 'user1'
}, config.jwtSecret);

let authHeader = `Bearer ${token}`;

export default authHeader;