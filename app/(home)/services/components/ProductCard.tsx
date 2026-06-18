import React from "react";
import Link from "next/link";
import MarketImage from "../../Components/MarketImage";
import TrustBadge from "../../Components/TrustBadge";

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
    <div className="market-card flex h-[420px] min-h-[420px] flex-col overflow-hidden">
      <div className="relative flex-shrink-0">
        <MarketImage src={image} alt={title} aspect="video" objectFit="cover" />
        {logo && (
          <img
            src={logo}
            alt="Business Logo"
            className="absolute bottom-2 right-2 h-12 w-12 rounded-full border border-white/15 bg-market-surface object-contain p-1 shadow-market-card"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="market-card-title mb-2 line-clamp-1">{title || "Untitled listing"}</h3>

        <p
          className="market-card-desc mb-3 overflow-hidden"
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
          <div className="h-px flex-1 bg-white/15" />
          <span className="font-montserrat text-xs font-medium text-market-gold">View Details</span>
        </div>

        <div className="market-card-footer mt-3 flex min-h-[64px] flex-col items-center justify-center gap-1">
          <span className="text-sm font-semibold text-market-muted">Earned Badge:</span>
          {badge ? <TrustBadge tier={badge} size="lg" linkToExplainer /> : <div className="h-14 w-[90px]" />}
        </div>
      </div>
    </div>
  );

  if (serviceId) {
    return (
      <Link href={`/vendor-profile/service-vendor/${serviceId}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-market-bg rounded-2xl">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default ProductCard;
