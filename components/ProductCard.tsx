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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
    <Card className="w-full max-w-sm border rounded-lg shadow hover:shadow-lg transition bg-white">
      <div className="relative w-full h-56 rounded-t-lg overflow-hidden">
        <Image
          src={
            product.image?.startsWith("http")
              ? product.image
              : "/placeholder.png"
          }
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>

      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm line-clamp-2">
          {product.description || "No description available."}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-blue-600 font-semibold text-lg">
            ₹{product.price}
          </span>

          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
