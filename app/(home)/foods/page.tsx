"use client"

import React, { Suspense, useEffect, useState } from 'react'
import PublicPageHero from '../Components/PublicPageHero';
import BookServices from './components/BookYourServices';
import { Service } from "@/types/service";
import { Category } from "@/types/Category";
import axios from "axios";
import VendorExpandCta from '../Components/VendorExpandCta';
import BrowseFoods from '../Components/BrowseFoods';
import PublicSearchFilterBar from '../Components/PublicSearchFilterBar';
import PublicFilterSection from '../Components/PublicFilterSection';
import {
  listingFiltersToApiParams,
  PublicSearchFilters,
} from '../Components/publicSearch';
import MarketErrorState from '../Components/MarketErrorState';
import MarketLoadingBlock from '../Components/MarketLoadingBlock';
import { useListingFilters } from '@/hooks/useListingFilters';

type FoodsListResponse = {
  success?: boolean;
  data?: Service[];
  total?: number;
  page?: number;
  totalPages?: number;
  limit?: number;
};

const FoodSection = () => {
  const { filters: urlFilters, setFilters: setUrlFilters, resetFilters } = useListingFilters("/foods");
  const [services, setServices] = useState<Service[]>([]);
  const [totalServices, setTotalServices] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setUrlFilters({ category: category._id, subcategory: "", page: "" });
  };
  
  useEffect(() => {
    let cancelled = false;

    async function loadFoods() {
      setLoading(true);
      setFetchError(null);

      try {
        const params: Record<string, string> = {
          page: urlFilters.page?.trim() || "1",
          limit: "10",
          ...listingFiltersToApiParams(urlFilters),
        };

        const res = await axios.get<FoodsListResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/food/list`, {
          params,
        });

        if (cancelled) return;

        setServices(Array.isArray(res.data.data) ? res.data.data : []);
        setTotalServices(typeof res.data.total === "number" ? res.data.total : 0);
        setCurrentPage(typeof res.data.page === "number" ? res.data.page : Number(params.page) || 1);
        setItemsPerPage(typeof res.data.limit === "number" ? res.data.limit : Number(params.limit) || 10);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setFetchError("Unable to load food listings right now. Please try again.");
          setServices([]);
          setTotalServices(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadFoods();

    return () => {
      cancelled = true;
    };
  }, [retryCount, urlFilters]);

  return (
    <div>
      <PublicPageHero
        title="Food & Grocery"
        variant="compact"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Food & Grocery" },
        ]}
        imageUrl="/bgdetailpage.png"
      />

      <FilterSection onSearch={(filters) => {
        setUrlFilters({ ...filters, page: "" });
      }} selectedCategory={selectedCategory} onCategorySelect={(category) => {
        handleCategorySelect(category);
      }} onClearFilters={resetFilters} showClearFilters={Boolean(
        urlFilters.keyword ||
        urlFilters.location ||
        urlFilters.minorityType ||
        urlFilters.category ||
        urlFilters.subcategory ||
        urlFilters.badge ||
        urlFilters.priceMin ||
        urlFilters.priceMax ||
        urlFilters.page
      )} />

      {fetchError ? (
        <div className="container-page py-6">
          <MarketErrorState
            title="Food listings are temporarily unavailable"
            description="We could not load food and grocery listings. Please try again."
            onRetry={() => setRetryCount((count) => count + 1)}
          />
        </div>
      ) : null}

      <BookServices services={services} totalProducts={totalServices} currentPage={currentPage} itemsPerPage={itemsPerPage} selectedCategory={selectedCategory} loading={loading} onCategorySelect={(categoryId) => {
        const categories = services.map(s => ({ _id: categoryId, name: '' } as Category));
        const category = categories.find(c => c._id === categoryId) || { _id: categoryId, name: '', description: '', createdAt: '', updatedAt: '', slug: '', __v: 0 } as Category;
        setSelectedCategory(category);
        setUrlFilters({ category: categoryId, subcategory: "", page: "" });
      }} onSubcategorySelect={(subcategoryId) => {
        setUrlFilters({ subcategory: subcategoryId, page: "" });
      }} onBadgeSelect={(badge) => {
        setUrlFilters({ badge, page: "" });
      }} onPriceChange={(min, max) => {
        setUrlFilters({ priceMin: String(min), priceMax: String(max), page: "" }, { replace: true });
      }} />

      <VendorExpandCta ctaHref="/become-a-vendor" />
    </div>
  )
}

function FilterSection({ onSearch, selectedCategory, onCategorySelect, onClearFilters, showClearFilters }: {
  onSearch?: (filters: PublicSearchFilters) => void;
  selectedCategory?: Category | null;
  onCategorySelect?: (category: Category) => void;
  onClearFilters?: () => void;
  showClearFilters?: boolean;
}) {
  const { filters: urlFilters } = useListingFilters("/foods");
  const initialFilters = {
    keyword: urlFilters.keyword,
    location: urlFilters.location,
    minorityType: urlFilters.minorityType,
  };
  const filterKey = `${initialFilters.keyword}|${initialFilters.location}|${initialFilters.minorityType}`;

  return (
    <>
      <PublicFilterSection>
        <FilterDraft
          key={filterKey}
          initialFilters={initialFilters}
          onSearch={onSearch}
          showClearFilters={showClearFilters}
          onClearFilters={onClearFilters}
        />
      </PublicFilterSection>

      <BrowseFoods onCategorySelect={onCategorySelect} />
    </>
  );
}

function FilterDraft({
  initialFilters,
  onSearch,
  showClearFilters,
  onClearFilters,
}: {
  initialFilters: PublicSearchFilters;
  onSearch?: (filters: PublicSearchFilters) => void;
  showClearFilters?: boolean;
  onClearFilters?: () => void;
}) {
  const [filters, setFilters] = useState(initialFilters);

  return (
    <PublicSearchFilterBar
      filters={filters}
      onChange={setFilters}
      onSubmit={() => onSearch?.(filters)}
      showClearFilters={showClearFilters}
      onClearFilters={onClearFilters}
    />
  );
}

function FoodPageFallback() {
  return (
    <div className="min-h-screen bg-market-bg">
      <MarketLoadingBlock label="Loading foods..." />
    </div>
  );
}

export default function FoodPage() {
  return (
    <Suspense fallback={<FoodPageFallback />}>
      <FoodSection />
    </Suspense>
  );
}
