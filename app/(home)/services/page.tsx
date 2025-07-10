"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import FilterBar from "./components/FilterBar";
import CategoryGrid from "./components/CategoryGrid";
import HeroSection from "./components/HeroSection";
import BookServices from "./components/BookYourServices";
import FeatureBlogs from "../Components/FeatureBlogs";
import { Service } from "@/types/service";


const ServicePage = () => {
  const [searchText, setSearchText] = useState("");
  const [minorityType, setMinorityType] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
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
      setServices(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    console.log({
      searchText,
      minorityType,
      searchLocation,
    });
    fetchServices();
  };

  useEffect(() => {
    fetchServices(); // load default services on page load
  }, []);

  return (
    <main className="text-black bg-white">
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
      <BookServices services={services} />
      <FeatureBlogs />
    </main>
  );
};

export default ServicePage;