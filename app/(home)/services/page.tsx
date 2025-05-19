// File: app/service/page.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import FilterBar from "./components/FilterBar";
import CategoryGrid from "./components/CategoryGrid";
import HeroSection from "./components/HeroSection";
import BookServices from "./components/BookYourServices";
import FeatureBlogs from "../Components/FeatureBlogs";


const ServicePage = () => {
  return (
    <main className="bg-white text-black">
        <HeroSection/>
        <FilterBar />
        <CategoryGrid/>
        <BookServices/>
        <FeatureBlogs/>
    </main>
  );
};

export default ServicePage;