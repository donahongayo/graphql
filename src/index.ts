/* eslint-disable no-empty */
import Koa from 'koa';
import mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import koaRouter from 'koa-router';
import { ApolloServer } from 'apollo-server-koa';
import KoaAuth from 'koa-basic-auth';
import jwt from 'jsonwebtoken';

import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import config from './config/config';
import mJwt from './middleware/jwt';

const app = new Koa();
const router = new koaRouter();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ ctx }) => {
    const authHeader = ctx.req.headers && ctx.req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      let auth;
      try {
        auth = jwt.verify(token, config.secret);
      } catch (err) {}
      if (auth.username == config.username) {
        return { auth };
      }
    } else {
      throw new Error('Unauthorized');
    }
  },
});

app.use(bodyParser());
mongoose.connect(`mongodb://127.0.0.1:27017/docker-mongo`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Database connected.'));

app.listen(9000, () => console.log('🚀 Server ready.'));
app.on('error', (err) => {
  console.log('Server error', err);
});

router.post(
  '/api/auth',
  KoaAuth({ name: config.username, pass: config.password }),
  async (ctx) => {
    ctx.body = {
      token: mJwt,
    };
  },
);

app.use(router.routes());
app.use(router.allowedMethods());
server.applyMiddleware({ app });

//export default server;
