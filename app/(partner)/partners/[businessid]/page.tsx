'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';  // Get `params` from Next.js
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import OverviewCards from './components/OverviewCards';
import SalesSection from './components/SalesSection';
import SubscriptionPlan from './components/SubscriptionPlan';
import ProductTable from './components/ProductTable';
import ReviewSummary from './components/ReviewSummary';
import LoadingPage from './components/LoadingPage';
import NotFoundPage from './components/NotFoundPage';

// Import Axios
import axios from 'axios';

// Import the Business type
import { Business } from '@/types/business';

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [businessData, setBusinessData] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { businessid } = useParams();  // Here `businessid` corresponds to [businessid] in the route

  useEffect(() => {
    if (!businessid) {
      console.log('Slug is not available yet.');
      return;  // Don't fetch if slug is not available yet
    }

    // Fetch business data first
    const fetchBusinessData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/${businessid}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setBusinessData(response.data.data);
          console.log('Business Data:', response.data.data);

          const listingType = response.data.data.listingType; // Assuming this field exists in your response
          console.log('Business Listing Type:', listingType);

          // Fetch the listing data based on business listing type
          if (listingType === 'food') {
            fetchFoodData(response.data.data._id);
          } else if (listingType === 'service') {
            fetchServiceData(response.data.data._id);
          } else if (listingType === 'product') {
            fetchProductData(response.data.data._id);
          }

        } else {
          throw new Error('Failed to fetch business data');
        }

      } catch (err:any) {
        console.log('Error fetching business data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchFoodData = async (businessId : string) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/private/food/list`, {
          params: {
            businessId: businessId,
            page: 1,
            limit: 10,
          },
        });
        console.log('Food Data:', response.data.data);  // Log food data
      } catch (err) {
        console.log('Error fetching food data:', err);
        setError('Error fetching food items.');
      }
    };

    const fetchServiceData = async (businessId : string) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/private/services/list`, {
          params: {
            businessId: businessId,
            page: 1,
            limit: 10,
          },
        });
        console.log('Service Data:', response.data.data);  // Log service data
      } catch (err) {
        console.log('Error fetching service data:', err);
        setError('Error fetching services.');
      }
    };

    const fetchProductData = async (businessId : string) => {
      try {
        console.log(businessId, 'Business ID for product fetch');
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/private/products/list`, {
          withCredentials: true,
          params: {
            businessId: businessId,
            page: 1,
            limit: 10,
          },
        });
        console.log('Product Data:', response.data.data);  // Log product data
      } catch (err:any) {
        console.log('Error fetching product data:', err);
        setError('Error fetching products.');
      }
    };

    fetchBusinessData();  // Fetch the business data first
  }, [businessid]);  // Trigger effect when `businessid` changes


  if (loading) {
    return <LoadingPage />;  // Show loading component
  }

  if (error) {
    return <NotFoundPage />;  // Show 404 Not Found component
  }

  return (
    <div className="flex h-screen bg-[#EBEAE2]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 p-2 space-y-6 overflow-y-auto lg:p-6">
          <Suspense fallback={<div>Loading Business Data...</div>}>
            {businessData && (
              <>
                <OverviewCards business={businessData} />
                <div className="flex flex-col gap-6 lg:flex-row">
                  <div className="w-full lg:w-3/4">
                    <SalesSection business={businessData} />
                  </div>
                  <div className="w-full lg:w-1/4">
                    <SubscriptionPlan business={businessData} />
                  </div>
                </div>

                <ProductTable business={businessData} />
                <ReviewSummary business={businessData} />
              </>
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
