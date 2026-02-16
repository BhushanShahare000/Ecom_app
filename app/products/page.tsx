"use client";

import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS, GetProductsData } from "@/app/graphql/queries/product";
import ProductCard from "@/components/ProductCard";
import { client } from "@/app/lib/apollo";
import { Search, SlidersHorizontal, PackageSearch } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
    const { data, loading, error } = useQuery<GetProductsData>(GET_PRODUCTS, { client });

    if (loading)
        return (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-12 transition-colors">
                <div className="h-12 w-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-800" />
                    ))}
                </div>
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-6 transition-colors">
                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-full mb-6">
                    <PackageSearch className="w-12 h-12 text-red-500 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">{error.message}</p>
                <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all">
                    Try Again
                </button>
            </div>
        );

    const products = data?.products || [];

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12 space-y-8 md:space-y-12 transition-colors">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12">
                <div className="space-y-4 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors mx-auto lg:mx-0">
                        Catalog
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight transition-colors">
                        Exquisite <span className="text-blue-600 dark:text-blue-400">Collection</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto lg:mx-0 transition-colors text-sm md:text-base leading-relaxed">
                        Explore our wide range of premium products selected specifically for discerning enthusiasts.
                    </p>
                </div>


            </div>

            {/* Product Count & Sort Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-b border-gray-100 dark:border-gray-800 text-sm gap-4 text-center sm:text-left">
                <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors">Showing <span className="text-gray-900 dark:text-gray-100 font-bold">{products.length}</span> distinctive products</p>
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 transition-colors">
                    Sort by: <span className="text-gray-900 dark:text-gray-100 font-bold cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b border-dotted border-gray-300 dark:border-gray-600">Popularity</span>
                </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-32 text-center">
                    <PackageSearch className="w-16 h-16 text-gray-200 dark:text-gray-800 mb-6" />
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-medium transition-colors">
                        No products discovered in this category yet.
                    </p>
                </div>
            ) : (
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
