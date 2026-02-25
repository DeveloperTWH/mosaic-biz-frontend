"use client"
import React, { useState, useEffect } from 'react'
import axios from "axios"
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import FilterBar from "./components/FilterBar";
import HeroSection from "./components/HeroSection";
import CategoryGrid from './components/CategoryGrid';
import FeaturedProducts from './components/FeaturedProducts';
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

type MinorityType = { _id: string; name: string };

type RankedItem = {
  _id: string;
  slug?: string;
  title: string;
  description?: string;
  coverImage?: string;
  variantRatingAvg?: number;
  variantRatingCount?: number;
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

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

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
            const params: any = {
                search: (q ?? searchText) || "",
                city: (c ?? searchLocation) || "",
                minorityType: (m ?? minorityType) || "",
                page: 1,
                limit: 10,
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
            setProducts(res.data.data || []);
        } catch (err) {
            console.error("Error fetching products", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchText) params.set("q", searchText);
        if (searchLocation) params.set("city", searchLocation);

        if (minorityType) {
            const mt = minorityTypes.find((t: MinorityType) => String(t._id) === String(minorityType));
            const nameOrId = mt?.name || minorityType;
            params.set("minorityType", nameOrId);
        }

        router.push(`${pathname}?${params.toString()}`);
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
        const q = searchParams.get("q") || "";
        const mRaw = searchParams.get("minorityType") || "";
        const c = searchParams.get("city") || "";

        const isHex24 = /^[a-f\d]{24}$/i.test(mRaw);
        let mResolved = mRaw;
        if (mRaw && !isHex24) {
            const match = minorityTypes.find((t: MinorityType) => String(t.name).toLowerCase() === String(mRaw).toLowerCase());
            mResolved = match?._id ? String(match._id) : "";
        }

        if (q !== searchText) setSearchText(q);
        if (mResolved !== minorityType) setMinorityType(mResolved);
        if (c !== searchLocation) setSearchLocation(c);

        fetchProducts(q, mResolved, c);
        fetchServices()
    }, [searchParams, minorityTypes]);

    return (
        <div>
            <HeroSection heading="Services" imageUrl="/bgdetailpage.png" />
            
            <FilterSection 
                onSearch={(filters) => {
                    console.log('Filter search triggered:', filters);
                    setLoading(true);
                    fetchProducts(filters.businessType, filters.minority, filters.location);
                }} 
                selectedCategory={selectedCategory} 
                onCategorySelect={(category) => {
                    setSelectedCategory(category);
                    setSelectedSubcategory("");
                    fetchProducts('', '', '', category._id);
                }} 
            />
            
            {loadingn && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="mt-2 text-gray-600">Searching products...</p>
                </div>
            )}
            
            <div className="relative p-10">
                {/* Navigation Buttons */}
                <div className="absolute top-1/2 left-10 -translate-y-1/2 -translate-x-4 z-10">
                    <button
                        ref={prevButton}
                        className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
                
                <div className="absolute top-1/2 right-10 -translate-y-1/2 translate-x-4 z-10">
                    <button
                        ref={nextButton}
                        className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                </div>

                <div className='flex flex-col items-center'>
                    <p className='text-3xl'>BEST SELLERS</p>
                    <div className="flex flex-col items-center justify-center">
                        <hr className="h-[2px] w-[100px] bg-gray-700" />
                        <hr className="h-[2px] w-[100px] mt-[2px] mb-4 bg-gray-700" />
                    </div>
                    <p className='w-[50%] text-xs text-[#2E2E2E] text-center font-thin text-montserrat'>
                        A dynamic carousel of best-selling items with animated “Top Pick” badges and 5-star ratings.
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
                            spaceBetween: 30,
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
                selectedCategory={selectedCategory}
                loading={loadingn}
                onCategorySelect={(categoryId) => {
                    const category = categories.find(cat => cat._id === categoryId);
                    if (category) {
                        setSelectedCategory(category);
                        setSelectedSubcategory("");
                    }
                    fetchProducts('', '', '', categoryId, undefined);
                }}
                onSubcategorySelect={(subcategoryId) => {
                    fetchProducts('', '', '', selectedCategory?._id, subcategoryId);
                }}
                onBadgeSelect={(badge) => {
                    setSelectedBadge(badge);
                    fetchProducts('', '', '', selectedCategory?._id, selectedSubcategory || undefined, badge, priceMin, priceMax);
                }}
                onPriceChange={(min, max) => {
                    setPriceMin(min);
                    setPriceMax(max);
                    fetchProducts('', '', '', selectedCategory?._id, selectedSubcategory || undefined, selectedBadge, min, max);
                }}
                onCategoryFilter={(category, subCategory) => {
                    console.log('Category filter from ProductServices:', category, subCategory);
                }}
            />
            <JoinVendorBanner />
        </div>
    )
}

function FilterSection({ onSearch, selectedCategory, onCategorySelect }: { 
    onSearch?: (filters: { businessType: string; location: string; minority: string }) => void;
    selectedCategory?: Category | null;
    onCategorySelect?: (category: Category) => void;
}) {
    const [businessType, setBusinessType] = useState("");
    const [location, setLocation] = useState("");
    const [minority, setMinority] = useState("");

    const fetchSubcategories = async (categoryId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/subcategories/${categoryId}`);
            const data: SubCategoryResponse = await response.json();
        } catch (err) {
            console.error('Error fetching subcategories:', err);
        }
    };

    const handleCategorySelect = (category: Category) => {
        fetchSubcategories(category._id);
    };

    const handleSearch = () => {
        console.log('Products page search clicked with filters:', { businessType, location, minority, category: selectedCategory?.name });
        onSearch?.({ businessType, location, minority });
    };

    return (
        <>
            <div className="w-full bg-[#1A1F71] py-6 text-center text-white pb-10">
                <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
                        <div className="flex-[3] min-w-0">
                            <label className="block text-left text-[14px] font-medium text-white font-poppins">
                                Filter By Business Type
                            </label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                value={businessType}
                                onChange={(e) => setBusinessType(e.target.value)}
                                className="w-full h-10 px-4 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-custom-orange text-xs font-poppins"
                            />
                        </div>

                        <div className="flex-[1] min-w-0">
                            <label className="block text-left text-[14px] font-medium text-white font-poppins">
                                Filter By Location
                            </label>
                            <div className="relative">
                                <select 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full h-10 px-4 text-gray-700 bg-white text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-custom-orange text-[#5F5F5F] font-poppins">
                                    <option value="">Choose Location</option>
                                    <option value="ny">New York City</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                    <svg className="w-full h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <label className="block text-left text-[14px] font-medium text-white font-poppins">
                                Filter By Minority
                            </label>
                            <div className="relative">
                                <select 
                                    value={minority}
                                    onChange={(e) => setMinority(e.target.value)}
                                    className="w-full h-10 px-4 text-gray-700 bg-white text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-custom-orange text-[#5F5F5F] font-poppins">
                                    <option value="">Choose Minority</option>
                                    <option value="african-american">African-American</option>
                                    <option value="asian">Asian</option>
                                    <option value="latinx">LatinX</option>
                                    <option value="woman">Woman</option>
                                    <option value="disabled-veteran">Disabled Veteran</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <button 
                                onClick={handleSearch}
                                className="w-full h-10 text-sm text-white font-xs text-gray-800 bg-[#C7A040] hover:bg-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-600 flex items-center justify-center gap-2 font-montserrat">
                                Search Here
                            </button>
                        </div>
                    </div>
                </div>
            </div>

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
    return Number(p.variantRatingCount ?? 0) || 0;
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
    const raw = p.variantRatingAvg ?? 0;
    const n = typeof raw === "number" ? raw : Number(raw) || 0;
    return Math.max(0, Math.min(5, n));
}

function ProductCard({ item }: { item: RankedItem }) {
    const router = useRouter();
    const href = `/product/${item._id}`;
    const title = pickTitle(item);
    const description = item.description ?? "";
    const trimmedDescription =
        description.length > 100 ? `${description.slice(0, 100).trimEnd()}...` : description;
    const images = gatherImages(item);
    const { price, effective, onSale } = pickPrice(item);
    const rating = pickRating(item);
    const ratingCount = pickRatingCount(item);
    const reviewCount = 5;

    const fullStars = Math.floor(rating);
    const fractional = rating % 1;
    const hasHalfStar = fractional >= 0.25 && fractional < 0.75;

    const handleCardClick = () => {
        router.push(`/product/${item._id}`);
    };

    return (
        <div 
            onClick={handleCardClick}
            className="bg-green p-2 border-2 border-[#D9D9D9] w-full max-w-[300px] h-[460px] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
        >
            {/* Product Image - Square (1:1 like 1080x1080) */}
            <div className="relative w-full aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                    src={images[0]}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                />
                
                {onSale && (
                    <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                            SALE
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info - Flex grow to fill space */}
            <div className="p-3 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight leading-snug font-poppins line-clamp-2 h-[42px]">
                    {title}
                </h3>

                {/* Description */}
                <p className="mb-2 text-xs text-gray-600 leading-5 font-montserrat h-[40px] overflow-hidden">
                    {trimmedDescription || "\u00a0"}
                </p>

                {/* Rating and Reviews */}
                <div className="flex-shrink-0 min-h-[20px]">
                    <div className="flex items-center mb-1">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    fill={i < fullStars ? "#FBBF24" : i === fullStars && hasHalfStar ? "#FBBF24" : "#E5E7EB"}
                                    stroke={i < fullStars ? "#FBBF24" : i === fullStars && hasHalfStar ? "#FBBF24" : "#D1D5DB"}
                                    className={i < fullStars || (i === fullStars && hasHalfStar) ? "text-yellow-400" : "text-gray-300"}
                                />
                            ))}
                        </div>
                        <p className="text-[10px] ml-2 text-gray-500 font-poppins leading-tight">
                            {ratingCount} Ratings And {reviewCount} Reviews
                        </p>
                    </div>
                </div>

                {/* Price */}
                <div className="flex-shrink-0 mt-auto">
                    {onSale ? (
                        <div className="flex items-center gap-3">
                            <span className="text-base font-bold text-red-600">
                                ${effective.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                                ${price.toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-base font-bold text-gray-900">
                            ${price.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Page;

