import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

export async function POST() {
    try {
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;

        if (!stripeSecretKey) {
            console.error("❌ CRITICAL: Missing STRIPE_SECRET_KEY in environment");
            return NextResponse.json({ error: "Checkout temporarily unavailable (Key Missing)" }, { status: 500 });
        }
        if (!appUrl) {
            console.error("❌ CRITICAL: Missing NEXT_PUBLIC_APP_URL in environment");
            return NextResponse.json({ error: "Checkout temporarily unavailable (URL Missing)" }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: "2025-12-15.clover",
        });

        const session = await getServerSession(authOptions);
        if (!session?.user) {
            console.warn("⚠️ Checkout attempt without session");
            return NextResponse.json({ error: "Please log in to continue" }, { status: 401 });
        }

        const user = session.user;
        if (!user.id) {
            console.error("❌ CRITICAL: User ID missing in session");
            return NextResponse.json({ error: "Session error: User ID missing" }, { status: 500 });
        }

        const cartItems = await prisma.cartItem.findMany({
            where: { cart: { userId: user.id } },
            include: { product: true },
        });

        if (cartItems.length === 0)
            return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });

        const total = cartItems.reduce(
            (acc, item) => acc + item.product.price * item.quantity, 0);

        // 1. Create Order in Database (PENDING status)
        const order = await prisma.order.create({
            data: {
                userId: user.id as string,
                total,
                status: "PENDING",
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
        });

        // 2. Clear User's Cart
        await prisma.cartItem.deleteMany({
            where: { cart: { userId: user.id as string } },
        });

        // Prepare Stripe line items with absolute image URLs
        const line_items = cartItems.map((item) => {
            let imageUrl = item.product.image;
            // Stripe requires absolute URLs for images
            if (imageUrl && !imageUrl.startsWith("http")) {
                imageUrl = `${appUrl.replace(/\/$/, "")}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
            }

            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.product.name,
                        images: imageUrl ? [imageUrl] : [],
                    },
                    unit_amount: Math.round(item.product.price * 100), // convert ₹ → paise
                },
                quantity: item.quantity,
            };
        });

        console.log(`🚀 Creating Stripe session for order ${order.id}`);

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${appUrl.replace(/\/$/, "")}/success`,
            cancel_url: `${appUrl.replace(/\/$/, "")}/cart`,
            metadata: {
                orderId: order.id,
                userId: user.id as string,
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error: any) {
        console.error("❌ Checkout API Error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred during checkout" },
            { status: 500 }
        );
    }
}
