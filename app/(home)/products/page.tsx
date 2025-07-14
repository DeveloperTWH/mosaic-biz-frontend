"use client"
import React, { useState } from 'react'
import FilterBar from "./components/FilterBar";
import HeroSection from "./components/HeroSection";
import CategoryGrid from './components/CategoryGrid';
import FeaturedProducts from './components/FeaturedProducts';


const productImages = [
  '/ShopProduct/Aria-SK6-Helmet 1 (3).png',
  '/ShopProduct/Aria-SK6-Helmet 1 (2).png',
  '/ShopProduct/Aria-SK6-Helmet 1 (1).png',
  '/ShopProduct/Aria-SK6-Helmet 1.png',
]

const dummyProducts = [
    {
        id: 1,
        title: 'Feature Product 1',
        price: 29.99,
        rating: 4.5,
        image: '/ShopProduct/Aria-SK6-Helmet 1 (3).png',
    },
    {
        id: 2,
        title: 'Feature Product 2',
        price: 19.99,
        rating: 5,
        image: '/ShopProduct/Aria-SK6-Helmet 1 (2).png',
    },
    {
        id: 3,
        title: 'Feature Product 3',
        price: 15.99,
        rating: 3.2,
        image: '/ShopProduct/Aria-SK6-Helmet 1 (1).png',
    },
    {
        id: 4,
        title: 'Feature Product 4',
        price: 45.0,
        rating: 2.7,
        image: '/ShopProduct/Aria-SK6-Helmet 1.png',
    },
    // Repeat to simulate more pages
    ...Array(56).fill(0).map((_, i) => ({
        id: i + 5,
        title: `Feature Product ${i + 5}`,
        price: 49.99,
        rating: 4.2,
        image: productImages[i % productImages.length],
    }))

];

const page = () => {
    const [searchText, setSearchText] = useState("");
    const [minorityType, setMinorityType] = useState("");
    const [searchLocation, setSearchLocation] = useState("");


    const handleSearch = () => {
        console.log({
            searchText,
            minorityType,
            searchLocation,
        });
    };

    return (
        <div>
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
            {(!searchText && !minorityType && !searchLocation) && (
                <CategoryGrid />
            )}
            <FeaturedProducts products={dummyProducts} />
        </div>
    )
}

export default page