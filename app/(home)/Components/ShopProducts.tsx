"use client";

import React from "react";
import { Star, StarHalf, RotateCcw, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getFeaturedProducts, FeaturedProduct } from "@/lib/api/featured-products";

/* ---------- types ---------- */
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

type RankedResponse = {
  items: RankedItem[];
  total: number;
  page: number;
  pageSize: number;
  mix: Record<string, number>;
  debug?: unknown;
};

/* ---------- config ---------- */
const PAGE = 1;
const PAGE_SIZE = 8;
const MAX_PER_VENDOR = 3;

function buildRankedUrl(searchFilters?: { businessType: string; location: string; minority: string }): string {
  const rankedPath =
    process.env.NEXT_PUBLIC_RANKED_PATH?.replace(/\/$/, "") ||
    "/api/ranked";
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
  const qs = new URLSearchParams({
    page: String(PAGE),
    pageSize: String(PAGE_SIZE),
    maxPerVendor: String(MAX_PER_VENDOR),
  });
  
  // Add search filters to query params
  if (searchFilters?.businessType) qs.set("businessType", searchFilters.businessType);
  if (searchFilters?.location) qs.set("location", searchFilters.location);
  if (searchFilters?.minority) qs.set("minority", searchFilters.minority);
  
  return base ? `${base}${rankedPath}?${qs.toString()}` : `${rankedPath}?${qs.toString()}`;
}

/* ---------- helpers ---------- */
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

function pickTitle(p: RankedItem): string {
  return p.title ?? "Untitled Product";
}

function pickRating(p: RankedItem): number {
  const raw = p.variantRatingAvg ?? 0;
  const n = typeof raw === "number" ? raw : Number(raw) || 0;
  return Math.max(0, Math.min(5, n));
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

function isAbortError(e: any) {
  return e?.name === "AbortError" || e?.code === 20 || /aborted/i.test(e?.message || "");
}

/* ---------- data hook for featured products ---------- */
function useFeaturedProducts(searchFilters?: { businessType: string; location: string; minority: string }) {
  const [items, setItems] = React.useState<FeaturedProduct[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const mountedRef = React.useRef(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeaturedProducts(1, 12);
      if (!mountedRef.current) return;
      setItems(data.products); // Show all products
    } catch (e: any) {
      console.error("Featured products fetch error:", e);
      if (!mountedRef.current) return;
      setError(e?.message || "Failed to load featured products.");
      setItems((prev) => prev ?? []);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    mountedRef.current = true;
    load();
    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  return { items, error, loading, reload: load };
}

/* ---------- Filter Component ---------- */

function FilterSection({ onSearch }: { onSearch: (filters: { businessType: string; location: string; minority: string }) => void }) {
  const [businessType, setBusinessType] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [minority, setMinority] = React.useState("");

  const handleSearch = () => {
    console.log('Search clicked with filters:', { businessType, location, minority });
    onSearch({ businessType, location, minority });
  };

  return (
    <div className="w-full bg-[#1A1F71] py-6 text-center text-white pb-10">
      <div className="max-w-[1500px]  mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col  md:flex-row md:items-end gap-4 md:gap-6">
        <div className="flex-[3] min-w-0 ">
            <label className="block text-[14px] text-left  font-medium text-white font-poppins">
              Filter By Business Type
            </label>
            <input
              type="text"
              placeholder="Type Here"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full h-10 px-4 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-custom-orange text-xs font-poppins"
            />
          </div>

          <div className="flex-[1] min-w-0">
            <label className="block   text-left  text-[14px] font-medium text-white font-poppins">
              Filter By Location
            </label>
            <div className="relative">
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 px-4 text-gray-700 bg-white text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-custom-orange text-[#5F5F5F] font-poppins">
                <option value="">Choose Location</option>
                <option value="ny">New York City</option>
                {/* <option value="gc">Grand Canyon</option>
                <option value="sf"> San Francisco</option>
                <option value="ch">Chicago</option> */}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-full h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <label className="block text-left   text-[14px] font-medium text-white font-poppins">
              Filter By Minority
            </label>
            <div className="relative">
              <select 
                value={minority}
                onChange={(e) => setMinority(e.target.value)}
                className="w-full h-10 px-4 text-gray-700 bg-white  text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-custom-orange text-[#5F5F5F] font-poppins">
                <option value="">Choose Minority</option>
                <option value="african-american">African-American</option>
                <option value="asian">Asian</option>
                <option value="latinx">LatinX</option>
                <option value="woman">Woman</option>
                 <option value="disabled-veteran">Disabled Veteran</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Yellow Search Button */}
          <div className="flex-1 min-w-0">
            <label className="block mb-2 text-sm font-medium text-white">
              {/* Search Here */}
            </label>
            <button 
              onClick={handleSearch}
              className="w-full h-10 text-sm text-white font-xs text-gray-800 bg-[#C7A040] hover:bg-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-600 flex items-center justify-center gap-2 font-montserrat">
              Search Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



/* ---------- main component ---------- */
export default function ShopProducts() {
  const [searchFilters, setSearchFilters] = React.useState({ businessType: "", location: "", minority: "" });
  const { items, error, loading, reload } = useFeaturedProducts(searchFilters);
  const [swiperRef, setSwiperRef] = React.useState<any>(null);

  const prevButton = React.useRef(null);
  const nextButton = React.useRef(null);

  const handleSearch = (filters: { businessType: string; location: string; minority: string }) => {
    console.log('Received search filters:', filters);
    setSearchFilters(filters);
    // Force reload will happen automatically due to useEffect dependency
  };

  return (
    <>
      <FilterSection onSearch={handleSearch} />
      
      <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-3 text-2xl uppercase sm:text-3xl md:text-4xl font-bold text-gray-900 font-poppins">
            Featured Products
          </h2>
          <div className="flex flex-col items-center justify-center mb-4">
            <hr className="w-20 h-1 bg-green-900" />
            <hr className="w-20 h-1 bg-green-900" />
          </div>
          <p className="px-2 mb-8 text-sm text-gray-600 sm:text-base sm:px-0 font-montserrat">
            See what’s trending, what’s new, and what our community is loving right now. Highlighted featured products from verified vendors you can trust
          </p>
        </div>

        {/* Products Carousel Section */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Searching products...</p>
          </div>
        )}
        {items === null || (loading && items === null) ? (
          <SkeletonCarousel />
        ) : error ? (
          <ErrorBlock error={error} onRetry={reload} />
        ) : items.length === 0 ? (
          <div className="text-center text-gray-600 py-8">No products to display.</div>
        ) : (
          <div className="relative">
            {/* Navigation Buttons */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 z-10">
              <button
                ref={prevButton}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 z-10">
              <button
                ref={nextButton}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Products Carousel */}
            <Swiper
              onSwiper={setSwiperRef}
              modules={[Navigation]}
              spaceBetween={15}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 15,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 15,
                },
              }}
              navigation={{
                prevEl: prevButton.current,
                nextEl: nextButton.current,
              }}
              onBeforeInit={(swiper) => {
                if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                  swiper.params.navigation.prevEl = prevButton.current;
                  swiper.params.navigation.nextEl = nextButton.current;
                }
              }}
              className="py-4"
            >
              {items.map((p) => (
                <SwiperSlide key={p._id} className="py-4 w-500 h-auto">
                  <FeaturedProductCard item={p} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Show All Products Button */}
        <div className="flex justify-start mt-12">
          <Link
            href="/products"
            className="inline-block px-12 py-3 text-sm font-semibold text-white  bg-[#1A1F71] hover:bg-blue-600 transition-colors font-montserrat"
          >
            Show All Products
          </Link>
        </div>

        {/* Bottom Decorative Line */}
        <div className="flex justify-center mt-12">
          <hr className="h-[2px] w-1/2 bg-custom-blue" />
        </div>
      </section>
    </>
  );
}

/* ---------- Featured Product Card ---------- */
function FeaturedProductCard({ item }: { item: FeaturedProduct }) {
  const href = `/product/${item._id}`;

  return (
    <div className="bg-white p-4 border-2 border-[#D9D9D9] w-[300px] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-[420px]">
      {/* Product Image - Fixed Height */}
      <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0 mb-3">
        <img
          src={item.coverImage}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-bold text-white bg-yellow-600 rounded-full">
            FEATURED
          </span>
        </div>
      </div>

      {/* Product Info - Flex grow to fill space */}
      <div className="flex flex-col flex-grow">
        {/* Title - Fixed height */}
        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight line-clamp-2 h-12 overflow-hidden font-poppins mb-2">
          {item.title}
        </h3>

        {/* Description - Fixed height */}
        <p className="mb-3 text-sm text-gray-600 leading-relaxed line-clamp-2 h-10 overflow-hidden font-montserrat">
          {item.description}
        </p>

        {/* Rating */}
        <div className="flex-shrink-0 mb-3">
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill="#FBBF24"
                  stroke="#FBBF24"
                  className="text-yellow-400"
                />
              ))}
            </div>
            <p className="text-xs ml-2 text-gray-500 font-poppins">
              Featured Product
            </p>
          </div>
        </div>

        {/* Price - Fixed at bottom */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="text-2xl font-bold text-green-600 text-center">
            ${item.price.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Skeleton Carousel ---------- */
function SkeletonCarousel() {
  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 z-10">
        <button className="w-12 h-12 bg-gray-200 rounded-full"></button>
      </div>
      
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 z-10">
        <button className="w-12 h-12 bg-gray-200 rounded-full"></button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-[480px] animate-pulse">
            <div className="h-48 bg-gray-200 flex-shrink-0"></div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="h-5 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-5 bg-gray-200 rounded mb-4 w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded mt-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Error Block ---------- */
function ErrorBlock({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <div className="text-red-600">
        We're having trouble loading products: {error}
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-custom-orange hover:bg-orange-600"
      >
        <RotateCcw size={16} /> Retry
      </button>
    </div>
  );
}