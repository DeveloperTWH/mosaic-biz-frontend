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
        <Link href="/products" className="market-btn-secondary inline-block">
          View all marketplace listings
        </Link>
      </div>
    </section>
  );
}
