import { prisma } from "@/app/lib/prisma"

export const productResolver = {
    Query: {
        products: () =>
            prisma.product.findMany({ include: { category: true } }),
        product: (_: any, { id }: { id: string }) =>
            prisma.product.findUnique({ where: { id }, include: { category: true } })
    },
    Mutation: {
        createProduct: (_: any, args: any) => prisma.product.create({ data: args }),
    },

};
