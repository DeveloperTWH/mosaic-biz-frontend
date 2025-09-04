"use client"
import React, { useState, useEffect } from 'react'
import axios from "axios"
import FilterBar from "./components/FilterBar";
import HeroSection from "./components/HeroSection";
import CategoryGrid from './components/CategoryGrid';
import FeaturedProducts from './components/FeaturedProducts';

const page = () => {
    const [searchText, setSearchText] = useState("");
    const [minorityType, setMinorityType] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/list`, {
                params: {
                    search: searchText,
                    city: searchLocation,
                    minorityType,
                    categorySlug: "", // Add category filter if needed
                    page: 1,
                    limit: 10,
                },
            });
            console.log(res.data.data);
            
            setProducts(res.data.data); // useState for products must be declared
        } catch (err) {
            console.error("Error fetching products", err);
        }finally{
            setLoading(false);
        }
    };

    const handleSearch = () => {
        console.log({
            searchText,
            minorityType,
            searchLocation,
        });
        fetchProducts();
    };

    useEffect(() => {
        fetchProducts(); // load default products on initial render
    }, [minorityType]);

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
            <FeaturedProducts products={products} loading={loading} />
        </div>
    )
}

export default page