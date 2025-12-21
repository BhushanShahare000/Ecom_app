export * from './product';


import { cartResolvers } from '../resolvers/cart';
import { productResolver } from "../resolvers/product";
import { categoryResolvers } from './category';
import { userResolvers } from "./user";
import { orderResolver } from "./order";

export const resolvers = {
    Query: {
        ...categoryResolvers.Query,
        ...productResolver.Query,
        ...userResolvers.Query,
        ...cartResolvers.Query,
        ...orderResolver.Query,
    },
    Mutation: {
        ...categoryResolvers.Mutation,
        ...productResolver.Mutation,
        ...cartResolvers.Mutation,
        ...orderResolver.Mutation,
    },
};
