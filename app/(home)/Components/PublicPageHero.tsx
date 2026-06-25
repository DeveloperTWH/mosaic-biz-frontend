import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = { label: string; href?: string };

export interface PublicPageHeroProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  imageUrl?: string;
  imageAlt?: string;
  /** Compact height on desktop for catalog/browse pages. */
  variant?: "default" | "compact";
}

const PublicPageHero = ({
  title,
  breadcrumbs = [],
  imageUrl,
  imageAlt,
  variant = "default",
}: PublicPageHeroProps) => {
  const titleId = "public-page-hero-title";
  const isCompact = variant === "compact";

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "relative w-full min-w-full overflow-hidden border-b border-white/10 bg-market-bg",
        isCompact
          ? "public-page-hero--compact"
          : "min-h-[220px] md:min-h-[280px]"
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt ?? title}
          fill
          priority
          className="object-cover object-center opacity-40"
        />
      ) : null}

      <div className="absolute inset-0 bg-market-hero" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-market-glow-radial"
        aria-hidden
      />

      <div
        className={cn(
          "public-page-hero-content relative flex flex-col items-center justify-center px-4 text-center sm:px-6",
          isCompact
            ? "min-h-[180px] py-8 md:min-h-[200px] md:py-10 lg:min-h-[148px] lg:py-6"
            : "min-h-[220px] py-10 md:min-h-[280px] md:py-12"
        )}
      >
        {breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex flex-wrap items-center justify-center gap-x-1.5 font-montserrat text-xs text-market-text/90 sm:text-sm">
              {breadcrumbs.map((item, index) => (
                <li key={`${item.label}-${index}`} className="flex items-center">
                  {index > 0 ? (
                    <span className="mx-1.5 text-market-text/50" aria-hidden>
                      /
                    </span>
                  ) : null}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="market-nav-link rounded-sm text-market-text/90 transition-colors hover:text-market-gold"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-market-text">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <h1
          id={titleId}
          className={cn(
            "font-poppins font-semibold leading-tight text-market-text",
            isCompact
              ? "text-2xl sm:text-3xl lg:text-[1.75rem]"
              : "text-2xl sm:text-3xl md:text-4xl"
          )}
        >
          {title}
        </h1>
        <div className="market-section-divider mt-4" aria-hidden />
      </div>
    </section>
  );
};

export default PublicPageHero;
