import { gql } from "@apollo/client";

export const cartTypeDefs = gql`
  type CartItem {
    id: ID!
    product: Product!
    quantity: Int!
  }

  type Query {
    cart: [CartItem!]!
  }

  type Mutation {
    addToCart(productId: ID!, quantity: Int!): CartItem!
    removeFromCart(productId: ID!): Boolean!
    updateCartItem(productId: ID!, quantity: Int!): CartItem!
  }
`;
