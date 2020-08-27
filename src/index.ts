/* eslint-disable no-empty */
import Koa from 'koa';
//import graphqlHTTP from 'koa-graphql';
//import mount from 'koa-mount';
import mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import koaRouter from 'koa-router';
import { ApolloServer } from 'apollo-server-koa';
import auth from './middleware/auth';

import * as graphlSchema from './graphql';

const server = new ApolloServer(graphlSchema);

const app = new Koa();
const router = new koaRouter();

app.use(router.routes());
app.use(router.allowedMethods());

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

server.applyMiddleware({ app });

/*app.use(
  mount(
    '/graphql',
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    }),
  ),
);*/

//export default server;
