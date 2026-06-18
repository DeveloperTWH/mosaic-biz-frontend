import React, { useState } from "react";
import { Service } from "@/types/service";
import { Category } from "@/types/Category";
import FilterAccordion from "./FilterAccordion";
import ProductCard from "./ProductCard";
import MarketLoadingBlock from "../../Components/MarketLoadingBlock";
import MarketEmptyState from "../../Components/MarketEmptyState";
import MobileFilterDrawer from "../../Components/MobileFilterDrawer";

interface BookServicesProps {
  services: Service[];
  totalProducts?: number;
  currentPage?: number;
  itemsPerPage?: number;
  selectedCategory?: Category | null;
  loading?: boolean;
  onCategorySelect?: (categoryId: string) => void;
  onSubcategorySelect?: (subcategoryId: string) => void;
  onBadgeSelect?: (badge: string) => void;
  onPriceChange?: (min: number, max: number) => void;
}

const BookServices: React.FC<BookServicesProps> = ({
  services,
  totalProducts = 0,
  currentPage = 1,
  itemsPerPage = 10,
  selectedCategory,
  loading = false,
  onCategorySelect,
  onSubcategorySelect,
  onBadgeSelect,
  onPriceChange,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const startItem = totalProducts > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalProducts > 0 ? Math.min(startItem + services.length - 1, totalProducts) : 0;

  const filterPanel = (
    <FilterAccordion
      selectedCategory={selectedCategory}
      onFilterChange={() => {}}
      onCategorySelect={onCategorySelect}
      onSubcategorySelect={onSubcategorySelect}
      onBadgeSelect={onBadgeSelect}
      onPriceChange={onPriceChange}
    />
  );

  return (
    <section className="container-page py-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="hidden w-full lg:block lg:w-1/4">
          <div className="space-y-6">{filterPanel}</div>
        </div>

        <div className="w-full min-w-0 lg:w-3/4">
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
            resultCount={totalProducts}
          >
            {filterPanel}
          </MobileFilterDrawer>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="market-result-count">
              (Showing {startItem} - {endItem} foods of {totalProducts} foods)
            </p>
          </div>

          {loading ? (
            <MarketLoadingBlock label="Loading foods…" minHeight="min-h-[256px]" />
          ) : services.length === 0 ? (
            <MarketEmptyState
              title="No foods found"
              description="Try adjusting your filters or search the marketplace."
              ctaLabel="Search marketplace"
              ctaHref="/search"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ProductCard
                  key={service._id}
                  foodId={service._id}
                  image={service.coverImage}
                  businessName={service.businessId?.businessName || service.title}
                  businessDescription={
                    service.businessId?.description || service.description || "No description available"
                  }
                  badge={service.businessId?.badge || (service as { badge?: string }).badge}
                  logo={service.businessId?.logo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookServices;
