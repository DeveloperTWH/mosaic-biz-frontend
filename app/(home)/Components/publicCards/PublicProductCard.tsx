import Link from "next/link";
import type { ReactNode } from "react";
import MarketImage from "../MarketImage";
import MarketPrice from "../MarketPrice";
import CardRatingRow from "../CardRatingRow";
import { getBadgeImage, handleBadgeImageError } from "./marketBadge";

export interface PublicProductCardProps {
  href: string;
  title: string;
  description?: string;
  image?: string | null;
  price?: number | null;
  compareAtPrice?: number | null;
  onSale?: boolean;
  vendorName?: string;
  badge?: string | null;
  rating?: number;
  reviewCount?: number;
  trustLabel?: string;
  actionLabel?: string;
  fallbackDescription?: string;
  stockHint?: string | null;
  imageOverlay?: ReactNode;
}

export default function PublicProductCard({
  href,
  title,
  description = "",
  image,
  price = null,
  compareAtPrice = null,
  onSale = false,
  vendorName,
  badge,
  rating,
  reviewCount = 0,
  trustLabel,
  actionLabel = "View",
  fallbackDescription = "Explore this product on Mosaic Biz Hub.",
  stockHint,
  imageOverlay,
}: PublicProductCardProps) {
  const badgeImage = getBadgeImage(badge);
  const hasRating = (rating ?? 0) > 0 || reviewCount > 0;
  const displayTrustLabel =
    trustLabel ?? (badge ? `Verified vendor · ${badge} badge` : undefined);

  return (
    <Link href={href} className="market-listing-card-link h-full">
      <article className="market-listing-card">
        <div className="market-card-media market-card-media--product">
          <MarketImage
            src={image ?? undefined}
            alt={title}
            aspect="square"
            objectFit="contain"
            fallbackLabel="Image coming soon"
          />
          {onSale ? <span className="market-card-sale-badge">Sale</span> : null}
          {stockHint ? <span className="market-card-stock-hint">{stockHint}</span> : null}
          {imageOverlay}
        </div>

        <div className="market-card-body">
          <h3 className="market-card-title line-clamp-2">{title}</h3>

          <p className="market-card-desc line-clamp-2">
            {description || fallbackDescription}
          </p>

          {displayTrustLabel ? <p className="market-card-trust-label">{displayTrustLabel}</p> : null}

          {vendorName ? (
            <p className="market-card-vendor-meta">
              <span className="market-card-vendor-meta-label">Vendor</span>
              {vendorName}
            </p>
          ) : null}

          {hasRating ? (
            <CardRatingRow rating={rating ?? 0} reviewCount={reviewCount} />
          ) : null}

          <MarketPrice
            value={onSale ? compareAtPrice : price}
            compareAt={onSale ? price : null}
            onSale={onSale}
            label="Starting from"
          />

          <div className="market-card-cta-row">
            <span className="market-card-action">{actionLabel}</span>
            {badgeImage ? (
              <div className="market-card-badge-wrap" title="Earned through Mosaic verification">
                <span className="sr-only">Earned trust badge</span>
                <img
                  src={badgeImage}
                  alt={`${badge} badge`}
                  className="market-card-badge-image"
                  onError={handleBadgeImageError}
                />
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
