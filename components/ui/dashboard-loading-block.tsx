import { cn } from "@/lib/utils";

export interface DashboardLoadingBlockProps {
  label?: string;
  minHeight?: string;
  className?: string;
}

export default function DashboardLoadingBlock({
  label = "Loading…",
  minHeight = "min-h-[280px]",
  className,
}: DashboardLoadingBlockProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12",
        minHeight,
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-dashboard-gold/30 border-t-dashboard-gold" />
      <p className="mt-3 font-montserrat text-sm text-dashboard-muted">{label}</p>
    </div>
  );
}
