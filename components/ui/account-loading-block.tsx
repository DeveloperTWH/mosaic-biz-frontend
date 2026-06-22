import { cn } from "@/lib/utils";

export interface AccountLoadingBlockProps {
  label?: string;
  minHeight?: string;
  className?: string;
}

export default function AccountLoadingBlock({
  label = "Loading…",
  minHeight = "min-h-[280px]",
  className,
}: AccountLoadingBlockProps) {
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
      <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-brand-gold/30 border-t-brand-gold" />
      <p className="mt-3 font-montserrat text-sm text-brand-muted">{label}</p>
    </div>
  );
}
