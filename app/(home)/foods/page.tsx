"use client"

import React, { useEffect, useState } from 'react'
import HeroSection from './components/HeroSection';
import FilterBar from '../services/components/FilterBar';
import TabsHeadingSection from './components/TabsHeadingSection';
import FoodsAndRestaurantsPage from './components/FoodsAndRestaurantsPage';
import SimilarProduct from '../products/[productid]/[id]/Component/SimilarProduct';
import BookServices from './components/BookYourServices';
import { Service } from "@/types/service";
import { Category, SubCategory, SubCategoryResponse } from "@/types/Category";
import axios from "axios";
import Image from 'next/image';
import JoinVendorBanner from './components/JoinVendorBanner';
import BrowseFoods from '../Components/BrowseFoods';

const FoodSection = () => {
  const [searchText, setSearchText] = useState("");
  const [minorityType, setMinorityType] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const handleSearch = () => {
    console.log({
      searchText,
      minorityType,
      searchLocation,
    });
  }

  const fetchFoods = async (categoryId?: string, subcategoryId?: string) => {
    setLoading(true);
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

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/food/list`, {
        params,
      });
      setServices(res.data.data);
    } catch (err) {
      console.error(err);
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
      <HeroSection heading={"Foods"} imageUrl="/bgdetailpage.png"  />

      <FilterSection onSearch={(filters) => {
        console.log('Filter search triggered:', filters);
        fetchFoods(selectedCategory?._id, selectedSubcategory || undefined);
      }} selectedCategory={selectedCategory} onCategorySelect={(category) => {
        setSelectedCategory(category);
        setSelectedSubcategory("");
        fetchFoods(category._id, undefined);
      }} />

      <BookServices services={services} selectedCategory={selectedCategory} loading={loading} onCategorySelect={(categoryId) => {
        const category = { _id: categoryId } as Category;
        setSelectedCategory(category);
        setSelectedSubcategory("");
        fetchFoods(categoryId, undefined);
      }} onSubcategorySelect={(subcategoryId) => {
        setSelectedSubcategory(subcategoryId);
        fetchFoods(selectedCategory?._id, subcategoryId);
      }} />

      <JoinVendorBanner/>
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

  const handleSearch = () => {
    console.log('Foods page search clicked with filters:', { businessType, location, minority, category: selectedCategory?.name });
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
                  <option value="gc">Grand Canyon</option>
                  <option value="sf"> San Francisco</option>
                  <option value="ch">Chicago</option>
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

      <BrowseFoods onCategorySelect={onCategorySelect} />
    </>
  );
}

export default FoodSection;