"use client";

import React from "react";
import { Star, StarHalf, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
function pctOff(price: number, salePrice: number | null) {
  if (!salePrice || price <= 0) return 0;
  return Math.max(0, Math.round(((price - salePrice) / price) * 100));
}
function isAbortError(e: any) {
  return e?.name === "AbortError" || e?.code === 20 || /aborted/i.test(e?.message || "");
}

/* ---------- data hook (abort-safe + retry) ---------- */
function useRankedProducts() {
  const [items, setItems] = React.useState<RankedItem[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const ctrlRef = React.useRef<AbortController | null>(null);
  const mountedRef = React.useRef(true);

  const load = React.useCallback(async () => {
    ctrlRef.current?.abort();
    const controller = new AbortController();
    ctrlRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const url = buildRankedUrl();
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
      }
      const data = (await res.json()) as RankedResponse;
      if (!data || !Array.isArray(data.items)) {
        throw new Error("Unexpected response shape (missing items[])");
      }
      if (!mountedRef.current) return;
      setItems(data.items.slice(0, PAGE_SIZE));
    } catch (e: any) {
      if (isAbortError(e)) return; // ignore navigation/unmount aborts
      console.error("ShopProducts fetch error:", e);
      if (!mountedRef.current) return;
      setError(e?.message || "Failed to load products.");
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
      ctrlRef.current?.abort();
    };
  }, [load]);

  return { items, error, loading, reload: load };
}

/* ---------- component ---------- */
export default function ShopProducts() {
  const { items, error, loading, reload } = useRankedProducts();

  return (
    <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="mb-3 text-2xl font-bold uppercase sm:text-3xl md:text-4xl heading">
          Shop Products
        </h2>
        <div className="flex flex-col items-center justify-center mb-4">
          <hr className="w-20 h-1 bg-green-900" />
          <hr className="w-20 h-1 bg-green-900" />
        </div>
        <p className="px-2 mb-10 text-sm text-gray-600 sm:text-base sm:px-0">
          Explore our most recent, high-quality picks — curated by rank and plan weight.
        </p>
      </div>

      {/* Loading / Error states */}
      {items === null || loading ? (
        <SkeletonGrid />
      ) : error ? (
        <ErrorBlock error={error} onRetry={reload} />
      ) : items.length === 0 ? (
        <div className="text-center text-gray-600">No products to display.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p._id} item={p} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6 md:justify-start">
        <Link
          href="/products"
          className="inline-block px-8 py-2 mx-auto text-white rounded bg-custom-orange md:mx-0"
        >
          Show All Products
        </Link>
      </div>

      <div className="flex justify-center h-full mt-4 md:justify-end md:mt-2">
        <hr className="h-[2px] w-1/2 bg-custom-blue mt-0" />
      </div>
    </section>
  );
}

/* ---------- subcomponents ---------- */

function ProductCard({ item }: { item: RankedItem }) {
  // const href = item.slug ? `/product/${item.slug}` : `/product/${item._id}`;
  const href = `/product/${item._id}`;
  const title = pickTitle(item);
  const description = item.description;
  const images = gatherImages(item);
  const { price, salePrice, effective, onSale, size, label, color } = pickPrice(item);
  const rating = pickRating(item);
  const ratingCount = pickRatingCount(item);
  const discount = pctOff(price, salePrice);

  const fullStars = Math.floor(rating);
  const fractional = rating % 1;
  const hasHalfStar = fractional >= 0.25 && fractional < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // prevent navigation when user is dragging/swiping the slider
  const draggingRef = React.useRef(false);
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
                  <img
                    src={src}
                    alt={`${title} ${i + 1}`}
                    loading="lazy"
                    className="object-contain w-full h-full p-3"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {onSale && (
            <span className="absolute left-2 top-2 text-[11px] font-semibold bg-red-600 text-white px-2 py-0.5 rounded z-10">
              {discount > 0 ? `-${discount}%` : "SALE"}
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
          title={description || ""}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,        // clamp to 2 lines; bump to 3 if you prefer
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: "break-word",
          }}
        >
          {description || ""}
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
        <div className="flex items-baseline gap-2">
          {onSale ? (
            <>
              <span className="text-base font-semibold text-red-600 sm:text-lg">
                ${effective.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500 line-through sm:text-sm">
                ${price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-base font-semibold text-gray-900 sm:text-lg">
              ${price.toFixed(2)}
            </span>
          )}
        </div>

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

function ErrorBlock({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="text-red-600">
        We’re having trouble loading products: {error}
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded bg-custom-orange"
      >
        <RotateCcw size={16} /> Retry
      </button>
    </div>
  );
}
