"use client"

import React, { Suspense, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryGrid from "./components/CategoryGrid";
import PublicPageHero from "../Components/PublicPageHero";
import BookServices from "./components/BookYourServices";
import FeatureBlogs from "../Components/FeatureBlogs";
import { Service } from "@/types/service";
import FilterAccordion from "./components/FilterAccordion";
import JoinVendorBanner from "./components/JoinVendorBanner";
import BrowseServices from "../Components/BrowsServices";
import { Category, SubCategory, SubCategoryResponse, ServiceCategoryResponse } from "@/types/Category";
import PublicSearchFilterBar from "../Components/PublicSearchFilterBar";
import PublicFilterSection from "../Components/PublicFilterSection";
import { buildSearchPageUrl, PublicSearchFilters } from "../Components/publicSearch";

type MinorityType = { _id: string; name: string };
type ServicesListResponse = {
  success?: boolean;
  data?: Service[];
  total?: number;
  page?: number;
  totalPages?: number;
  limit?: number;
};

const ServicePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const [minorityType, setMinorityType] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [totalServices, setTotalServices] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("");
  const [priceMin, setPriceMin] = useState<number | undefined>();
  const [priceMax, setPriceMax] = useState<number | undefined>();
  const [minorityTypes, setMinorityTypes] = useState<MinorityType[]>([]);
  const latestRequestIdRef = useRef(0);
  const searchParamsKey = searchParams.toString();

  const fetchServices = async (
    categoryId?: string,
    subcategoryId?: string,
    badge?: string,
    priceMin?: number,
    priceMax?: number,
    q?: string,
    m?: string,
    c?: string,
  ) => {
    const requestId = ++latestRequestIdRef.current;
    setLoading(true);
    setFetchError(null);
    try {
      const params: any = {
        search: q ?? searchText,
        city: c ?? searchLocation,
        minorityType: m ?? minorityType,
        page: 1,
        limit: 10,
      };
      
      if (categoryId) params.categoryId = categoryId;
      if (subcategoryId) params.subcategoryId = subcategoryId;
      if (badge) params.badge = badge;
      if (priceMin !== undefined && priceMax !== undefined) {
        params.price = `${priceMin}-${priceMax}`;
      }

      const res = await axios.get<ServicesListResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/list`, {
        params,
      });

      if (requestId !== latestRequestIdRef.current) {
        return;
      }

      setServices(Array.isArray(res.data.data) ? res.data.data : []);
      setTotalServices(typeof res.data.total === "number" ? res.data.total : 0);
      setCurrentPage(typeof res.data.page === "number" ? res.data.page : 1);
      setItemsPerPage(typeof res.data.limit === "number" ? res.data.limit : Number(params.limit) || 10);
    } catch (err) {
      console.error(err);
      if (requestId === latestRequestIdRef.current) {
        setFetchError("Unable to load services right now. Please try again.");
        setServices([]);
        setTotalServices(0);
      }
    } finally {
      if (requestId === latestRequestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/subcategories/${categoryId}`);
      const data: SubCategoryResponse = await response.json();
      // setSubcategories(data.data); // Removed - handled by FilterAccordion
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      // setSubcategories([]); // Removed - handled by FilterAccordion
    }
  };

  const syncCategoryInUrl = (category: Category) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("categoryId", category._id);
    params.set("categorySlug", category.slug);
    router.replace(`/services?${params.toString()}`);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("");
    syncCategoryInUrl(category);
    fetchServices(category._id, undefined);
  };

  useEffect(() => {
    const fetchMinorityTypes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/minority-types`);
        const data = await res.json();
        setMinorityTypes(Array.isArray(data) ? (data as MinorityType[]) : []);
      } catch (err) {
        console.error('Failed to load minority types', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/services`);
        const data: ServiceCategoryResponse = await res.json();
        setCategories(data.data.serviceCategories);
      } catch (err) {
        console.error('Failed to load service categories', err);
      }
    };
    fetchMinorityTypes();
    fetchCategories();
  }, []);

  useEffect(() => {
    const hasCategoryFilter = Boolean(searchParams.get("categoryId") || searchParams.get("categorySlug"));

    if (hasCategoryFilter) {
      return;
    }

    fetchServices();
  }, [searchParams]);

  useEffect(() => {
    if (categories.length === 0) {
      return;
    }

    const categoryId = searchParams.get("categoryId");
    const categorySlug = searchParams.get("categorySlug");

    if (!categoryId && !categorySlug) {
      return;
    }

    const matchedCategory =
      categories.find((category) => category._id === categoryId) ??
      categories.find((category) => category.slug === categorySlug);

    if (!matchedCategory || selectedCategory?._id === matchedCategory._id) {
      return;
    }

    setSelectedCategory(matchedCategory);
    setSelectedSubcategory("");
    fetchServices(matchedCategory._id, undefined, selectedBadge, priceMin, priceMax);
  }, [categories, searchParamsKey, selectedCategory?._id, selectedBadge, priceMin, priceMax]);

  const handleSearch = () => {
    const match = minorityTypes.find((type) => String(type._id) === String(minorityType));
    router.push(buildSearchPageUrl({
      keyword: searchText,
      location: searchLocation,
      minorityType: match?.name || minorityType,
    }));
  };

  return (
    <main>
      <PublicPageHero
        title="Services"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
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
        onSearch={handleSearch}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {fetchError ? (
        <div className="mx-auto max-w-[1400px] px-4 py-6">
          <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {fetchError}{" "}
            <button
              type="button"
              onClick={() => fetchServices()}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        </div>
      ) : null}

      <BookServices services={services} totalProducts={totalServices} currentPage={currentPage} itemsPerPage={itemsPerPage} selectedCategory={selectedCategory} loading={loading} onCategorySelect={(categoryId) => {
        const category = categories.find(cat => cat._id === categoryId);
        if (category) {
          handleCategorySelect(category);
          return;
        }
        fetchServices(categoryId, undefined, selectedBadge, priceMin, priceMax);
      }} onSubcategorySelect={(subcategoryId) => {
        setSelectedSubcategory(subcategoryId);
        fetchServices(selectedCategory?._id, subcategoryId, selectedBadge, priceMin, priceMax);
      }} onBadgeSelect={(badge) => {
        setSelectedBadge(badge);
        fetchServices(selectedCategory?._id, selectedSubcategory || undefined, badge, priceMin, priceMax);
      }} onPriceChange={(min, max) => {
        setPriceMin(min);
        setPriceMax(max);
        fetchServices(selectedCategory?._id, selectedSubcategory || undefined, selectedBadge, min, max);
      }} />
      <JoinVendorBanner/>
    </main>
  );
};

function ServicePageFallback() {
  return (
    <main>
      <PublicPageHero
        title="Services"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
        imageUrl="/bgdetailpage.png"
      />
      <section className="flex min-h-[320px] items-center justify-center px-4 py-10">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-market-gold border-t-transparent" />
          <p className="text-sm font-medium text-market-muted">Loading services...</p>
        </div>
      </section>
    </main>
  );
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

      <BrowseServices
        showAllService={false}
        onCategorySelect={onCategorySelect}
        selectedCategoryId={selectedCategory?._id ?? null}
      />
    </>
  );
}

export default function ServicePage() {
  return (
    <Suspense fallback={<ServicePageFallback />}>
      <ServicePageContent />
    </Suspense>
  );
}
