import React, { useState } from "react";
import { Service } from "@/types/service";
import { Category } from "@/types/Category";
import Image from "next/image";
import Link from "next/link";
import FilterAccordion from "./FilterAccordion";
import { Star } from "lucide-react";
import MarketImage from "../../Components/MarketImage";
import MarketLoadingBlock from "../../Components/MarketLoadingBlock";
import MarketEmptyState from "../../Components/MarketEmptyState";


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
  totalReviews : number;
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
  totalProducts = 0,
  currentPage = 1,
  itemsPerPage = 40,
  selectedCategory,
  loading = false,
  onSubcategorySelect,
  onCategorySelect,
  onCategoryFilter,
  onBadgeSelect,
  onPriceChange
}) => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    subCategory: "",
    badge: ""
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const safeTotalProducts = Number(totalProducts) || 0;
  const startItem = safeTotalProducts === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = safeTotalProducts === 0 ? 0 : Math.min(currentPage * itemsPerPage, safeTotalProducts);

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
    <section className="container-page py-8">
       
      <div className="flex flex-col gap-6 lg:flex-row">

        {/* Left Sidebar - Filters */}
        <div className="w-full lg:w-[300px] lg:flex-none">
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
                  console.log('Category filter clicked:', category, subCategory);
                  onCategoryFilter?.(category, subCategory);
                }}
                onCategorySelect={onCategorySelect}
                onSubcategorySelect={onSubcategorySelect}
                onBadgeSelect={onBadgeSelect}
                onPriceChange={onPriceChange}
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
        </div>

        {/* Right Content - Services Grid */}
        <div className="w-full min-w-0 flex-1">
    
          {/* Products Count - Compact */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
   
            <p className="market-result-count">
              (Showing {startItem} – {endItem} Products Of {safeTotalProducts} Products)
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

          {/* Services Grid - Compact Cards */}
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

function pickRatingCount(p: any): number {
  return Number(p.averageRating ?? 0) || 0;
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
function pickRating(p: any): number {
  const raw = p.averageRating ?? 0;
  const n = typeof raw === "number" ? raw : Number(raw) || 0;
  return Math.max(0, Math.min(5, n));
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

function pickBadgeValue(item: any): string | null {
  const rawBadge =
    item?.badge ??
    item?.businessDetails?.badge ??
    item?.businessId?.badge ??
    null;

  if (typeof rawBadge !== "string") return null;
  const trimmed = rawBadge.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function buildBadgeImagePath(badge: string): string {
  const compact = badge.toLowerCase().replace(/[\s_-]+/g, "");
  const knownBadges: Record<string, string> = {
    silver: "silver",
    gold: "gold",
    platinum: "platinum",
    diamond: "diamond",
  };

  if (knownBadges[compact]) {
    return `/badge/${knownBadges[compact]}.png`;
  }

  return `/badge/${badge.replace(/\s+/g, "-").toLowerCase()}.png`;
}

function ProductCard({ item }: { item: RankedItem }) {

  
  const href = `/product/${item._id}`;
  const title = pickTitle(item);
  const description = item.description ?? "";
  const strippedDescription = stripHtml(description);
  const trimmedDescription =
    strippedDescription.length > 100 ? `${strippedDescription.slice(0, 100).trimEnd()}...` : strippedDescription;
  const images = gatherImages(item);
  const { price: variantPrice, effective, onSale } = pickPrice(item);
  const rating = pickRating(item);
  const ratingCount = pickRatingCount(item);
  const reviewCount = item.totalReviews || 0;
  const badge = pickBadgeValue(item as any);
  const badgeImagePath = badge ? buildBadgeImagePath(badge) : null;
  
  // Get price from item.price or fallback to variant price
  let displayPrice = 0;
  if ((item as any).price) {
    const priceData = (item as any).price;
    if (priceData.$numberDecimal !== undefined) {
      displayPrice = parseFloat(priceData.$numberDecimal);
    } else if (typeof priceData === 'number') {
      displayPrice = priceData;
    } else if (typeof priceData === 'string') {
      displayPrice = parseFloat(priceData);
    }
  } else {
    displayPrice = variantPrice;
  }

  const fullStars = Math.floor(rating);
  const fractional = rating % 1;
  const hasHalfStar = fractional >= 0.25 && fractional < 0.75;

  return (

    <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-market-bg rounded-2xl">
    <div className="market-card flex h-[480px] w-full max-w-[300px] cursor-pointer flex-col overflow-hidden p-2">
      <div className="market-card-media relative aspect-square w-full flex-shrink-0">
        <MarketImage src={images[0]} alt={title} aspect="square" objectFit="contain" />

        {onSale && (
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
              SALE
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="market-card-title line-clamp-2 h-[42px]">
          {title}
        </h3>

        <p className="market-card-desc mb-2 h-[40px] overflow-hidden">
          {trimmedDescription || "\u00a0"}
        </p>

        {(rating > 0 || reviewCount > 0) && (
        <div className="min-h-[20px] flex-shrink-0">
          <div className="mb-1 flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < fullStars ? "#E2B84B" : i === fullStars && hasHalfStar ? "#E2B84B" : "transparent"}
                  stroke={i < fullStars || (i === fullStars && hasHalfStar) ? "#E2B84B" : "#A9A2D8"}
                  className={i < fullStars || (i === fullStars && hasHalfStar) ? "text-market-gold" : "text-market-muted/40"}
                />
              ))}
            </div>
            <p className="ml-2 font-poppins text-[10px] leading-tight text-market-muted">
              {ratingCount} Ratings And {reviewCount} Reviews
            </p>
          </div>
        </div>
        )}

        <div className="mt-auto flex-shrink-0">
  {onSale ? (
    <div className="flex flex-col leading-tight">
      <span className="text-xs text-market-muted">
        Starting from
      </span>
      <div className="flex items-center gap-2">
        <span className="market-card-price-sale">
          ${effective.toFixed(2)}
        </span>
        <span className="text-sm text-market-muted line-through">
          ${displayPrice.toFixed(2)}
        </span>
      </div>
    </div>
  ) : (
    <div className="flex flex-col leading-tight">
      <span className="text-xs text-market-muted">
        Starting from
      </span>
      <span className="market-card-price">
        ${displayPrice.toFixed(2)}
      </span>
    </div>
  )}
</div>

        <div className="market-card-footer mt-3">
  <span className="text-sm font-semibold text-market-muted">
    Earned Badge:
  </span>

  {badge ? (
<img
  src={badgeImagePath || "/badge.png"}
  alt={`${badge} badge`}
  className="h-12 object-contain"
  onError={(e) => {
    const img = e.currentTarget;
    if (img.src.endsWith("/badge.png")) return;
    img.src = "/badge.png";
  }}
/>
  ) : (
    <div className="h-14 w-[90px]" />
  )}
</div>

      </div>
    </div>
    </Link>
  );
}

export default ProductSevices;


