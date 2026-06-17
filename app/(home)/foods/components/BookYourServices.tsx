import React, { useState } from "react";
import { Service } from "@/types/service";
import { Category } from "@/types/Category";
import FilterAccordion from "./FilterAccordion";
import ProductCard from "./ProductCard";

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
  const endItem = totalProducts > 0 ? Math.min(startItem + services.length - 1, totalProducts) : 0;

  const handleFilterChange = (filterType: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? "" : value,
    }));
  };

  return (
    <section className="px-4 py-8 mx-auto max-w-7xl sm:px-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <div className="space-y-6">
            <FilterAccordion
              selectedCategory={selectedCategory}
              onFilterChange={(category, subCategory) => {
                console.log("Food filter clicked:", category, subCategory);
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

        <div className="lg:w-3/4">
          <div className="flex mb-4 flex-row justify-between">
            <p className="market-result-count">
              (Showing {startItem} - {endItem} foods Of {totalProducts} foods)
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
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-market-gold"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="market-empty-state">
              <p className="market-empty-state-title">No foods found</p>
              <p className="mt-2 text-sm text-market-muted">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ProductCard
                  key={service._id}
                  foodId={service._id}
                  image={service.coverImage}
                  businessName={service.businessId?.businessName || service.title}
                  businessDescription={service.businessId?.description || service.description || "No description available"}
                  badge={service.businessId?.badge || (service as any).badge}
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
