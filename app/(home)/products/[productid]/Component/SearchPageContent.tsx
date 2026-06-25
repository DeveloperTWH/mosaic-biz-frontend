"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import FilterSidebar from "./FilterSidebar";
import { Star, StarHalf } from "lucide-react";
import BannerSection from "./BannerSection";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MarketEmptyState from "../../../Components/MarketEmptyState";
import MarketErrorState from "../../../Components/MarketErrorState";
import MarketImage from "../../../Components/MarketImage";
import MarketPrice from "../../../Components/MarketPrice";
import { toFiniteNumber } from "@/lib/marketplace/display";

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

/* ---------- helpers ---------- */
function gatherImages(p: RankedItem): string[] {
  const arr = [
    ...(p.firstEligible?.images || []),
    ...(p.coverImage ? [p.coverImage] : []),
  ];
  // de-dupe while preserving order
  const seen = new Set<string>();
  const out: string[] = [];
  for (const src of arr) {
    if (src && !seen.has(src)) {
      seen.add(src);
      out.push(src);
    }
  }
  return out;
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
      price: null as number | null,
      salePrice: null as number | null,
      effective: null as number | null,
      onSale: false,
      size: undefined as string | undefined,
      label: undefined as string | undefined,
      color: undefined as string | undefined,
    };
  }
  const price = toFiniteNumber(fe.price);
  const salePrice = toFiniteNumber(fe.salePrice);
  const onSale = Boolean(fe.onSale && salePrice !== null && price !== null && salePrice < price);
  const effective = onSale ? (salePrice as number) : price;
  return { price, salePrice, effective, onSale, size: fe.size, label: fe.label, color: fe.color };
}
function pctOff(price: number, salePrice: number | null) {
  if (!salePrice || price <= 0) return 0;
  return Math.max(0, Math.round(((price - salePrice) / price) * 100));
}
function isAbortError(e: any) {
  return e?.name === "AbortError" || e?.code === 20 || /aborted/i.test(e?.message || "");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

type Filters = {
  brand: string;
  minPrice: number;
  maxPrice: number;
  subcategory?: string;
  minorityType?: string;
  size?: string;
  color?: string;
};

type Subcategory = { _id: string; name: string; slug: string };

/* ---------- data loading ---------- */

export default function SearchPageContent() {
  const { productid } = useParams<{ productid: string }>();
  const categorySlug = productid ?? "";

  const [filters, setFilters] = useState<Filters>({
    brand: "",
    minPrice: 0,
    maxPrice: 1000,
  });

  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<RankedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((n) => n + 1), []);

  useEffect(() => {
    let abort = false;
    const run = async () => {
      setLoading(true);
      setFetchError(null);
      try {

        const rankedParams = new URLSearchParams();
        if (categorySlug) rankedParams.set("categorySlug", categorySlug);
        if (filters.subcategory) rankedParams.set("subcategorySlug", filters.subcategory);
        if (filters.brand) rankedParams.set("brand", filters.brand);
        if (filters.minorityType) rankedParams.set("minorityType", filters.minorityType);
        if (filters.size) rankedParams.set("size", String(filters.size).toUpperCase());
        rankedParams.set("page", "1");
        rankedParams.set("pageSize", "24");

        const [subRes, prodRes] = await Promise.all([
          categorySlug
            ? fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sub-categories?categorySlug=${encodeURIComponent(categorySlug)}`, {
              headers: { "Accept": "application/json" },
              cache: "no-store",
            })
            : Promise.resolve(null as unknown as Response),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ranked?${rankedParams.toString()}`, {
            headers: { "Accept": "application/json" },
            cache: "no-store",
          }),
        ]);

        if (!prodRes.ok) {
          throw new Error(`HTTP ${prodRes.status}`);
        }

        if (!abort && subRes) {
          const subData = await subRes.json();
          setSubcategories(Array.isArray(subData) ? subData : []);
        } else if (!abort && !categorySlug) {
          setSubcategories([]);
        }

        const data: RankedResponse = await prodRes.json();

        if (!abort) {
          const priced = (data.items || []).filter((item) => {
            const price =
              toFiniteNumber(item.firstEligible?.effectivePrice) ??
              toFiniteNumber(item.firstEligible?.price);
            if (price === null) {
              return (filters.minPrice ?? 0) <= 0;
            }
            return (
              price >= (filters.minPrice ?? 0) &&
              price <= (filters.maxPrice ?? Infinity)
            );
          });

          setProducts(priced);
        }
      } catch (e) {
        console.error("Category products fetch error:", e);
        if (!abort) {
          setFetchError("Products are temporarily unavailable.");
          setProducts([]);
          setSubcategories([]);
        }
      } finally {
        if (!abort) setLoading(false);
      }
    };
    run();
    return () => { abort = true; };
  }, [categorySlug, filters, reloadToken]);


  return (
    <>
      <BannerSection heading={`${categorySlug} Products`} imageUrl='/shopfashion/shopfashion.png' />
      <div className="flex flex-col gap-6 px-6 py-8 mx-auto md:flex-row">
        <FilterSidebar filters={filters} setFilters={setFilters} subcategories={subcategories} />
        <main className="flex-1">
          {loading ? (
            <SkeletonGrid />
          ) : fetchError ? (
            <MarketErrorState
              title="Products are temporarily unavailable"
              description={fetchError}
              onRetry={reload}
              retryLabel="Retry"
              ctaLabel="Browse all products"
              ctaHref="/products"
              className="py-8"
            />
          ) : products.length === 0 ? (
            <MarketEmptyState
              title="No products found"
              description="Try changing your filters or browse the full product catalog."
              ctaLabel="Browse all products"
              ctaHref="/products"
              className="py-8"
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p._id} item={p} />
              ))}
            </div>
          )}
        </main>
      </div>
      <div className="max-w-screen-xl px-8 py-10 mx-auto">
        {/* <SimilarProduct /> */}
      </div>
    </>
  );
}




/* ---------- subcomponents ---------- */

function ProductCard({ item }: { item: RankedItem }) {
  // const href = item.slug ? `/product/${item.slug}` : `/product/${item._id}`;
  const href = `/product/${item._id}`;
  const title = pickTitle(item);
  const description = item.description ?? "";
  const strippedDescription = stripHtml(description);
  const trimmedDescription =
    strippedDescription.length > 100
      ? `${strippedDescription.slice(0, 100).trimEnd()}...`
      : strippedDescription;
  const images = gatherImages(item);
  const { price, salePrice, effective, onSale, size, label, color } = pickPrice(item);
  const rating = pickRating(item);
  const ratingCount = pickRatingCount(item);
  const discount = price !== null && salePrice !== null && price > 0 && salePrice < price
    ? ((price - salePrice) / price) * 100
    : 0;

  const fmtPct = (n: number) => {
    const v = Number(n);
    if (!Number.isFinite(v) || v <= 0) return null;
    return Number.isInteger(v) ? String(v) : v.toFixed(1); // e.g. 0.5, 12.3
  };
  const discountLabel = fmtPct(discount);

  const fullStars = Math.floor(rating);
  const fractional = rating % 1;
  const hasHalfStar = fractional >= 0.25 && fractional < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // prevent navigation when user is dragging/swiping the slider
  const draggingRef = useRef(false);
  const handleClickCapture = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (draggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Link
      href={href}
      target="_blank"
      onClickCapture={handleClickCapture}
      aria-label={`Open ${title}`}
    >
      <div className="group border rounded-2xl p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        {/* Slider (square) */}
        <div className="relative w-full overflow-hidden bg-gray-50 rounded-xl">
          <div className="pt-[100%]" />
          <div className="absolute inset-0">
            {images.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
                slidesPerView={1}
                pagination={{ clickable: true, dynamicBullets: true }}
                keyboard={{ enabled: true }}
                autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: false }}
                loop
                onSliderMove={() => (draggingRef.current = true)}
                onTouchStart={() => (draggingRef.current = false)}
                onTouchEnd={() => setTimeout(() => (draggingRef.current = false), 0)}
                className="h-full product-swiper"
              >
                {images.map((src, i) => (
                  <SwiperSlide key={i}>
                    <MarketImage
                      src={src}
                      alt={`${title} ${i + 1}`}
                      objectFit="contain"
                      fallbackLabel="Image coming soon"
                      className="h-full w-full"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <MarketImage
                src={null}
                alt={`${title} image`}
                objectFit="contain"
                fallbackLabel="Image coming soon"
                className="h-full w-full"
              />
            )}
          </div>

          {onSale && (
            <span className="absolute left-2 top-2 text-[11px] font-semibold bg-red-600 text-white px-2 py-0.5 rounded z-10">
              {discountLabel ? `-${discountLabel}%` : "SALE"}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="mt-3 mb-1 text-sm font-semibold text-gray-900 sm:text-base"
          title={title}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: "break-word",
          }}
        >
          {title}
        </h3>


        <p
          className="mb-2 text-xs text-gray-600"
          title={strippedDescription}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,        // clamp to 2 lines; bump to 3 if you prefer
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: "break-word",
          }}
        >
          {trimmedDescription || ""}
        </p>


        {/* Variant meta */}
        {(label || size) && (
          <p className="mb-2 text-xs text-gray-500">
            {label ? `${label}: ` : ""}
            {size}
            {color ? (
              <span
                className="inline-block w-3 h-3 ml-2 align-middle border rounded-full"
                style={{ backgroundColor: color }}
              />
            ) : null}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center mb-2 space-x-0.5 text-yellow-500">
          {Array(fullStars)
            .fill(0)
            .map((_, idx) => (
              <Star
                key={`full-${idx}`}
                size={14}
                fill="currentColor"
                stroke="currentColor"
                className="text-yellow-400"
              />
            ))}
          {hasHalfStar && (
            <StarHalf
              key="half"
              size={14}
              fill="currentColor"
              stroke="currentColor"
              className="text-yellow-400"
            />
          )}
          {Array(emptyStars)
            .fill(0)
            .map((_, idx) => (
              <Star
                key={`empty-${idx}`}
                size={14}
                fill="none"
                stroke="gray"
                className="text-gray-300"
              />
            ))}
          {ratingCount > 0 && (
            <span className="ml-2 text-[11px] text-gray-500">({ratingCount})</span>
          )}
        </div>

        {/* Price */}
        <MarketPrice
          value={onSale ? effective : price}
          compareAt={onSale ? price : null}
          onSale={onSale}
          priceClassName={onSale ? "text-base font-semibold text-red-600 sm:text-lg" : "text-base font-semibold text-gray-900 sm:text-lg"}
          compareClassName="text-xs text-gray-500 line-through sm:text-sm"
          labelClassName="sr-only"
        />

        {/* Full-card link overlay (prevents click during drag) */}
        <style jsx global>{`
        .product-swiper .swiper-pagination-bullets {
          bottom: 6px !important;
          opacity: 0; /* hidden by default for a cleaner look */
          transition: opacity 150ms ease;
        }
        /* show dots when card is hovered (requires parent has .group) */
        .group:hover .product-swiper .swiper-pagination-bullets {
          opacity: 1;
        }
        .product-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: rgba(0, 0, 0, 0.35);
          opacity: 1;
          margin: 0 3px !important;
          transition: transform 150ms ease, background 150ms ease;
        }
        .product-swiper .swiper-pagination-bullet-active {
          background: rgba(0, 0, 0, 0.75);
          transform: scale(1.15);
        }
      `}</style>
      </div>
    </Link>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <div key={i} className="p-4 border rounded-2xl animate-pulse">
          <div className="relative w-full overflow-hidden bg-gray-100 rounded-xl">
            <div className="pt-[100%]" />
          </div>
          <div className="w-3/4 h-4 mt-4 bg-gray-200 rounded" />
          <div className="w-1/2 h-3 mt-2 bg-gray-200 rounded" />
          <div className="w-1/3 h-5 mt-4 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

