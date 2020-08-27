import jwt from 'jsonwebtoken';
import config from '../config/config';

const token = jwt.sign(
  {
    username: config.username,
  },
  config.secret
);

export default token;
