import { GraphQLSchema } from "graphql";
import { prisma } from "@/app/lib/prisma";
import { GraphQLError } from "graphql/error";

export const orderResolver = {
    Query: {
        orders: async (_: any, __: any, { session }: any) => {
            if (!session?.user) throw new GraphQLError("Unauthorized")
            return prisma.order.findMany({
                where: { userId: session.user.id },
                include: {
                    items: { include: { product: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        }
    },

    Mutation: {
        checkout: async (_: any, __: any, { session }: any) => {
            if (!session?.user) throw new GraphQLError("Unauthorized")

            const cartItems = await prisma.cartItem.findMany({
                where: { cart: { userId: session.user.id } },
                include: { product: true },
            });

            if (cartItems.length === 0) {
                throw new GraphQLError("Cart is empty")
            }

            const total = cartItems.reduce(
                (acc, item) => acc + item.product.price * item.quantity, 0);

            // Create order
            const order = await prisma.order.create({
                data: {
                    userId: session.user.id,
                    total,
                    items: {
                        create: cartItems.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price,
                        })),
                    },
                },
                include: { items: { include: { product: true } } },
            });

            // Clear cart
            await prisma.cartItem.deleteMany({
                where: { cart: { userId: session.user.id } },
            });

            return order;
        },
    },
};
