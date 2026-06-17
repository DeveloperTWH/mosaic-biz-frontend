"use client";

import React from "react";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
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

/* ---------- main component ---------- */
export default function ShopProducts() {
  const { items, error, loading, reload } = useFeaturedProducts();
  const [swiperRef, setSwiperRef] = React.useState<any>(null);

  const prevButton = React.useRef(null);
  const nextButton = React.useRef(null);

  return (
    <section className="mx-auto w-full max-w-[1400px] bg-market-bg px-4 py-12 sm:px-6 lg:px-12">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="market-section-heading">Featured Products</h2>
          <div className="market-section-divider" />
          <p className="mx-auto mt-4 max-w-2xl font-montserrat text-sm text-market-muted sm:text-base">
            See what is trending from verified vendors. Live listings powered by our marketplace API.
          </p>
        </div>

        {/* Products Carousel Section */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-market-gold"></div>
            <p className="mt-2 text-market-muted">Searching products...</p>
          </div>
        )}
        {items === null || (loading && items === null) ? (
          <SkeletonCarousel />
        ) : error ? (
          <ErrorBlock error={error} onRetry={reload} />
        ) : items.length === 0 ? (
          <div className="market-card rounded-xl px-6 py-10 text-center">
            <p className="font-semibold text-market-text">Featured products coming soon</p>
            <p className="mt-2 text-sm text-market-muted">
              Check back shortly or browse the full marketplace.
            </p>
            <Link
              href="/products"
              className="market-btn-secondary mt-4 inline-block px-6 py-2 text-sm normal-case"
            >
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Buttons */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 z-10">
              <button
                ref={prevButton}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-market-elevated text-market-text shadow-market-card transition hover:bg-market-surface"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 z-10">
              <button
                ref={nextButton}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-market-elevated text-market-text shadow-market-card transition hover:bg-market-surface"
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

        <div className="mt-12 flex justify-center">
          <Link
            href="/products"
            className="market-btn-secondary inline-block px-12 py-3 font-montserrat text-sm normal-case"
          >
            Show all products
          </Link>
        </div>
      </section>
  );
}

/* ---------- Featured Product Card ---------- */
function FeaturedProductCard({ item }: { item: FeaturedProduct }) {
  const title = item.title?.trim() || "Untitled product";
  const coverImage = item.coverImage?.trim() || "/ShopProduct/Aria-SK6-Helmet 1.png";
  const price =
    typeof item.price === "number" && Number.isFinite(item.price)
      ? item.price
      : null;
  const description = item.description ?? "";
  const strippedDescription = stripHtml(description);
  const trimmedDescription =
    strippedDescription.length > 100
      ? `${strippedDescription.slice(0, 100).trimEnd()}...`
      : strippedDescription;

  return (
    <Link
      href={`/product/${item._id}`}
      className="market-card block h-[460px] w-full max-w-[300px] overflow-hidden hover:-translate-y-1"
    >
      <div className="flex h-full flex-col">
        {/* Product Image - Square (1:1 like 1080x1080) */}
        <div className="relative aspect-square w-full flex-shrink-0 overflow-hidden bg-market-elevated">
          <img
            src={coverImage}
            alt={title}
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
          <h3 className="line-clamp-2 h-[42px] font-poppins text-base font-bold uppercase leading-snug tracking-tight text-market-text">
            {title}
          </h3>

          <p className="mb-2 h-[40px] overflow-hidden font-montserrat text-xs leading-5 text-market-muted">
            {trimmedDescription || "\u00a0"}
          </p>

          <p className="mb-2 font-poppins text-[10px] uppercase tracking-wide text-market-teal">
            Featured Product
          </p>

          <div className="mt-auto flex-shrink-0">
            <span className="text-base font-bold text-market-gold">
              {price !== null ? `$${price.toFixed(2)}` : "Price on request"}
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
        <button className="h-12 w-12 rounded-full border border-white/10 bg-market-elevated"></button>
      </div>
      
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 z-10">
        <button className="h-12 w-12 rounded-full border border-white/10 bg-market-elevated"></button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="market-card flex h-[480px] animate-pulse flex-col overflow-hidden">
            <div className="h-48 flex-shrink-0 bg-market-elevated"></div>
            <div className="flex flex-grow flex-col p-5">
              <div className="mb-3 h-5 rounded bg-market-elevated"></div>
              <div className="mb-2 h-4 rounded bg-market-elevated"></div>
              <div className="mb-3 h-4 rounded bg-market-elevated"></div>
              <div className="mb-4 h-5 w-1/2 rounded bg-market-elevated"></div>
              <div className="mt-auto h-10 rounded bg-market-elevated"></div>
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
    <div className="market-card flex flex-col items-center gap-3 rounded-xl py-8 text-center">
      <div className="text-market-teal">
        We&apos;re having trouble loading products: {error}
      </div>
      <button
        onClick={onRetry}
        className="market-btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm normal-case"
      >
        <RotateCcw size={16} /> Retry
      </button>
    </div>
  );
}

