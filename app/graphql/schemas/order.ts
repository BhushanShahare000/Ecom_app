import { gql } from "@apollo/client";

export const orderTypeDefs = gql`
scalar DateTime

type OrderItem {
id:ID!
product:Product!
quantity:Int!
price:Float!
}

type Order {
id:ID!
total:Float!
status :String!
createdAt:DateTime!
updatedAt:DateTime!
items: [OrderItem!]!
}

extend type Query {
  orders:[Order!]!
  allOrders:[Order!]!
}

extend type Mutation {
  checkout:Order!
  deleteOrder(id: ID!): Boolean!
}
`