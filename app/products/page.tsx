"use client";

import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS, GetProductsData } from "@/app/graphql/queries/product";
import ProductCard from "@/components/ProductCard";
import { client } from "@/app/lib/apollo";

export default function ProductsPage() {
    const { data, loading, error } = useQuery<GetProductsData>(GET_PRODUCTS, { client });

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 text-blue-600 font-medium">
                Loading products...
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 text-red-500 font-medium">
                Error: {error.message}
            </div>
        );

    const products = data?.products || [];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Page Title */}
                <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-10">
                    Our Products
                </h1>

                {/* Empty State */}
                {products.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">
                        No products available at the moment.
                    </p>
                ) : (
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
