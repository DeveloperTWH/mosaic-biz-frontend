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

const ProductCard: React.FC<ProductCardProps> = ({
  serviceId,
  image,
  title,
  description,
  badge,
  logo,
}) => {
  const cardContent = (
    <div className="market-card flex h-[420px] flex-col overflow-hidden transition-all duration-300 hover:shadow-market-glow">
      <div className="relative h-[180px] w-full flex-shrink-0 bg-market-elevated">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-market-muted">
            No image
          </div>
        )}
        {logo && (
          <img
            src={logo}
            alt="Business Logo"
            className="absolute bottom-2 right-2 h-12 w-12 rounded-full border border-white/10 bg-market-surface object-contain p-1 shadow-md"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="product-title mb-2 line-clamp-1 text-base font-semibold text-market-text">
          {title || "Untitled listing"}
        </h3>

        <p
          className="product-description mb-3 overflow-hidden font-montserrat text-sm text-market-muted"
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

        <div className="mt-auto flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="view-details text-xs text-market-gold">View Details</span>
        </div>

        <div className="mt-3 flex min-h-[64px] items-center justify-between rounded bg-market-elevated px-4 py-2">
          <span className="text-sm font-semibold text-market-muted">Earned Badge:</span>
          {badge ? (
            <img
              src={`/badge/${badge.charAt(0).toUpperCase() + badge.slice(1)}.png`}
              alt={`${badge} badge`}
              className="h-14 object-contain"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src.endsWith("/badge.png")) return;
                img.src = "/badge.png";
              }}
            />
          ) : (
            <div className="h-14 w-[90px]" />
          )}
        </div>
      </div>
    </div>
  );

  if (serviceId) {
    return (
      <Link href={`/vendor-profile/service-vendor/${serviceId}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default ProductCard;
