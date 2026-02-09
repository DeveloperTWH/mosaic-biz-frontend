import React, { useState } from "react";
import { Service } from "@/types/service";
import { Category } from "@/types/Category";
import Image from "next/image";
import Link from "next/link";
import FilterAccordion from "./FilterAccordion";
import { Star } from "lucide-react";


interface BookServicesProps {
  services: Service[];
  totalProducts?: number;
  currentPage?: number;
  itemsPerPage?: number;
  selectedCategory?: Category | null;
  loading?: boolean;
  onSubcategorySelect?: (subcategoryId: string) => void;
  onCategoryFilter?: (category: string, subCategory: string) => void;
}

type RankedItem = {
  _id: string;
  slug?: string;
  title: string;
  description?: string;
  coverImage?: string;
  variantRatingAvg?: number;
  variantRatingCount?: number;
  firstEligible?: {
    variantId: string;
    label?: string;
    color?: string; // hex or css color
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
  totalProducts = 72,
  currentPage = 1,
  itemsPerPage = 40,
  selectedCategory,
  loading = false,
  onSubcategorySelect,
  onCategoryFilter
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
        

            
            <div className="space-y-6">

              <FilterAccordion 
                selectedCategory={selectedCategory}
                onFilterChange={(category, subCategory) => {
                  console.log('Category filter clicked:', category, subCategory);
                  onCategoryFilter?.(category, subCategory);
                }}
                onSubcategorySelect={onSubcategorySelect}
              />

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
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A1F71]"></div>
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-600">No Product found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service, index) => (
                  // <div key={service._id} className="overflow-hidden border rounded-lg shadow-sm hover:shadow transition-shadow">
                  //   {/* Compact Image */}
                  //   <div className="relative h-36">
                  //     <Image
                  //       src={service.coverImage || "/Service/19099.png"}
                  //       alt={service.title}
                  //       fill
                  //       className="object-cover"
                  //     />
                  //   </div>
                    
                  //   {/* Compact Content */}
                  //   <div className="p-3">
                  //     {/* Brand Name - Compact */}
                  //     <h3 className="mb-1 text-sm font-bold line-clamp-1">
                  //       {service.title || "Feature Brand Name"}
                  //     </h3>
                      
                  //     {/* Description - More Compact */}
                  //     <p className="mb-1 text-xs text-gray-600 line-clamp-2">
                  //       {service.description || "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Praesent Vitae."}
                  //     </p>
                      
                  //     {/* Address - Smaller */}
                  //     {service.contact?.address && (
                  //       <p className="mb-1 text-xs text-gray-500 line-clamp-1">
                  //         {service.contact.address}
                  //       </p>
                  //     )}
                      
                  //     {/* View Details Link - Compact */}
                  //     <div className="mb-2">
                  //       <Link
                  //         href={`/service/${service.slug}`}
                  //         className="text-xs text-blue-600 hover:underline"
                  //       >
                  //         [View Details]
                  //       </Link>
                  //     </div>
                      
                  //     {/* Earned Badge Section - Compact */}
                  //     <div>
                  //       <p className="text-xs font-medium">Earned Badge:</p>
                  //       <div className="mt-0.5">
                  //         <div className="inline-block w-20 h-4 border border-dashed border-gray-300 rounded text-xs text-transparent">
                  //           Badge
                  //         </div>
                  //       </div>
                  //     </div>
                  //   </div>
                  // </div>
                  <ProductCard key={index} item={service} />
                ))}
              </div>


            </>
          )}
        </div>
      </div>
    </section>
  );
};


const PAGE = 1;
const PAGE_SIZE = 8;
const MAX_PER_VENDOR = 3;
function buildRankedUrl(): string {
  const rankedPath =
    process.env.NEXT_PUBLIC_RANKED_PATH?.replace(/\/$/, "") ||
    "/api/ranked";
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
  const qs = new URLSearchParams({
    page: String(PAGE),
    pageSize: String(PAGE_SIZE),
    maxPerVendor: String(MAX_PER_VENDOR),
  }).toString();
  return base ? `${base}${rankedPath}?${qs}` : `${rankedPath}?${qs}`;
}

function pickTitle(p: RankedItem): string {
  return p.title ?? "Untitled Product";
}
function gatherImages(p: RankedItem): string[] {
  const arr = [
    ...(p.firstEligible?.images || []),
    ...(p.coverImage ? [p.coverImage] : []),
  ];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const src of arr) {
    if (src && !seen.has(src)) {
      seen.add(src);
      out.push(src);
    }
  }
  return out.length ? out : ["/ShopProduct/Aria-SK6-Helmet 1.png"];
}

function pickRatingCount(p: RankedItem): number {
  return Number(p.variantRatingCount ?? 0) || 0;
}

function pickPrice(p: RankedItem) {
  const fe = p.firstEligible;
  if (!fe) {
    return {
      price: 0,
      salePrice: null as number | null,
      effective: 0,
      onSale: false,
      size: undefined as string | undefined,
      label: undefined as string | undefined,
      color: undefined as string | undefined,
    };
  }
  const price = Number(fe.price ?? 0);
  const salePrice = fe.salePrice == null ? null : Number(fe.salePrice);
  const onSale = Boolean(fe.onSale && salePrice != null);
  const effective = onSale ? (salePrice as number) : price;
  return { price, salePrice, effective, onSale, size: fe.size, label: fe.label, color: fe.color };
}
function pickRating(p: RankedItem): number {
  const raw = p.variantRatingAvg ?? 0;
  const n = typeof raw === "number" ? raw : Number(raw) || 0;
  return Math.max(0, Math.min(5, n));
}


function ProductCard({ item }: { item: RankedItem }) {
  const href = `/product/${item._id}`;
  const title = pickTitle(item);
  const description = item.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae.";
  const images = gatherImages(item);
  const { price, effective, onSale } = pickPrice(item);
  const rating = pickRating(item);
  const ratingCount = pickRatingCount(item);
  const reviewCount = 5;

  const fullStars = Math.floor(rating);
  const fractional = rating % 1;
  const hasHalfStar = fractional >= 0.25 && fractional < 0.75;

  return (
    <div className="bg-green p-3  border-2 border-[#D9D9D9] w-[300px] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-[420px]">
      {/* Product Image - Fixed Height */}
      <div className="relative h-60 overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={images[0]}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        
        {onSale && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
              SALE
            </span>
          </div>
        )}
      </div>

      {/* Product Info - Flex grow to fill space */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title - Fixed height */}
        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight line-clamp-1 h-9 overflow-hidden font-poppins">
          {title}
        </h3>

        {/* Description - Fixed height */}
        <p className="mb-3 text-sm text-gray-600 leading-relaxed line-clamp-2 h-10 overflow-hidden font-montserrat">
          {description}
        </p>

        {/* Rating and Reviews - Fixed height */}
        <div className="flex-shrink-0">
          <div className="flex items-center mb-1">

            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < fullStars ? "#FBBF24" : i === fullStars && hasHalfStar ? "#FBBF24" : "#E5E7EB"}
                  stroke={i < fullStars ? "#FBBF24" : i === fullStars && hasHalfStar ? "#FBBF24" : "#D1D5DB"}
                  className={i < fullStars || (i === fullStars && hasHalfStar) ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            {/* <span className="ml-2 text-sm font-semibold text-gray-700">
              {rating.toFixed(1)}
            </span> */}
            <p className="text-xs ml-2 text-gray-500 font-poppins">
            {ratingCount} Ratings And {reviewCount} Reviews
          </p>
          </div>
          {/* <p className="text-xs text-gray-500">
            {ratingCount} Ratings And {reviewCount} Reviews
          </p> */}
        </div>

        {/* Price - Fixed height */}
        <div className="flex-shrink-0">
          {onSale ? (
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-red-600">
                ${effective.toFixed(2)}
              </span>
              <span className="text-base text-gray-500 line-through">
                ${price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
          )}
        </div>

        {/* View Product Button - Fixed at bottom */}
        {/* <div className="mt-auto pt-4">
          <Link
            href={href}
            className="block w-full py-2.5 text-center text-white font-semibold bg-custom-orange rounded-lg hover:bg-orange-600 transition-colors"
          >
            View Product
          </Link>
        </div> */}
      </div>
    </div>


  );
}

export default ProductSevices;