"use client"
import React, { useState, useEffect } from 'react'
import axios from "axios"
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import FilterBar from "./components/FilterBar";
import HeroSection from "./components/HeroSection";
import CategoryGrid from './components/CategoryGrid';
import FeaturedProducts from './components/FeaturedProducts';

type MinorityType = { _id: string; name: string };

const page = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [searchText, setSearchText] = useState("");
    const [minorityType, setMinorityType] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [minorityTypes, setMinorityTypes] = useState<MinorityType[]>([]);


    useEffect(() => {
        const fetchMinorityTypes = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/minority-types`);
                const data = await res.json();
                setMinorityTypes(Array.isArray(data) ? (data as MinorityType[]) : []);
            } catch (err) {
                console.error('Failed to load minority types', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMinorityTypes();
    }, []);


    const fetchProducts = async (q?: string, m?: string, c?: string) => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/list`, {
                params: {
                    search: (q ?? searchText) || "",
                    city: (c ?? searchLocation) || "",
                    minorityType: (m ?? minorityType) || "",
                    categorySlug: "",
                    page: 1,
                    limit: 10,
                },
            });
            setProducts(res.data.data || []);
        } catch (err) {
            console.error("Error fetching products", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchText) params.set("q", searchText);
        if (searchLocation) params.set("city", searchLocation);

        if (minorityType) {
            const mt = minorityTypes.find((t: MinorityType) => String(t._id) === String(minorityType));
            const nameOrId = mt?.name || minorityType;
            params.set("minorityType", nameOrId);
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        const q = searchParams.get("q") || "";
        const mRaw = searchParams.get("minorityType") || "";
        const c = searchParams.get("city") || "";

        // detect ObjectId
        const isHex24 = /^[a-f\d]{24}$/i.test(mRaw);
        // resolve name -> id (case-insensitive) when needed
        let mResolved = mRaw;
        if (mRaw && !isHex24) {
            const match = minorityTypes.find((t: MinorityType) => String(t.name).toLowerCase() === String(mRaw).toLowerCase());
            mResolved = match?._id ? String(match._id) : "";
        }

        if (q !== searchText) setSearchText(q);
        if (mResolved !== minorityType) setMinorityType(mResolved);
        if (c !== searchLocation) setSearchLocation(c);

        // fetch with resolved ID
        fetchProducts(q, mResolved, c);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, minorityTypes]);

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