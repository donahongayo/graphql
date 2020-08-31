import { createTestClient } from 'apollo-server-testing';
import { ApolloServer, gql } from 'apollo-server-koa';
import mongoose from 'mongoose';
import request from 'supertest';
import chai from 'chai';

import typeDefs from '../src/graphql/schema';
import resolvers from '../src/graphql/resolvers';
import User from '../src/models/user';
import app from '../src/';
import config from '../src/config/config';

const should = chai.should();

const constructServer = (context = {}) =>
  new ApolloServer({
    typeDefs,
    resolvers,
    context,
  });

const GET_USER = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;
const GET_USERS = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;
const CREATE_USER = gql`
  mutation createUser($email: String!, $name: String, $password: String!) {
    createUser(input: { email: $email, name: $name, password: $password }) {
      id
      email
      name
    }
  }
`;
const UPDATE_PROFILE = gql`
  mutation updateProfile($email: String, $name: String, $password: String) {
    updateProfile(input: { email: $email, name: $name, password: $password }) {
      id
      email
      name
    }
  }
`;
const testUserData = {
  email: 'testuser@mail.com',
  name: 'testuser',
  password: 'testpassword',
};
const createUser = () => {
  const server = constructServer();
  const { mutate } = createTestClient(server);
  return mutate({
    mutation: CREATE_USER,
    variables: testUserData,
  });
};
const setupDB = () => {
  before(async () => {
    return mongoose
      .connect('mongodb://127.0.0.1:27017/docker-mongo', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: 'test',
        pass: 'test',
      })
      .then(() => {
        console.log('successfully connected to the database');
      })
      .catch((err) => {
        console.log('error connecting to the database', err);
        process.exit();
      });
  });
  afterEach(async () => {
    return User.remove({});
  });
  after((done) => {
    mongoose.disconnect(done);
  });
};
describe('Endpoints', () => {
  setupDB();
  describe('POST /api/auth', () => {
    test('should return valid token', async () => {
      const basicAuth = Buffer.from(
        `${config.username}:${config.password}`,
      ).toString('base64');
      const resp = await request(app.callback())
        .post('/api/auth')
        .set('Authorization', `Basic ${basicAuth}`)
        .send();
      should.not.exist(resp);
    });
  });
  describe('Queries', () => {
    it('should fetch a user ', async () => {
      const server = constructServer({ auth: true });
      const { query } = createTestClient(server);
      const resCreateUser = await createUser();
      const id = resCreateUser.data.createUser.id;
      const res = await query({ query: GET_USER, variables: { id } });
      should.not.exist(res);
    });
    it('should fetch all users', async () => {
      const server = constructServer({ auth: true });
      const { query } = createTestClient(server);
      await createUser();
      const res = await query({ query: GET_USERS });
      should.not.exist(res);
    });
  });
  describe('Mutations', () => {
    it('should create a user', async () => {
      const res = await createUser();
      should.not.exist(res);
    });
    it('should update a user', async () => {
      const resCreateUser = await createUser();
      const server = constructServer({
        auth: { data: { _id: resCreateUser.data.createUser.id } },
      });
      const { mutate } = createTestClient(server);
      const email = 'new@mail.com';
      const password = 'newpassword';
      const res = await mutate({
        mutation: UPDATE_PROFILE,
        variables: {
          email,
          password,
        },
      });
      const updatedUser = await User.findById(res.data.updateProfile.id);
      should.not.exist(updatedUser);
    });
  });
});
