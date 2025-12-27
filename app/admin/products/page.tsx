"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { client } from "@/app/lib/apollo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";


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
    const { data, loading, error, refetch } = useQuery<GetProductsData>(GET_PRODUCTS, { client });
    const [deleteProduct] = useMutation(DELETE_PRODUCT, { client });

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await deleteProduct({ variables: { id } });
            alert("Product deleted successfully");
            refetch();
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return <p className="text-center mt-10">Loading products...</p>;
    if (error) return <p className="text-center text-red-500">{error.message}</p>;

    return (
        <div className="max-w-5xl mx-auto mt-10 p-4">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                🧑‍💻 Admin Products
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data?.products?.map((p) => (
                    <Card key={p.id} className="shadow hover:shadow-lg transition">
                        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                            <img
                                src={p.image}
                                alt={p.name}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <CardContent className="p-4 flex flex-col gap-2">
                            <h3 className="font-semibold text-gray-800">{p.name}</h3>
                            <p className="text-blue-600 font-medium">₹{p.price}</p>

                            <Button
                                onClick={() => handleDelete(p.id)}
                                variant="destructive"
                                size="sm"
                                className="mt-2 flex items-center gap-1"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
