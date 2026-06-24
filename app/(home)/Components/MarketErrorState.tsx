import MarketEmptyState from "./MarketEmptyState";

export interface MarketErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export default function MarketErrorState({
  title = "Something did not load",
  description = "We could not load this part of the marketplace. Please try again.",
  onRetry,
  retryLabel = "Retry",
  ctaLabel,
  ctaHref,
  className = "",
}: MarketErrorStateProps) {
  return (
    <div role="alert" aria-live="polite">
      <MarketEmptyState
        title={title}
        description={description}
        onRetry={onRetry}
        retryLabel={retryLabel}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
        className={className}
      />
    </div>
  );
}
