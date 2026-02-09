import React, { useState } from "react";
import { Service } from "@/types/service";
import { Category } from "@/types/Category";
import Image from "next/image";
import Link from "next/link";
import FilterAccordion from "./FilterAccordion";
import ProductCard from "./ProductCard";

interface BookServicesProps {
  services: Service[];
  totalProducts?: number;
  currentPage?: number;
  itemsPerPage?: number;
  selectedCategory?: Category | null;
  loading?: boolean;
  onSubcategorySelect?: (subcategoryId: string) => void;
}

const BookServices: React.FC<BookServicesProps> = ({ 
  services, 
  totalProducts = 72,
  currentPage = 1,
  itemsPerPage = 40,
  selectedCategory,
  loading = false,
  onSubcategorySelect
}) => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    subCategory: "",
    badge: ""
  });

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

const handleFilterChange = (filterType: keyof typeof selectedFilters, value: string) => {
  setSelectedFilters(prev => ({
    ...prev,
    [filterType]: prev[filterType] === value ? "" : value
  }));
};

  return (
    <section className="px-4 py-8 mx-auto max-w-7xl sm:px-6">
       
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left Sidebar - Filters */}
        <div className="lg:w-1/4">
          <div className="space-y-6">
            <FilterAccordion 
              selectedCategory={selectedCategory}
              onFilterChange={(category, subCategory) => {
                console.log('Service filter clicked:', category, subCategory);
              }}
              onSubcategorySelect={onSubcategorySelect}
            />
          </div>
        </div>

        {/* Right Content - Services Grid */}
        <div className="lg:w-3/4">
    
          {/* Products Count - Compact */}
          <div className="flex mb-4 flex-row justify-between">
   
            <p className="text-sm text-gray-600">
              (Showing {startItem} – {endItem} Products Of {totalProducts} Products)
            </p>

            {/* Sort By Section - Compact */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Sort By:</span>
              <select className="px-3 py-1 text-sm border rounded cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option>Default</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
                <option>Newest</option>
              </select>
            </div>
              
          </div>

          {/* Services Grid - Compact Cards */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A1F71]"></div>
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-600">No services found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <ProductCard 
                  key={service._id}
                  title={service.title}
                  image={service.coverImage}
                  description={service.description}
                  rating={service.averageRating}
                  totalRatings={service.averageRating}
                  reviews={service.totalReviews}
                  />
                ))}
              </div> 

            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookServices;