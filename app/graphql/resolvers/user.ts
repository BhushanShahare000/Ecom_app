import { GraphQLError } from "graphql";

export const userResolvers = {
    Query: {
        me: async (_: any, __: any, { prisma, session }: any) => {
            if (!session?.user) throw new GraphQLError("Not authenticated");

            return prisma.user.findUnique({
                where: { email: session.user.email },
                select: { id: true, name: true, email: true, role: true },
            });
        },
    },
};
