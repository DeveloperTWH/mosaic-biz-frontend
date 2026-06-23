import React from "react";
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
  const startItem = totalProducts > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem =
    totalProducts > 0 ? Math.min(startItem + services.length - 1, totalProducts) : 0;

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
    <CatalogListingLayout
      filterPanel={filterPanel}
      resultCount={totalProducts}
      summary={formatCatalogRange(startItem, endItem, totalProducts, "foods")}
    >
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
        <div className="public-grid-listing public-grid-listing--services">
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
    </CatalogListingLayout>
  );
};

export default BookServices;
