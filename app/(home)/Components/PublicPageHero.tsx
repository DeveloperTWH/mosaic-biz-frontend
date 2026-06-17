import Image from "next/image";
import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

export interface PublicPageHeroProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  imageUrl?: string;
  imageAlt?: string;
}

const PublicPageHero = ({
  title,
  breadcrumbs = [],
  imageUrl,
  imageAlt,
}: PublicPageHeroProps) => {
  const titleId = "public-page-hero-title";

  return (
    <section
      aria-labelledby={titleId}
      className="relative min-h-[220px] overflow-hidden border-b border-white/10 bg-market-bg md:min-h-[280px]"
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

      <div className="relative flex min-h-[220px] flex-col items-center justify-center px-4 py-10 text-center sm:px-6 md:min-h-[280px] md:py-12">
        {breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex flex-wrap items-center justify-center gap-x-1.5 font-montserrat text-xs text-market-muted sm:text-sm">
              {breadcrumbs.map((item, index) => (
                <li key={`${item.label}-${index}`} className="flex items-center">
                  {index > 0 ? (
                    <span className="mx-1.5 text-market-muted/60" aria-hidden>
                      /
                    </span>
                  ) : null}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-market-gold"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={index === breadcrumbs.length - 1 ? "text-market-text/80" : undefined}>
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
          className="font-poppins text-2xl font-semibold leading-tight text-market-text sm:text-3xl md:text-4xl"
        >
          {title}
        </h1>
        <div className="market-section-divider mt-4" aria-hidden />
      </div>
    </section>
  );
};

export default PublicPageHero;
