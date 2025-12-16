"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/app/lib/apollo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <div className="flex justify-center mt-10">
            <Card className="w-[400px] border border-gray-200 shadow-lg">
                <CardHeader>
                    <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Product name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={form.image}
                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                            className="w-full border p-2 rounded"
                        />

                        {catLoading ? (
                            <p>Loading categories...</p>
                        ) : (
                            <select
                                value={form.categoryId}
                                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                className="w-full border p-2 rounded"
                            >
                                <option value="">Select category</option>
                                {catData?.categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white"
                        >
                            {loading ? "Creating..." : "Add Product"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
