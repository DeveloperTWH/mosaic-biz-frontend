import { Star } from "lucide-react";

type CardRatingRowProps = {
  rating: number;
  reviewCount?: number;
};

export default function CardRatingRow({ rating, reviewCount = 0 }: CardRatingRowProps) {
  if (rating <= 0 && reviewCount <= 0) return null;

  const fullStars = Math.floor(rating);
  const fractional = rating % 1;
  const hasHalfStar = fractional >= 0.25 && fractional < 0.75;
  const label =
    rating > 0 && reviewCount > 0
      ? `${rating.toFixed(1)} · ${reviewCount} review${reviewCount === 1 ? "" : "s"}`
      : rating > 0
        ? rating.toFixed(1)
        : `${reviewCount} review${reviewCount === 1 ? "" : "s"}`;

  return (
    <div className="market-card-rating-row" aria-label={label}>
      <div className="flex shrink-0">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={13}
            fill={i < fullStars ? "#E2B84B" : i === fullStars && hasHalfStar ? "#E2B84B" : "transparent"}
            stroke={i < fullStars || (i === fullStars && hasHalfStar) ? "#E2B84B" : "#A9A2D8"}
            className={i < fullStars || (i === fullStars && hasHalfStar) ? "text-market-gold" : "text-market-muted/40"}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="market-card-rating-meta">{label}</span>
    </div>
  );
}
