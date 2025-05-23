import React from 'react';
import { ShoppingCart } from 'lucide-react';
import StarRating from '../../renderStars';

interface ShopProductCardProps {
  name: string;
  image: string;
  price: string;
  quantity?: string;
  rating: number;
  onAddToCart?: () => void;
}

const ShopProductCard: React.FC<ShopProductCardProps> = ({
  name,
  image,
  price,
  quantity,
  rating,
  onAddToCart,
}) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
      <div className="relative">
        <img src={image} alt={name} className="h-48 w-full object-contain" />
        <button
          onClick={onAddToCart}
          className="absolute bottom-2 right-2 bg-custom-orange p-2 rounded-full text-white hover:bg-orange-600"
        >
          <ShoppingCart size={18} />
        </button>
      </div>

      <div className="p-4 space-y-1">
        <div className="flex justify-between items-center text-sm font-medium text-gray-800">
          <span>{name}</span>
          {quantity && <span className="text-gray-500">{quantity}</span>}
        </div>
        <div className="text-yellow-500 w-[60px]">
          <StarRating rating={rating}/>
        </div>
        <div className="text-custom-orange font-bold text-sm">{price}</div>
      </div>
    </div>
  );
};

export default ShopProductCard;
