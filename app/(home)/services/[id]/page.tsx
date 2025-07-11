"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import FilterBar from "../components/FilterBar";
import FAQSection from "../../Components/FaQ";
import ClientTestimonials from "../../Components/ClientTestimonials";
import Link from "next/link";
import { MoveRight, SlidersHorizontal, ChevronDown, AlertTriangle, Loader2 } from "lucide-react";
import ServiceCard from "./components/ServiceCard";
import { Service } from '@/types/service';


interface PageProps {
    params: Promise<{ id: string }>;
}



// const dummyServices: Service[] = [
//     {
//         id: 1,
//         title: "1. LOREM IPSUM",
//         description:
//             "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae libero venenatis, tristique justo.",
//         location: "San Francisco, CA",
//         image: "/Service/19099.png",
//         tags: ["Skin Care", "Salon Treatment"],
//         rating: 4.5,
//         reviews: 12,
//         mapQuery: "1600+Amphitheatre+Parkway,+Mountain+View,+CA",
//     },
//     {
//         id: 2,
//         title: "2. LOREM IPSUM",
//         description:
//             "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae libero venenatis, tristique justo.",
//         location: "Los Angeles, CA",
//         image: "/Service/19099.png",
//         tags: ["Skin Care", "Nail Spa"],
//         rating: 4.7,
//         reviews: 10,
//         mapQuery: "6801+Hollywood+Blvd,+Los+Angeles,+CA",
//     },
//     {
//         id: 3,
//         title: "3. LOREM IPSUM",
//         description:
//             "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae libero venenatis, tristique justo.",
//         location: "New York, NY",
//         image: "/Service/19099.png",
//         tags: ["Salon", "Hair Treatment"],
//         rating: 4.2,
//         reviews: 15,
//         mapQuery: "Times+Square,+New+York,+NY",
//     },
// ];

export default function ServiceCategoryPage({ params }: PageProps) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;

    const [activeService, setActiveService] = useState<String | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [searchText, setSearchText] = useState("");
    const [minorityType, setMinorityType] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);


    const fetchServices = async () => {
        try {
            console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/list?categorySlug=${id}&search=${searchText}&minorityType=${minorityType}&city=${searchLocation}`);

            setLoading(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/list?categorySlug=${id}&search=${searchText}&minorityType=${minorityType}&city=${searchLocation}`
            );
            const data = await res.json();
            if (data.success) {
                setServices(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch services", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [id, minorityType]);


    const handleSearch = () => {
        console.log({
            searchText,
            minorityType,
            searchLocation,
        });
        fetchServices();
    }

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const selectedService = services.find(
        (service) => service._id === activeService
    );

    if (loading) return (
        <div className="flex items-center justify-center p-5 text-custom-blue">
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            <span>Loading...</span>
        </div>
    );



    return (
        <>
            <main className="text-black bg-white">
                {/* Banner */}
                <section className="relative w-full">
                    <Image
                        src="/Service/Banner.png"
                        alt="Category Banner"
                        width={1200}
                        height={400}
                        className="object-cover w-full"
                    />
                </section>
                <FilterBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    minorityType={minorityType}
                    setMinorityType={setMinorityType}
                    searchLocation={searchLocation}
                    setSearchLocation={setSearchLocation}
                    onSearch={handleSearch}
                />
                {services.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-5 text-red-600">
                        <AlertTriangle className="w-10 h-10 mb-2" />
                        <span>Service not found</span>
                    </div>
                ) :
                    (
                        <section className="grid grid-cols-1 gap-8 px-4 py-10 mx-auto max-w-7xl lg:grid-cols-3">
                            {/* Service List */}
                            <div className="space-y-6 lg:col-span-2">
                                <div>
                                    <p className="text-xs uppercase text-custom-blue">{id}</p>
                                    <h2 className="mb-4 text-xl font-bold md:text-2xl heading custom-blue">
                                        Top Treatment Services Near San Francisco, California
                                    </h2>
                                    <div className="flex flex-wrap gap-2 text-[12px]">
                                        <div className="flex items-center justify-center gap-1 px-3 py-1 capitalize border border-black rounded-full cursor-pointer">
                                            <SlidersHorizontal size={"15px"} /> all
                                        </div>

                                        {/* Price Dropdown */}
                                        <div className="relative">
                                            <select className="px-3 py-1 capitalize bg-white border border-black rounded-full appearance-none cursor-pointer">
                                                <option value="">price</option>
                                                <option value="low">Low to High</option>
                                                <option value="high">High to Low</option>
                                            </select>
                                            <ChevronDown
                                                size={16}
                                                className="absolute text-black transform -translate-y-1/2 pointer-events-none right-2 top-1/2"
                                            />
                                        </div>

                                        {/* Sort By Dropdown */}
                                        <div className="relative">
                                            <select className="px-3 py-1 capitalize bg-white border border-black rounded-full appearance-none cursor-pointer">
                                                <option value="">sort by</option>
                                                <option value="rating">Rating</option>
                                                <option value="reviews">Most Reviewed</option>
                                                <option value="new">Newest</option>
                                            </select>
                                            <ChevronDown
                                                size={16}
                                                className="absolute text-black transform -translate-y-1/2 pointer-events-none right-2 top-1/2"
                                            />
                                        </div>

                                        <div className="px-3 py-1 capitalize border border-black rounded-full cursor-pointer">
                                            open now
                                        </div>
                                        <div className="px-3 py-1 capitalize border border-black rounded-full cursor-pointer">
                                            online booking
                                        </div>
                                        <div className="px-3 py-1 capitalize border border-black rounded-full cursor-pointer">
                                            offers available
                                        </div>
                                    </div>

                                </div>

                                {services.map((service) => {
                                    const isActive = activeService === service._id;

                                    return (
                                        <ServiceCard
                                            key={service._id}
                                            service={service}
                                            isActive={isActive}
                                            isMobile={isMobile}
                                            onClick={setActiveService}
                                        />
                                    );
                                })}

                            </div>

                            {/* Desktop Map Sidebar */}
                            {!isMobile && activeService !== null && selectedService && (
                                <div className="sticky w-full overflow-hidden transition-opacity duration-500 rounded shadow h-96 top-20 animate-fade-in">
                                    <iframe
                                        src={`https://www.google.com/maps?q=${selectedService.contact.address}&output=embed`}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        className="rounded"
                                    />
                                </div>
                            )}
                        </section>
                    )
                }
                {/* Filters and Listings */}

            </main>
            <div className="bbg-custom-soil">
                <FAQSection />
            </div>
            <ClientTestimonials />
        </>
    );
}
