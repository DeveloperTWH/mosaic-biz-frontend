import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type VendorProfileBreadcrumb = {
  label: string;
  href?: string;
  accent?: boolean;
};

export interface VendorProfileHeroProps {
  title: string;
  breadcrumbs: VendorProfileBreadcrumb[];
  imageSrc?: string;
  imageAlt?: string;
  separator?: "/" | "//";
}

export default function VendorProfileHero({
  title,
  breadcrumbs,
  imageSrc = "/products/19099 1.png",
  imageAlt = "",
  separator = "/",
}: VendorProfileHeroProps) {
  return (
    <div className="vendor-profile-hero-band">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        className="object-cover object-center opacity-30"
        aria-hidden={!imageAlt}
      />
      <div className="absolute inset-0 bg-market-hero" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-market-glow-radial" aria-hidden />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="vendor-profile-hero-title">{title}</h1>
        <nav
          className="mt-2 font-montserrat text-sm text-market-text/90"
          aria-label="Breadcrumb"
        >
          <ol className="flex flex-wrap items-center justify-center gap-x-1">
            {breadcrumbs.map((item, index) => (
              <li key={`${item.label}-${index}`} className="flex items-center">
                {index > 0 ? (
                  <span className="mx-2 text-market-text/60" aria-hidden>
                    {separator}
                  </span>
                ) : null}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="rounded-sm text-market-text/90 transition-colors hover:text-market-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      item.accent ? "vendor-profile-breadcrumb-accent" : "text-market-text"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
