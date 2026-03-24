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
  const params = new URLSearchParams();

  if (filters.keyword?.trim()) {
    params.set("keyword", filters.keyword.trim());
  }

  if (filters.location?.trim()) {
    params.set("location", filters.location.trim());
  }

  if (filters.minorityType?.trim()) {
    params.set("minorityType", filters.minorityType.trim());
  }

  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

export function buildListingSearchParams(filters: Partial<PublicSearchFilters>): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.keyword?.trim()) {
    params.set("q", filters.keyword.trim());
  }

  if (filters.location?.trim()) {
    params.set("city", filters.location.trim());
  }

  if (filters.minorityType?.trim()) {
    params.set("minorityType", filters.minorityType.trim());
  }

  return params;
}
