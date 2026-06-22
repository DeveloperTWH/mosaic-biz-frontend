import React from "react";
import { ShoppingCart } from "lucide-react";
import StarRating from "../../renderStars";

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
    <article className="market-listing-card overflow-hidden">
      <div className="market-card-media relative">
        <img src={image} alt={name} className="h-48 w-full object-contain p-2" />
        <button
          type="button"
          onClick={onAddToCart}
          className="absolute bottom-2 right-2 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-brand-gold text-brand-navy shadow-market-card hover:bg-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          aria-label={`Add ${name} to cart`}
        >
          <ShoppingCart size={18} aria-hidden />
        </button>
      </div>

      <div className="space-y-1 p-4">
        <div className="flex items-center justify-between gap-2 text-sm font-medium">
          <span className="market-card-title line-clamp-1">{name}</span>
          {quantity ? <span className="market-card-desc shrink-0">{quantity}</span> : null}
        </div>
        <div className="w-[60px] text-market-gold">
          <StarRating rating={rating} />
        </div>
        <div className="market-card-price text-sm">{price}</div>
      </div>
    </article>
  );
};

export default ShopProductCard;
