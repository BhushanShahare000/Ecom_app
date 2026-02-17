"use client";

import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES, GetCategoriesData } from "@/app/graphql/queries/category";
import { client } from "@/app/lib/apollo";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tag, ChevronRight, Layers } from "lucide-react";

export default function CategoriesPage() {
    const { data, loading, error } = useQuery<GetCategoriesData>(GET_CATEGORIES, { client });

    if (loading) return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
            <div className="h-10 w-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-48 bg-gray-50 dark:bg-gray-900 rounded-4xl animate-pulse" />
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <h2 className="text-2xl font-bold text-red-600">Failed to load categories</h2>
            <p className="text-gray-500 mt-2">{error.message}</p>
        </div>
    );

    const categories = data?.categories || [];

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 lg:py-28">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-2.5 rounded-2xl shrink-0 shadow-lg shadow-indigo-200 dark:shadow-none">
                        <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-gray-100">Browse <span className="text-indigo-600 dark:text-indigo-400">Categories</span></h1>
                        <p className="text-sm md:text-base text-gray-500 font-medium mt-2 max-w-lg">Explore our curated collections across all departments</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat) => (
                    <Link key={cat.id} href={`/categories/${cat.id}`}>
                        <Card className="group relative overflow-hidden border-none bg-white dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-900 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-4xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50">
                            <CardContent className="p-8 md:p-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                            <Tag className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">{cat.name}</h3>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Explore Collection</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-300 dark:text-gray-700 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all duration-500">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </CardContent>
                            <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-600 group-hover:w-full transition-all duration-700" />
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
