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
        },
        allOrders: async (_: any, __: any, { session }: any) => {
            if (session?.user?.role !== "ADMIN") throw new GraphQLError("Forbidden")
            return prisma.order.findMany({
                include: {
                    user: true,
                    items: { include: { product: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        }
    },

    Mutation: {
        deleteOrder: async (_: any, { id }: { id: string }, { session }: any) => {
            if (session?.user?.role !== "ADMIN") throw new GraphQLError("Forbidden")
            try {
                // Delete related order items first (though Prisma should handle this if defined, let's be safe)
                await prisma.orderItem.deleteMany({ where: { orderId: id } });
                await prisma.order.delete({ where: { id } });
                return true;
            } catch (error) {
                console.error("Delete order error:", error);
                throw new GraphQLError("Failed to delete order");
            }
        },
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

            // Create order record in DB
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
