import { buildSchema } from 'graphql';

const typeDefs = buildSchema(`
type User {
  id: ID,
  email: String
  password: String
  name: String, 
}
type Query {
 listUsers: [User]
}
type Mutation {
  createUser(email: String, name: String!, password: String): User
}
`);

export default typeDefs;
