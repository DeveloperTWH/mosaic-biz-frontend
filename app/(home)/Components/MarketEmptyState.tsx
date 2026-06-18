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
    <div
      className={`rounded border border-[#E5DEC9] bg-white p-10 text-center ${className}`}
    >
      <p className="text-lg font-semibold text-gray-900">{title}</p>
      {description ? (
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      ) : null}
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded border border-[#C7A040] px-5 py-2 text-sm font-semibold text-[#C7A040] transition-colors hover:bg-[#C7A040]/10"
          >
            {retryLabel}
          </button>
        ) : null}
        {ctaLabel && ctaHref ? (
          <Link
            href={ctaHref}
            className="rounded bg-[#C7A040] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a88432]"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
