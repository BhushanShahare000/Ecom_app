import { gql } from "@apollo/client";

export const productTypeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    image: String!
    category: Category!
  }

  type Category {
    id: ID!
    name: String!
    products: [Product!]
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
    categories: [Category!]!
    category(id: ID!): Category
  }

  type Mutation {
    deleteProduct(id: ID!): Boolean
    createProduct(
      name: String
      description: String!
      price: Float!
      image: String!
      categoryId: ID!
    ): Product!
    createCategory(name: String!): Category!
    updateProduct(
      id: ID!
      name: String
      description: String
      price: Float
      image: String
      categoryId: ID
    ): Product!
  }
`;
