"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import FilterBar from "../components/FilterBar";
import FAQSection from "../../Components/FaQ";
import ClientTestimonials from "../../Components/ClientTestimonials";
import Link from "next/link";
import { MoveRight, SlidersHorizontal, ChevronDown } from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

interface Service {
    id: number;
    title: string;
    description: string;
    location: string;
    image: string;
    tags: string[];
    rating: number;
    reviews: number;
    mapQuery: string;
}

const dummyServices: Service[] = [
    {
        id: 1,
        title: "1. LOREM IPSUM",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae libero venenatis, tristique justo.",
        location: "San Francisco, CA",
        image: "/Service/19099.png",
        tags: ["Skin Care", "Salon Treatment"],
        rating: 4.5,
        reviews: 12,
        mapQuery: "1600+Amphitheatre+Parkway,+Mountain+View,+CA",
    },
    {
        id: 2,
        title: "2. LOREM IPSUM",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae libero venenatis, tristique justo.",
        location: "Los Angeles, CA",
        image: "/Service/19099.png",
        tags: ["Skin Care", "Nail Spa"],
        rating: 4.7,
        reviews: 10,
        mapQuery: "6801+Hollywood+Blvd,+Los+Angeles,+CA",
    },
    {
        id: 3,
        title: "3. LOREM IPSUM",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae libero venenatis, tristique justo.",
        location: "New York, NY",
        image: "/Service/19099.png",
        tags: ["Salon", "Hair Treatment"],
        rating: 4.2,
        reviews: 15,
        mapQuery: "Times+Square,+New+York,+NY",
    },
];

export default function ServiceCategoryPage({ params }: PageProps) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;

    const [activeService, setActiveService] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const selectedService = dummyServices.find(
        (service) => service.id === activeService
    );

    return (
        <>
            <main className="bg-white text-black">
                {/* Banner */}
                <section className="relative w-full">
                    <Image
                        src="/Service/Banner.png"
                        alt="Category Banner"
                        width={1200}
                        height={400}
                        className="w-full object-cover"
                    />
                </section>
                <FilterBar />

                {/* Filters and Listings */}
                <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Service List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <p className="uppercase text-custom-blue text-xs">{id}</p>
                            <h2 className="text-xl md:text-2xl font-bold mb-4 heading custom-blue">
                                Top Treatment Services Near San Francisco, California
                            </h2>
                            <div className="flex flex-wrap gap-2 text-[12px]">
                                <div className="capitalize border border-black px-3 py-1 rounded-full flex gap-1 justify-center items-center cursor-pointer">
                                    <SlidersHorizontal size={"15px"} /> all
                                </div>

                                {/* Price Dropdown */}
                                <div className="relative">
                                    <select className="capitalize border border-black px-3 py-1  rounded-full bg-white appearance-none cursor-pointer">
                                        <option value="">price</option>
                                        <option value="low">Low to High</option>
                                        <option value="high">High to Low</option>
                                    </select>
                                    <ChevronDown
                                        size={16}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-black"
                                    />
                                </div>

                                {/* Sort By Dropdown */}
                                <div className="relative">
                                    <select className="capitalize border border-black px-3 py-1  rounded-full bg-white appearance-none cursor-pointer">
                                        <option value="">sort by</option>
                                        <option value="rating">Rating</option>
                                        <option value="reviews">Most Reviewed</option>
                                        <option value="new">Newest</option>
                                    </select>
                                    <ChevronDown
                                        size={16}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-black"
                                    />
                                </div>

                                <div className="capitalize border border-black px-3 py-1 rounded-full cursor-pointer">
                                    open now
                                </div>
                                <div className="capitalize border border-black px-3 py-1 rounded-full cursor-pointer">
                                    online booking
                                </div>
                                <div className="capitalize border border-black px-3 py-1 rounded-full cursor-pointer">
                                    offers available
                                </div>
                            </div>

                        </div>

                        {dummyServices.map((service) => {
                            const isActive = activeService === service.id;

                            return (
                                <div
                                    key={service.id}
                                    onClick={() => setActiveService(service.id)}
                                    className={`cursor-pointer border rounded-md overflow-hidden shadow-sm transition-all duration-300 relative ${isActive ? "text-white" : "text-black"
                                        }`}
                                    style={
                                        isActive
                                            ? {
                                                backgroundImage:
                                                    "linear-gradient(216.65deg, rgba(0, 0, 0, 0.36) -10.96%, rgba(0, 0, 0, 0.87) 29.64%, #000000 70.76%), url('/Footer/footer-bg.png')",
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                            }
                                            : {}
                                    }
                                >
                                    <div className="grid grid-cols-3">
                                        <Image
                                            src={service.image}
                                            alt={service.title}
                                            width={150}
                                            height={150}
                                            className="object-cover h-full w-full col-span-1"
                                        />
                                        <div className="col-span-2 p-4">
                                            <h3 className="font-semibold text-lg mb-1">
                                                {service.title}
                                            </h3>
                                            <div className="my-1 text-sm">
                                                ⭐ {service.rating} ({service.reviews} Reviews)
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-xs my-2">
                                                {service.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-sm">{service.description}</p>
                                            <Link
                                                href={`/services/home-care-service/${service.id}`}

                                                className={`inline-flex items-center gap-1 mt-4 hover:underline text-[14px] ${isActive ? "text-custom-orange" : "text-black"}`}
                                            >
                                                Read More <MoveRight className="ml-1" size={14} />
                                            </Link>

                                        </div>
                                    </div>

                                    {/* Mobile-only map under the card */}
                                    {isMobile && isActive && (
                                        <div className="w-full h-64 mt-4 px-4 mb-5">
                                            <iframe
                                                src={`https://www.google.com/maps?q=${service.mapQuery}&output=embed`}
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                allowFullScreen
                                                loading="lazy"
                                                className="rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop Map Sidebar */}
                    {!isMobile && activeService !== null && selectedService && (
                        <div className="w-full h-96 sticky top-20 animate-fade-in rounded shadow overflow-hidden transition-opacity duration-500">
                            <iframe
                                src={`https://www.google.com/maps?q=${selectedService.mapQuery}&output=embed`}
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
            </main>
            <div className="bbg-custom-soil">
                <FAQSection />
            </div>
            <ClientTestimonials />
        </>
    );
}
