import React from "react";
import Link from "next/link";
import MarketImage from "../../Components/MarketImage";
import TrustBadge from "../../Components/TrustBadge";

type FoodCardProps = {
  foodId?: string;
  image?: string;
  businessName: string;
  businessDescription?: string;
  badge?: string;
  logo?: string;
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
    <article className="market-listing-card">
      <div className="market-card-media relative aspect-[16/10] w-full shrink-0">
        <MarketImage
          src={image}
          alt={businessName}
          aspect="video"
          objectFit="cover"
          fallbackLabel="Image coming soon"
        />
        {logo ? (
          <img
            src={logo}
            alt=""
            className="absolute bottom-2 right-2 h-10 w-10 rounded-full border border-white/15 bg-market-surface object-contain p-1 shadow-market-card sm:h-12 sm:w-12"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h3 className="market-card-title line-clamp-2">{businessName}</h3>

        <p className="market-card-desc line-clamp-2" title={businessDescription}>
          {businessDescription || "Explore food and grocery from this vendor."}
        </p>

        <div className="mt-auto flex items-center justify-center gap-3 pt-1">
          <div className="h-px flex-1 bg-white/15" />
          <span className="font-montserrat text-xs font-semibold text-market-gold">View details</span>
          <div className="h-px flex-1 bg-white/15" />
        </div>

        {badge ? (
          <div className="market-card-footer flex-col gap-1 py-2">
            <span className="text-xs font-semibold text-market-muted">Earned badge</span>
            <TrustBadge tier={badge} size="lg" linkToExplainer />
          </div>
        ) : null}
      </div>
    </article>
  );

  if (foodId) {
    return (
      <Link href={`/vendor-profile/food-vendor/${foodId}`} className="market-listing-card-link h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default FoodCard;
