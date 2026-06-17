import React from "react";
import Link from "next/link";

type ProductCardProps = {
  serviceId?: string;
  image: string;
  title: string;
  description: string;
  rating: number;
  totalRatings: number;
  reviews: number;
  badge?: string;
  price?: number;
  logo?: string;
};

const HorizontalLine = () => {
  return <p style={{ borderTop: '1px solid', color : "#D9D9D9",  margin: '10px 0' }}></p> ;
};

const ProductCard: React.FC<ProductCardProps> = ({
  serviceId,
  image,
  title,
  description,
  rating,
  totalRatings,
  reviews,
  badge,
  price,
  logo,
}) => {
  const cardContent = (
    <div className="product-card h-[420px] flex flex-col overflow-hidden border-2 border-[#D9D9D9] shadow-lg">
      <div className="relative h-[180px] w-full flex-shrink-0">
        {image ? (
          <img src={image} alt={title} className="product-image h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}
        {logo && (
          <img src={logo} alt="Business Logo" className="absolute bottom-2 right-2 h-12 w-12 object-contain bg-white rounded-full p-1 shadow-md" />
        )}
      </div>

      <div className="product-content p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="product-title text-base font-bold mb-2 line-clamp-1 h-6">{title || "Untitled listing"}</h3>

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
          {description || "\u00a0"}
        </p>



        <div className="flex justify-center mt-auto">
          <div className="w-[65%] mr-5">
            <HorizontalLine />
          </div>
          <span className="view-details text-[#C7A040] text-xs text-montserrat">
            View Details
          </span>
        </div>

        {/* Grey background full width, fixed height to keep space even if no badge */}
        <div className="mt-3 bg-gray-100 rounded px-4 py-2 flex justify-between items-center min-h-[64px]">
          {/* Label always visible on left */}
          <span className="text-gray-600 text-sm font-semibold">Earned Badge:</span>

          {/* Badge image or empty placeholder on right */}
          {badge ? (
            <img
              src={`/badge/${badge.charAt(0).toUpperCase() + badge.slice(1).toLowerCase()}.png`}
              alt={`${badge} badge`}
              className="h-16 object-contain"
            />
          ) : (
            // empty placeholder keeps spacing
            <div className="h-16 w-[96px]" />
          )}
        </div>
      </div>
    </div>
  );

  if (serviceId) {
    return (
      <Link
        href={`/vendor-profile/service-vendor/${serviceId}`}
        className="block cursor-pointer transition-transform hover:-translate-y-0.5"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default ProductCard;
