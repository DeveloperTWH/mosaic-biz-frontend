"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PublicSearchFilterBar from "../Components/PublicSearchFilterBar";
import PublicPageHero from "../Components/PublicPageHero";
import PublicFilterSection from "../Components/PublicFilterSection";
import MarketLoadingBlock from "../Components/MarketLoadingBlock";
import MarketEmptyState from "../Components/MarketEmptyState";
import MarketImage from "../Components/MarketImage";
import { PublicSearchFilters, parseListingFiltersFromSearchParams, buildSearchPageUrlWithTab } from "../Components/publicSearch";

type ApiBusiness = {
  _id?: string;
  businessName?: string;
  logo?: string;
  badge?: string;
  description?: string;
};

type ApiProduct = {
  _id: string;
  title?: string;
  description?: string;
  price?: { $numberDecimal?: string } | string | number | null;
  coverImage?: string;
  slug?: string;
  businessId?: ApiBusiness;
};

type ApiService = {
  _id: string;
  title?: string;
  description?: string;
  businessDescription?: string;
  price?: number | string | null;
  coverImage?: string;
  slug?: string;
  businessId?: ApiBusiness;
  location?: string;
  contact?: {
    address?: string;
  };
};

type ApiFood = {
  _id: string;
  title?: string;
  name?: string;
  description?: string;
  coverImage?: string;
  slug?: string;
  businessId?: ApiBusiness;
  businessName?: string;
  badge?: string;
  location?:
    | string
    | {
        address?: string;
      };
};

type SearchApiResponse = {
  success: boolean;
  filters?: Partial<PublicSearchFilters>;
  totals?: {
    all?: number;
    products?: number;
    services?: number;
    foods?: number;
  };
  data?: {
    products?: ApiProduct[];
    services?: ApiService[];
    foods?: ApiFood[];
  };
  message?: string;
};

type SearchTab = "products" | "services" | "foods";

function stripHtml(value?: string): string {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, "").trim() : "";
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object" && "$numberDecimal" in value) {
    const parsed = Number((value as { $numberDecimal?: string }).$numberDecimal);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function getBadgeImage(badge?: string): string | null {
  if (!badge) return null;
  const key = badge.trim().toLowerCase().replace(/[\s_-]+/g, "");
  const badgeMap: Record<string, string> = {
    silver: "/badge/silver.png",
    gold: "/badge/gold.png",
    platinum: "/badge/platinum.png",
    diamond: "/badge/diamond.png",
  };
  return badgeMap[key] ?? null;
}

function buildSearchApiUrl(filters: PublicSearchFilters): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
  const params = new URLSearchParams();

  if (filters.keyword.trim()) params.set("keyword", filters.keyword.trim());
  if (filters.location.trim()) params.set("location", filters.location.trim());
  if (filters.minorityType.trim()) params.set("minorityType", filters.minorityType.trim());

  return `${base}/api/public/search?${params.toString()}`;
}

function ProductCard({ item }: { item: ApiProduct }) {
  const title = item.title || "Untitled Product";
  const description = stripHtml(item.description);
  const trimmedDescription =
    description.length > 100 ? `${description.slice(0, 100).trimEnd()}...` : description;
  const price = toNumber(item.price);
  const badgeImage = getBadgeImage(item.businessId?.badge);
  const vendorName = item.businessId?.businessName?.trim();

  return (
    <Link href={`/product/${item._id}`} className="market-listing-card-link h-full">
      <article className="market-listing-card p-2">
        <div className="market-card-media relative aspect-[4/3] w-full shrink-0 sm:aspect-square">
          <MarketImage src={item.coverImage} alt={title} aspect="square" objectFit="contain" fallbackLabel="Image coming soon" />
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          <h3 className="market-card-title line-clamp-2">{title}</h3>
          <p className="market-card-desc line-clamp-2">
            {trimmedDescription || "Explore this product on Mosaic Biz Hub."}
          </p>

          {vendorName ? (
            <p className="market-card-rating-meta">{vendorName}</p>
          ) : null}

          <div className="mt-auto flex flex-col gap-0.5">
            <span className="text-xs text-market-muted">Starting from</span>
            <span className="market-card-price">${price.toFixed(2)}</span>
          </div>

          {badgeImage ? (
            <div className="market-card-footer mt-2 gap-2 py-2">
              <span className="text-xs font-semibold text-market-muted">Earned badge</span>
              <img
                src={badgeImage}
                alt={`${item.businessId?.badge || "Business"} badge`}
                className="h-10 object-contain sm:h-12"
                onError={(e) => {
                  e.currentTarget.src = "/badge.png";
                }}
              />
            </div>
          ) : null}
        </div>
      </article>
    </Link>
  );
}

function BusinessResultCard({
  href,
  title,
  description,
  image,
  logo,
  badge,
  meta,
}: {
  href: string;
  title: string;
  description: string;
  image?: string;
  logo?: string;
  badge?: string;
  meta?: string;
}) {
  const badgeImage = getBadgeImage(badge);

  return (
    <Link href={href} className="market-listing-card-link h-full">
      <article className="market-listing-card overflow-hidden p-0">
        <div className="market-card-media relative aspect-[16/10] w-full shrink-0">
          {image ? (
            <MarketImage src={image} alt={title} aspect="video" objectFit="cover" fallbackLabel="Image coming soon" />
          ) : (
            <div className="market-card-placeholder aspect-[16/10] w-full text-sm normal-case">
              Image coming soon
            </div>
          )}

          {logo ? (
            <img
              src={logo}
              alt=""
              className="absolute bottom-2 right-2 h-10 w-10 rounded-full border border-white/15 bg-market-surface object-contain p-1 shadow-market-card sm:h-12 sm:w-12"
            />
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="market-card-title line-clamp-2">{title}</h3>
          <p className="market-card-desc line-clamp-3">
            {description || "Business information available on vendor profile."}
          </p>

          {meta ? <p className="market-card-rating-meta">{meta}</p> : null}

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/10 pt-3">
            <span className="market-card-action">View details</span>
            {badgeImage ? (
              <img
                src={badgeImage}
                alt={`${badge || "Business"} badge`}
                className="h-10 object-contain sm:h-12"
                onError={(e) => {
                  e.currentTarget.src = "/badge.png";
                }}
              />
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<PublicSearchFilters>({
    keyword: "",
    location: "",
    minorityType: "",
  });
  const [response, setResponse] = useState<SearchApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SearchTab>(() => {
    const tab = searchParams.get("tab");
    if (tab === "services" || tab === "foods" || tab === "products") return tab;
    return "products";
  });

  const queryFilters = useMemo(
    () => {
      const parsed = parseListingFiltersFromSearchParams(searchParams);
      return {
        keyword: parsed.keyword,
        location: parsed.location,
        minorityType: parsed.minorityType,
      };
    },
    [searchParams]
  );

  useEffect(() => {
    setFilters(queryFilters);
  }, [queryFilters]);

  useEffect(() => {
    const hasAnyFilter =
      Boolean(queryFilters.keyword.trim()) ||
      Boolean(queryFilters.location.trim()) ||
      Boolean(queryFilters.minorityType.trim());

    if (!hasAnyFilter) {
      setResponse({
        success: true,
        totals: { all: 0, products: 0, services: 0, foods: 0 },
        data: { products: [], services: [], foods: [] },
      });
      setError(null);
      return;
    }

    const controller = new AbortController();

    async function loadResults() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(buildSearchApiUrl(queryFilters), {
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error("Failed to load search results.");
        }

        const json = (await res.json()) as SearchApiResponse;
        if (!json.success) {
          throw new Error(json.message || "Search request failed.");
        }

        setResponse({
          ...json,
          totals: {
            all: json.totals?.all ?? 0,
            products: json.totals?.products ?? json.data?.products?.length ?? 0,
            services: json.totals?.services ?? json.data?.services?.length ?? 0,
            foods: json.totals?.foods ?? json.data?.foods?.length ?? 0,
          },
          data: {
            products: json.data?.products ?? [],
            services: json.data?.services ?? [],
            foods: json.data?.foods ?? [],
          },
        });
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err?.message || "Something went wrong while searching.");
        setResponse(null);
      } finally {
        setLoading(false);
      }
    }

    loadResults();

    return () => controller.abort();
  }, [queryFilters]);

  useEffect(() => {
    const productsCount = response?.totals?.products ?? 0;
    const servicesCount = response?.totals?.services ?? 0;
    const foodsCount = response?.totals?.foods ?? 0;

    if (activeTab === "products" && productsCount > 0) return;
    if (activeTab === "services" && servicesCount > 0) return;
    if (activeTab === "foods" && foodsCount > 0) return;

    if (productsCount > 0) setActiveTab("products");
    else if (servicesCount > 0) setActiveTab("services");
    else if (foodsCount > 0) setActiveTab("foods");
  }, [activeTab, response]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (filters.keyword.trim()) params.set("keyword", filters.keyword.trim());
    if (filters.location.trim()) params.set("location", filters.location.trim());
    if (filters.minorityType.trim()) params.set("minorityType", filters.minorityType.trim());

    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const products = response?.data?.products ?? [];
  const services = response?.data?.services ?? [];
  const foods = response?.data?.foods ?? [];
  // const totalResults = response?.totals?.all ?? 0;
  const totalResults =
  (response?.data?.products?.length ?? 0) +
  (response?.data?.services?.length ?? 0) +
  (response?.data?.foods?.length ?? 0);

  // const tabItems: Array<{ key: SearchTab; label: string; count: number }> = [
  //   { key: "products", label: "Search For Products", count: response?.totals?.products ?? 0 },
  //   { key: "services", label: "Search For Services", count: response?.totals?.services ?? 0 },
  //   { key: "foods", label: "Search For Food Item", count: response?.totals?.foods ?? 0 },
  // ];

const tabItems = [
  { key: "products", label: "Products", count: response?.totals?.products ?? 0 },
  { key: "services", label: "Services", count: response?.totals?.services ?? 0 },
  { key: "foods", label: "Foods", count: response?.totals?.foods ?? 0 },
].filter((tab) => tab.count > 0) as Array<{
  key: SearchTab;
  label: string;
  count: number;
}>;

  const hasAnyFilter =
    Boolean(queryFilters.keyword.trim()) ||
    Boolean(queryFilters.location.trim()) ||
    Boolean(queryFilters.minorityType.trim());

  return (
    <div className="min-h-screen bg-market-bg">
      <PublicPageHero
        title="Search"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Search" },
        ]}
        imageUrl="/bgdetailpage.png"
      />
      <PublicFilterSection>
        <PublicSearchFilterBar filters={filters} onChange={setFilters} onSubmit={handleSearch} />
      </PublicFilterSection>

      <section className="container-page public-section max-w-[1400px]">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
          {tabItems.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  router.replace(
                    buildSearchPageUrlWithTab({
                      ...filters,
                      tab: tab.key,
                    })
                  );
                }}
                className={`relative w-full border px-4 py-3 text-sm font-semibold transition-colors sm:min-w-[180px] sm:w-auto lg:min-w-[220px] ${
                  isActive
                    ? "border-market-gold bg-market-gold text-market-header"
                    : "border-white/15 bg-market-elevated text-market-text hover:border-market-gold/40"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>

        <div className="mb-6 flex flex-col gap-2 text-sm text-market-muted md:flex-row md:items-center md:justify-between">
          <p className="market-result-count">
            ({totalResults > 0 ? `Showing 1 - ${totalResults} results` : "No results yet"})
          </p>
          <p className="text-xs uppercase tracking-[0.14em] text-market-muted">
            Keyword: {queryFilters.keyword || "Any"} | Location: {queryFilters.location || "Any"} | Minority:{" "}
            {queryFilters.minorityType || "Any"}
          </p>
        </div>

        {loading ? (
          <MarketLoadingBlock label="Searching results…" minHeight="min-h-[320px]" />
        ) : error ? (
          <div className="market-card border-red-400/30 p-4 text-red-300">{error}</div>
        ) : totalResults === 0 && !hasAnyFilter ? (
          <MarketEmptyState
            title="Search the marketplace"
            description="Enter a keyword, state, or minority-owned business type above to find products, services, and food vendors."
            ctaLabel="Browse products"
            ctaHref="/products"
          />
        ) : totalResults === 0 ? (
          <MarketEmptyState
            title="No matches yet"
            description="Try another keyword, state, or minority type to explore the marketplace."
            ctaLabel="Browse all products"
            ctaHref="/products"
          />
        ) : (
          <>
            {activeTab === "products" ? (
              <div className="public-grid-listing">
                {products.map((item) => (
                  <ProductCard key={item._id} item={item} />
                ))}
              </div>
            ) : null}

            {activeTab === "services" ? (
              <div className="public-grid-listing">
                {services.map((item) => (
                  <BusinessResultCard
                    key={item._id}
                    href={`/vendor-profile/service-vendor/${item._id}`}
                    title={item.businessId?.businessName || item.title || "Service Business"}
                    description={stripHtml(item.businessDescription || item.businessId?.description || item.description)}
                    image={item.coverImage}
                    logo={item.businessId?.logo}
                    badge={item.businessId?.badge}
                    meta={item.contact?.address || item.location || ""}
                  />
                ))}
              </div>
            ) : null}

            {activeTab === "foods" ? (
              <div className="public-grid-listing">
                {foods.map((item) => (
                  <BusinessResultCard
                    key={item._id}
                    href={`/vendor-profile/food-vendor/${item._id}`}
                    title={item.businessId?.businessName || item.businessName || item.title || item.name || "Food Business"}
                    description={stripHtml(item.description)}
                    image={item.coverImage}
                    logo={item.businessId?.logo}
                    badge={item.businessId?.badge || item.badge}
                    meta={typeof item.location === "string" ? item.location : item.location?.address || ""}
                  />
                ))}
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}

function SearchPageFallback() {
  return (
    <div className="min-h-screen bg-market-bg">
      <MarketLoadingBlock label="Loading search…" />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}
