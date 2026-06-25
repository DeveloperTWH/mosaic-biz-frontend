"use client"

import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import PublicPageHero from "../Components/PublicPageHero";
import BookServices from "./components/BookYourServices";
import { Service } from "@/types/service";
import VendorExpandCta from "../Components/VendorExpandCta";
import BrowseServices from "../Components/BrowsServices";
import { Category, ServiceCategoryResponse } from "@/types/Category";
import PublicSearchFilterBar from "../Components/PublicSearchFilterBar";
import PublicFilterSection from "../Components/PublicFilterSection";
import {
  listingFiltersToApiParams,
  type ListingFilters,
  PublicSearchFilters,
} from "../Components/publicSearch";
import MarketErrorState from "../Components/MarketErrorState";
import MarketLoadingBlock from "../Components/MarketLoadingBlock";
import { useListingFilters } from "@/hooks/useListingFilters";

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
  const { filters: urlFilters, setFilters: setUrlFilters, resetFilters } = useListingFilters("/services");
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
  const [selectedSort, setSelectedSort] = useState("");
  const [minorityTypes, setMinorityTypes] = useState<MinorityType[]>([]);
  const latestRequestIdRef = useRef(0);

  const fetchServices = useCallback(async (filters: Partial<ListingFilters>) => {
    const requestId = ++latestRequestIdRef.current;
    setLoading(true);
    setFetchError(null);
    try {
      const params: Record<string, string> = {
        page: filters.page?.trim() || "1",
        limit: "10",
        ...listingFiltersToApiParams(filters),
      };

      const res = await axios.get<ServicesListResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/list`, {
        params,
      });

      if (requestId !== latestRequestIdRef.current) {
        return;
      }

      setServices(Array.isArray(res.data.data) ? res.data.data : []);
      setTotalServices(typeof res.data.total === "number" ? res.data.total : 0);
      setCurrentPage(typeof res.data.page === "number" ? res.data.page : Number(params.page) || 1);
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
  }, []);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setUrlFilters({ category: category._id, subcategory: "", page: "" });
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
        setCategories(data?.data?.serviceCategories || []);
      } catch (err) {
        console.error('Failed to load service categories', err);
      }
    };
    fetchMinorityTypes();
    fetchCategories();
  }, []);

  useEffect(() => {
    setSearchText(urlFilters.keyword);
    setSearchLocation(urlFilters.location);
    setMinorityType(urlFilters.minorityType);
    setSelectedSort(urlFilters.sort || "");
  }, [urlFilters]);

  useEffect(() => {
    fetchServices(urlFilters);
  }, [fetchServices, urlFilters]);

  useEffect(() => {
    if (!urlFilters.category) {
      setSelectedCategory(null);
      return;
    }

    if (categories.length === 0) {
      return;
    }

    const matchedCategory =
      categories.find((category) => category._id === urlFilters.category) ??
      categories.find((category) => category.slug === urlFilters.category);

    if (!matchedCategory) {
      return;
    }

    if (selectedCategory?._id !== matchedCategory._id) {
      setSelectedCategory(matchedCategory);
    }
    if (urlFilters.category !== matchedCategory._id) {
      setUrlFilters({ category: matchedCategory._id }, { replace: true });
    }
  }, [categories, selectedCategory?._id, setUrlFilters, urlFilters.category]);

  const handleSearch = () => {
    const match = minorityTypes.find((type) => String(type._id) === String(minorityType));
    setUrlFilters({
      keyword: searchText,
      location: searchLocation,
      minorityType: match?.name || minorityType,
      page: "",
    });
  };

  return (
    <main>
      <PublicPageHero
        title="Services"
        variant="compact"
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
        onClearFilters={resetFilters}
        showClearFilters={Boolean(
          urlFilters.keyword ||
          urlFilters.location ||
          urlFilters.minorityType ||
          urlFilters.category ||
          urlFilters.subcategory ||
          urlFilters.badge ||
          urlFilters.sort ||
          urlFilters.priceMin ||
          urlFilters.priceMax ||
          urlFilters.page
        )}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {fetchError ? (
        <div className="mx-auto max-w-[1400px] px-4 py-6">
          <MarketErrorState
            title="Services are temporarily unavailable"
            description="We could not load service listings. Please try again."
            onRetry={() => fetchServices(urlFilters)}
          />
        </div>
      ) : null}

      <BookServices services={services} totalProducts={totalServices} currentPage={currentPage} itemsPerPage={itemsPerPage} selectedCategory={selectedCategory} loading={loading} sort={selectedSort} onCategorySelect={(categoryId) => {
        const category = categories.find(cat => cat._id === categoryId);
        if (category) {
          handleCategorySelect(category);
          return;
        }
        setUrlFilters({ category: categoryId, subcategory: "", page: "" });
      }} onSubcategorySelect={(subcategoryId) => {
        setUrlFilters({ subcategory: subcategoryId, page: "" });
      }} onBadgeSelect={(badge) => {
        setUrlFilters({ badge, page: "" });
      }} onPriceChange={(min, max) => {
        setUrlFilters({ priceMin: String(min), priceMax: String(max), page: "" }, { replace: true });
      }} onSortChange={(sort) => {
        setSelectedSort(sort);
        setUrlFilters({ sort, page: "" }, { replace: true });
      }} onPageChange={(page) => {
        setUrlFilters({ page: String(page) });
      }} />
      <VendorExpandCta ctaHref="/become-a-vendor" />
    </main>
  );
};

function ServicePageFallback() {
  return (
    <main>
      <PublicPageHero
        title="Services"
        variant="compact"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
        imageUrl="/bgdetailpage.png"
      />
      <MarketLoadingBlock label="Loading services..." minHeight="min-h-[320px]" />
    </main>
  );
}

function FilterSection({ filters, onFiltersChange, onSearch, onClearFilters, showClearFilters, selectedCategory, onCategorySelect }: {
  filters: PublicSearchFilters;
  onFiltersChange: (filters: PublicSearchFilters) => void;
  onSearch?: () => void;
  onClearFilters?: () => void;
  showClearFilters?: boolean;
  selectedCategory?: Category | null;
  onCategorySelect?: (category: Category) => void;
}) {
  return (
    <>
      <PublicFilterSection>
        <PublicSearchFilterBar
          filters={filters}
          onChange={onFiltersChange}
          onSubmit={() => onSearch?.()}
          submitLabel="Apply filters"
          showClearFilters={showClearFilters}
          onClearFilters={onClearFilters}
        />
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
