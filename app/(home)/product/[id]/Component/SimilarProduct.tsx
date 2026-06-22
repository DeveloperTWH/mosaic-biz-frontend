'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, StarHalf, RotateCcw } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import MarketEmptyState from '../../../Components/MarketEmptyState';

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
    } catch (e: unknown) {
      const err = e as { name?: string; message?: string };
      if (err?.name === 'AbortError') return;
      setError(err?.message || 'Failed to load similar products');
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

function SimilarProductCard({
  item,
  onImgLoad,
}: {
  item: RankedItem;
  onImgLoad?: () => void;
}) {
  const img = pickImage(item);
  const href = `/product/${item._id}`;
  const r = ratingNum(item);
  const full = Math.floor(r);
  const hasHalf = r % 1 >= 0.25 && r % 1 < 0.75;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  const fe = item.firstEligible;
  const price = getPriceNumber(fe?.price ?? item.price);
  const sale = getPriceNumber(fe?.salePrice ?? item.salePrice ?? null);
  const onSale = !!fe?.onSale && sale > 0;
  const effective = onSale ? sale : price;

  return (
    <Link href={href} target="_blank" className="market-card similar-card flex h-full flex-col p-4">
      <div className="market-card-media relative mx-auto mb-4 flex h-[200px] w-full items-center justify-center">
        <img
          src={img}
          alt={item.title}
          className="max-h-full max-w-full object-contain p-3"
          loading="lazy"
          onLoad={onImgLoad}
        />
        {onSale && (
          <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-[11px] font-semibold text-white">
            SALE
          </span>
        )}
      </div>

      <h3 className="market-card-title line-clamp-2 text-sm" title={item.title}>
        {item.title}
      </h3>

      {item.description ? (
        <p className="market-card-desc mb-2 line-clamp-2 text-xs" title={stripHtml(item.description)}>
          {stripHtml(item.description)}
        </p>
      ) : null}

      <div className="mb-2 flex items-center space-x-0.5 text-market-gold">
        {Array(full)
          .fill(0)
          .map((_, idx) => (
            <Star key={`f-${idx}`} size={12} fill="currentColor" stroke="currentColor" />
          ))}
        {hasHalf && <StarHalf size={12} fill="currentColor" stroke="currentColor" />}
        {Array(empty)
          .fill(0)
          .map((_, idx) => (
            <Star
              key={`e-${idx}`}
              size={12}
              className="text-market-muted/40"
              fill="transparent"
              stroke="currentColor"
            />
          ))}
        {ratingCount(item) > 0 && (
          <span className="ml-2 text-[11px] text-market-muted">({ratingCount(item)})</span>
        )}
      </div>

      <div className="mt-auto flex flex-col leading-tight">
        <span className="text-xs text-market-muted">Starting from</span>
        {onSale ? (
          <div className="flex items-baseline gap-2">
            <span className="market-card-price-sale text-sm sm:text-base">${effective.toFixed(2)}</span>
            <span className="text-xs text-market-muted line-through">${price.toFixed(2)}</span>
          </div>
        ) : (
          <span className="market-card-price text-sm sm:text-base">${price.toFixed(2)}</span>
        )}
      </div>
    </Link>
  );
}

function SkeletonSlide() {
  return (
    <div className="market-card animate-pulse p-4">
      <div className="market-card-media mx-auto mb-4 h-[200px] w-full" />
      <div className="mb-2 h-4 w-3/4 rounded bg-white/10" />
      <div className="h-3 w-1/2 rounded bg-white/10" />
    </div>
  );
}

/* ---------- component ---------- */
export default function SimilarProduct({ productId }: { productId?: string }) {
  const params = useParams();
  const idFromRoute = (params as { id?: string })?.id;
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

  const swiperBreakpoints = {
    0: { slidesPerView: 1 },
    640: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
  };

  return (
    <div className="mt-12">
      <h3 className="market-section-heading text-center">Best Sellers</h3>
      <div className="market-section-divider" />
      <div className="mx-auto mt-4 max-w-2xl">
        <p className="text-center font-montserrat text-sm text-market-muted">
          You might also like these highly-ranked picks.
        </p>
      </div>

      <div className="mb-10 mt-10">
        {items === null || loading ? (
          <Swiper
            modules={[Pagination, Keyboard, A11y]}
            spaceBetween={20}
            slidesPerView={4}
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            breakpoints={swiperBreakpoints}
            className="similar-swiper pb-10"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <SwiperSlide key={i}>
                <SkeletonSlide />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 text-red-400">
            {error}
            <button
              type="button"
              onClick={reload}
              className="market-btn-outline inline-flex items-center gap-1 px-3 py-1 text-xs normal-case"
            >
              <RotateCcw size={14} /> Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <MarketEmptyState
            title="No similar products"
            description="We couldn't find related products for this item right now."
            ctaLabel="Browse all products"
            ctaHref="/products"
          />
        ) : (
          <div ref={eqRef}>
            <Swiper
              modules={[Pagination, Keyboard, A11y]}
              spaceBetween={20}
              slidesPerView={4}
              pagination={{ clickable: true }}
              keyboard={{ enabled: true }}
              breakpoints={swiperBreakpoints}
              className="similar-swiper pb-10"
            >
              {items.map((p) => (
                <SwiperSlide key={p._id}>
                  <SimilarProductCard item={p} onImgLoad={handleImgLoad} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      <div className="mx-auto text-center">
        <Link href="/products" className="market-btn-primary inline-block px-8 py-2 text-sm normal-case">
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
          background: rgba(255, 255, 255, 0.35);
          opacity: 1;
          margin: 0 3px !important;
          transition: transform 150ms ease, background 150ms ease;
        }
        .similar-swiper .swiper-pagination-bullet-active {
          background: #e2b84b;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
