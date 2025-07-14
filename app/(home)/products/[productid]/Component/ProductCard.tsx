import { useState } from "react";
import { Product } from "./types/product";
import { Heart, HeartIcon } from "lucide-react"; // Lucide icons

export default function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setWishlisted] = useState(false);

  return (
    <div className="border rounded p-4 shadow-sm hover:shadow-md transition relative">
      {/* Wishlist Icon */}
      <button
        onClick={() => setWishlisted(!isWishlisted)}
        className="absolute top-3 right-3"
      >
        {isWishlisted ? (
          <Heart className="text-red-500 fill-red-500 transition-all duration-300" />
        ) : (
          <HeartIcon className="text-gray-400 hover:text-red-400 transition-all duration-300" />
        )}
      </button>

      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="text-md font-semibold mt-2">{product.title}</h3>
      <p className="text-sm text-gray-700 mt-1">₹{product.price}</p>
      <div className="text-sm text-yellow-600 mt-1">
        ⭐ {product.rating} ({product.ratingCount})
      </div>
      <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
    </div>
  );
}
