"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, CreditCard, ShieldCheck } from "lucide-react";
import { client } from "@/app/lib/apollo";
import { GetCartData, CartItem, CheckoutData } from "@/app/graphql/types";
import Link from "next/link";

const CHECKOUT = gql`
  mutation {
    checkout {
      id
      total
      status
    }
  }
`;

const GET_CART = gql`
  query {
    cart {
      id
      quantity
      product {
        id
        name
        price
        image
      }
    }
  }
`;

const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: ID!) {
    removeFromCart(productId: $productId)
  }
`;

export default function CartPage() {
    const { data, loading, error, refetch } = useQuery<GetCartData, {}>(GET_CART, { client });
    const [removeFromCart] = useMutation(REMOVE_FROM_CART, { client });

    const handleCheckout = async () => {
        try {
            const res = await fetch("/api/checkout", { method: "POST" });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url; // redirect to Stripe
            } else {
                alert(data.error || "Unable to checkout");
            }
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading)
        return (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-12">
                <div className="h-10 w-48 bg-gray-100 rounded-xl animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-50 rounded-2xl animate-pulse" />)}
                    </div>
                    <div className="h-64 bg-gray-50 rounded-3xl animate-pulse" />
                </div>
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col justify-center items-center py-32 text-center">
                <div className="bg-red-50 p-6 rounded-full mb-6">
                    <ShoppingBag className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart issues?</h2>
                <p className="text-gray-500 mb-8">{error.message}</p>
                <Button onClick={() => refetch()} className="bg-blue-600 rounded-full px-8">Refresh Cart</Button>
            </div>
        );

    const handleRemove = async (productId: string) => {
        try {
            await removeFromCart({ variables: { productId } });
            refetch();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const cartItems = data?.cart || [];
    const total = cartItems.reduce(
        (acc: number, item: CartItem) => acc + item.product.price * item.quantity,
        0
    );

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
            <div className="flex items-center gap-4 mb-10 text-gray-900 dark:text-gray-100 transition-colors">
                <div className="bg-blue-600 p-2 rounded-xl">
                    <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">Shopping <span className="text-blue-600 dark:text-blue-400">Cart</span></h1>
            </div>

            {cartItems.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-20 md:py-32 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 transition-all px-6">
                    <ShoppingBag className="w-16 md:w-20 h-16 md:h-20 text-gray-200 dark:text-gray-800 mb-6" />
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Your cart is feeling light</h3>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8 transition-colors">Seems like you haven&apos;t added anything to your cart yet.</p>
                    <Button asChild size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full px-10 border-none">
                        <Link href="/products">Explore Products</Link>
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-10 lg:gap-12 items-start">
                    {/* Cart Items List */}
                    <div className="w-full lg:col-span-2 space-y-4 md:space-y-6">
                        {cartItems.map((item: CartItem) => (
                            <div key={item.id} className="group relative bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                                <div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 shrink-0">
                                    <Image
                                        src={item.product.image?.startsWith("http") ? item.product.image : "/placeholder.png"}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                <div className="grow space-y-1 text-center sm:text-left w-full">
                                    <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                        {item.product.name}
                                    </h2>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium capitalize">Premium Quality</p>
                                    <p className="text-blue-600 dark:text-blue-400 font-extrabold text-lg md:text-xl pt-1 transition-colors">₹{item.product.price}</p>
                                </div>

                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between w-full sm:w-auto gap-4">
                                    <Button
                                        onClick={() => handleRemove(item.product.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-all order-2 sm:order-1"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>

                                    <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-full p-1 border border-gray-100 dark:border-gray-700 transition-colors order-1 sm:order-2">
                                        <button className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-colors text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><Minus className="w-3.5 h-3.5" /></button>
                                        <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors">{item.quantity}</span>
                                        <button className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-colors text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><Plus className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="space-y-6 lg:sticky lg:top-28">
                        <Card className="rounded-3xl border-none shadow-2xl shadow-blue-900/5 dark:shadow-none bg-white dark:bg-gray-900 overflow-hidden border dark:border-gray-800 transition-all">
                            <CardContent className="p-8 space-y-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors">Order Summary</h3>

                                <div className="space-y-4 pt-2">
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm transition-colors">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors">₹{total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm transition-colors">
                                        <span>Shipping</span>
                                        <span className="text-green-600 dark:text-green-400 font-bold uppercase tracking-wider text-[10px] mt-1 transition-colors">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm transition-colors">
                                        <span>Tax Estimate</span>
                                        <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors">₹0.00</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end transition-colors">
                                        <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors">Order Total</span>
                                        <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tighter transition-colors">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-8 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 border-none"
                                >
                                    Proceed to Checkout <ArrowRight className="w-5 h-5" />
                                </Button>

                                <div className="flex flex-col gap-4 pt-4">
                                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 transition-colors">
                                        <ShieldCheck className="w-4 h-4 text-green-500 dark:text-green-400" />
                                        <span>Secure 256-bit SSL encrypted payments</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 transition-colors">
                                        <CreditCard className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                        <span>Accepting all major credit & debit cards</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
