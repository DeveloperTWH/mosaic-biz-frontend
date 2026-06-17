"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PublicSearchFilterBar from "./PublicSearchFilterBar";
import CategoryPills from "./CategoryPills";
import {
  DEFAULT_PUBLIC_SEARCH_FILTERS,
  PublicSearchFilters,
  buildSearchPageUrl,
} from "./publicSearch";

export default function HomeSearchSection() {
  const router = useRouter();
  const [filters, setFilters] = useState<PublicSearchFilters>(DEFAULT_PUBLIC_SEARCH_FILTERS);

  const handleSubmit = () => {
    router.push(buildSearchPageUrl(filters));
  };

  return (
    <section className="relative bg-market-bg px-4 pb-2 pt-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-market-glow-radial opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-[1500px] rounded-2xl border border-white/15 bg-market-elevated p-4 shadow-market-card sm:p-6">
        <PublicSearchFilterBar
          filters={filters}
          onChange={setFilters}
          onSubmit={handleSubmit}
          submitLabel="Search marketplace"
        />
        <CategoryPills />
      </div>
    </section>
  );
}
