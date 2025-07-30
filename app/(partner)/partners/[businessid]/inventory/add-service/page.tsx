"use client";

import { useBusinessStore } from '@/app/store/businessStore';
import { fetchBusinessBySlug } from '../../utils/fetchBusiness';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import axios from 'axios';
import LoadingPage from '../../components/LoadingPage';
import NotFoundPage from '../../components/NotFoundPage';
import Link from 'next/link';
import CreateServiceForm from './CreateServiceForm';

const page = () => {
    const { businessid } = useParams();
    const { business, setBusiness, clearBusiness } = useBusinessStore();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


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
            } finally {
                setIsLoading(false);
            }
        };

        loadBusiness();
    }, [businessid]);

    if (!business || isLoading) return null;

    if (business.listingType !== 'service') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[100vh] text-center px-4">
                <div className="max-w-md p-6 bg-white border border-red-200 rounded-lg shadow">
                    <h1 className="mb-2 text-3xl font-bold text-red-600">403 - Not Authorized</h1>
                    <p className="mb-4 text-gray-700">
                        You don’t have permission to access this page. This section is only available for service-based businesses.
                    </p>
                    <Link href={`/partners/${business.slug}`}>
                        <button className="px-4 py-2 text-white transition bg-red-600 rounded hover:bg-red-700">
                            Go Back to Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        );
    }


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
                    <CreateServiceForm businessId={business?._id} businessSlug={business?.slug} />
                </main>
            </div>
        </div>
    );
};
export default page