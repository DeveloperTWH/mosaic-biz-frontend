import React from "react";

type ProductCardProps = {
  image?: string;
  title: string;
  description?: string;
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
    <div className="product-card h-[380px] flex flex-col overflow-hidden border-2 border-[#D9D9D9] shadow-lg">
      {image ? (
        <img src={image} alt={title} className="product-image h-[180px] w-full object-cover flex-shrink-0" />
      ) : (
        <div className="h-[180px] w-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-gray-500 tracking-wide">
          NO IMAGE
        </div>
      )}

      <div className="product-content p-4 flex flex-col flex-1">
        {/* Badge */}
        <div className="mb-2 h-6">
          {badge && (
            <span className="px-2 py-1 text-xs font-semibold text-white bg-yellow-600 rounded uppercase">
              {badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="product-title text-base font-bold mb-2 line-clamp-1 h-6">{title}</h3>

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
        {description || "\u00a0"}</p>

        {/* Price */}
        <div className="mb-3 h-7">
          {price !== undefined && (
            <span className="text-lg font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex justify-center mt-auto">
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
