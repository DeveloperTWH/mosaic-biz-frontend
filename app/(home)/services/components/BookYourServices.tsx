import React, { useState } from "react";
import { Service } from "@/types/service";
import Image from "next/image";
import Link from "next/link";
import FilterAccordion from "./FilterAccordion";

interface BookServicesProps {
  services: Service[];
  totalProducts?: number;
  currentPage?: number;
  itemsPerPage?: number;
}

const BookServices: React.FC<BookServicesProps> = ({ 
  services, 
  totalProducts = 72,
  currentPage = 1,
  itemsPerPage = 40 
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


  const filterOptions = {
    categories: ["Hair Salon", "Spa", "Nail Salon", "Barber", "Massage"],
    subCategories: ["Haircut", "Coloring", "Facial", "Manicure", "Pedicure"],
    badges: ["Premium", "Verified", "Top Rated", "Eco-Friendly", "Luxury"]
  };

  return (
    <section className="px-4 py-8 mx-auto max-w-7xl sm:px-6">
       
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left Sidebar - Filters with Orange Background */}
        <div className="lg:w-1/4">
        
          {/* <div className="p-5 rounded-lg bg-orange-50"> */}
            {/* <h2 className="mb-5 text-xl font-bold text-gray-800"># Filter</h2> */}
            
            <div className="space-y-6">
              {/* Category Filter */}
              {/* <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">Select Category</h3>
                <div className="w-full h-0.5 bg-gray-300 mb-3"></div>
                <div className="space-y-1">
                  {filterOptions.categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleFilterChange('category', category)}
                      className={`w-full px-3 py-2 text-sm text-left rounded transition-colors ${
                        selectedFilters.category === category 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div> */}
              <FilterAccordion/>

              {/* Sub-Category Filter */}
              {/* <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">Select Sub - Category</h3>
                <div className="w-full h-0.5 bg-gray-300 mb-3"></div>
                <div className="space-y-1">
                  {filterOptions.subCategories.map((subCategory) => (
                    <button
                      key={subCategory}
                      onClick={() => handleFilterChange('subCategory', subCategory)}
                      className={`w-full px-3 py-2 text-sm text-left rounded transition-colors ${
                        selectedFilters.subCategory === subCategory 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      {subCategory}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Badge Filter */}
              {/* <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">Select Badge</h3>
                <div className="w-full h-0.5 bg-gray-300 mb-3"></div>
                <div className="space-y-1">
                  {filterOptions.badges.map((badge) => (
                    <button
                      key={badge}
                      onClick={() => handleFilterChange('badge', badge)}
                      className={`w-full px-3 py-2 text-sm text-left rounded transition-colors ${
                        selectedFilters.badge === badge 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div> */}
            {/* </div> */}
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
          {services.length === 0 ? (
            <p className="text-center text-gray-600">No services found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <div key={service._id} className="overflow-hidden border rounded-lg shadow-sm hover:shadow transition-shadow">
                    {/* Compact Image */}
                    <div className="relative h-36">
                      <Image
                        src={service.coverImage || "/Service/19099.png"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Compact Content */}
                    <div className="p-3">
                      {/* Brand Name - Compact */}
                      <h3 className="mb-1 text-sm font-bold line-clamp-1">
                        {service.title || "Feature Brand Name"}
                      </h3>
                      
                      {/* Description - More Compact */}
                      <p className="mb-1 text-xs text-gray-600 line-clamp-2">
                        {service.description || "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Praesent Vitae."}
                      </p>
                      
                      {/* Address - Smaller */}
                      {service.contact?.address && (
                        <p className="mb-1 text-xs text-gray-500 line-clamp-1">
                          {service.contact.address}
                        </p>
                      )}
                      
                      {/* View Details Link - Compact */}
                      <div className="mb-2">
                        <Link
                          href={`/service/${service.slug}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          [View Details]
                        </Link>
                      </div>
                      
                      {/* Earned Badge Section - Compact */}
                      <div>
                        <p className="text-xs font-medium">Earned Badge:</p>
                        <div className="mt-0.5">
                          <div className="inline-block w-20 h-4 border border-dashed border-gray-300 rounded text-xs text-transparent">
                            Badge
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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