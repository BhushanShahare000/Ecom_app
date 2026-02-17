import { GraphQLError } from "graphql";
import { prisma } from "@/app/lib/prisma";

export const cartResolvers = {
    Query: {
        cart: async (_: any, __: any, { session }: any) => {
            if (!session?.user) throw new GraphQLError("Not authenticated");

            return prisma.cartItem.findMany({
                where: {
                    cart: {
                        userId: session.user.id
                    }
                },
                include: { product: { include: { category: true } } },
            });
        },
    },

    Mutation: {
        addToCart: async (_: any, { productId, quantity }: any, { session }: any) => {
            if (!session?.user) throw new GraphQLError("Not authenticated");

            // Get or create cart
            let cart = await prisma.cart.findUnique({
                where: { userId: session.user.id },
            });

            if (!cart) {
                cart = await prisma.cart.create({
                    data: { userId: session.user.id },
                });
            }

            // Check if item already exists
            const existing = await prisma.cartItem.findFirst({
                where: {
                    cartId: cart.id,
                    productId
                },
            });

            if (existing) {
                // Increment quantity
                return prisma.cartItem.update({
                    where: { id: existing.id },
                    data: { quantity: existing.quantity + quantity },
                    include: { product: { include: { category: true } } },
                });
            }

            return prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
                include: { product: { include: { category: true } } },
            });
        },

        removeFromCart: async (_: any, { productId }: any, { session }: any) => {
            if (!session?.user) throw new GraphQLError("Not authenticated");

            await prisma.cartItem.deleteMany({
                where: {
                    cart: {
                        userId: session.user.id
                    },
                    productId
                },
            });

            return true;
        },

        updateCartItem: async (_: any, { productId, quantity }: any, { session }: any) => {
            if (!session?.user) throw new GraphQLError("Not authenticated");

            const item = await prisma.cartItem.findFirst({
                where: {
                    cart: {
                        userId: session.user.id
                    },
                    productId
                },
            });

            if (!item) throw new GraphQLError("Item not in cart");
            if (quantity <= 0) throw new GraphQLError("Quantity must be greater than 0");

            return prisma.cartItem.update({
                where: { id: item.id },
                data: { quantity },
                include: { product: { include: { category: true } } },
            });
        },
    },
};
