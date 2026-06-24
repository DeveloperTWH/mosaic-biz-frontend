"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PublicSearchFilterBar from "../Components/PublicSearchFilterBar";
import PublicPageHero from "../Components/PublicPageHero";
import PublicFilterSection from "../Components/PublicFilterSection";
import MarketLoadingBlock from "../Components/MarketLoadingBlock";
import MarketDiscoveryPanel from "../Components/MarketDiscoveryPanel";
import MarketImage from "../Components/MarketImage";
import {
  MARKET_ALTERNATE_SEARCHES,
  MARKET_BROWSE_LINKS,
  MARKET_CULTURAL_LINKS,
  MARKET_SUGGESTED_SEARCHES,
} from "../Components/marketDiscovery";
import { SEARCH_TRUST_NOTE, SHOPPER_LOW_INVENTORY_NOTE } from "../Components/marketTrustProof";
import PublicProductCard from "../Components/publicCards/PublicProductCard";
import { mapApiProductToPublicProductCard } from "../Components/publicCards/publicProductCardMappers";
import { PublicSearchFilters, parseListingFiltersFromSearchParams, buildSearchPageUrlWithTab, searchParamsUsesLegacyNames } from "../Components/publicSearch";

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
  return <PublicProductCard {...mapApiProductToPublicProductCard(item)} />;
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

          {badgeImage ? (
            <p className="market-card-trust-label">Verified vendor · {badge} badge</p>
          ) : null}

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
  const [retryCount, setRetryCount] = useState(0);
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
    if (!searchParamsUsesLegacyNames(searchParams)) {
      return;
    }

    const parsed = parseListingFiltersFromSearchParams(searchParams);
    router.replace(
      buildSearchPageUrlWithTab({
        ...parsed,
        tab: activeTab,
      })
    );
  }, [searchParams, router, activeTab]);

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
        setError("Search is temporarily unavailable. Please try again.");
        setResponse(null);
      } finally {
        setLoading(false);
      }
    }

    loadResults();

    return () => controller.abort();
  }, [queryFilters, retryCount]);

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
    router.push(
      buildSearchPageUrlWithTab({
        ...filters,
        tab: activeTab,
      })
    );
  };

  const clearAllFilters = () => {
    router.push("/search");
  };

  const clearFilter = (field: keyof PublicSearchFilters) => {
    router.push(
      buildSearchPageUrlWithTab({
        ...queryFilters,
        [field]: "",
        tab: activeTab,
      })
    );
  };

  const activeFilterChips = useMemo(() => {
    const chips: Array<{ label: string; onClear?: () => void }> = [];
    if (queryFilters.keyword.trim()) {
      chips.push({
        label: `"${queryFilters.keyword.trim()}"`,
        onClear: () => clearFilter("keyword"),
      });
    }
    if (queryFilters.location.trim()) {
      chips.push({
        label: queryFilters.location.trim(),
        onClear: () => clearFilter("location"),
      });
    }
    if (queryFilters.minorityType.trim()) {
      chips.push({
        label: queryFilters.minorityType.trim(),
        onClear: () => clearFilter("minorityType"),
      });
    }
    return chips;
  }, [queryFilters, activeTab, router]);

  const products = response?.data?.products ?? [];
  const services = response?.data?.services ?? [];
  const foods = response?.data?.foods ?? [];
  const totalResults =
    (response?.data?.products?.length ?? 0) +
    (response?.data?.services?.length ?? 0) +
    (response?.data?.foods?.length ?? 0);

  const isLowInventory = totalResults > 0 && totalResults <= 3;

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
        variant="compact"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Search" },
        ]}
        imageUrl="/bgdetailpage.png"
      />
      <PublicFilterSection>
        <PublicSearchFilterBar
          filters={filters}
          onChange={setFilters}
          onSubmit={handleSearch}
          showClearFilters
          onClearFilters={clearAllFilters}
        />
      </PublicFilterSection>

      <section className="container-page public-section max-w-[1400px]">
        {tabItems.length > 0 ? (
          <div className="catalog-search-tabs">
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
                  className={`catalog-search-tab ${
                    isActive ? "catalog-search-tab--active" : "catalog-search-tab--inactive"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              );
            })}
          </div>
        ) : null}

        {hasAnyFilter && !loading && !error ? (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            {activeFilterChips.map((chip) =>
              chip.onClear ? (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.onClear}
                  className="market-active-filter-chip"
                >
                  {chip.label}
                  <span aria-hidden className="ml-1 opacity-70">
                    ×
                  </span>
                </button>
              ) : (
                <span key={chip.label} className="market-active-filter-chip market-active-filter-chip--static">
                  {chip.label}
                </span>
              )
            )}
          </div>
        ) : null}

        <div className="mb-6 flex flex-col gap-2 text-sm text-market-muted md:flex-row md:items-center md:justify-between">
          <p className="market-result-count">
            {totalResults > 0
              ? `Showing ${totalResults} result${totalResults === 1 ? "" : "s"}`
              : hasAnyFilter
                ? "No matches for your filters"
                : "Start with a keyword, state, or business type"}
          </p>
          {hasAnyFilter ? (
            <p className="hidden text-xs uppercase tracking-[0.14em] text-market-muted sm:block">
              Keyword: {queryFilters.keyword || "Any"} · Location: {queryFilters.location || "Any"} · Type:{" "}
              {queryFilters.minorityType || "Any"}
            </p>
          ) : null}
        </div>

        {loading ? (
          <MarketLoadingBlock variant="searchGrid" label="Searching the marketplace…" />
        ) : error ? (
          <MarketDiscoveryPanel
            title="Search temporarily unavailable"
            description="We could not load marketplace results. Please retry or browse a category below."
            onRetry={() => setRetryCount((count) => count + 1)}
            actions={[
              { label: "Browse all products", href: "/products", variant: "primary" },
              { label: "Browse vendors", href: "/vendors", variant: "outline" },
            ]}
            browseLinks={MARKET_BROWSE_LINKS}
          />
        ) : totalResults === 0 && !hasAnyFilter ? (
          <MarketDiscoveryPanel
            title="Discover verified minority-owned businesses"
            description="Search by product, service, state, or business type to find trusted vendors across the marketplace."
            trustNote={SEARCH_TRUST_NOTE}
            showTrustHint
            actions={[
              { label: "Browse all products", href: "/products", variant: "primary" },
              { label: "Browse vendors", href: "/vendors", variant: "outline" },
            ]}
            suggestions={MARKET_SUGGESTED_SEARCHES}
            browseLinks={MARKET_BROWSE_LINKS}
            collections={MARKET_CULTURAL_LINKS}
          />
        ) : totalResults === 0 ? (
          <MarketDiscoveryPanel
            title="No matches for this search"
            description="Try a different keyword, broaden your location, or explore curated categories below."
            trustNote="Verified vendors may still match under different keywords or categories."
            showTrustHint
            activeFilters={activeFilterChips}
            actions={[
              { label: "Clear all filters", onClick: clearAllFilters, variant: "outline" },
              { label: "Browse all products", href: "/products", variant: "primary" },
              { label: "Browse vendors", href: "/vendors", variant: "secondary" },
            ]}
            suggestions={MARKET_ALTERNATE_SEARCHES}
            browseLinks={MARKET_BROWSE_LINKS}
          />
        ) : (
          <>
            {activeTab === "products" ? (
              <>
                {isLowInventory && products.length > 0 ? (
                  <p className="shopper-low-inventory-note">{SHOPPER_LOW_INVENTORY_NOTE}</p>
                ) : null}
                <div
                  className={`public-grid-listing${products.length > 0 && products.length <= 3 ? " public-grid-listing--low-count" : ""}`}
                >
                  {products.map((item) => (
                    <ProductCard key={item._id} item={item} />
                  ))}
                </div>
              </>
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

            {isLowInventory ? (
              <MarketDiscoveryPanel
                compact
                className="mt-8"
                title="Keep exploring"
                description="Discover more products, services, and food vendors across the marketplace."
                showTrustHint
                suggestions={MARKET_SUGGESTED_SEARCHES.slice(0, 4)}
                browseLinks={MARKET_BROWSE_LINKS}
              />
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
