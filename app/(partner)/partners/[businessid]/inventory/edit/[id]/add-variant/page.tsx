"use client";

import { useBusinessStore } from '@/app/store/businessStore';
import { fetchBusinessBySlug } from '../../../../utils/fetchBusiness';
import { useParams,useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../components/Sidebar';
import Topbar from '../../../../components/Topbar';
import axios from 'axios';
import LoadingPage from '../../../../components/LoadingPage';
import NotFoundPage from '../../../../components/NotFoundPage';
import AddVariantForm from './AddVariantForm';

const page = () => {
    const { businessid,id,variantId } = useParams();
    const { business, setBusiness, clearBusiness } = useBusinessStore();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


  const router = useRouter();
  
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
            } finally{
                setIsLoading(false);
            }
        };

        loadBusiness();
    }, [businessid]);


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
                    <AddVariantForm />
                </main>
            </div>
        </div>
    );
};
export default page