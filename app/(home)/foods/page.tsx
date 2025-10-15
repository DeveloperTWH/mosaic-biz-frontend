"use client"

import React, { useState } from 'react'
import HeroSection from '../services/components/HeroSection';
import FilterBar from '../services/components/FilterBar';
import TabsHeadingSection from './components/TabsHeadingSection';
import FoodsAndRestaurantsPage from './components/FoodsAndRestaurantsPage';
import SimilarProduct from '../products/[productid]/[id]/Component/SimilarProduct';

const FoodSection = () => {

  const [searchText, setSearchText] = useState("");
  const [minorityType, setMinorityType] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleSearch = () => {
    console.log({
      searchText,
      minorityType,
      searchLocation,
    });
  }
  return (
    <div>
      <HeroSection heading={"Foods"} imageUrl='/foods/food_section.png' />
      <FilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        minorityType={minorityType}
        setMinorityType={setMinorityType}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        onSearch={handleSearch}
      />
      <FoodsAndRestaurantsPage />
      <div className="max-w-screen-xl px-8 py-10 mx-auto">
        {/* <SimilarProduct /> */}
      </div>
    </div>
  )
}

export default FoodSection;