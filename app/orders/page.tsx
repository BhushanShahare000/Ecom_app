"use client";

import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Package, Calendar, Clock, ChevronRight, ShoppingBag, ExternalLink } from "lucide-react";
import { client } from "@/app/lib/apollo";
import { GetOrdersData, Order } from "@/app/graphql/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

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
    const { data, loading, error, refetch } = useQuery<GetOrdersData>(GET_ORDERS, { client });

    if (loading)
        return (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-8">
                <div className="h-12 w-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-4/5 bg-gray-50 dark:bg-gray-900 rounded-4xl animate-pulse" />
                    ))}
                </div>
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col justify-center items-center py-32 text-center">
                <div className="bg-red-50 p-6 rounded-full mb-6">
                    <Package className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load orders</h2>
                <p className="text-gray-500 mb-8">{error.message}</p>
                <div className="flex gap-4">
                    <Button onClick={() => refetch()} className="bg-blue-600 rounded-full px-8">Try Again</Button>
                    <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full px-8">Reload Page</Button>
                </div>
            </div>
        );

    const orders = data?.orders || [];

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 text-gray-900 dark:text-gray-100 transition-colors gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-2 rounded-xl shrink-0">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Your <span className="text-blue-600 dark:text-blue-400">Orders</span></h1>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">Manage and track your recent purchases</p>
                    </div>
                </div>
                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                    <div className="text-xs md:text-sm text-gray-400 dark:text-gray-500 font-medium transition-colors">
                        Total Orders: <span className="text-gray-900 dark:text-gray-100 font-bold transition-colors">{orders.length}</span>
                    </div>
                    <Button onClick={() => refetch()} variant="outline" size="sm" className="rounded-full shadow-sm hover:shadow-md transition-all dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 dark:hover:bg-gray-800 px-6 py-5 md:py-2">
                        Refresh List
                    </Button>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-20 md:py-32 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 transition-all px-6">
                    <ShoppingBag className="w-16 md:w-20 h-16 md:h-20 text-gray-200 dark:text-gray-800 mb-6 transition-colors" />
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors">No orders yet</h3>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8 transition-colors">When you buy something, it will appear here.</p>
                    <Button asChild size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full px-10 border-none">
                        <Link href="/products">Start Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-6 md:space-y-10">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-gray-900 rounded-4xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                            {/* Order Header */}
                            <div className="bg-gray-50/50 dark:bg-gray-800/50 px-6 md:px-8 py-5 md:py-6 border-b border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 transition-colors">Order ID</p>
                                        <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors">#{order.id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 transition-colors">Date Placed</p>
                                        <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors">
                                            <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 transition-colors">Total Amount</p>
                                        <p className="text-base md:text-lg font-black text-blue-600 dark:text-blue-400 tracking-tight transition-colors">₹{order.total.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto pt-4 lg:pt-0 border-t border-gray-100 dark:border-gray-800 lg:border-none">
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${order.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                        order.status === 'PENDING' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}>
                                        <Clock className="w-3 h-3" /> {order.status}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase text-gray-400 md:hidden">Details</span>
                                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all text-gray-400 dark:text-gray-600 h-9 w-9">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="px-6 md:px-8 py-5 md:py-6 space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0 group/item transition-colors gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shrink-0">
                                                <Image
                                                    src={item.product.image?.startsWith("http") ? item.product.image : "/placeholder.png"}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-sm md:text-base font-bold text-gray-900 dark:text-gray-100 group-hover/item:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                                    {item.product.name}
                                                </h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Qty: {item.quantity}</span>
                                                    <span className="text-xs text-gray-300 dark:text-gray-700">|</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">₹{item.price.toFixed(2)} / unit</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                                            <span className="text-xs text-gray-400 sm:hidden">Item Total</span>
                                            <p className="font-bold text-gray-900 dark:text-gray-100 transition-colors">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Footer/Actions */}
                            <div className="px-6 md:px-8 py-4 bg-gray-50/30 dark:bg-gray-800/10 flex flex-col sm:flex-row justify-between items-center transition-colors gap-4">
                                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-medium md:block hidden">
                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <Button variant="link" className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 group/btn border-none transition-colors p-0 text-xs md:text-sm">
                                    View Detailed Invoice <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
