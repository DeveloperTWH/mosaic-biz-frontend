'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, StarHalf, RotateCcw } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

/* ---------- types ---------- */
type RankedItem = {
  _id: string;
  description?: string;
  slug?: string;
  title: string;
  coverImage?: string;
  variantRatingAvg?: number;
  variantRatingCount?: number;
  firstEligible?: {
    images?: string[];
    label?: string;
    color?: string;
    size?: string;
    price?: number | { $numberDecimal: string };
    salePrice?: number | { $numberDecimal: string } | null;
    onSale?: boolean;
    effectivePrice?: number;
  };
  price?: number | { $numberDecimal: string };
  salePrice?: number | { $numberDecimal: string } | null;
};

type RankedResponse = {
  items: RankedItem[];
};

/* ---------- utils ---------- */
function isValidObjectId(s?: string) {
  return !!s && /^[a-fA-F0-9]{24}$/.test(s);
}

function buildSimilarUrl(productId: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? '';
  const path = `/api/${productId}/similar`;
  const qs = new URLSearchParams({ page: '1', pageSize: '8' }).toString();
  return base ? `${base}${path}?${qs}` : `${path}?${qs}`;
}

function pickImage(p: RankedItem) {
  const arr = [...(p.firstEligible?.images || []), ...(p.coverImage ? [p.coverImage] : [])];
  const dedup = Array.from(new Set(arr));
  return dedup[0] || '/ShopProduct/Aria-SK6-Helmet 1.png';
}

function ratingNum(p: RankedItem) {
  const n = Number(p.variantRatingAvg ?? 0);
  return Math.max(0, Math.min(5, isFinite(n) ? n : 0));
}

function ratingCount(p: RankedItem) {
  const n = Number(p.variantRatingCount ?? 0);
  return isFinite(n) ? n : 0;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// Helper to convert number or Mongo $numberDecimal
function getPriceNumber(v?: number | { $numberDecimal: string } | null) {
  if (v == null) return 0;
  if (typeof v === 'number') return v;
  if ('$numberDecimal' in v) return Number(v.$numberDecimal);
  return 0;
}

/* ---------- data hook ---------- */
function useSimilar(productId?: string) {
  const [items, setItems] = React.useState<RankedItem[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const ctrlRef = React.useRef<AbortController | null>(null);

  const load = React.useCallback(async () => {
    if (!productId || !isValidObjectId(productId)) {
      setItems([]);
      return;
    }
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildSimilarUrl(productId), {
        signal: ctrl.signal,
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = (await res.json()) as RankedResponse;
      if (!data || !Array.isArray(data.items)) throw new Error('Bad similar response');
      setItems(data.items.slice(0, 8));
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      setError(e?.message || 'Failed to load similar products');
      setItems((prev) => prev ?? []);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  React.useEffect(() => {
    load();
    return () => ctrlRef.current?.abort();
  }, [load]);

  return { items, error, loading, reload: load };
}

/* ---------- component ---------- */
export default function SimilarProduct({ productId }: { productId?: string }) {
  const params = useParams();
  const idFromRoute = (params as any)?.id as string | undefined;
  const effectiveId = productId || idFromRoute;

  const { items, error, loading, reload } = useSimilar(effectiveId);

  const eqRef = React.useRef<HTMLDivElement | null>(null);
  const equalizeHeights = React.useCallback(() => {
    const root = eqRef.current;
    if (!root) return;
    const cards = root.querySelectorAll<HTMLElement>('.similar-card');
    if (!cards.length) return;
    cards.forEach((c) => (c.style.height = 'auto'));
    let max = 0;
    cards.forEach((c) => (max = Math.max(max, c.offsetHeight)));
    cards.forEach((c) => (c.style.height = `${max}px`));
  }, []);

  React.useEffect(() => {
    if (items?.length) requestAnimationFrame(equalizeHeights);
  }, [items, equalizeHeights]);

  React.useEffect(() => {
    const onResize = () => equalizeHeights();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [equalizeHeights]);

  const handleImgLoad = React.useCallback(() => {
    equalizeHeights();
  }, [equalizeHeights]);

  if (!effectiveId || !isValidObjectId(effectiveId)) return null;

  return (
    <div className="mt-12">
      <h3 className="mb-4 text-4xl font-bold text-center uppercase heading">
        BEST SELLERS
      </h3>
      <hr className="h-[2px] w-[100px] bg-green-900 mx-auto" />
      <hr className="h-[2px] w-[100px] bg-green-900 mx-auto mt-[1px]" />
      <div className="w-3/5 mx-auto">
        <p className="mt-4 text-center text-brand-muted">
          You might also like these highly-ranked picks.
        </p>
      </div>

      <div className="mt-10 mb-10">
        {items === null || loading ? (
          <Swiper
            modules={[Pagination, Keyboard, A11y]}
            spaceBetween={20}
            slidesPerView={4}
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-10"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <SwiperSlide key={i}>
                <div className="p-4 border rounded-lg animate-pulse">
                  <div className="w-[200px] h-[200px] bg-gray-100 rounded mx-auto" />
                  <div className="w-3/4 h-4 mx-auto mt-4 bg-gray-200 rounded" />
                  <div className="w-1/2 h-3 mx-auto mt-2 bg-gray-200 rounded" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 text-red-600">
            {error}
            <button
              onClick={reload}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs text-white rounded bg-custom-orange"
            >
              <RotateCcw size={14} /> Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-brand-muted">No similar products found.</div>
        ) : (
          <div ref={eqRef}>
            <Swiper
              modules={[Pagination, Keyboard, A11y]}
              spaceBetween={20}
              slidesPerView={4}
              pagination={{ clickable: true }}
              keyboard={{ enabled: true }}
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-10 similar-swiper"
            >
              {items.map((p) => {
                const img = pickImage(p);
                const href = `/product/${p._id}`;

                const r = ratingNum(p);
                const full = Math.floor(r);
                const hasHalf = r % 1 >= 0.25 && r % 1 < 0.75;
                const empty = 5 - full - (hasHalf ? 1 : 0);

                const fe = p.firstEligible;

                // --- FIXED PRICE HANDLING ---
                const price = getPriceNumber(fe?.price ?? p.price);
                const sale = getPriceNumber(fe?.salePrice ?? p.salePrice ?? null);
                const onSale = !!fe?.onSale && sale > 0;
                const effective = onSale ? sale : price;

                return (
                  <SwiperSlide key={p._id}>
                    <Link
                      href={href}
                      target="_blank"
                      className="flex flex-col p-4 transition border rounded-lg similar-card hover:shadow-md"
                    >
                      <div className="relative mx-auto flex h-[200px] w-[200px] items-center justify-center rounded bg-gray-50">
                        <img
                          src={img}
                          alt={p.title}
                          className="object-contain w-full h-full p-3"
                          loading="lazy"
                          onLoad={handleImgLoad}
                        />
                        {onSale && (
                          <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                            SALE
                          </span>
                        )}
                      </div>

                      <h3
                        className="mt-3 mb-1 text-sm font-semibold text-brand-navy"
                        title={p.title}
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          wordBreak: 'break-word',
                        }}
                      >
                        {p.title}
                      </h3>
                      <p
                        className="mb-2 text-xs text-brand-muted"
                        title={stripHtml(p.description || '')}
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          wordBreak: 'break-word',
                        }}
                      >
                        {stripHtml(p.description || '')}
                      </p>

                      <div className="flex items-center mb-2 space-x-0.5 text-yellow-500">
                        {Array(full)
                          .fill(0)
                          .map((_, idx) => (
                            <Star
                              key={`f-${idx}`}
                              size={12}
                              fill="currentColor"
                              stroke="currentColor"
                              className="text-yellow-400"
                            />
                          ))}
                        {hasHalf && (
                          <StarHalf
                            size={12}
                            fill="currentColor"
                            stroke="currentColor"
                            className="text-yellow-400"
                          />
                        )}
                        {Array(empty)
                          .fill(0)
                          .map((_, idx) => (
                            <Star
                              key={`e-${idx}`}
                              size={12}
                              fill="none"
                              stroke="gray"
                              className="text-brand-muted/70"
                            />
                          ))}
                        {ratingCount(p) > 0 && (
                          <span className="ml-2 text-[11px] text-brand-muted">({ratingCount(p)})</span>
                        )}
                      </div>

<div className="flex flex-col mt-auto leading-tight">
  <span className="text-xs text-brand-muted">
    Starting from
  </span>

  {onSale ? (
    <div className="flex items-baseline gap-2">
      <span className="text-sm font-semibold text-[#B12704] sm:text-base">
        ${effective.toFixed(2)}
      </span>
      <span className="text-xs text-brand-muted line-through">
        ${price.toFixed(2)}
      </span>
    </div>
  ) : (
    <span className="text-sm font-semibold text-brand-navy sm:text-base">
      ${price.toFixed(2)}
    </span>
  )}
</div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
      </div>

      <div className="mx-auto text-center">
        <Link href="/products" className="inline-block px-8 py-2 text-white rounded bg-blue-900">
          Show All Products
        </Link>
      </div>

      <style jsx global>{`
        .similar-swiper .swiper-pagination-bullets {
          bottom: 6px !important;
        }
        .similar-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: rgba(0, 0, 0, 0.35);
          opacity: 1;
          margin: 0 3px !important;
          transition: transform 150ms ease, background 150ms ease;
        }
        .similar-swiper .swiper-pagination-bullet-active {
          background: rgba(0, 0, 0, 0.75);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}