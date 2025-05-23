"use client"

import React, { useState } from "react";
import FilterBar from "./components/FilterBar";
import CategoryGrid from "./components/CategoryGrid";
import HeroSection from "./components/HeroSection";
import BookServices from "./components/BookYourServices";
import FeatureBlogs from "../Components/FeatureBlogs";


const ServicePage = () => {
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
    <main className="bg-white text-black">
      <HeroSection />
      <FilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        minorityType={minorityType}
        setMinorityType={setMinorityType}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        onSearch={handleSearch}
      />

      <CategoryGrid />
      <BookServices />
      <FeatureBlogs />
    </main>
  );
};

export default ServicePage;