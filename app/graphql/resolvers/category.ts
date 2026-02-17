import { GraphQLError } from "graphql";
import { prisma } from "@/app/lib/prisma";

export const categoryResolvers = {
    Query: {
        categories: async () => prisma.category.findMany(),
        category: async (_: any, { id }: { id: string }) => {
            return prisma.category.findUnique({
                where: { id },
                include: { products: { include: { category: true } } }
            });
        }
    },

    Mutation: {
        createCategory: async (_: any, { name }: { name: string }, { session }: any) => {
            if (!session?.user || session.user.role !== "ADMIN") {
                throw new GraphQLError("Not authorized");
            }

            return prisma.category.create({ data: { name } });
        },
    },
};
