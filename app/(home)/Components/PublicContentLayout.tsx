import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import PublicPageHero, { PublicPageHeroProps } from "./PublicPageHero";

export interface PublicContentLayoutProps extends PublicPageHeroProps {
  children: ReactNode;
  maxWidthClass?: string;
  /** `legal` wraps content in a light readable card (`market-prose-light`). */
  proseVariant?: "default" | "legal";
  /** Full-width content below the main container (e.g. policy page CTAs). */
  footer?: ReactNode;
}

export default function PublicContentLayout({
  children,
  maxWidthClass = "max-w-[900px]",
  proseVariant = "default",
  footer,
  ...heroProps
}: PublicContentLayoutProps) {
  const isLegal = proseVariant === "legal";

  return (
    <main className="w-full bg-market-bg">
      <PublicPageHero {...heroProps} />
      <div className="container-page py-8 sm:py-12">
        <div
          className={cn(
            "mx-auto",
            maxWidthClass,
            isLegal
              ? "market-surface-light market-prose-light rounded-2xl border border-white/10 px-6 py-8 shadow-market-card sm:px-10"
              : "public-prose"
          )}
        >
          {children}
        </div>
      </div>
      {footer}
    </main>
  );
}
