"use client";

import { useQuery } from "@apollo/client/react";
import { GET_CATEGORY_WITH_PRODUCTS, GetCategoryData } from "@/app/graphql/queries/category";
import { client } from "@/app/lib/apollo";
import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";
import { Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CategoryDetailsPage() {
    const { categoryId } = useParams();
    const { data, loading, error } = useQuery<GetCategoryData>(GET_CATEGORY_WITH_PRODUCTS, {
        client,
        variables: { id: categoryId },
        skip: !categoryId,
    });

    if (loading) return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
            <div className="h-10 w-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-4/5 bg-gray-50 dark:bg-gray-900 rounded-4xl animate-pulse" />
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <h2 className="text-2xl font-bold text-red-600">Failed to load category products</h2>
            <p className="text-gray-500 mt-2">{error.message}</p>
        </div>
    );

    const category = data?.category;
    const products = category?.products || [];

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
            <Link href="/categories" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all mb-10">
                <ArrowLeft className="w-4 h-4" /> Back to Categories
            </Link>

            <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-2.5 rounded-2xl shrink-0">
                        <Tag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-gray-100">{category?.name}</h1>
                        <p className="text-sm text-gray-500 font-medium mt-1 uppercase tracking-widest">{products.length} Items Available</p>
                    </div>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-32 bg-gray-50 dark:bg-gray-900 rounded-4xl border border-dashed border-gray-200 dark:border-gray-800">
                    <Tag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">No products found</h3>
                    <p className="text-gray-500 mt-2">Check back later for new arrivals in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
}
