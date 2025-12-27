import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover",
});

export async function POST() {
    try {
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;

        if (!stripeSecretKey) {
            console.error("Missing STRIPE_SECRET_KEY");
            return NextResponse.json({ error: "Internal Server Error: Missing Stripe Key" }, { status: 500 });
        }
        if (!appUrl) {
            console.error("Missing NEXT_PUBLIC_APP_URL");
            return NextResponse.json({ error: "Internal Server Error: Missing App URL" }, { status: 500 });
        }

        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const user = session.user;
        const cartItems = await prisma.cartItem.findMany({
            where: { cart: { userId: user.id } },
            include: { product: true },
        });

        if (cartItems.length === 0)
            return NextResponse.json({ error: "Cart empty" }, { status: 400 });

        // Create Stripe line items
        const line_items = cartItems.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.product.name,
                    images: [item.product.image],
                },
                unit_amount: Math.round(item.product.price * 100), // convert ₹ → paise
            },
            quantity: item.quantity,
        }));

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${appUrl}/success`,
            cancel_url: `${appUrl}/cart`,
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error: any) {
        console.error("Checkout Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
