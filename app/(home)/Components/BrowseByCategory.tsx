"use client";

import Link from "next/link";
import BrowseServices from "./BrowsServices";
import BrowseFoodAndGrocery from "./BrowsbyFoodndGrocerry";

export default function BrowseByCategory() {
  return (
    <section className="bg-market-bg">
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="market-section-heading">Browse by category</h2>
          <div className="market-section-divider" />
          <p className="mx-auto mt-4 max-w-2xl font-montserrat text-sm text-market-muted">
            Discover products, services, and food from verified minority-owned businesses.
          </p>
        </div>
      </div>
      <BrowseServices showAllService={true} />
      <BrowseFoodAndGrocery />
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/products" className="market-btn-secondary min-w-[140px]">
            Shop products
          </Link>
          <Link href="/services" className="market-btn-secondary min-w-[140px]">
            Book services
          </Link>
          <Link href="/foods" className="market-btn-secondary min-w-[140px]">
            Order food
          </Link>
        </div>
        <Link href="/search" className="market-btn-primary inline-block">
          Search the marketplace
        </Link>
      </div>
    </section>
  );
}
