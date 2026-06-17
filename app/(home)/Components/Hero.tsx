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
    <div className="bg-white">
      <section
        className="relative h-[520px] bg-cover bg-center sm:h-[600px] lg:h-[650px]"
        style={{ backgroundImage: "url(/herobanner.png)" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-800/60 px-4 text-center">
          <div className="mx-auto w-full max-w-4xl">
            <h1 className="mb-4 font-poppins text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Your Marketplace for Minority-Owned Excellence
            </h1>
            <p className="mx-auto mb-8 max-w-2xl font-poppins text-sm text-white sm:text-base">
              From food to fashion to services, Mosaic Biz Hub connects you to
              verified businesses and gives entrepreneurs the tools to grow.
            </p>

            {isLoggedIn === null ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <div className="h-11 w-44 rounded bg-gray-100/70" />
                <div className="h-11 w-44 rounded bg-gray-100/70" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/products">
                  <button
                    type="button"
                    className="min-w-[200px] bg-[#C7A040] px-8 py-3 font-poppins text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#b08f35]"
                  >
                    Explore Marketplace
                  </button>
                </Link>
                <Link href="/become-a-vendor">
                  <button
                    type="button"
                    className="min-w-[200px] border-2 border-white px-8 py-3 font-poppins text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
                  >
                    Become a Vendor
                  </button>
                </Link>
              </div>
            )}

            {isLoggedIn === false ? (
              <p className="mt-6 text-xs text-white/80">
                Already have an account?{" "}
                <Link href="/login?type=customer" className="underline hover:text-white">
                  Customer login
                </Link>
                {" · "}
                <Link href="/login?type=vendor" className="underline hover:text-white">
                  Vendor login
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
