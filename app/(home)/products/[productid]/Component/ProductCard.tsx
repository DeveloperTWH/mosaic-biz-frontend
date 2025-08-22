import { useState } from "react";
import { Product } from "./types/product";
import { Heart, HeartIcon } from "lucide-react"; // Lucide icons

export default function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setWishlisted] = useState(false);

  return (
    <div className="relative p-4 transition border rounded shadow-sm hover:shadow-md">
      {/* Wishlist Icon */}
      {/* <button
        onClick={() => setWishlisted(!isWishlisted)}
        className="absolute top-3 right-3"
      >
        {isWishlisted ? (
          <Heart className="text-red-500 transition-all duration-300 fill-red-500" />
        ) : (
          <HeartIcon className="text-gray-400 transition-all duration-300 hover:text-red-400" />
        )}
      </button> */}

      <img
        src={product.image}
        alt={product.title}
        className="object-contain w-full h-48 rounded"
      />
      <h3 className="mt-2 font-semibold text-md">{product.title}</h3>
      <p className="mt-1 text-sm text-gray-700">${product.price}</p>
      <div className="mt-1 text-sm text-yellow-600">
        ⭐ {product.rating} ({product.ratingCount})
      </div>
      <p className="mt-1 text-xs text-gray-500">{product.brand}</p>
    </div>
  );
}
