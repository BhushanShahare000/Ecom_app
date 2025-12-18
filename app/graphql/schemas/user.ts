import { gql } from "@apollo/client";

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Query {
    me: User
  }
`;
