"use client";

import Link from "next/link";
import MarketEmptyState from "./MarketEmptyState";
import MarketImage from "./MarketImage";
import { MARKET_CULTURAL_COLLECTIONS } from "./marketDiscovery";

/**
 * Curated cultural discovery sections for homepage.
 * Backend-dependent: replace STATIC_COLLECTIONS when curated API is available.
 */
export function CulturalDiscoveryCollections() {
  return (
    <section className="container-page public-section">
      <div className="mb-6 text-center sm:mb-8">
        <h2 className="market-section-heading">Cultural Discovery</h2>
        <div className="market-section-divider" />
        <p className="mx-auto mt-3 max-w-2xl font-montserrat text-sm leading-relaxed text-market-muted sm:mt-4">
          Explore minority-owned businesses by heritage and community — curated collections updated as vendors join.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
        {MARKET_CULTURAL_COLLECTIONS.map((col) => (
          <Link
            key={col.id}
            href={col.href}
            className="market-listing-card-link group"
          >
            <article className="market-listing-card overflow-hidden p-0">
              <MarketImage
                src={col.image}
                alt={col.title}
                aspect="video"
                className="h-32 !aspect-auto shrink-0 sm:h-36"
                fallbackLabel="Image coming soon"
              />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="font-poppins text-base font-semibold text-market-text group-hover:text-market-gold sm:text-lg">
                  {col.title}
                </h3>
                <p className="market-card-desc line-clamp-2">{col.description}</p>
                <span className="mt-auto inline-flex min-h-11 items-center text-sm font-semibold text-market-gold">
                  Explore
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function VendorSpotlightSection() {
  return (
    <section className="container-page public-section">
      <MarketEmptyState
        title="Featured vendors coming soon"
        description="We're curating standout minority-owned businesses for this spotlight. Check back as new vendors launch on Mosaic Biz Hub."
        ctaLabel="Browse all vendors"
        ctaHref="/vendors"
      />
      <p className="mt-4 text-center text-xs text-market-muted">
        Backend-dependent: curated vendor spotlight API
      </p>
    </section>
  );
}

export function VendorStoriesSection() {
  return (
    <section className="container-page public-section">
      <div className="market-card-light mx-auto max-w-3xl p-8 text-center">
        <h2 className="market-card-light-title">Vendor Stories</h2>
        <p className="mt-4 market-card-light-body">
          Real stories from entrepreneurs building on Mosaic Biz Hub — launching with our first vendor cohort.
        </p>
        <Link href="/about" className="market-btn-secondary mt-6 inline-flex min-h-11 items-center px-6">
          Learn about our mission
        </Link>
      </div>
      <p className="mt-4 text-center text-xs text-market-muted">
        Backend-dependent: vendor stories CMS / API
      </p>
    </section>
  );
}
