"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { client } from "@/app/lib/apollo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
}

interface GetProductsData {
    products: Product[];
}

const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
      image
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export default function AdminProductsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
            router.push("/");
        }
    }, [status, session, router]);

    const { data, loading, error, refetch } = useQuery<GetProductsData>(GET_PRODUCTS, { client });
    const [deleteProduct] = useMutation<{ deleteProduct: boolean }>(DELETE_PRODUCT, { client });

    if (status === "loading" || (status === "authenticated" && (session?.user as any)?.role !== "ADMIN")) {
        return <div className="min-h-screen flex items-center justify-center">Verifying Authorisation...</div>;
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

        try {
            const { data } = await deleteProduct({ variables: { id } });
            if (data?.deleteProduct) {
                alert("Product deleted successfully");
                refetch();
            }
        } catch (err: any) {
            // Display the specific error message from the backend
            alert(err.message || "An unexpected error occurred while deleting the product.");
        }
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-8">
            <div className="h-12 w-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="aspect-4/5 bg-gray-50 dark:bg-gray-900 rounded-4xl animate-pulse" />
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <div className="inline-flex p-6 rounded-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 mb-6">
                <Trash2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Inventory Sync Failed</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">{error.message}</p>
            <Button onClick={() => refetch()} className="bg-blue-600 rounded-full px-10">Try Again</Button>
        </div>
    );

    const products = data?.products || [];

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 md:mb-16 gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-2.5 rounded-2xl shrink-0 shadow-lg shadow-indigo-200 dark:shadow-none">
                        <Trash2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100">Product <span className="text-indigo-600 dark:text-indigo-400">Inventory</span></h1>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Manage and audit your global product catalog</p>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 transition-colors w-full md:w-auto text-center md:text-left">
                    System SKU Count: <span className="text-indigo-600 dark:text-indigo-400 ml-1">{products.length}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {products.map((p) => (
                    <Card key={p.id} className="group relative overflow-hidden border-none bg-white dark:bg-gray-900 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-4xl">
                        <div className="relative aspect-4/5 overflow-hidden bg-gray-50 dark:bg-gray-800">
                            <img
                                src={p.image?.startsWith("http") ? p.image : "/placeholder.png"}
                                alt={p.name}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                <p className="text-[10px] text-white font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">ID: #{p.id.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>
                        <CardContent className="p-6 md:p-8 space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{p.name}</h3>
                                <p className="text-indigo-600 dark:text-indigo-400 font-black text-2xl tracking-tight">₹{p.price.toFixed(2)}</p>
                            </div>

                            <Button
                                onClick={() => handleDelete(p.id)}
                                variant="destructive"
                                size="lg"
                                className="w-full mt-2 flex items-center justify-center gap-2 rounded-2xl font-bold py-7 shadow-xl shadow-red-100 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all bg-red-600 border-none group-hover:bg-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                                Remove Product
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
