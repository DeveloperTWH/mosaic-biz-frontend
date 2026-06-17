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
        className="relative flex min-h-[520px] items-center overflow-hidden bg-market-hero bg-cover bg-center sm:min-h-[580px] lg:min-h-[640px]"
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
              <Link href="/products">
                <button type="button" className="market-btn-primary min-w-[220px]">
                  Explore the Marketplace
                </button>
              </Link>
              <Link href="/become-a-vendor">
                <button type="button" className="market-btn-outline min-w-[220px]">
                  Apply to Become a Vendor
                </button>
              </Link>
            </div>
          )}

          {isLoggedIn === false ? (
            <p className="mt-6 text-xs text-market-muted">
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
