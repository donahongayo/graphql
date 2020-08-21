import Koa from 'koa';
import graphqlHTTP from 'koa-graphql';
import mount from 'koa-mount';
import schema from './graphql/schema';
import root from './graphql/root';
import mongoose from 'mongoose';

const app = new Koa();

mongoose.connect(`mongodb://127.0.0.1:27017/docker-mongo`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Database connected.'));

app.listen(9000);

app.on('error', (err) => {
  console.log('Server error', err);
});

app.use(
  mount(
    '/graphql',
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    }),
  ),
);

//export default server;
