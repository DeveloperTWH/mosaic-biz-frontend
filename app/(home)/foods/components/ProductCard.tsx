import React from "react";
import Link from "next/link";

type FoodCardProps = {
  foodId?: string;
  image?: string;
  businessName: string;
  businessDescription?: string;
  badge?: string;
  logo?: string;
};

const getBadgeUrl = (badge?: string) => {
  if (!badge) return "";
  const normalized = badge.toLowerCase().replace(/[\s_-]+/g, "");
  const badgeMap: Record<string, string> = {
    silver: "/badge/silver.png",
    gold: "/badge/gold.png",
    platinum: "/badge/platinum.png",
    diamond: "/badge/diamond.png",
  };
  return badgeMap[normalized] || "/badge.png";
};

const FoodCard: React.FC<FoodCardProps> = ({
  foodId,
  image,
  businessName,
  businessDescription,
  badge,
  logo,
}) => {
  const cardContent = (
    <div className="market-card flex h-[420px] flex-col overflow-hidden">
      <div className="market-card-media h-[180px] w-full flex-shrink-0">
        {image ? (
          <img src={image} alt={businessName} className="h-full w-full object-cover" />
        ) : (
          <div className="market-card-placeholder">No image</div>
        )}

        {logo && (
          <img
            src={logo}
            alt="Business Logo"
            className="absolute bottom-2 right-2 h-12 w-12 rounded-full border border-white/15 bg-market-surface object-contain p-1 shadow-market-card"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="market-card-title mb-2 line-clamp-1">{businessName}</h3>

        <p
          className="market-card-desc mb-3 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
          title={businessDescription}
        >
          {businessDescription || "\u00a0"}
        </p>

        <div className="mt-auto flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-white/15" />
          <span className="font-montserrat text-xs font-medium text-market-gold">View Details</span>
        </div>

        <div className="market-card-footer mt-3 min-h-[64px]">
          <span className="text-sm font-semibold text-market-muted">Earned Badge:</span>
          {badge ? (
            <img
              src={getBadgeUrl(badge)}
              alt={`${badge} badge`}
              className="h-16 object-contain"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src.endsWith("/badge.png")) {
                  img.style.display = "none";
                  return;
                }
                img.src = "/badge.png";
              }}
            />
          ) : (
            <div className="h-16 w-[96px]" />
          )}
        </div>
      </div>
    </div>
  );

  if (foodId) {
    return (
      <Link
        href={`/vendor-profile/food-vendor/${foodId}`}
        className="block cursor-pointer transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-market-bg rounded-2xl"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default FoodCard;
