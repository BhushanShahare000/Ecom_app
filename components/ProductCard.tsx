import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { client } from "@/app/lib/apollo";
import { useCart } from "@/app/context/Cartcontext";


const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity) {
      id
      quantity
      product {
        id
        name
      }
    }
  }
`;

import { Product } from "@/app/graphql/queries/product";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [addToCart] = useMutation(ADD_TO_CART, { client });
  const { count, setCount, refetch } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart({ variables: { productId: product.id, quantity: 1 } });
      setCount(count + 1);
      refetch();
      alert(`${product.name} added to cart!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Card className="group w-full max-w-xs border-0 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
      <div className="relative w-full h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        <Image
          src={
            product.image?.startsWith("http")
              ? product.image
              : "/placeholder.png"
          }
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <CardContent className="p-4 space-y-2.5">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {product.description || "No description available."}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-blue-600 font-bold text-xl">
            ₹{product.price}
          </span>

          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
