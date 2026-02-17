"use client";

import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS, GetProductsData } from "@/app/graphql/queries/product";
import { client } from "@/app/lib/apollo";
import ProductCard from "@/components/ProductCard";
import { Sparkles, Zap, Timer } from "lucide-react";

export default function DealsPage() {
    const { data, loading, error } = useQuery<GetProductsData>(GET_PRODUCTS, { client });

    if (loading) return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
            <div className="h-10 w-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-4/5 bg-gray-50 dark:bg-gray-900 rounded-4xl animate-pulse" />
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <h2 className="text-2xl font-bold text-red-600">Trouble loading deals</h2>
            <p className="text-gray-500 mt-2">{error.message}</p>
        </div>
    );

    // Simplified logic: treat all products as "deals" for now, maybe filter by some logic later
    const deals = data?.products.slice(0, 8) || [];

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 lg:py-28">
            <div className="relative mb-20 p-10 md:p-20 rounded-5xl overflow-hidden bg-indigo-600 text-white shadow-2xl shadow-indigo-200 dark:shadow-none">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Sparkles className="w-64 h-64" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-6">
                        <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" /> Flash Sale Active
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">Exclusive <span className="text-indigo-200">Deals</span> of the Season</h1>
                    <p className="text-lg md:text-xl text-indigo-100 font-medium leading-relaxed mb-10">Premium craftsmanship meet exceptional value. Discover handpicked offers on our most celebrated collections.</p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Timer className="w-5 h-5 text-indigo-200" />
                            <p className="text-sm font-bold text-indigo-200">Ending in 14h 22m</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100">Featured <span className="text-indigo-600">Offers</span></h2>
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Selected curation</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {deals.map((p) => (
                    <ProductCard key={p.id} product={{ ...p, price: p.price * 0.8 }} /> // visual discount simulation for demo
                ))}
            </div>
        </div>
    );
}
