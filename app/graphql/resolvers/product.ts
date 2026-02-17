import { prisma } from "@/app/lib/prisma";
import { GraphQLError } from "graphql";

export const productResolver = {
    Query: {
        products: () =>
            prisma.product.findMany({ include: { category: true } }),

        product: (_: any, { id }: { id: string }) =>
            prisma.product.findUnique({
                where: { id },
                include: { category: true },
            }),
    },

    Mutation: {
        // ✅ Create Product
        createProduct: (_: any, args: any, { session }: any) => {
            if (session?.user?.role !== "ADMIN") throw new GraphQLError("Not authorized");
            return prisma.product.create({ data: args, include: { category: true } });
        },

        deleteProduct: async (_: any, { id }: { id: string }, { session }: any) => {
            if (session?.user?.role !== "ADMIN") throw new GraphQLError("Not authorized");
            try {
                // Delete related cart items first
                await prisma.cartItem.deleteMany({ where: { productId: id } });

                // Delete the product
                await prisma.product.delete({ where: { id } });
                return true;
            } catch (error: any) {
                console.error("Error deleting product:", error);
                // Prisma error code for foreign key constraint violation
                if (error.code === 'P2003') {
                    throw new GraphQLError("Cannot delete product: It is linked to existing orders. Delete those orders first if you wish to remove this product.");
                }
                throw new GraphQLError("Failed to delete product. Please try again.");
            }
        },

        // ✅ Optional: Update Product (simple)
        updateProduct: (_: any, { id, ...data }: any, { session }: any) => {
            if (session?.user?.role !== "ADMIN") throw new GraphQLError("Not authorized");
            return prisma.product.update({
                where: { id },
                data,
                include: { category: true },
            });
        },
    },
};
