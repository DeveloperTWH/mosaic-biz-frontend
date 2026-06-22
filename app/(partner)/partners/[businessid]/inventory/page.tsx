"use client";

import { useBusinessStore } from '@/app/store/businessStore';
import { fetchBusinessBySlug } from '../utils/fetchBusiness';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { listPrivateServices } from '@/lib/api/services';
import { getUserSafeMessage } from '@/lib/api/errors';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ProductTable from '../components/ProductTable';
import axios from 'axios';
import { PackageSearch, Star, AlertTriangle } from "lucide-react";
import LoadingPage from '../components/LoadingPage';
import NotFoundPage from '../components/NotFoundPage';
import ServiceTable from '../components/ServiceTable';



const Page = () => {
    const { businessid } = useParams();
    const searchParams = useSearchParams();
    const inventoryRefreshToken = searchParams.get('updated');
    const { business, setBusiness, clearBusiness } = useBusinessStore();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // States for products, services, food
    const [products, setProducts] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [foodItems, setFoodItems] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [OutofStockOrUnpublised, setOutofStockOrUnpublised] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // ✅ Load Business
    useEffect(() => {
        if (!businessid) return;

        const loadBusiness = async () => {
            try {
                if (business && business.slug === businessid) return;
                if (business && business.slug !== businessid) clearBusiness();

                const fetchedBusiness = await fetchBusinessBySlug(businessid as string);
                setBusiness(fetchedBusiness);
            } catch (error) {
                console.error("Error loading business:", error);
            }
        };

        loadBusiness();
    }, [businessid]);

    // ✅ Fetch Data based on listingType
    useEffect(() => {
        if (!business) return;

        const { listingType, _id } = business;

        if (listingType === "product") fetchProducts(_id, currentPage);
        if (listingType === "service") fetchServices(_id, currentPage);
        if (listingType === "food") fetchFood(_id, currentPage);
    }, [business, currentPage, inventoryRefreshToken]);

    const fetchProducts = async (businessId: string, page = 1, limit = 10) => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/private/products/list`,
                {
                    withCredentials: true,
                    params: { businessId, page, limit },
                }
            );
            const { data, total, totalPages, sellableCount, totalVariants } = response.data;
            setProducts(data);
            setTotal(totalVariants);
            setOutofStockOrUnpublised(totalVariants - sellableCount);
            setTotalPages(totalPages || Math.ceil(total / limit));
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Error fetching products.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchServices = async (businessId: string, page = 1, limit = 10) => {
        try {
            setIsLoading(true);
            setError(null);
            const { data, total, totalPages, unpublishedCount } = await listPrivateServices(
                businessId,
                page,
                limit
            );

            setServices(data);
            setTotal(total);
            setTotalPages(totalPages || Math.ceil(total / limit));
            setOutofStockOrUnpublised(unpublishedCount);
        } catch (err) {
            console.error("Error fetching services:", err);
            setError(getUserSafeMessage(err, "Error fetching services."));
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFood = async (businessId: string, page = 1, limit = 10) => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/private/food/list`,
                {
                    withCredentials: true,
                    params: { businessId, page, limit }
                }
            );
            const { data, total, totalPages } = response.data;
            setFoodItems(data);
            setTotal(total);
            setTotalPages(totalPages || Math.ceil(total / limit));
        } catch (err) {
            console.error("Error fetching food items:", err);
            setError("Error fetching food items.");
        } finally {
            setIsLoading(false);
        }
    };

    const overviewData = [
        {
            label:
                business?.listingType === "product"
                    ? "Total Products"
                    : business?.listingType === "service"
                        ? "Total Services"
                        : "Total Food",
            value: total, // ✅ total from API
            icon: <PackageSearch className="w-5 h-5 text-white" />,
            bg: "bg-custom-yellow",
            border: "border-l-4 border-custom-yellow",
        },
        {
            label: "Available",
            value: total - OutofStockOrUnpublised, // ✅ (total - outOfStockOrUnpublished)
            icon: <Star className="w-5 h-5 text-white" />,
            bg: "bg-green-500",
            border: "border-l-4 border-green-500",
        },
        {
            label:
                business?.listingType === "service"
                    ? "Unpublished Services"
                    : "Out Of Stock",
            value: OutofStockOrUnpublised, // ✅ from API
            icon: <AlertTriangle className="w-5 h-5 text-white" />,
            bg: "bg-gray-400",
            border: "border-l-4 border-gray-400",
        },
    ];

    return (
        <div className="flex h-screen bg-[#EBEAE2]">
            <Sidebar businessName={business?.businessName} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 p-2 space-y-6 overflow-y-auto lg:p-6">
                    {isLoading && (
                        <LoadingPage />
                    )}

                    {error && (
                        <NotFoundPage />
                    )}


                    {business && !isLoading && !error && (
                        <>
                            <h1 className="text-xl font-bold capitalize">
                                {business.listingType} Inventory
                            </h1>
                            <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
                                {overviewData.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-4 p-4 bg-white rounded shadow ${item.border}`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg}`}
                                        >
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">{item.label}</p>
                                            <p className="text-xl font-semibold">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {business.listingType === 'product' && (
                                <ProductTable
                                    products={products}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) => {
                                        setCurrentPage(page);
                                        fetchProducts(business._id, page); // call API with new page
                                    }}
                                    isLoading={isLoading}
                                    error={error}
                                />
                            )}

                            {business.listingType === 'service' && business._id && (
                                <ServiceTable
                                    services={services}
                                    businessId={business._id}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) => {
                                        setCurrentPage(page);
                                        fetchServices(business._id, page);
                                    }}
                                    onServicesChanged={() => fetchServices(business._id, currentPage)}
                                    isLoading={isLoading}
                                    error={error}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Page;
