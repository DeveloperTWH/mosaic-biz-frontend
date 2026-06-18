export interface MarketLoadingBlockProps {
  label?: string;
  minHeight?: string;
  className?: string;
}

export default function MarketLoadingBlock({
  label = "Loading…",
  minHeight = "min-h-[200px]",
  className = "",
}: MarketLoadingBlockProps) {
  return (
    <div
      className={`flex items-center justify-center ${minHeight} ${className}`}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C7A040] border-t-transparent" />
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
    </div>
  );
}
