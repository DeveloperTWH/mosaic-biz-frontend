import React, { useState } from "react";
import { Service } from "@/types/service";
import { Category } from "@/types/Category";
import FilterAccordion from "./FilterAccordion";
import ProductCard from "./ProductCard";
import MarketLoadingBlock from "../../Components/MarketLoadingBlock";
import MarketEmptyState from "../../Components/MarketEmptyState";

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
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    subCategory: "",
    badge: "",
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const startItem = totalProducts > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalProducts > 0 ? Math.min(startItem + services.length - 1, totalProducts) : 0;

  const handleFilterChange = (filterType: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? "" : value,
    }));
  };

  return (
    <section className="container-page py-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <button
            type="button"
            className="market-btn-secondary mb-4 w-full lg:hidden"
            onClick={() => setFiltersOpen((prev) => !prev)}
            aria-expanded={filtersOpen}
          >
            {filtersOpen ? "Hide filters" : "Filters"}
          </button>
          <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
            <div className="space-y-6">
              <FilterAccordion
              selectedCategory={selectedCategory}
              onFilterChange={(category, subCategory) => {
                console.log("Service filter clicked:", category, subCategory);
                handleFilterChange("category", category);
                handleFilterChange("subCategory", subCategory);
              }}
              onCategorySelect={onCategorySelect}
              onSubcategorySelect={onSubcategorySelect}
              onBadgeSelect={onBadgeSelect}
              onPriceChange={onPriceChange}
            />
            </div>
          </div>
        </div>

        <div className="w-full min-w-0 lg:w-3/4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="market-result-count">
              (Showing {startItem} - {endItem} Service Of {totalProducts} Services)
            </p>

            <div className="flex items-center gap-2">
              <span className="market-result-count">Sort By:</span>
              <div className="market-select-wrap">
                <select className="market-select w-auto min-w-[140px] px-3 py-1 text-sm">
                  <option>Default</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                  <option>Newest</option>
                </select>
                <div className="market-select-chevron">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <MarketLoadingBlock label="Loading services…" minHeight="min-h-[256px]" />
          ) : services.length === 0 ? (
            <MarketEmptyState
              title="No services found"
              description="Try adjusting your filters or search the marketplace."
              ctaLabel="Search marketplace"
              ctaHref="/search"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ProductCard
                  key={service._id}
                  serviceId={service._id}
                  title={(service as any).businessDetails?.businessName || service.title}
                  image={service.coverImage}
                  description={(service as any).businessDetails?.description || service.description}
                  rating={service.averageRating}
                  totalRatings={service.averageRating}
                  reviews={service.totalReviews}
                  badge={(service as any).businessDetails?.badge || (service as any).badge}
                  price={(service as any).price}
                  logo={(service as any).businessDetails?.logo}
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
