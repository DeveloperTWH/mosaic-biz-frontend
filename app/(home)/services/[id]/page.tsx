"use client";

import React, { useState, useEffect, use, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FilterBar from "../components/FilterBar";
import FAQSection from "../../Components/FaQ";
import ClientTestimonials from "../../Components/ClientTestimonials";
import Link from "next/link";
import { MoveRight, SlidersHorizontal, ChevronDown, AlertTriangle, Loader2 } from "lucide-react";
import ServiceCard from "./components/ServiceCard";
import { Service } from '@/types/service';
import AllServicesMap from "./components/AllServicesMap";
import AffixSidebar from "./components/AffixSidebar"; // adjust path as needed
import PublicPageHero from "../../Components/PublicPageHero";
import { buildSearchPageUrl } from "../../Components/publicSearch";



interface PageProps {
    params: Promise<{ id: string }>;
}

type MinorityType = { _id: string; name: string };

const slugToTitle = (slug: string) =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function ServiceCategoryPage({ params }: PageProps) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const router = useRouter();

    const [activeService, setActiveService] = useState<String | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [searchText, setSearchText] = useState("");
    const [minorityType, setMinorityType] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [minorityTypes, setMinorityTypes] = useState<MinorityType[]>([]);

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

    const fetchServices = async (q?: string, m?: string, c?: string) => {
        try {
            setLoading(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/list?categorySlug=${id}&search=${q ?? searchText}&minorityType=${m ?? minorityType}&city=${c ?? searchLocation}`
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
        const fetchMinorityTypes = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/minority-types`);
                const data = await res.json();
                setMinorityTypes(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load minority types", err);
            }
        };

        fetchMinorityTypes();
    }, []);

    useEffect(() => {
        fetchServices();
    }, [id]);

    const handleSearch = () => {
        const match = minorityTypes.find((type) => String(type._id) === String(minorityType));
        router.push(buildSearchPageUrl({
            keyword: searchText,
            location: searchLocation,
            minorityType: match?.name || minorityType,
        }));
    };

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
        <div className="flex items-center justify-center p-5 text-market-teal">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span className="text-market-muted">Loading...</span>
        </div>
    );



    return (
        <>
            <main>
                {/* Banner */}
                <PublicPageHero
                    title={`${slugToTitle(id)} Services`}
                    breadcrumbs={[
                        { label: "Home", href: "/" },
                        { label: "Services", href: "/services" },
                        { label: slugToTitle(id) },
                    ]}
                    imageUrl="/Service/service.png"
                />
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
                    <div className="market-card mx-auto flex max-w-md flex-col items-center justify-center p-8 text-center">
                        <AlertTriangle className="mb-2 h-10 w-10 text-red-400" />
                        <span className="text-market-text">Service not found</span>
                    </div>
                ) :
                    (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                                <p className="text-xs uppercase tracking-wide text-market-teal">{id}</p>
                                <h2 className="heading mb-4 text-xl font-semibold text-market-text md:text-2xl">
                                    Top {slugToTitle(id)} Services Near You
                                </h2>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <div className="flex cursor-pointer items-center justify-center gap-1 rounded-full border border-white/10 bg-market-elevated px-3 py-1.5 capitalize text-market-text">
                                        <SlidersHorizontal size={"15px"} /> all
                                    </div>

                                    <div className="relative">
                                        <select className="cursor-pointer appearance-none rounded-full border border-white/10 bg-market-elevated px-3 py-1.5 capitalize text-market-text">
                                            <option value="">price</option>
                                            <option value="low">Low to High</option>
                                            <option value="high">High to Low</option>
                                        </select>
                                        <ChevronDown
                                            size={16}
                                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform text-market-muted"
                                        />
                                    </div>

                                    <div className="relative">
                                        <select className="cursor-pointer appearance-none rounded-full border border-white/10 bg-market-elevated px-3 py-1.5 capitalize text-market-text">
                                            <option value="">sort by</option>
                                            <option value="rating">Rating</option>
                                            <option value="reviews">Most Reviewed</option>
                                            <option value="new">Newest</option>
                                        </select>
                                        <ChevronDown
                                            size={16}
                                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform text-market-muted"
                                        />
                                    </div>

                                    <div className="cursor-pointer rounded-full border border-white/10 bg-market-elevated px-3 py-1.5 capitalize text-market-text">
                                        open now
                                    </div>
                                    <div className="cursor-pointer rounded-full border border-white/10 bg-market-elevated px-3 py-1.5 capitalize text-market-text">
                                        online booking
                                    </div>
                                    <div className="cursor-pointer rounded-full border border-white/10 bg-market-elevated px-3 py-1.5 capitalize text-market-text">
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
                                        <div className="sticky top-[calc(var(--header-h)+1rem)] z-40">
                                            <div className="market-card h-[60vh] overflow-visible rounded-2xl">
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
            <div className="bg-market-bg">
                <FAQSection />
            </div>
            <ClientTestimonials />
        </>
    );
}
