import { buildSearchPageUrl } from "./publicSearch";

export type MarketBrowseLink = {
  label: string;
  href: string;
};

export type MarketSuggestedSearch = {
  label: string;
  href: string;
};

export type MarketCulturalCollection = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
};

export const MARKET_BROWSE_LINKS: MarketBrowseLink[] = [
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Foods", href: "/foods" },
  { label: "Vendors", href: "/vendors" },
];

const SUGGESTED_KEYWORDS = [
  "Catering",
  "Hair salon",
  "Graphic design",
  "Bakery",
  "Consulting",
  "Handmade jewelry",
  "Photography",
  "Cleaning services",
] as const;

export const MARKET_SUGGESTED_SEARCHES: MarketSuggestedSearch[] = SUGGESTED_KEYWORDS.map(
  (keyword) => ({
    label: keyword,
    href: buildSearchPageUrl({ keyword }),
  })
);

/** Alternate suggestions for zero-results recovery (offset from primary list). */
export const MARKET_ALTERNATE_SEARCHES: MarketSuggestedSearch[] = [
  "Wellness",
  "Event planning",
  "Custom apparel",
  "Landscaping",
  "Tech support",
  "Food truck",
].map((keyword) => ({
  label: keyword,
  href: buildSearchPageUrl({ keyword }),
}));

export const MARKET_CULTURAL_COLLECTIONS: MarketCulturalCollection[] = [
  {
    id: "black-owned",
    title: "Black-Owned Excellence",
    description: "Discover products and services from Black-owned businesses in your community.",
    href: "/search?minorityType=Black",
    image: "/Carousel/nature-3.jpg",
  },
  {
    id: "latinx",
    title: "Latinx Heritage",
    description: "Celebrate culture through food, services, and goods from Latinx entrepreneurs.",
    href: "/search?minorityType=Latinx",
    image: "/Carousel/nature-2.jpg",
  },
  {
    id: "women-owned",
    title: "Women-Owned Ventures",
    description: "Support women-led businesses building the future of local commerce.",
    href: "/search?minorityType=Woman",
    image: "/Carousel/nature-1.jpg",
  },
];

/** Compact cultural links for discovery panels (title + href only). */
export const MARKET_CULTURAL_LINKS = MARKET_CULTURAL_COLLECTIONS.map(({ title, href }) => ({
  title,
  href,
}));
