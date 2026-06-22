import React from "react";
import { Star } from "lucide-react";

interface RestaurantCardProps {
  name: string;
  image: string;
  rating: number;
  location: string;
  tagline?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  name,
  image,
  rating,
  location,
  tagline,
}) => {
  return (
    <article className="market-listing-card overflow-hidden">
      <div className="market-card-media relative h-40 w-full">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-1 p-4">
        <h3 className="market-card-title text-base">{name}</h3>
        {tagline ? <p className="market-card-desc">{tagline}</p> : null}
        <div className="market-card-rating-row text-sm text-market-gold">
          <Star size={14} fill="currentColor" aria-hidden />
          <span className="market-card-rating-meta">
            {rating.toFixed(1)} · {location}
          </span>
        </div>
      </div>
    </article>
  );
};

export default RestaurantCard;
