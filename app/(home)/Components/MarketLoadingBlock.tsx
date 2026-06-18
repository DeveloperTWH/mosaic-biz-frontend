export interface MarketLoadingBlockProps {
  label?: string;
  minHeight?: string;
  className?: string;
}

export default function MarketLoadingBlock({
  label = "Loading…",
  minHeight = "min-h-[280px]",
  className = "",
}: MarketLoadingBlockProps) {
  return (
    <div
      className={`flex ${minHeight} flex-col items-center justify-center py-12 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-market-gold/30 border-t-market-gold" />
      <p className="mt-3 font-montserrat text-sm text-market-muted">{label}</p>
    </div>
  );
}
