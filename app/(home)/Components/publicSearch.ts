export type PublicSearchFilters = {
  keyword: string;
  location: string;
  minorityType: string;
};

export const DEFAULT_PUBLIC_SEARCH_FILTERS: PublicSearchFilters = {
  keyword: "",
  location: "",
  minorityType: "",
};


// export const US_STATE_OPTIONS = [
//   "Alabama",
//   "Alaska",
//   "New York",
//   "Virginia",
// ] as const;

export const US_STATE_OPTIONS = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
] as const;

export function buildSearchPageUrl(filters: Partial<PublicSearchFilters>): string {
  return buildSearchPageUrlWithTab(filters);
}

/** Extended filters for listing pages and unified search */
export type ListingFilters = PublicSearchFilters & {
  category?: string;
  subcategory?: string;
  badge?: string;
  sort?: string;
  tab?: "products" | "services" | "foods";
  priceMin?: string;
  priceMax?: string;
  page?: string;
};

export const DEFAULT_LISTING_FILTERS: ListingFilters = {
  ...DEFAULT_PUBLIC_SEARCH_FILTERS,
  category: "",
  subcategory: "",
  badge: "",
  sort: "",
  tab: "products",
  priceMin: "",
  priceMax: "",
  page: "",
};

const LEGACY_KEYWORD_KEYS = ["keyword", "q", "search"] as const;
const LEGACY_LOCATION_KEYS = ["location", "city"] as const;

function readFirstParam(params: URLSearchParams, keys: readonly string[]): string {
  for (const key of keys) {
    const value = params.get(key)?.trim();
    if (value) return value;
  }
  return "";
}

/** True when URL uses legacy search param names that should be replaced with canonical q/city */
export function searchParamsUsesLegacyNames(
  params: URLSearchParams | null | undefined
): boolean {
  if (!params) return false;
  return (
    params.has("keyword") ||
    params.has("search") ||
    params.has("location")
  );
}

/** Parse URL search params into listing filters (backward-compat with legacy names) */
export function parseListingFiltersFromSearchParams(
  params: URLSearchParams | null | undefined
): ListingFilters {
  if (!params) return { ...DEFAULT_LISTING_FILTERS };

  const tab = params.get("tab");
  const validTab =
    tab === "products" || tab === "services" || tab === "foods" ? tab : DEFAULT_LISTING_FILTERS.tab;

  return {
    keyword: readFirstParam(params, LEGACY_KEYWORD_KEYS),
    location: readFirstParam(params, LEGACY_LOCATION_KEYS),
    minorityType: params.get("minorityType")?.trim() || "",
    category: params.get("category")?.trim() || params.get("categoryId")?.trim() || "",
    subcategory: params.get("subcategory")?.trim() || params.get("subcategoryId")?.trim() || "",
    badge: params.get("badge")?.trim() || "",
    sort: params.get("sort")?.trim() || "",
    tab: validTab,
    priceMin: params.get("priceMin")?.trim() || "",
    priceMax: params.get("priceMax")?.trim() || "",
    page: params.get("page")?.trim() || "",
  };
}

/** Build a shareable listing page URL with canonical param names */
export function buildListingPageUrl(path: string, filters: Partial<ListingFilters>): string {
  const params = new URLSearchParams();
  const normalized = { ...DEFAULT_LISTING_FILTERS, ...filters };

  if (normalized.keyword?.trim()) params.set("q", normalized.keyword.trim());
  if (normalized.location?.trim()) params.set("city", normalized.location.trim());
  if (normalized.minorityType?.trim()) params.set("minorityType", normalized.minorityType.trim());
  if (normalized.category?.trim()) params.set("category", normalized.category.trim());
  if (normalized.subcategory?.trim()) params.set("subcategory", normalized.subcategory.trim());
  if (normalized.badge?.trim()) params.set("badge", normalized.badge.trim());
  if (normalized.sort?.trim()) params.set("sort", normalized.sort.trim());
  if (normalized.priceMin?.trim()) params.set("priceMin", normalized.priceMin.trim());
  if (normalized.priceMax?.trim()) params.set("priceMax", normalized.priceMax.trim());
  if (normalized.page?.trim()) params.set("page", normalized.page.trim());
  if (normalized.tab && normalized.tab !== "products" && path.startsWith("/search")) {
    params.set("tab", normalized.tab);
  }

  const query = params.toString();
  const base = path.split("?")[0];
  return query ? `${base}?${query}` : base;
}

/** Build search page URL with tab support */
export function buildSearchPageUrlWithTab(filters: Partial<ListingFilters>): string {
  return buildListingPageUrl("/search", filters);
}

/** Convert listing filters to API query params for list endpoints */
export function listingFiltersToApiParams(filters: Partial<ListingFilters>): Record<string, string> {
  const api: Record<string, string> = {};
  if (filters.keyword?.trim()) api.search = filters.keyword.trim();
  if (filters.location?.trim()) api.city = filters.location.trim();
  if (filters.minorityType?.trim()) api.minorityType = filters.minorityType.trim();
  if (filters.category?.trim()) api.categoryId = filters.category.trim();
  if (filters.subcategory?.trim()) api.subcategoryId = filters.subcategory.trim();
  if (filters.badge?.trim()) api.badge = filters.badge.trim();
  if (filters.sort?.trim()) api.sort = filters.sort.trim();
  if (filters.page?.trim()) api.page = filters.page.trim();
  if (filters.priceMin?.trim() && filters.priceMax?.trim()) {
    api.price = `${filters.priceMin}-${filters.priceMax}`;
  }
  return api;
}
