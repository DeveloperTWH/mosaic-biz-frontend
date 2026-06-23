export interface MarketLoadingBlockProps {
  label?: string;
  minHeight?: string;
  className?: string;
  variant?: "spinner" | "searchGrid";
}

function SearchGridSkeleton() {
  return (
    <div className="public-grid-listing w-full" aria-hidden>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="market-search-skeleton-card">
          <div className="market-search-skeleton-media" />
          <div className="space-y-2 p-3">
            <div className="market-search-skeleton-line market-search-skeleton-line--title" />
            <div className="market-search-skeleton-line market-search-skeleton-line--body" />
            <div className="market-search-skeleton-line market-search-skeleton-line--short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MarketLoadingBlock({
  label = "Loading…",
  minHeight = "min-h-[280px]",
  className = "",
  variant = "spinner",
}: MarketLoadingBlockProps) {
  if (variant === "searchGrid") {
    return (
      <div
        className={`flex min-h-[200px] flex-col items-center justify-center py-8 ${className}`}
        role="status"
        aria-live="polite"
      >
        <SearchGridSkeleton />
        <p className="mt-4 font-montserrat text-sm text-market-text/85">{label}</p>
      </div>
    );
  }

  return (
    <div
      className={`flex ${minHeight} flex-col items-center justify-center py-12 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-market-gold/30 border-t-market-gold" />
      <p className="mt-3 font-montserrat text-sm text-market-text/85">{label}</p>
    </div>
  );
}
