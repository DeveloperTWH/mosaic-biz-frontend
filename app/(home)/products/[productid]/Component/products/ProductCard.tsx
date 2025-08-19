import { Heart, Star } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  brand: string;
  title: string;
  price: number;
  image: string;
  rating: number;
  ratingCount: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="relative bg-white border max-w-[250px] border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-lg transition-shadow duration-300">
      {/* Image & Wishlist Container */}
      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          priority={false}
        />
        <button className="absolute p-1 transition-colors bg-white rounded-full top-3 right-3 bg-opacity-70 hover:bg-red-100">
          <Heart size={18} className="stroke-[2.2] text-gray-400 hover:text-red-500" />
        </button>
      </div>

      {/* Product Info */}
      <div className="px-1 mt-3">
        <h4 className="text-sm font-semibold text-gray-900 uppercase truncate">
          {product.brand}
        </h4>
        <p className="mt-1 text-xs leading-snug text-gray-600 line-clamp-2">
          {product.title}
        </p>
        <p className="mt-2 text-base font-bold text-black">${product.price}</p>

        {/* Rating */}
        <div className="flex items-center mt-1 space-x-1 text-xs text-yellow-500">
          <Star size={14} fill="currentColor" className="text-yellow-500" />
          <span className="font-semibold text-yellow-600">{product.rating.toFixed(1)}</span>
          <span className="text-gray-400">({product.ratingCount})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
