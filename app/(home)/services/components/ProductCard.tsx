import React from "react";

type ProductCardProps = {
  image: string;
  title: string;
  description: string;
  rating: number; // 0–5
  totalRatings: number;
  reviews: number;
  badge?: string;
};




const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  rating,
  totalRatings,
  reviews,
  badge,
}) => {
  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />

      <div className="product-content">
        {/* Ratings */}
        <div className="rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < rating ? "star filled" : "star"}>
              ★
            </span>
          ))}
          <span className="rating-text">
            {totalRatings} Ratings And {reviews} Reviews
          </span>
        </div>

        {/* Title */}
        <h3 className="product-title">{title}</h3>

        {/* Description */}
        <p className="product-description">{description}</p>

        {/* View Details */}
        <a href="#" className="view-details">
          View Details
        </a>
      </div>

      {/* Badge */}
      {badge && (
        <div className="badge">
          <img src={badge} alt="Badge" />
          <span>Earned Badge:</span>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
