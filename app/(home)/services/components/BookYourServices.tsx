import React, { useState } from "react";
import { Service } from "@/types/service";
import { Category } from "@/types/Category";
import FilterAccordion from "./FilterAccordion";
import ProductCard from "./ProductCard";
import MarketLoadingBlock from "../../Components/MarketLoadingBlock";
import MarketEmptyState from "../../Components/MarketEmptyState";
import CatalogListingLayout from "../../Components/CatalogListingLayout";
import { formatCatalogRange } from "../../Components/CatalogListingToolbar";

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

  const startItem = totalProducts > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem =
    totalProducts > 0 ? Math.min(startItem + services.length - 1, totalProducts) : 0;

  const handleFilterChange = (filterType: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? "" : value,
    }));
  };

  const filterPanel = (
    <FilterAccordion
      selectedCategory={selectedCategory}
      onFilterChange={(category, subCategory) => {
        handleFilterChange("category", category);
        handleFilterChange("subCategory", subCategory);
      }}
      onCategorySelect={onCategorySelect}
      onSubcategorySelect={onSubcategorySelect}
      onBadgeSelect={onBadgeSelect}
      onPriceChange={onPriceChange}
    />
  );

  const sortSlot = (
    <>
      <span className="market-result-count">Sort by:</span>
      <div className="market-select-wrap">
        <select className="market-select w-auto min-w-[140px] px-3 py-1 text-sm" aria-label="Sort services">
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
    </>
  );

  return (
    <CatalogListingLayout
      filterPanel={filterPanel}
      resultCount={totalProducts}
      summary={formatCatalogRange(startItem, endItem, totalProducts, "services")}
      sortSlot={sortSlot}
    >
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
        <div className="public-grid-listing public-grid-listing--services">
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
    </CatalogListingLayout>
  );
};

export default BookServices;
