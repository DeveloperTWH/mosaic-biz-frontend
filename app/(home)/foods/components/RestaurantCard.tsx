// components/RestaurantCard.tsx

import React from 'react';
import { Star } from 'lucide-react';

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
    <div className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
      <img
        src={image}
        alt={name}
        className="h-40 w-full object-cover"
      />
      <div className="p-4 space-y-1">
        <h3 className="text-lg font-semibold">{name}</h3>
        {tagline && <p className="text-sm text-gray-500">{tagline}</p>}
        <div className="flex items-center gap-1 text-sm text-yellow-600">
          <Star size={14} fill="currentColor" />
          {rating.toFixed(1)} <span className="text-gray-400">•</span> {location}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
