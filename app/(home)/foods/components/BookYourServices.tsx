import React, { useState } from "react";
import { Service } from "@/types/service";
import { Category } from "@/types/Category";
import Image from "next/image";
import Link from "next/link";
import FilterAccordion from "./FilterAccordion";
import ProductCard from "./ProductCard";

const demoData = [
  {
    "title": "Restaurants",
    "description": "Professional house and apartment cleaning services.",
    "coverImage": "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    "category": "Restaurants",
    "subcategory": "Cleaning Services"
  },
  {
    "title": "Home Grocery",
    "description": "Expert plumbing repair and installation services.",
    "coverImage": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "category": "Home Grocery",
    "subcategory": "Plumbing"
  },
  {
    "title": "Electrical Installation",
    "description": "Safe and reliable electrical wiring and repair.",
    "coverImage": "https://images.unsplash.com/photo-1621905251918-48416bd8575a",
    "category": "Others",
    "subcategory": "Electrical Services"
  },
  {
    "title": "Restaurants",
    "description": "Professional haircut and styling for men and women.",
    "coverImage": "https://images.unsplash.com/photo-1595475884562-073c30d45670",
    "category": "Restaurants",
    "subcategory": "Hair & Barber Services"
  },
  {
    "title": "Relaxation Massage",
    "description": "Full-body massage therapy for stress relief.",
    "coverImage": "https://images.unsplash.com/photo-1600334129128-685c5582fd35",
    "category": "Restaurants",
    "subcategory": "Massage Therapy"
  },
  {
    "title": "Accounting & Tax Filing",
    "description": "Complete bookkeeping and tax filing services.",
    "coverImage": "https://images.unsplash.com/photo-1554224154-22dec7ec8818",
    "category": "Grocery",
    "subcategory": "Accounting & Bookkeeping"
  },
  {
    "title": "Website Development",
    "description": "Custom website and web application development.",
    "coverImage": "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "category": "Grocery",
    "subcategory": "Web & App Development"
  },
  {
    "title": "SEO & Digital Marketing",
    "description": "Improve your online presence and website traffic.",
    "coverImage": "https://images.unsplash.com/photo-1533750349088-cd871a92f312",
    "category": "Others",
    "subcategory": "Digital Marketing & SEO"
  },
  {
    "title": "Event Planning Service",
    "description": "Complete planning and coordination for events.",
    "coverImage": "https://images.unsplash.com/photo-1515169067865-5387ec356754",
    "category": "Others",
    "subcategory": "Event Planning & Coordination"
  },
  {
    "title": "Car Maintenance Service",
    "description": "Regular car servicing and mechanical repairs.",
    "coverImage": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e",
    "category": "Others",
    "subcategory": "Auto Repair & Maintenance"
  }
]

const demoRanked = demoData.map((d, i) => ({
  image: d.coverImage,
  title: d.title,
  description: d.description,
  coverImage : d.coverImage,
  averageRating: 4.2,
  totalRatings: 10,
  reviews: 10,
  category: d.category,
  subcategory: d.subcategory,
}));

interface BookServicesProps {
  services: Service[];
  totalProducts?: number;
  currentPage?: number;
  itemsPerPage?: number;
  selectedCategory?: Category | null;
}

const BookServices: React.FC<BookServicesProps> = ({ 
  services, 
  totalProducts = 72,
  currentPage = 1,
  itemsPerPage = 40,
  selectedCategory
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

  const [categoryFilter, setCategoryFilter] = useState("")

  return (
    <section className="px-4 py-8 mx-auto max-w-7xl sm:px-6">
       
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left Sidebar - Filters */}
        <div className="lg:w-1/4">
          <div className="space-y-6">
            <FilterAccordion 
              selectedCategory={selectedCategory}
              onFilterChange={(category, subCategory) => {
                console.log('Food filter clicked:', category, subCategory);
                setCategoryFilter(category);
              }} 
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
          {services.length === 0 ? (
            <p className="text-center text-gray-600">No services found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <div key={service._id}></div>
                ))}

                {demoRanked.filter((data)=> data.category?.includes(categoryFilter) || data.subcategory?.includes(categoryFilter)).map((item, index) => (
                   <ProductCard
                    key={index}
                    image={item.coverImage || "/Service/19099.png"}
                    title={item.title}
                    description={item.description}
                    rating={item.averageRating ?? 0}
                    totalRatings={item.totalRatings ?? 0}
                    reviews={item.reviews ?? 0}
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