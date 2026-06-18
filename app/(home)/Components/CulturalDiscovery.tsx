"use client";

import Link from "next/link";
import MarketEmptyState from "./MarketEmptyState";
import MarketImage from "./MarketImage";

type CulturalCollection = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
};

const STATIC_COLLECTIONS: CulturalCollection[] = [
  {
    id: "black-owned",
    title: "Black-Owned Excellence",
    description: "Discover products and services from Black-owned businesses in your community.",
    href: "/search?minorityType=Black",
    image: "/Carousel/nature-3.jpg",
  },
  {
    id: "latinx",
    title: "Latinx Heritage",
    description: "Celebrate culture through food, services, and goods from Latinx entrepreneurs.",
    href: "/search?minorityType=Latinx",
    image: "/Carousel/nature-2.jpg",
  },
  {
    id: "women-owned",
    title: "Women-Owned Ventures",
    description: "Support women-led businesses building the future of local commerce.",
    href: "/search?minorityType=Woman",
    image: "/Carousel/nature-1.jpg",
  },
];

/**
 * Curated cultural discovery sections for homepage.
 * Backend-dependent: replace STATIC_COLLECTIONS when curated API is available.
 */
export function CulturalDiscoveryCollections() {
  return (
    <section className="container-page public-section py-12">
      <div className="mb-8 text-center">
        <h2 className="font-poppins text-2xl font-semibold text-market-text sm:text-3xl">
          Cultural Discovery
        </h2>
        <div className="market-section-divider mx-auto mt-4" />
        <p className="mx-auto mt-4 max-w-2xl font-montserrat text-sm text-market-muted">
          Explore minority-owned businesses by heritage and community — curated collections updated as vendors join.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {STATIC_COLLECTIONS.map((col) => (
          <Link
            key={col.id}
            href={col.href}
            className="market-card group overflow-hidden p-0 transition-transform hover:-translate-y-0.5"
          >
            <MarketImage
              src={col.image}
              alt={col.title}
              aspect="video"
              className="h-36 !aspect-auto shrink-0"
              fallbackLabel="Image coming soon"
            />
            <div className="p-4">
              <h3 className="font-poppins text-lg font-semibold text-market-text group-hover:text-market-gold">
                {col.title}
              </h3>
              <p className="mt-2 font-montserrat text-sm text-market-muted">{col.description}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-market-gold">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function VendorSpotlightSection() {
  return (
    <section className="container-page public-section py-12">
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
    <section className="container-page public-section py-12">
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
