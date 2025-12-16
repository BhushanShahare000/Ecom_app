import { gql } from "apollo-server-micro"

export const typeDefs = gql`

type User {
id:ID!
name:String!
email:String!
role: String!
}


type Product {
id:ID!
name:String!
description:String!
price:Float!
image:String!
category:Category!
}

type Category {
id:ID!
name:String!
products:[Product!]
}

type CartItem{
id:ID!
product:Product!
quantity:Int!

}
  type Query {
    products: [Product!]!
    product(id: ID!): Product
    me: User
    cart: [CartItem!]!   # ✅ Added this line
  }

type Query {
products:[Product!]!
product(id:ID!):Product
categories:[Category!]!
}

type Mutation{

  addToCart(productId: ID!, quantity: Int!): CartItem!
    createCategory(name: String!): Category!
createProduct(name:String,description:String!,price:Float!,image:String!,categoryId:ID!):Product!
 removeFromCart(productId: ID!): Boolean! 
  updateCartItem(productId: ID!, quantity: Int!): CartItem!
}



type Query {
  products: [Product!]!
  product(id: ID!): Product
  categories: [Category!]!
  me: User
}

extend type Query {
  me: User
}


`