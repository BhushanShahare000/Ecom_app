"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/app/lib/apollo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowRight } from "lucide-react";

const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $description: String!
    $price: Float!
    $image: String!
    $categoryId: ID!
  ) {
    createProduct(
      name: $name
      description: $description
      price: $price
      image: $image
      categoryId: $categoryId
    ) {
      id
      name
      price
      image
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

const GET_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`;

interface Category {
    id: string;
    name: string;
}

interface GetCategoriesData {
    categories: Category[];
}

export default function AddProductPage() {
    const router = useRouter();
    const { data: catData, loading: catLoading } = useQuery<GetCategoriesData>(GET_CATEGORIES, { client });
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        categoryId: "",
    });

    const [createProduct, { loading }] = useMutation(CREATE_PRODUCT, {
        client,
        onCompleted: () => {
            alert("Product created successfully!");
            router.push("/products");
        },
        onError: (err) => alert(err.message),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createProduct({
            variables: {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                image: form.image,
                categoryId: form.categoryId,
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 transition-colors">
            <div className="flex items-center gap-4 mb-10 text-gray-900 dark:text-gray-100 transition-colors">
                <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none">
                    <Plus className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">Add New <span className="text-blue-600 dark:text-blue-400">Product</span></h1>
            </div>

            <Card className="border-none bg-white dark:bg-gray-900 shadow-2xl shadow-blue-900/5 dark:shadow-none rounded-3xl overflow-hidden border dark:border-gray-800 transition-all">
                <CardHeader className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Product Particulars</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure the details of your new premium offering.</p>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Minimalist Timepiece"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 dark:text-gray-100 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Category</label>
                                    <button
                                        type="button"
                                        onClick={() => router.push("/admin/add-category")}
                                        className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add New
                                    </button>
                                </div>
                                {catLoading ? (
                                    <div className="w-full h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
                                ) : (
                                    <select
                                        required
                                        value={form.categoryId}
                                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 dark:text-gray-100 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select a category</option>
                                        {catData?.categories.map((cat: any) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Description</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Describe the craftsmanship and features..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 dark:text-gray-100 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    placeholder="0.00"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 dark:text-gray-100 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Image URL</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="https://images.unsplash.com/..."
                                    value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 dark:text-gray-100 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-8 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 dark:shadow-none transition-all hover:scale-[1.01] active:scale-[0.99] border-none"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">Creating Product...</span>
                                ) : (
                                    <span className="flex items-center gap-2">Initialize Product <ArrowRight className="w-5 h-5" /></span>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
