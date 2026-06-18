import Link from "next/link";

export interface MarketEmptyStateProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export default function MarketEmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  className = "",
}: MarketEmptyStateProps) {
  return (
    <div className={`market-empty-state ${className}`}>
      <p className="market-empty-state-title">{title}</p>
      {description ? (
        <p className="mt-2 font-montserrat text-sm text-market-muted">{description}</p>
      ) : null}
      {ctaLabel && ctaHref ? (
        <Link href={ctaHref} className="market-btn-secondary mt-6 inline-block">
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
