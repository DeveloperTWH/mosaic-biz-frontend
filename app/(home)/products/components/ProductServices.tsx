import React, { useState } from "react";
import { Service } from "@/types/service";
import { Category } from "@/types/Category";
import FilterAccordion from "./FilterAccordion";
import MarketLoadingBlock from "../../Components/MarketLoadingBlock";
import MarketEmptyState from "../../Components/MarketEmptyState";
import PublicProductCard from "../../Components/publicCards/PublicProductCard";
import { mapRankedItemToPublicProductCard } from "../../Components/publicCards/publicProductCardMappers";
import { SHOPPER_LOW_INVENTORY_NOTE } from "../../Components/marketTrustProof";
import CatalogListingLayout from "../../Components/CatalogListingLayout";
import { formatCatalogRange } from "../../Components/CatalogListingToolbar";

interface BookServicesProps {
  services: Service[];
  totalProducts?: number;
  currentPage?: number;
  itemsPerPage?: number;
  selectedCategory?: Category | null;
  loading?: boolean;
  onSubcategorySelect?: (subcategoryId: string) => void;
  onCategorySelect?: (categoryId: string) => void;
  onCategoryFilter?: (category: string, subCategory: string) => void;
  onBadgeSelect?: (badge: string) => void;
  onPriceChange?: (min: number, max: number) => void;
}

type RankedItem = {
  _id: string;
  slug?: string;
  title: string;
  description?: string;
  coverImage?: string;
  variantRatingAvg?: number;
  variantRatingCount?: number;
  totalReviews: number;
  firstEligible?: {
    variantId: string;
    label?: string;
    color?: string;
    images?: string[];
    videos?: string[];
    averageRating?: number;
    totalReviews?: number;
    allowBackorder?: boolean;
    totalStock?: number;
    size?: string;
    price: number;
    salePrice: number | null;
    discountEndDate: string | null;
    onSale: boolean;
    effectivePrice: number;
  };
};

const ProductSevices: React.FC<BookServicesProps> = ({
  services,
  totalProducts = 0,
  currentPage = 1,
  itemsPerPage = 40,
  selectedCategory,
  loading = false,
  onSubcategorySelect,
  onCategorySelect,
  onCategoryFilter,
  onBadgeSelect,
  onPriceChange,
}) => {
  const safeTotalProducts = Number(totalProducts) || 0;
  const startItem = safeTotalProducts === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem =
    safeTotalProducts === 0 ? 0 : Math.min(currentPage * itemsPerPage, safeTotalProducts);

  const filterPanel = (
    <FilterAccordion
      selectedCategory={selectedCategory}
      onFilterChange={(category, subCategory) => {
        onCategoryFilter?.(category, subCategory);
      }}
      onCategorySelect={onCategorySelect}
      onSubcategorySelect={onSubcategorySelect}
      onBadgeSelect={onBadgeSelect}
      onPriceChange={onPriceChange}
    />
  );

  const sortSlot = (
  <>
    <span className="market-result-count">Sort:</span>
    <span className="market-result-count text-market-muted">Featured</span>
  </>
  );

  return (
    <CatalogListingLayout
      filterPanel={filterPanel}
      resultCount={safeTotalProducts}
      summary={formatCatalogRange(startItem, endItem, safeTotalProducts, "products")}
      sortSlot={sortSlot}
    >
      {loading ? (
        <MarketLoadingBlock label="Loading products…" minHeight="min-h-[256px]" />
      ) : services.length === 0 ? (
        <MarketEmptyState
          title="No products found"
          description="Try adjusting your filters or search the marketplace."
          ctaLabel="Search marketplace"
          ctaHref="/search"
        />
      ) : (
        <>
          {services.length <= 3 ? (
            <p className="shopper-low-inventory-note mb-4">{SHOPPER_LOW_INVENTORY_NOTE}</p>
          ) : null}
          <div
            className={`public-grid-listing ${services.length <= 3 ? "public-grid-listing--low-count" : ""}`}
          >
            {services.map((service) => (
              <PublicProductCard
                key={service._id}
                {...mapRankedItemToPublicProductCard(service as RankedItem)}
              />
            ))}
          </div>
        </>
      )}
    </CatalogListingLayout>
  );
};

export default ProductSevices;
