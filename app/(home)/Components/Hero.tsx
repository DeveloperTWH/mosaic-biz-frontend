"use client";

import Link from "next/link";
import { useIsMarketLoggedIn } from "@/hooks/useMarketSession";
import MarketTrustProofRow from "./MarketTrustProofRow";
import { SHOPPER_TRUST_PROOFS } from "./marketTrustProof";

const HERO_CATEGORIES = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/foods", label: "Foods" },
  { href: "/vendors", label: "Vendors" },
] as const;

const Hero = () => {
  const isLoggedIn = useIsMarketLoggedIn();

  return (
    <div className="relative bg-market-bg">
      <section
        className="hero-mobile-cap relative flex items-center overflow-hidden bg-market-hero bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(18,11,47,0.75) 0%, rgba(33,23,71,0.82) 100%), url(/herobanner.png)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-market-glow-radial"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:py-20">
          <p className="mb-4 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-market-gold sm:text-sm">
            Mosaic Biz Hub
          </p>
          <h1 className="mb-4 font-poppins text-3xl font-bold leading-tight text-market-text sm:text-4xl md:text-5xl lg:text-6xl">
            Shop the Movement.
            <span className="mt-2 block text-market-gold">Support the Culture.</span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl font-montserrat text-sm text-market-muted sm:mb-8 sm:text-base">
            From food to fashion to services, Mosaic Biz Hub connects you to verified
            minority-owned businesses and gives entrepreneurs the tools to grow.
          </p>

          <div className="hero-cta-group">
            <Link href="/products" className="hero-cta-primary">
              Shop the Marketplace
            </Link>
            {isLoggedIn ? (
              <Link href="/customer/order" className="market-btn-outline w-full text-center sm:min-w-[220px] sm:w-auto">
                My Orders
              </Link>
            ) : (
              <Link href="/become-a-vendor" className="market-btn-secondary w-full text-center sm:min-w-[220px] sm:w-auto">
                Become a Vendor
              </Link>
            )}
          </div>

          <MarketTrustProofRow items={SHOPPER_TRUST_PROOFS} className="mt-6 sm:mt-8" />

          <div className="hero-browse-divider">
            <p className="mb-3 font-montserrat text-xs uppercase tracking-wider text-market-muted/70">
              Browse categories
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {HERO_CATEGORIES.map((item) => (
                <Link key={item.href} href={item.href} className="hero-category-pill">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <p className="hero-trust-footnote">
            <Link href="/consumer/trustbadge" className="text-market-gold underline hover:text-market-gold-hover">
              Learn about trust badges
            </Link>
            {" — "}verified onboarding, not customer ratings.
            {!isLoggedIn ? (
              <>
                {" · "}
                <Link href="/login?type=customer" className="text-market-gold underline hover:text-market-gold-hover">
                  Customer login
                </Link>
                {" · "}
                <Link href="/login?type=vendor" className="text-market-gold underline hover:text-market-gold-hover">
                  Vendor login
                </Link>
              </>
            ) : null}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Hero;
