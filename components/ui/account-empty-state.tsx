import Link from "next/link";
import { cn } from "@/lib/utils";

export interface AccountEmptyStateProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export default function AccountEmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  onRetry,
  retryLabel = "Try again",
  className,
}: AccountEmptyStateProps) {
  return (
    <div className={cn("account-empty-state", className)}>
      <p className="account-empty-state-title">{title}</p>
      {description ? (
        <p className="account-empty-state-desc">{description}</p>
      ) : null}
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="min-h-11 rounded border border-brand-gold/40 px-5 py-2 font-poppins text-xs font-semibold uppercase tracking-wide text-brand-navy transition-colors hover:border-brand-gold hover:bg-brand-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40"
          >
            {retryLabel}
          </button>
        ) : null}
        {ctaLabel && ctaHref ? (
          <Link
            href={ctaHref}
            className="inline-flex min-h-11 items-center rounded bg-brand-gold px-6 py-2 font-poppins text-xs font-semibold uppercase tracking-wide text-brand-navy transition-colors hover:bg-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
