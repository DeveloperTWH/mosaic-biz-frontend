"use client";

import React, { useState, useEffect, use, useRef } from "react";
import Image from "next/image";
import FilterBar from "../components/FilterBar";
import FAQSection from "../../Components/FaQ";
import ClientTestimonials from "../../Components/ClientTestimonials";
import Link from "next/link";
import { MoveRight, SlidersHorizontal, ChevronDown, AlertTriangle, Loader2 } from "lucide-react";
import ServiceCard from "./components/ServiceCard";
import { Service } from '@/types/service';
import AllServicesMap from "./components/AllServicesMap";
import AffixSidebar from "./components/AffixSidebar"; // adjust path as needed
import HeroSection from "../components/HeroSection";



interface PageProps {
    params: Promise<{ id: string }>;
}


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

    const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const listColRef = useRef<HTMLDivElement | null>(null);
    const asideRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const update = () => {
            const h = listColRef.current?.offsetHeight ?? 0;
            if (asideRef.current) {
                asideRef.current.style.minHeight = h ? `${h}px` : "";
            }
        };
        update();

        const ro = new ResizeObserver(update);
        if (listColRef.current) ro.observe(listColRef.current);
        window.addEventListener("resize", update);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", update);
        };
    }, [services.length]); // re-evaluate when list size changes



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


    const handleMapSelect = (serviceId: string) => {
        setActiveService(serviceId);
        const el = cardRefs.current[serviceId];
        console.log(el);

        if (el) {
            // Smooth scroll the page to this card
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };


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
                <HeroSection heading={`${id} Services`} imageUrl="/Service/service.png"  />
                <FilterBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    minorityType={minorityType}
                    setMinorityType={setMinorityType}
                    searchLocation={searchLocation}
                    setSearchLocation={setSearchLocation}
                    onSearch={handleSearch}
                />
                {services.length === 1 ? (
                    <div className="flex flex-col items-center justify-center p-5 text-red-600">
                        <AlertTriangle className="w-10 h-10 mb-2" />
                        <span>Service not found</span>
                    </div>
                ) :
                    (
                        <>
                            <div className="mx-auto max-w-7xl">
                                <p className="text-xs uppercase text-custom-blue">{id}</p>
                                <h2 className="mb-4 text-xl font-bold md:text-2xl heading custom-blue">
                                    Top {id} Service's Near you 
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
                            <section className="grid grid-cols-1 gap-8 px-4 py-10 mx-auto max-w-7xl lg:grid-cols-3">
                                {/* Service List */}
                                <div ref={listColRef} className="space-y-6 lg:col-span-2">
                                    {services.map((service) => {
                                        const isActive = activeService === service._id;
                                        return (
                                            <div
                                                key={`${service._id}-wrap`}
                                                ref={(el) => { if (el) cardRefs.current[service._id] = el; }}
                                            >
                                                <ServiceCard
                                                    key={service._id}
                                                    service={service}
                                                    isActive={isActive}
                                                    isMobile={isMobile}
                                                    onClick={setActiveService}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Desktop Map Sidebar */}
                                {!isMobile && services.length > 0 && (
                                    <aside ref={asideRef} className="lg:col-span-1">
                                        <div className="sticky top-[calc(var(--header-h)+1rem)] z-40 rounded shadow">
                                            {/* Use max-h so it fits the viewport but doesn't fight the column height */}
                                            <div className="h-[60vh] rounded bg-white overflow-visible">
                                                <AllServicesMap
                                                    services={services}
                                                    selectedServiceId={activeService as string | null}
                                                    onSelect={handleMapSelect}
                                                />
                                            </div>
                                        </div>
                                    </aside>
                                )}
                            </section>
                        </>
                    )
                }
                {/* Filters and Listings */}

            </main >
            <div className="bbg-custom-soil">
                <FAQSection />
            </div>
            <ClientTestimonials />
        </>
    );
}
