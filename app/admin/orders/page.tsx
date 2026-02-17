"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { client } from "@/app/lib/apollo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Package, Calendar, User, Clock, ShoppingBag } from "lucide-react";
import { Order } from "@/app/graphql/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ALL_ORDERS = gql`
  query {
    allOrders {
      id
      total
      status
      createdAt
      user {
        name
        email
      }
      items {
        id
        quantity
        price
        product {
          name
        }
      }
    }
  }
`;

const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`;

export default function AdminOrdersPage() {
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (sessionStatus === "unauthenticated") {
            router.push("/login");
        } else if (sessionStatus === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
            router.push("/");
        }
    }, [sessionStatus, session, router]);

    const { data, loading, error, refetch } = useQuery<{ allOrders: Order[] }>(ALL_ORDERS, { client });
    const [deleteOrder] = useMutation<{ deleteOrder: boolean }>(DELETE_ORDER, { client });

    if (sessionStatus === "loading" || (sessionStatus === "authenticated" && (session?.user as any)?.role !== "ADMIN")) {
        return <div className="min-h-screen flex items-center justify-center">Verifying Authorisation...</div>;
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this order? This will remove all associated records.")) return;

        try {
            const { data } = await deleteOrder({ variables: { id } });
            if (data?.deleteOrder) {
                alert("Order deleted successfully");
                refetch();
            }
        } catch (err: any) {
            alert(err.message || "Failed to delete order");
        }
    };

    if (loading) return (
        <div className="max-w-6xl mx-auto mt-10 p-6 space-y-6">
            <div className="h-10 w-48 bg-gray-100 rounded-xl animate-pulse" />
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-50 rounded-2xl animate-pulse" />)}
        </div>
    );

    if (error) return (
        <div className="max-w-6xl mx-auto mt-20 text-center p-12 bg-red-50 rounded-3xl">
            <Package className="w-16 h-16 text-red-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
            <p className="text-gray-500 mb-6">{error.message}</p>
            <Button onClick={() => refetch()} variant="outline" className="rounded-full">Try Again</Button>
        </div>
    );

    const orders = data?.allOrders || [];

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 text-gray-900 dark:text-gray-100 transition-colors gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-2 rounded-xl shrink-0">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Manage <span className="text-indigo-600 dark:text-indigo-400">Orders</span></h1>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">Global order management oversight</p>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 transition-colors w-full md:w-auto text-center md:text-left">
                    Total System Orders: <span className="text-indigo-600 dark:text-indigo-400 ml-1 transition-colors">{orders.length}</span>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-20 md:py-32 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 transition-all px-6">
                    <ShoppingBag className="w-16 md:w-20 h-16 md:h-20 text-gray-200 dark:text-gray-800 mb-6 transition-colors" />
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors">No orders in system</h3>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 transition-colors">As soon as customers place orders, they will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:gap-8">
                    {orders.map((order) => (
                        <Card key={order.id} className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 border dark:border-gray-800 group rounded-4xl">
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Order Brief */}
                                    <div className="lg:w-1/3 bg-gray-50/50 dark:bg-gray-800/50 p-6 md:p-8 lg:border-r border-b lg:border-b-0 border-gray-100 dark:border-gray-800 space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 transition-colors">Order Identifier</p>
                                                <h3 className="font-mono text-xs md:text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors">#{order.id.slice(-12).toUpperCase()}</h3>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${order.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                                order.status === 'PENDING' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                }`}>
                                                <Clock className="w-3 h-3" /> {order.status}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 pt-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors shrink-0">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none transition-colors truncate">{order.user.name}</p>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 transition-colors truncate">{order.user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors shrink-0">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs font-bold text-gray-600 dark:text-gray-400 transition-colors">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Content */}
                                    <div className="grow p-6 md:p-8 flex flex-col justify-between">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-900 w-6 h-6 rounded-lg flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 transition-colors shrink-0">{item.quantity}</span>
                                                        <span className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200 transition-colors truncate">{item.product.name}</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 transition-colors shrink-0 ml-4">₹{item.price}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between transition-colors gap-6">
                                            <div className="text-center sm:text-left">
                                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 transition-colors">Settlement Amount</p>
                                                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight transition-colors">₹{order.total.toFixed(2)}</p>
                                            </div>
                                            <Button
                                                onClick={() => handleDelete(order.id)}
                                                variant="destructive"
                                                size="lg"
                                                className="w-full sm:w-auto rounded-2xl shadow-xl shadow-red-200 dark:shadow-none hover:scale-105 transition-all text-xs font-bold px-8 py-6"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" /> Delete Record
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
