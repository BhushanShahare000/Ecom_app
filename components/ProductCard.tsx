import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { client } from "@/app/lib/apollo";
import { useCart } from "@/app/context/Cartcontext";
import { Product } from "@/app/graphql/queries/product";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [addToCart] = useMutation(ADD_TO_CART, { client });
  const { count, setCount, refetch } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || isAdded) return;

    // Optimistic Update: Change count immediately
    setCount(count + 1);
    setIsAdded(true);
    setLoading(true);

    try {
      await addToCart({ variables: { productId: product.id, quantity: 1 } });
      refetch();

      // Keep "Added" state for 2 seconds for visual feedback
      setTimeout(() => setIsAdded(false), 2000);
    } catch (err: any) {
      // Revert count on error
      setCount(Math.max(0, count - 1));
      setIsAdded(false);
      alert("Failed to add: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="group relative w-full overflow-hidden rounded-2xl border-none bg-white dark:bg-gray-900 shadow-sm hover:shadow-2xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
        <Image
          src={
            product.image?.startsWith("http") || product.image?.startsWith("data:")
              ? product.image
              : product.image?.startsWith("/9j/") // Common JPEG base64 start
                ? `data:image/jpeg;base64,${product.image}`
                : "/placeholder.png"
          }
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 ease-out ${isHovered ? "scale-110" : "scale-100"}`}
        />

        {/* Overlay Actions */}
        <div className={`absolute inset-0 bg-black/5 dark:bg-black/20 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`} />

        <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 transform ${isHovered ? "translate-x-0" : "translate-x-12"}`}>
          <button className="p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full text-gray-700 dark:text-gray-200 hover:bg-blue-600 hover:text-white transition-all shadow-lg border border-transparent dark:border-gray-700">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full text-gray-700 dark:text-gray-200 hover:bg-blue-600 hover:text-white transition-all shadow-lg border border-transparent dark:border-gray-700">
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Button (Bottom of Image) */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 transform ${isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
          <Button
            onClick={handleAddToCart}
            disabled={loading || isAdded}
            className={`w-full rounded-xl py-6 font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-xl ${isAdded
              ? "bg-green-500 hover:bg-green-600 text-white shadow-green-100 dark:shadow-none"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-blue-200 dark:shadow-none"
              }`}
          >
            {isAdded ? (
              <>
                <div className="flex items-center gap-2 animate-in zoom-in duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Added!</span>
                </div>
              </>
            ) : loading ? (
              "Adding..."
            ) : (
              "Quick Add"
            )}
          </Button>
        </div>
      </div>

      <CardContent className="p-5 space-y-3">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Premium</p>
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed h-10">
          {product.description || "Sophisticated design meets unparalleled functionality in this premium product."}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium line-through">₹{(product.price * 1.2).toFixed(0)}</span>
            <span className="text-blue-600 dark:text-blue-400 font-extrabold text-2xl tracking-tighter">
              ₹{product.price}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className={`w-3 h-3 ${star <= 4 ? "text-yellow-400" : "text-gray-200 dark:text-gray-700"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">(4.8)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
