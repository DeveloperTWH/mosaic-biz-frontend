"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    setIsLoggedIn(session === "true");
  }, []);

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
        <div className="relative mx-auto w-full max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="mb-4 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-market-gold sm:text-sm">
            Mosaic Biz Hub
          </p>
          <h1 className="mb-4 font-poppins text-3xl font-bold leading-tight text-market-text sm:text-4xl md:text-5xl lg:text-6xl">
            Shop the Movement.
            <span className="mt-2 block text-market-gold">Support the Culture.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl font-montserrat text-sm text-market-muted sm:text-base">
            From food to fashion to services, Mosaic Biz Hub connects you to verified
            minority-owned businesses and gives entrepreneurs the tools to grow.
          </p>

          {isLoggedIn === null ? (
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="h-11 w-48 rounded bg-white/10" />
              <div className="h-11 w-48 rounded bg-white/10" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/products" className="market-btn-primary w-full text-center sm:min-w-[220px] sm:w-auto">
                Shop the Marketplace
              </Link>
              <Link href="/become-a-vendor" className="market-btn-outline w-full text-center sm:min-w-[220px] sm:w-auto">
                Become a vendor
              </Link>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { href: "/products", label: "Products" },
              { href: "/services", label: "Services" },
              { href: "/foods", label: "Foods" },
              { href: "/vendors", label: "Vendors" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="market-nav-link rounded-full border border-white/15 bg-market-elevated/80 px-4 py-2 font-montserrat text-xs font-medium text-market-text transition-colors hover:border-market-gold/40 hover:text-market-gold sm:text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <p className="mt-6 font-montserrat text-xs text-market-muted">
            <Link href="/consumer/trustbadge" className="text-market-gold underline hover:text-market-gold-hover">
              Learn about trust badges
            </Link>
            {" — "}verified onboarding, not customer ratings.
          </p>

          {isLoggedIn === false ? (
            <p className="mt-3 text-xs text-market-muted">
              Already have an account?{" "}
              <Link
                href="/login?type=customer"
                className="text-market-gold underline hover:text-market-gold-hover"
              >
                Customer login
              </Link>
              {" · "}
              <Link
                href="/login?type=vendor"
                className="text-market-gold underline hover:text-market-gold-hover"
              >
                Vendor login
              </Link>
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default Hero;
