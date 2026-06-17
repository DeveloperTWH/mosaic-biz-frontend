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

        <div className="lg:w-3/4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-market-muted">
              (Showing {startItem} - {endItem} Service Of {totalProducts} Services)
            </p>

            <div className="flex items-center gap-2">
              <span className="text-sm text-market-muted">Sort By:</span>
              <select className="market-input w-auto cursor-pointer px-3 py-1 text-sm">
                <option>Default</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-market-gold"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="market-card p-8 text-center">
              <p className="text-market-muted">No services found.</p>
            </div>
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
