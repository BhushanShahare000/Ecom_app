export * from './product';


import { cartResolvers } from '../resolvers/cart';
import { productResolver } from "../resolvers/product";
import { categoryResolvers } from './category';
import { userResolvers } from "./user";

export const resolvers = {
    Query: {
        ...categoryResolvers.Query,
        ...productResolver.Query,
        ...userResolvers.Query,
        ...cartResolvers.Query,
    },
    Mutation: {
        ...categoryResolvers.Mutation,
        ...productResolver.Mutation,
        ...cartResolvers.Mutation,
    },
};
