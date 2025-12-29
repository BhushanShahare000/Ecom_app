"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { client } from "@/app/lib/apollo";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { GetOrdersData, Order } from "@/app/graphql/types";

const GET_ORDERS = gql`
  query {
    orders {
      id
      total
      status
      createdAt
      items {
        id
        quantity
        price
        product {
          id
          name
          image
        }
      }
    }
  }
`;

export default function OrdersPage() {
    const { data, loading, error } = useQuery<GetOrdersData>(GET_ORDERS, { client });

    if (loading) return <p className="text-center mt-10">Loading orders...</p>;
    if (error) return <p className="text-center text-red-500">{error.message}</p>;

    const orders = data?.orders || [];

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                📦 Your Orders
            </h1>

            {orders.length === 0 ? (
                <p className="text-gray-500 text-center">No orders yet.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: Order) => (
                        <Card key={order.id} className="shadow-sm border rounded-xl">
                            <CardContent className="p-4 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-800">
                                        Order #{order.id.slice(0, 6)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 border-b pb-2"
                                        >
                                            <div className="relative w-14 h-14 rounded overflow-hidden border">
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
                                            <div className="flex-1">
                                                <p className="text-gray-800 font-medium">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity} × ₹{item.price}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-3">
                                    <span className="font-semibold text-gray-700">
                                        Total: ₹{order.total.toFixed(2)}
                                    </span>
                                    <span
                                        className={`text-sm font-medium ${order.status === "PENDING"
                                            ? "text-yellow-600"
                                            : "text-green-600"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
