"use client";

import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS, GetProductsData } from "@/app/graphql/queries/product";
import ProductCard from "@/components/ProductCard";
import { client } from "@/app/lib/apollo";

export default function ProductsPage() {
    const { data, loading, error } = useQuery<GetProductsData>(GET_PRODUCTS, { client });

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const products = data?.products || [];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Products</h1>
            {products.length === 0 ? (
                <p className="text-gray-500">No products available.</p>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
