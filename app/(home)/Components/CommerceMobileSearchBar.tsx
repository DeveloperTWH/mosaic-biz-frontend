"use client";

import PublicFilterSection from "./PublicFilterSection";
import PublicSearchFilterBar from "./PublicSearchFilterBar";
import type { PublicSearchFilters } from "./publicSearch";

type CommerceMobileSearchBarProps = {
  filters: PublicSearchFilters;
  onChange: (filters: PublicSearchFilters) => void;
  onSubmit: () => void;
};

/** Marketplace search bar for commerce detail/storefront pages — mobile and tablet only. */
export default function CommerceMobileSearchBar({
  filters,
  onChange,
  onSubmit,
}: CommerceMobileSearchBarProps) {
  return (
    <div className="lg:hidden">
      <PublicFilterSection>
        <PublicSearchFilterBar filters={filters} onChange={onChange} onSubmit={onSubmit} />
      </PublicFilterSection>
    </div>
  );
}
