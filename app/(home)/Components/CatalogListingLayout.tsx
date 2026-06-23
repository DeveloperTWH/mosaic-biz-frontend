"use client";

import { ReactNode, useState } from "react";
import MobileFilterDrawer from "./MobileFilterDrawer";
import CatalogListingToolbar from "./CatalogListingToolbar";

type CatalogListingLayoutProps = {
  filterPanel: ReactNode;
  resultCount: number;
  summary: string;
  sortSlot?: ReactNode;
  children: ReactNode;
};

export default function CatalogListingLayout({
  filterPanel,
  resultCount,
  summary,
  sortSlot,
  children,
}: CatalogListingLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <section className="container-page catalog-listing-section">
      <div className="catalog-listing-layout">
        <aside className="catalog-filter-sidebar" aria-label="Filters">
          <div className="catalog-filter-sidebar-inner">{filterPanel}</div>
        </aside>

        <div className="catalog-listing-main">
          <button
            type="button"
            className="market-btn-secondary mb-4 w-full min-h-11 lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
          >
            Filters
          </button>

          <MobileFilterDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            resultCount={resultCount}
          >
            {filterPanel}
          </MobileFilterDrawer>

          <CatalogListingToolbar summary={summary} sortSlot={sortSlot} />
          {children}
        </div>
      </div>
    </section>
  );
}
