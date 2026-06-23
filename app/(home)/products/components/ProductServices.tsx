import React, { useState } from "react";
import { Service } from "@/types/service";
import { Category } from "@/types/Category";
import Image from "next/image";
import Link from "next/link";
import FilterAccordion from "./FilterAccordion";
import MarketImage from "../../Components/MarketImage";
import CardRatingRow from "../../Components/CardRatingRow";
import MarketLoadingBlock from "../../Components/MarketLoadingBlock";
import MarketEmptyState from "../../Components/MarketEmptyState";
import PublicProductCard from "../../Components/publicCards/PublicProductCard";
import { mapRankedItemToPublicProductCard } from "../../Components/publicCards/publicProductCardMappers";
import { SHOPPER_LOW_INVENTORY_NOTE } from "../../Components/marketTrustProof";
import MobileFilterDrawer from "../../Components/MobileFilterDrawer";


interface BookServicesProps {
  services: Service[];
  totalProducts?: number;
  currentPage?: number;
  itemsPerPage?: number;
  selectedCategory?: Category | null;
  loading?: boolean;
  onSubcategorySelect?: (subcategoryId: string) => void;
  onCategorySelect?: (categoryId: string) => void;
  onCategoryFilter?: (category: string, subCategory: string) => void;
  onBadgeSelect?: (badge: string) => void;
  onPriceChange?: (min: number, max: number) => void;
}

type RankedItem = {
  _id: string;
  slug?: string;
  title: string;
  description?: string;
  coverImage?: string;
  variantRatingAvg?: number;
  variantRatingCount?: number;
  totalReviews : number;
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

const ProductSevices: React.FC<BookServicesProps> = ({ 
  services, 
  totalProducts = 0,
  currentPage = 1,
  itemsPerPage = 40,
  selectedCategory,
  loading = false,
  onSubcategorySelect,
  onCategorySelect,
  onCategoryFilter,
  onBadgeSelect,
  onPriceChange
}) => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    subCategory: "",
    badge: ""
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const safeTotalProducts = Number(totalProducts) || 0;
  const startItem = safeTotalProducts === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = safeTotalProducts === 0 ? 0 : Math.min(currentPage * itemsPerPage, safeTotalProducts);

const handleFilterChange = (filterType: keyof typeof selectedFilters, value: string) => {
  setSelectedFilters(prev => ({
    ...prev,
    [filterType]: prev[filterType] === value ? "" : value
  }));
};


  const filterPanel = (
    <FilterAccordion
      selectedCategory={selectedCategory}
      onFilterChange={(category, subCategory) => {
        onCategoryFilter?.(category, subCategory);
      }}
      onCategorySelect={onCategorySelect}
      onSubcategorySelect={onSubcategorySelect}
      onBadgeSelect={onBadgeSelect}
      onPriceChange={onPriceChange}
    />
  );

  return (
    <section className="container-page py-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="hidden w-full lg:block lg:w-[300px] lg:flex-none">
          <div className="space-y-6">{filterPanel}</div>
        </div>

        <div className="w-full min-w-0 flex-1">
          <button
            type="button"
            className="market-btn-secondary mb-4 w-full min-h-11 lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
          >
            Filters
          </button>

          <MobileFilterDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            resultCount={safeTotalProducts}
          >
            {filterPanel}
          </MobileFilterDrawer>
          {/* Products Count - Compact */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
   
            <p className="market-result-count">
              (Showing {startItem} – {endItem} Products Of {safeTotalProducts} Products)
            </p>

                <div className="flex items-center gap-2">
                  <span className="market-result-count">Sort:</span>
                  <span className="market-result-count text-market-muted">Featured</span>
                </div>
              
          </div>

          {/* Services Grid - Compact Cards */}
          {loading ? (
            <MarketLoadingBlock label="Loading products…" minHeight="min-h-[256px]" />
          ) : services.length === 0 ? (
            <MarketEmptyState
              title="No products found"
              description="Try adjusting your filters or search the marketplace."
              ctaLabel="Search marketplace"
              ctaHref="/search"
            />
          ) : (
            <>
              {services.length <= 3 ? (
                <p className="shopper-low-inventory-note">{SHOPPER_LOW_INVENTORY_NOTE}</p>
              ) : null}
              <div className={`public-grid-listing ${services.length <= 3 ? "public-grid-listing--low-count" : ""}`}>
                {services.map((service) => (
                  <PublicProductCard key={service._id} {...mapRankedItemToPublicProductCard(service as RankedItem)} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};


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

function pickTitle(p: RankedItem): string {
  return p.title ?? "Untitled Product";
}
function gatherImages(p: RankedItem): string[] {
  const arr = [
    ...(p.firstEligible?.images || []),
    ...(p.coverImage ? [p.coverImage] : []),
  ];
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

function pickRatingCount(p: any): number {
  return Number(p.averageRating ?? 0) || 0;
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
function pickRating(p: any): number {
  const raw = p.averageRating ?? 0;
  const n = typeof raw === "number" ? raw : Number(raw) || 0;
  return Math.max(0, Math.min(5, n));
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

function pickBadgeValue(item: any): string | null {
  const rawBadge =
    item?.badge ??
    item?.businessDetails?.badge ??
    item?.businessId?.badge ??
    null;

  if (typeof rawBadge !== "string") return null;
  const trimmed = rawBadge.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function buildBadgeImagePath(badge: string): string {
  const compact = badge.toLowerCase().replace(/[\s_-]+/g, "");
  const knownBadges: Record<string, string> = {
    silver: "silver",
    gold: "gold",
    platinum: "platinum",
    diamond: "diamond",
  };

  if (knownBadges[compact]) {
    return `/badge/${knownBadges[compact]}.png`;
  }

  return `/badge/${badge.replace(/\s+/g, "-").toLowerCase()}.png`;
}

function ProductCard({ item }: { item: RankedItem }) {
  return <PublicProductCard {...mapRankedItemToPublicProductCard(item)} />;
}

export default ProductSevices;


