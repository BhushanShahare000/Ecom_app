"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { client } from "@/app/lib/apollo";
import { GetCartData, CartItem, CheckoutData } from "@/app/graphql/types";


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
    const [checkout] = useMutation<CheckoutData>(CHECKOUT, { client });

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
            <div className="flex justify-center items-center h-screen text-gray-500">
                Loading cart...
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {error.message}
            </div>
        );

    const handleRemove = async (productId: string) => {
        try {
            await removeFromCart({ variables: { productId } });
            alert("Removed from cart");
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
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">🛒 Your Cart</h1>

            {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center">Your cart is empty.</p>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item: CartItem) => (
                        <Card
                            key={item.id}
                            className="border border-gray-200 shadow-sm hover:shadow-md transition rounded-xl"
                        >
                            <CardContent className="flex gap-4 items-center p-4">
                                {/* Product Image */}
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                    <Image
                                        src={
                                            item.product.image?.startsWith("http")
                                                ? item.product.image
                                                : "/placeholder.png"
                                        }
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                                        {item.product.name}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        Price: ₹{item.product.price}
                                    </p>
                                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                                </div>

                                {/* Remove Button */}
                                <Button
                                    onClick={() => handleRemove(item.product.id)}
                                    variant="destructive"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Total Summary */}
                    <Card className="border border-gray-300 mt-6">
                        <CardContent className="flex items-center justify-between p-4">
                            <span className="text-lg font-semibold text-gray-800">
                                Total:
                            </span>
                            <span className="text-xl font-bold text-blue-600">
                                ₹{total.toFixed(2)}
                            </span>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end mt-4">
                        <Button
                            onClick={handleCheckout}
                            size="lg"
                            className="bg-green-600 hover:bg-green-700 text-white px-6"
                        >
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
