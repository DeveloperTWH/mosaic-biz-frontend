"use client"
import React, { useState, useEffect, Suspense } from 'react'
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation";
import PublicPageHero from "../Components/PublicPageHero";
import CategoryGrid from './components/CategoryGrid';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import ProductSevices from './components/ProductServices';
import { Service } from '@/types/service';
import JoinVendorBanner from './components/JoinVendorBanner';
import BrowseCategories from './components/BrowsCategories';
import FilterAccordion from './components/FilterAccordion';
import { Category, SubCategory, SubCategoryResponse, CategoryResponse } from '@/types/Category';
import Link from 'next/link';
import PublicSearchFilterBar from "../Components/PublicSearchFilterBar";
import PublicFilterSection from "../Components/PublicFilterSection";
import { buildSearchPageUrl, parseListingFiltersFromSearchParams, buildListingPageUrl, PublicSearchFilters } from "../Components/publicSearch";
import { useListingFilters } from "@/hooks/useListingFilters";
import MarketImage from "../Components/MarketImage";
import MarketLoadingBlock from "../Components/MarketLoadingBlock";

type MinorityType = { _id: string; name: string };

type RankedItem = {
  _id: string;
  slug?: string;
  title: string;
  description?: string;
  coverImage?: string;
  variantRatingAvg?: number;
  variantRatingCount?: number;
  totalReviews?:number;
  averageRating : number;
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

const HorizontalLine = () => {
  return <p style={{ borderTop: '2px solid', color : "#2E2E2E",  margin: '10px 0' }}></p> ;
};

const ProductsPageInner = () => {
    const router = useRouter();
    const { filters: urlFilters, setFilters: setUrlFilters } = useListingFilters("/products");

    const [searchText, setSearchText] = useState("");
    const [minorityType, setMinorityType] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [products, setProducts] = useState([]);
    const [loadingn, setLoading] = useState(true);
    const [minorityTypes, setMinorityTypes] = useState<MinorityType[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedBadge, setSelectedBadge] = useState("");
    const [priceMin, setPriceMin] = useState<number | undefined>();
    const [priceMax, setPriceMax] = useState<number | undefined>();
    const [totalProducts, setTotalProducts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const prevButton = React.useRef(null);
    const nextButton = React.useRef(null);
    const [swiperRef, setSwiperRef] = React.useState<any>(null);

    const { items, error, loading, reload } = useRankedProducts();

    useEffect(() => {
        const fetchMinorityTypes = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/minority-types`);
                const data = await res.json();
                setMinorityTypes(Array.isArray(data) ? (data as MinorityType[]) : []);
            } catch (err) {
                console.error('Failed to load minority types', err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/products`);
                const data: CategoryResponse = await res.json();
                setCategories(data.data.productCategories);
            } catch (err) {
                console.error('Failed to load categories', err);
            }
        };

        fetchMinorityTypes();
        fetchCategories();
    }, []);

    const fetchProducts = async (q?: string, m?: string, c?: string, categoryId?: string, subcategoryId?: string, badge?: string, priceMin?: number, priceMax?: number) => {
        setLoading(true);
        try {
            const defaultLimit = 10;
            const params: any = {
                search: (q ?? searchText) || "",
                city: (c ?? searchLocation) || "",
                minorityType: (m ?? minorityType) || "",
                page: 1,
                limit: defaultLimit,
            };
            
            if (categoryId) params.categoryId = categoryId;
            if (subcategoryId) params.subcategoryId = subcategoryId;
            if (badge) params.badge = badge;
            if (priceMin !== undefined && priceMax !== undefined) {
                params.price = `${priceMin}-${priceMax}`;
            }

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/list`, {
                params,
            });
            const responseData = res.data || {};
            const apiProducts = Array.isArray(responseData.data) ? responseData.data : [];
            // console.log("api", apiProducts)
            setProducts(apiProducts);
            setTotalProducts(Number(responseData.total ?? apiProducts.length ?? 0));
            setCurrentPage(Number(responseData.page ?? params.page ?? 1));
            setItemsPerPage(Number(responseData.pageSize ?? responseData.limit ?? params.limit ?? defaultLimit));
        } catch (err) {
            console.error("Error fetching products", err);
            setProducts([]);
            setTotalProducts(0);
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const mt = minorityTypes.find((t: MinorityType) => String(t._id) === String(minorityType));
        router.push(buildSearchPageUrl({
            keyword: searchText,
            location: searchLocation,
            minorityType: mt?.name || minorityType,
        }));
    };

    const [services, setServices] = useState<Service[]>([]);
    const fetchServices = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/list`, {
                params: {
                    search: searchText,
                    city: searchLocation,
                    minorityType,
                    page: 1,
                    limit: 10,
                },
            });
            setServices(res.data.data || []);
        } catch (err) {
            console.error("Error fetching services", err);
            setServices([]);
        }
    };

    useEffect(() => {
        setSearchText(urlFilters.keyword);
        setSearchLocation(urlFilters.location);
        setMinorityType(urlFilters.minorityType);
        if (urlFilters.badge) setSelectedBadge(urlFilters.badge);
        if (urlFilters.category && categories.length) {
            const cat = categories.find((c) => c._id === urlFilters.category);
            if (cat) setSelectedCategory(cat);
        }
    }, [urlFilters, categories]);

    useEffect(() => {
        fetchProducts(
            urlFilters.keyword,
            urlFilters.minorityType,
            urlFilters.location,
            urlFilters.category,
            urlFilters.subcategory,
            urlFilters.badge,
            urlFilters.priceMin ? Number(urlFilters.priceMin) : undefined,
            urlFilters.priceMax ? Number(urlFilters.priceMax) : undefined
        );
    }, [urlFilters]);

    return (
        <div>
            <PublicPageHero
                title="Shop"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Shop" },
                ]}
                imageUrl="/bgdetailpage.png"
            />
            
            <FilterSection 
                filters={{
                    keyword: searchText,
                    location: searchLocation,
                    minorityType,
                }}
                onFiltersChange={(filters) => {
                    setSearchText(filters.keyword);
                    setSearchLocation(filters.location);
                    setMinorityType(filters.minorityType);
                }}
                onSearch={() => {
                    setLoading(true);
                    handleSearch();
                }}
                selectedCategory={selectedCategory} 
                onCategorySelect={(category) => {
                    setSelectedCategory(category);
                    setSelectedSubcategory("");
                    fetchProducts('', '', '', category._id);
                }} 
            />
            
            {loadingn && (
                <MarketLoadingBlock label="Searching products…" minHeight="min-h-[120px]" />
            )}
            
            <div className="relative px-4 py-10 sm:px-6">
                <div className="absolute top-1/2 left-2 z-10 -translate-y-1/2 sm:left-4">
                    <button
                        ref={prevButton}
                        type="button"
                        className="market-carousel-btn h-11 w-11 sm:h-12 sm:w-12"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="absolute top-1/2 right-2 z-10 -translate-y-1/2 sm:right-4">
                    <button
                        ref={nextButton}
                        type="button"
                        className="market-carousel-btn h-11 w-11 sm:h-12 sm:w-12"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex flex-col items-center text-center">
                    <h2 className="font-poppins text-2xl font-semibold text-market-text sm:text-3xl">
                        What&apos;s Hot. What&apos;s Trusted. What&apos;s Moving
                    </h2>
                    <div className="market-section-divider mt-4" />
                    <p className="mt-4 max-w-2xl font-montserrat text-sm text-market-muted sm:text-base">
                        Discover top-rated products and services that customers love—updated in real time
                    </p>
                </div>

                {/* Products Carousel */}
                <Swiper
                    onSwiper={setSwiperRef}
                    modules={[Navigation]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                        1280: {
                            slidesPerView: 4,
                            spaceBetween: 0,
                        },
                    }}
                    navigation={{
                        prevEl: prevButton.current,
                        nextEl: nextButton.current,
                    }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    className="py-4"
                >
                    {items?.map((p) => (
                        <SwiperSlide key={p._id} className="py-4 h-auto flex justify-center">
                            <ProductCard item={p} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <ProductSevices 
                services={products}
                totalProducts={totalProducts}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                selectedCategory={selectedCategory}
                loading={loadingn}
                onCategorySelect={(categoryId) => {
                    const category = categories.find(cat => cat._id === categoryId);
                    if (category) {
                        setSelectedCategory(category);
                        setSelectedSubcategory("");
                    }
                    setUrlFilters({ category: categoryId, subcategory: "" }, { replace: true });
                }}
                onSubcategorySelect={(subcategoryId) => {
                    setUrlFilters({ subcategory: subcategoryId }, { replace: true });
                }}
                onBadgeSelect={(badge) => {
                    setSelectedBadge(badge);
                    setUrlFilters({ badge }, { replace: true });
                }}
                onPriceChange={(min, max) => {
                    setPriceMin(min);
                    setPriceMax(max);
                    setUrlFilters({ priceMin: String(min), priceMax: String(max) }, { replace: true });
                }}
                onCategoryFilter={(category, subCategory) => {
                    console.log('Category filter from ProductServices:', category, subCategory);
                }}
            />
            <JoinVendorBanner />
        </div>
    )
}

function FilterSection({ filters, onFiltersChange, onSearch, selectedCategory, onCategorySelect }: { 
    filters: PublicSearchFilters;
    onFiltersChange: (filters: PublicSearchFilters) => void;
    onSearch?: () => void;
    selectedCategory?: Category | null;
    onCategorySelect?: (category: Category) => void;
}) {
    return (
        <>
            <PublicFilterSection>
                <PublicSearchFilterBar filters={filters} onChange={onFiltersChange} onSubmit={() => onSearch?.()} />
            </PublicFilterSection>

            <BrowseCategories onCategorySelect={onCategorySelect} />
        </>
    );
}

function isAbortError(e: any) {
    return e?.name === "AbortError" || e?.code === 20 || /aborted/i.test(e?.message || "");
}

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
            console.log(url)
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
            if (isAbortError(e)) return;
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

const PAGE = 1;
const PAGE_SIZE = 8;
const MAX_PER_VENDOR = 3;

function buildRankedUrl(): string {
    const rankedPath = process.env.NEXT_PUBLIC_RANKED_PATH?.replace(/\/$/, "") || "/api/ranked";
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

function pickRatingCount(p: RankedItem): number {
    return Number(p.averageRating ?? 0) || 0;
}

function pickPrice(p: RankedItem) {
    const fe = p.firstEligible;
    if (fe) {
        return {
            price: Number(fe.price),
            salePrice: fe.salePrice ?? null,
            effective: fe.effectivePrice ?? Number(fe.price),
            onSale: fe.onSale ?? false,
            size: fe.size,
            label: fe.label,
            color: fe.color,
        };
    }

    const apiPrice = Number((p as any).price?.$numberDecimal ?? 0);
    return {
        price: apiPrice,
        salePrice: null,
        effective: apiPrice,
        onSale: false,
        size: undefined,
        label: undefined,
        color: undefined,
    };
}

function pickRating(p: RankedItem): number {
    const raw = p.averageRating ?? 0;
    const n = typeof raw === "number" ? raw : Number(raw) || 0;
    return Math.max(0, Math.min(5, n));
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
}

function ProductCard({ item }: { item: RankedItem }) {
    const router = useRouter();
    const href = `/product/${item._id}`;
    const title = pickTitle(item);
    const description = item.description ?? "";
    const strippedDescription = stripHtml(description);
    const trimmedDescription =
        strippedDescription.length > 100 ? `${strippedDescription.slice(0, 100).trimEnd()}...` : strippedDescription;
    const images = gatherImages(item);
    const { price, effective, onSale } = pickPrice(item);
    const rating = pickRating(item);
    const ratingCount = pickRatingCount(item);

    // const avgRating = item.averageRating
    const reviewCount = item.totalReviews;

    const fullStars = Math.floor(rating);
    const fractional = rating % 1;
    const hasHalfStar = fractional >= 0.25 && fractional < 0.75;

    const handleCardClick = () => {
        router.push(`/product/${item._id}`);
    };

    return (
        <div 
            onClick={handleCardClick}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
            role="button"
            tabIndex={0}
            className="market-card flex h-[460px] w-full max-w-[300px] cursor-pointer flex-col overflow-hidden p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-market-bg"
        >
            <div className="market-card-media relative aspect-square w-full flex-shrink-0">
                <MarketImage src={images[0]} alt={title} aspect="square" objectFit="contain" />
                
                {onSale && (
                    <div className="absolute top-3 left-3">
                        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                            SALE
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-3">
                <h3 className="market-card-title line-clamp-2 h-[42px]">
                    {title}
                </h3>

                <p className="market-card-desc mb-2 h-[40px] overflow-hidden">
                    {trimmedDescription || "\u00a0"}
                </p>

                {(rating > 0 || (reviewCount ?? 0) > 0) && (
                <div className="min-h-[20px] flex-shrink-0">
                    <div className="mb-1 flex items-center">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    fill={i < fullStars ? "#E2B84B" : i === fullStars && hasHalfStar ? "#E2B84B" : "transparent"}
                                    stroke={i < fullStars || (i === fullStars && hasHalfStar) ? "#E2B84B" : "#A9A2D8"}
                                    className={i < fullStars || (i === fullStars && hasHalfStar) ? "text-market-gold" : "text-market-muted/40"}
                                />
                            ))}
                        </div>
                        <p className="ml-2 font-poppins text-[10px] leading-tight text-market-muted">
                            {ratingCount} Ratings And {reviewCount} Reviews
                        </p>
                    </div>
                </div>
                )}

                <div className="mt-auto flex-shrink-0">
  {onSale ? (
    <div className="flex flex-col leading-tight">
      <span className="text-xs text-market-muted">
        Starting from
      </span>
      <div className="flex items-center gap-3">
        <span className="market-card-price-sale text-base">
          ${effective.toFixed(2)}
        </span>
        <span className="text-sm text-market-muted line-through">
          ${price.toFixed(2)}
        </span>
      </div>
    </div>
  ) : (
    <div className="flex flex-col leading-tight">
      <span className="text-xs text-market-muted">
        Starting from
      </span>
      <span className="market-card-price text-base">
        ${price.toFixed(2)}
      </span>
    </div>
  )}
</div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<MarketLoadingBlock label="Loading shop…" minHeight="min-h-[40vh]" />}>
            <ProductsPageInner />
        </Suspense>
    );
}

