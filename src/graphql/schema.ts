import { gql } from 'apollo-server-koa';

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
  }
  input CreateUserInput {
    email: String!
    password: String!
    name: String
  }

  input UpdateProfileInput {
    id: ID!
    name: String
    password: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateProfile(input: UpdateProfileInput!): User!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!
  }
`;

export default typeDefs;
