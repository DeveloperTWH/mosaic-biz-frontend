import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, max = 5, className = '' }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={`full-${i}`} className={`w-4 h-4 text-yellow-500 ${className}`} fill="currentColor" />
    );
  }

  if (hasHalf) {
    stars.push(
      <StarHalf key="half" className={`w-4 h-4 text-yellow-500 ${className}`} fill="currentColor" />
    );
  }

  const remaining = max - stars.length;

  for (let i = 0; i < remaining; i++) {
    stars.push(
      <Star key={`empty-${i}`} className={`w-4 h-4 text-gray-300 ${className}`} />
    );
  }

  return <div className="flex gap-0.5">{stars}</div>;
};

export default StarRating;
