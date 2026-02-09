import React from "react";

type ProductCardProps = {
  image: string;
  title: string;
  description: string;
  rating: number;
  totalRatings: number;
  reviews: number;
  badge?: string;
  price?: number;
};

const HorizontalLine = () => {
  return <p style={{ borderTop: '1px solid', color : "#D9D9D9",  margin: '10px 0' }}></p> ;
};

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  rating,
  totalRatings,
  reviews,
  badge,
  price,
}) => {
  return (
    <div className="product-card h-[380px]">
      {image && <img src={image} alt={title} className="product-image h-[180px] w-full" />}

      <div className="product-content p-4">
        {/* Badge */}
        {badge && (
          <div className="mb-2">
            <span className="px-2 py-1 text-xs font-semibold text-white bg-yellow-600 rounded uppercase">
              {badge}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="product-title text-base font-bold mb-2">{title}</h3>

        {/* Description */}
        <p
          className="product-description text-sm text-[#5F5F5F] overflow-hidden font-montserrat mb-3"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
          }}
          title={description}
        >
        {description}</p>

        {/* Price */}
        {price !== undefined && (
          <div className="mt-auto mb-3">
            <span className="text-lg font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-center mt-2">
            <div className="w-[65%] mr-5">
            <HorizontalLine/>
            </div>
            <a href="#" className="view-details text-[#C7A040] text-xs text-montserrat">
            View Details
            </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
