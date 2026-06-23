"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PublicSearchFilterBar from "./PublicSearchFilterBar";
import CategoryPills from "./CategoryPills";
import MarketTrustBadgeHint from "./MarketTrustBadgeHint";
import { MARKET_SUGGESTED_SEARCHES } from "./marketDiscovery";
import {
  DEFAULT_PUBLIC_SEARCH_FILTERS,
  PublicSearchFilters,
  buildSearchPageUrl,
} from "./publicSearch";

const HOME_POPULAR_SEARCHES = MARKET_SUGGESTED_SEARCHES.slice(0, 5);

export default function HomeSearchSection() {
  const router = useRouter();
  const [filters, setFilters] = useState<PublicSearchFilters>(DEFAULT_PUBLIC_SEARCH_FILTERS);

  const handleSubmit = () => {
    router.push(buildSearchPageUrl(filters));
  };

  return (
    <section className="relative bg-market-bg pb-2 pt-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-market-glow-radial opacity-60" aria-hidden />
      <div className="container-page relative max-w-[1500px] rounded-2xl border border-white/15 bg-market-elevated p-4 shadow-market-card sm:p-6">
        <PublicSearchFilterBar
          filters={filters}
          onChange={setFilters}
          onSubmit={handleSubmit}
          submitLabel="Search marketplace"
        />
        <MarketTrustBadgeHint className="mt-3 px-1" />
        <CategoryPills />
        <div className="border-t border-white/10 pt-4">
          <p className="market-discovery-section-label text-center">Popular searches</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {HOME_POPULAR_SEARCHES.map((item) => (
              <Link key={item.href} href={item.href} className="market-suggestion-chip">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
