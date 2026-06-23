"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import PublicPageHero from '../Components/PublicPageHero';
import FilterBar from '../services/components/FilterBar';
import TabsHeadingSection from './components/TabsHeadingSection';
import FoodsAndRestaurantsPage from './components/FoodsAndRestaurantsPage';
import BookServices from './components/BookYourServices';
import { Service } from "@/types/service";
import { Category, SubCategory, SubCategoryResponse } from "@/types/Category";
import axios from "axios";
import Image from 'next/image';
import JoinVendorBanner from './components/JoinVendorBanner';
import BrowseFoods from '../Components/BrowseFoods';
import PublicSearchFilterBar from '../Components/PublicSearchFilterBar';
import PublicFilterSection from '../Components/PublicFilterSection';
import { buildSearchPageUrl, DEFAULT_PUBLIC_SEARCH_FILTERS, PublicSearchFilters } from '../Components/publicSearch';

type FoodsListResponse = {
  success?: boolean;
  data?: Service[];
  total?: number;
  page?: number;
  totalPages?: number;
  limit?: number;
};

const FoodSection = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [minorityType, setMinorityType] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [totalServices, setTotalServices] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("");
  const [priceMin, setPriceMin] = useState<number | undefined>();
  const [priceMax, setPriceMax] = useState<number | undefined>();

  const handleSearch = () => {
    router.push(buildSearchPageUrl({
      keyword: searchText,
      location: searchLocation,
      minorityType,
    }));
  };

  const fetchFoods = async (categoryId?: string, subcategoryId?: string, badge?: string, priceMin?: number, priceMax?: number) => {
    setLoading(true);
    setFetchError(null);
    try {
      const params: any = {
        search: searchText,
        city: searchLocation,
        minorityType,
        page: 1,
        limit: 10,
      };
      
      if (categoryId) params.categoryId = categoryId;
      if (subcategoryId) params.subcategoryId = subcategoryId;
      if (badge) params.badge = badge;
      if (priceMin !== undefined && priceMax !== undefined) {
        params.price = `${priceMin}-${priceMax}`;
      }

      const res = await axios.get<FoodsListResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/food/list`, {
        params,
      });
      setServices(Array.isArray(res.data.data) ? res.data.data : []);
      setTotalServices(typeof res.data.total === "number" ? res.data.total : 0);
      setCurrentPage(typeof res.data.page === "number" ? res.data.page : 1);
      setItemsPerPage(typeof res.data.limit === "number" ? res.data.limit : Number(params.limit) || 10);
    } catch (err) {
      console.error(err);
      setFetchError("Unable to load food listings right now. Please try again.");
      setServices([]);
      setTotalServices(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/foods/subcategories/${categoryId}`);
      const data: SubCategoryResponse = await response.json();
      // setSubcategories(data.data); // Removed - handled by FilterAccordion
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      // setSubcategories([]); // Removed - handled by FilterAccordion
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("");
    fetchFoods(category._id, undefined);
  };
  
  useEffect(() => {
    fetchFoods(undefined, undefined);
  }, [])

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
        router.push(buildSearchPageUrl(filters));
      }} selectedCategory={selectedCategory} onCategorySelect={(category) => {
        setSelectedCategory(category);
        setSelectedSubcategory("");
        fetchFoods(category._id, undefined);
      }} />

      {fetchError ? (
        <div className="container-page py-6">
          <div className="market-state-error flex flex-wrap items-center justify-between gap-3">
            <span>{fetchError}</span>
            <button
              type="button"
              onClick={() => fetchFoods(undefined, undefined)}
              className="font-semibold text-market-gold underline hover:text-market-gold-hover"
            >
              Retry
            </button>
          </div>
        </div>
      ) : null}

      <BookServices services={services} totalProducts={totalServices} currentPage={currentPage} itemsPerPage={itemsPerPage} selectedCategory={selectedCategory} loading={loading} onCategorySelect={(categoryId) => {
        const categories = services.map(s => ({ _id: categoryId, name: '' } as Category));
        const category = categories.find(c => c._id === categoryId) || { _id: categoryId, name: '', description: '', createdAt: '', updatedAt: '', slug: '', __v: 0 } as Category;
        setSelectedCategory(category);
        setSelectedSubcategory("");
        fetchFoods(categoryId, undefined, selectedBadge, priceMin, priceMax);
      }} onSubcategorySelect={(subcategoryId) => {
        setSelectedSubcategory(subcategoryId);
        fetchFoods(selectedCategory?._id, subcategoryId, selectedBadge, priceMin, priceMax);
      }} onBadgeSelect={(badge) => {
        setSelectedBadge(badge);
        fetchFoods(selectedCategory?._id, selectedSubcategory || undefined, badge, priceMin, priceMax);
      }} onPriceChange={(min, max) => {
        setPriceMin(min);
        setPriceMax(max);
        fetchFoods(selectedCategory?._id, selectedSubcategory || undefined, selectedBadge, min, max);
      }} />

      <JoinVendorBanner/>
    </div>
  )
}

function FilterSection({ onSearch, selectedCategory, onCategorySelect }: { 
  onSearch?: (filters: PublicSearchFilters) => void;
  selectedCategory?: Category | null;
  onCategorySelect?: (category: Category) => void;
}) {
  const [filters, setFilters] = useState(DEFAULT_PUBLIC_SEARCH_FILTERS);

  return (
    <>
      <PublicFilterSection>
        <PublicSearchFilterBar filters={filters} onChange={setFilters} onSubmit={() => onSearch?.(filters)} />
      </PublicFilterSection>

      <BrowseFoods onCategorySelect={onCategorySelect} />
    </>
  );
}

export default FoodSection;
