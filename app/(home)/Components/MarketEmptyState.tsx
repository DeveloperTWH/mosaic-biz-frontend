import Link from "next/link";

export interface MarketEmptyStateProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export default function MarketEmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  onRetry,
  retryLabel = "Try again",
  className = "",
}: MarketEmptyStateProps) {
  return (
    <div className={`market-empty-state ${className}`}>
      <p className="market-empty-state-title">{title}</p>
      {description ? (
        <p className="mt-2 market-empty-state-desc">{description}</p>
      ) : null}
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="market-btn-outline px-5 py-2 text-sm font-semibold"
          >
            {retryLabel}
          </button>
        ) : null}
        {ctaLabel && ctaHref ? (
          <Link href={ctaHref} className="market-btn-secondary inline-block">
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
