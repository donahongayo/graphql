/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import jwt from 'jsonwebtoken';
import { Request, Next } from 'koa';
import config from '../config/config';

const authenticateJWT = async (req: Request, next: Next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    //console.log(token);
    let auth;
    try {
      auth = jwt.verify(token, config.secret);
    } catch (err) {}
    if (auth.username == config.username) {
      return next();
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export default authenticateJWT;
