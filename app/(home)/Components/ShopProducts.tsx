"use client";

import React from "react";
import { Star, StarHalf, RotateCcw, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getFeaturedProducts, FeaturedProduct } from "@/lib/api/featured-products";
import PublicSearchFilterBar from "./PublicSearchFilterBar";
import { buildSearchPageUrl, DEFAULT_PUBLIC_SEARCH_FILTERS, PublicSearchFilters } from "./publicSearch";

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

function FilterSection({ onSearch }: { onSearch: (filters: PublicSearchFilters) => void }) {
  const [filters, setFilters] = React.useState(DEFAULT_PUBLIC_SEARCH_FILTERS);

  return (
    <PublicSearchFilterBar filters={filters} onChange={setFilters} onSubmit={() => onSearch(filters)} />
  );
}



/* ---------- main component ---------- */
export default function ShopProducts() {
  const router = useRouter();
  const { items, error, loading, reload } = useFeaturedProducts();
  const [swiperRef, setSwiperRef] = React.useState<any>(null);

  const prevButton = React.useRef(null);
  const nextButton = React.useRef(null);

  const handleSearch = (filters: PublicSearchFilters) => {
    router.push(buildSearchPageUrl(filters));
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
<p
  className="px-2 mb-8 text-gray-600 sm:px-0 sm:text-base"
  style={{
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '24px',
    letterSpacing: '0%',
    textAlign: 'center'
  }}
>
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
              spaceBetween={22}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 22,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 22,
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
                <SwiperSlide key={p._id} className="py-4 h-auto flex justify-center">
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
  const description = item.description ?? "";
  const trimmedDescription =
    description.length > 100 ? `${description.slice(0, 100).trimEnd()}...` : description;

  return (
    <Link
      href={`/product/${item._id}`}
      className="block bg-green p-2 border-2 border-[#D9D9D9] w-full max-w-[300px] h-[460px] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      <div className="flex h-full flex-col">
        {/* Product Image - Square (1:1 like 1080x1080) */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={item.coverImage}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
          />
          
          {/* <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-bold text-white bg-yellow-600 rounded-full">
              FEATURED
            </span>
          </div> */}
        </div>

        {/* Product Info - Flex grow to fill space */}
        <div className="p-3 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight leading-snug font-poppins line-clamp-2 h-[42px]">
            {item.title}
          </h3>

          {/* Description */}
          <p className="mb-2 text-xs text-gray-600 leading-5 font-montserrat h-[40px] overflow-hidden">
            {trimmedDescription || "\u00a0"}
          </p>

          {/* Rating */}
          <div className="flex-shrink-0 min-h-[20px]">
            <div className="flex items-center mb-1">
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
              <p className="text-[10px] ml-2 text-gray-500 font-poppins leading-tight">
                Featured Product
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex-shrink-0 mt-auto">
            <span className="text-base font-bold text-gray-900">
              ${item.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
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

