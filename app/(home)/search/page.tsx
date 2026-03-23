"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";

type SearchFilters = {
  keyword: string;
  location: string;
  minorityType: string;
};

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
  filters?: Partial<SearchFilters>;
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

const minorityOptions = [
  { value: "", label: "Choose Minority" },
  { value: "African-American", label: "African-American" },
  { value: "Asian", label: "Asian" },
  { value: "LatinX", label: "LatinX" },
  { value: "Woman", label: "Woman" },
  { value: "Disabled Veteran", label: "Disabled Veteran" },
];

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

function buildSearchApiUrl(filters: SearchFilters): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
  const params = new URLSearchParams();

  if (filters.keyword.trim()) params.set("keyword", filters.keyword.trim());
  if (filters.location.trim()) params.set("location", filters.location.trim());
  if (filters.minorityType.trim()) params.set("minorityType", filters.minorityType.trim());

  return `${base}/api/public/search?${params.toString()}`;
}

function SearchFilterBar({
  filters,
  onChange,
  onSubmit,
}: {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
  onSubmit: () => void;
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full bg-[#1A1F71] py-6 pb-10 text-white">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-end md:gap-6 lg:px-12"
      >
        <div className="min-w-0 flex-[3]">
          <label className="block text-left text-[14px] font-medium text-white font-poppins">
            Filter By Business Type
          </label>
          <input
            type="text"
            placeholder="Type Here"
            value={filters.keyword}
            onChange={(e) => onChange({ ...filters, keyword: e.target.value })}
            className="h-10 w-full bg-white px-4 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-orange"
          />
        </div>

        <div className="min-w-0 flex-1">
          <label className="block text-left text-[14px] font-medium text-white font-poppins">
            Filter By Location
          </label>
          <input
            type="text"
            placeholder="Choose Location"
            value={filters.location}
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
            className="h-10 w-full bg-white px-4 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-orange"
          />
        </div>

        <div className="min-w-0 flex-1">
          <label className="block text-left text-[14px] font-medium text-white font-poppins">
            Filter By Minority
          </label>
          <div className="relative">
            <select
              value={filters.minorityType}
              onChange={(e) => onChange({ ...filters, minorityType: e.target.value })}
              className="h-10 w-full appearance-none bg-white px-4 text-xs text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-custom-orange"
            >
              {minorityOptions.map((option) => (
                <option key={option.value || "empty"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <button
            type="submit"
            className="flex h-10 w-full items-center justify-center bg-[#C7A040] text-sm font-semibold text-white transition-colors hover:bg-[#a88432]"
          >
            Search Here
          </button>
        </div>
      </form>
    </div>
  );
}

function ProductCard({ item }: { item: ApiProduct }) {
  const title = item.title || "Untitled Product";
  const description = stripHtml(item.description);
  const trimmedDescription =
    description.length > 100 ? `${description.slice(0, 100).trimEnd()}...` : description;
  const price = toNumber(item.price);
  const badgeImage = getBadgeImage(item.businessId?.badge);

  return (
    <Link
      href={`/product/${item._id}`}
      className="flex h-full flex-col overflow-hidden border-2 border-[#D9D9D9] bg-white p-2 shadow-lg transition-all duration-300 hover:shadow-2xl"
    >
      <div className="relative w-full flex-shrink-0 overflow-hidden bg-gray-100 aspect-square">
        <img
          src={item.coverImage || "/ShopProduct/Aria-SK6-Helmet 1.png"}
          alt={title}
          className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="h-[42px] line-clamp-2 text-base font-bold uppercase leading-snug tracking-tight text-gray-900 font-poppins">
          {title}
        </h3>
        <p className="mb-2 h-[40px] overflow-hidden text-xs leading-5 text-gray-600 font-montserrat">
          {trimmedDescription || "\u00a0"}
        </p>

        <div className="mb-2 flex items-center">
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <Star key={index} size={14} fill="#FBBF24" stroke="#FBBF24" className="text-yellow-400" />
            ))}
          </div>
          <p className="ml-2 text-[10px] leading-tight text-gray-500 font-poppins">
            {item.businessId?.businessName || "Verified Business"}
          </p>
        </div>

        <div className="mt-auto flex flex-col leading-tight">
          <span className="text-xs text-gray-500">Starting from</span>
          <span className="text-lg font-semibold text-gray-900">${price.toFixed(2)}</span>
        </div>

        <div className="mt-3 flex min-h-[52px] items-center justify-between rounded bg-gray-100 px-4 py-2">
          <span className="text-sm font-semibold text-gray-600">Earned Badge:</span>
          {badgeImage ? (
            <img
              src={badgeImage}
              alt={`${item.businessId?.badge || "Business"} badge`}
              className="h-12 object-contain"
              onError={(e) => {
                e.currentTarget.src = "/badge.png";
              }}
            />
          ) : (
            <div className="h-12 w-[90px]" />
          )}
        </div>
      </div>
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
    <Link
      href={href}
      className="block h-[460px] w-full overflow-hidden border-2 border-[#D9D9D9] bg-white shadow-lg transition-transform hover:-translate-y-0.5"
    >
      <div className="relative h-[220px] w-full flex-shrink-0 bg-gray-100">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
            NO IMAGE
          </div>
        )}

        {logo ? (
          <img
            src={logo}
            alt={`${title} logo`}
            className="absolute bottom-3 right-3 h-14 w-14 rounded-full bg-white object-contain p-1 shadow-md"
          />
        ) : null}
      </div>

      <div className="flex h-[240px] flex-col p-4">
        <h3 className="mb-2 line-clamp-2 min-h-[48px] text-base font-bold text-gray-900">{title}</h3>
        <p
          className="mb-2 min-h-[60px] text-sm text-[#5F5F5F] font-montserrat"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description || "Business information available on vendor profile."}
        </p>

        {/* <p className="mb-3 min-h-[32px] text-xs text-gray-500">{meta || "\u00a0"}</p> */}

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#C7A040]">View Details</span>
          {badgeImage ? (
            <img
              src={badgeImage}
              alt={`${badge || "Business"} badge`}
              className="h-12 object-contain"
              onError={(e) => {
                e.currentTarget.src = "/badge.png";
              }}
            />
          ) : (
            <div className="h-12 w-[90px]" />
          )}
        </div>
      </div>
    </Link>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SearchFilters>({
    keyword: "",
    location: "",
    minorityType: "",
  });
  const [response, setResponse] = useState<SearchApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SearchTab>("products");

  const queryFilters = useMemo(
    () => ({
      keyword: searchParams.get("keyword") || "",
      location: searchParams.get("location") || "",
      minorityType: searchParams.get("minorityType") || "",
    }),
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
  const totalResults = response?.totals?.all ?? 0;

  const tabItems: Array<{ key: SearchTab; label: string; count: number }> = [
    { key: "products", label: "Search For Products", count: response?.totals?.products ?? 0 },
    { key: "services", label: "Search For Services", count: response?.totals?.services ?? 0 },
    { key: "foods", label: "Search For Food Item", count: response?.totals?.foods ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F2]">
      <SearchFilterBar filters={filters} onChange={setFilters} onSubmit={handleSearch} />

      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-12">
        <div className="mb-8 flex flex-col items-center justify-center gap-3 md:flex-row">
          {tabItems.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative min-w-[220px] border px-6 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-[#C7A040] bg-[#C7A040] text-white"
                    : "border-[#B6B8D6] bg-white text-[#1A1F71] hover:border-[#C7A040]"
                }`}
              >
                {tab.label} ({tab.count})
                {isActive ? (
                  <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#C7A040]" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mb-6 flex flex-col gap-2 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
          <p>
            ({totalResults > 0 ? `Showing 1 - ${totalResults} results` : "No results yet"})
          </p>
          <p className="text-xs uppercase tracking-[0.14em] text-gray-500">
            Keyword: {queryFilters.keyword || "Any"} | Location: {queryFilters.location || "Any"} | Minority:{" "}
            {queryFilters.minorityType || "Any"}
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C7A040] border-t-transparent" />
              <p className="text-sm font-medium text-gray-600">Searching results...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
        ) : totalResults === 0 ? (
          <div className="rounded border border-[#E5DEC9] bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900">No results found</h2>
            <p className="mt-2 text-sm text-gray-600">
              Try another business keyword, location, or minority type.
            </p>
          </div>
        ) : (
          <>
            {activeTab === "products" ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((item) => (
                  <ProductCard key={item._id} item={item} />
                ))}
              </div>
            ) : null}

            {activeTab === "services" ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-12">
        <div className="flex min-h-[240px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#c79b44] border-t-transparent" />
            <p className="text-sm font-medium text-gray-500">Loading search...</p>
          </div>
        </div>
      </section>
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
