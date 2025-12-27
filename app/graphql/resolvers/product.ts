import { prisma } from "@/app/lib/prisma";

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
        createProduct: (_: any, args: any) =>
            prisma.product.create({ data: args, include: { category: true } }),

        deleteProduct: async (_: any, { id }: { id: string }) => {
            try {
                // Delete related cart items first
                await prisma.cartItem.deleteMany({ where: { productId: id } });

                // Delete the product
                await prisma.product.delete({ where: { id } });
                return true;
            } catch (error: any) {
                console.error("Error deleting product:", error);
                if (error.code === 'P2003') {
                    throw new Error("Cannot delete product because it is part of an existing order.");
                }
                throw new Error("Failed to delete product");
            }
        },

        // ✅ Optional: Update Product (simple)
        updateProduct: (_: any, { id, ...data }: any) =>
            prisma.product.update({
                where: { id },
                data,
                include: { category: true },
            }),
    },
};
