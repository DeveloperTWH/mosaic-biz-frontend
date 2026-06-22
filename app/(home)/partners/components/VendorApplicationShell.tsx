import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VendorApplicationShellProps {
  variant?: "dashboard" | "market";
  title?: string;
  eyebrow?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  maxWidthClass?: string;
  headerSlot?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function VendorApplicationShell({
  variant = "dashboard",
  title,
  eyebrow,
  description,
  backHref,
  backLabel = "Back",
  maxWidthClass = "max-w-6xl",
  headerSlot,
  actions,
  children,
  className,
}: VendorApplicationShellProps) {
  if (variant === "market") {
    return (
      <div className={cn("relative min-h-screen bg-market-bg pb-10", className)}>
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/become-a-vendor/vendor-registion-bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-market-hero" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-market-glow-radial" aria-hidden />

        {(backHref || title || eyebrow || description || headerSlot) && (
          <div className="relative w-full border-b border-white/10">
            <div className={cn("relative mx-auto px-4", maxWidthClass === "max-w-6xl" ? "max-w-4xl" : maxWidthClass)}>
              {backHref ? (
                <div className="py-4">
                  <Link
                    href={backHref}
                    className="market-btn-outline inline-flex items-center gap-1 px-4 py-2 text-sm normal-case"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {backLabel}
                  </Link>
                </div>
              ) : null}

              {headerSlot}

              {(title || eyebrow || description) && (
                <div className="pb-10 pt-2 text-center">
                  {eyebrow ? (
                    <span className="mb-4 inline-block rounded-full bg-market-gold px-6 py-2 text-sm font-medium text-market-header">
                      {eyebrow}
                    </span>
                  ) : null}
                  {title ? (
                    <h1 className="mb-2 font-poppins text-3xl font-bold uppercase tracking-wide text-market-text sm:text-4xl">
                      {title}
                    </h1>
                  ) : null}
                  {title ? <div className="market-section-divider mx-auto" aria-hidden /> : null}
                  {description ? (
                    <p className="mx-auto mt-4 max-w-3xl font-montserrat text-sm font-medium text-market-muted sm:text-base">
                      {description}
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={cn("relative mx-auto px-4 pt-8", maxWidthClass === "max-w-6xl" ? "max-w-4xl" : maxWidthClass)}>
          {children}
          {actions ? <div className="mt-6">{actions}</div> : null}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-surface-cream py-6 sm:py-8", className)}>
      <div className={cn("container mx-auto px-4 sm:px-6", maxWidthClass)}>
        {(backHref || title || eyebrow || description || headerSlot) && (
          <header className="mb-6">
            {backHref ? (
              <Link
                href={backHref}
                className="mb-3 inline-flex items-center text-sm text-dashboard-muted transition-colors hover:text-dashboard-text"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                {backLabel}
              </Link>
            ) : null}
            {headerSlot}
            {eyebrow ? (
              <span className="mb-2 inline-block rounded-full bg-brand-cream px-3 py-1 text-xs font-medium text-brand-gold">
                {eyebrow}
              </span>
            ) : null}
            {title ? (
              <h1 className="font-poppins text-2xl font-bold text-dashboard-text sm:text-3xl">{title}</h1>
            ) : null}
            {description ? <p className="mt-2 max-w-3xl text-sm text-dashboard-muted">{description}</p> : null}
          </header>
        )}

        {children}
        {actions ? <div className="mt-6">{actions}</div> : null}
      </div>
    </div>
  );
}
