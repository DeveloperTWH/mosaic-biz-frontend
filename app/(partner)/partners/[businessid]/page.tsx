'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';  // Get `params` from Next.js
import { useBusinessStore } from '@/app/store/businessStore'; // ✅ Import store
import PartnerDashboardShell from './components/PartnerDashboardShell';
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
import { ProductListingItem } from "@/types/product";
import { Subscription, SubscriptionPlantype } from '@/types/subscription';
import ServiceTable from './components/ServiceTable';
import DashboardLoadingBlock from '@/components/ui/dashboard-loading-block';
import {
  DashboardActionLink,
  DashboardPageHeader,
  DashboardStatusPill,
} from '@/components/ui/dashboard-primitives';

const DashboardPage = () => {
  const { business, setBusiness, clearBusiness } = useBusinessStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [businessData, setBusinessData] = useState<Business | null>(null);
  const [products, setProducts] = useState<ProductListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [outOfStockOrUnpublished, setOutOfStockOrUnpublished] = useState(0);
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlantype | null>(null);

  const [isLoading, setIsLoading] = useState(false);



  const { businessid } = useParams();  // Here `businessid` corresponds to [businessid] in the route
  const listingLabel = businessData?.listingType
    ? `${businessData.listingType.charAt(0).toUpperCase()}${businessData.listingType.slice(1)} business`
    : "Vendor business";

  useEffect(() => {


    if (!businessid) {
      console.log('Slug is not available yet.');
      return;  // Don't fetch if slug is not available yet
    }

    // Fetch business data first
    const fetchBusinessData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/${businessid}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          const { business, subscription, subscriptionPlan } = response.data.data;


          setBusinessData(business);
          setSubscription(subscription);
          setSubscriptionPlan(subscriptionPlan);
          setBusiness(business);

          const listingType = business.listingType;

          if (listingType === "food") {
            fetchFoodData(business._id);
          } else if (listingType === "service") {
            fetchServiceData(business._id);
          } else if (listingType === "product") {
            fetchProductData(business._id);
          }
        } else {
          throw new Error("Failed to fetch business data");
        }
      } catch (err: any) {
        console.log("Error fetching business data:", err);
        setError(err.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };



    fetchBusinessData();  // Fetch the business data first
  }, [businessid]);  // Trigger effect when `businessid` changes





  async function fetchFoodData(businessId: string, page: number = 1, limit: number = 4) {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/private/food/list`, {
        withCredentials: true,
        params: { businessId, page, limit },
      });

      const { data, total, totalPages } = response.data;
      setFoodItems(data);
      setTotal(total)
      setTotalPages(totalPages || Math.ceil(total / limit));
    } catch (err) {
      console.log('Error fetching food data:', err);
      setError('Error fetching food items.');
    }
  }

  async function fetchServiceData(businessId: string, page: number = 1, limit: number = 4) {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/private/services/list`, {
        withCredentials: true,
        params: { businessId, page, limit },
      });

      const { data, total, totalPages, unpublishedCount } = response.data;
      setOutOfStockOrUnpublished(unpublishedCount);
      setServices(data);
      setTotal(total);
      setTotalPages(totalPages || Math.ceil(total / limit));
    } catch (err) {
      console.log('Error fetching service data:', err);
      setError('Error fetching services.');
    }
  }


  async function fetchProductData(businessId: string, page: number = 1, limit: number = 4) {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/private/products/list`,
        {
          withCredentials: true,
          params: {
            businessId,
            page,
            limit,
          },
        }
      );

      const { data, total, totalPages, sellableCount, totalVariants } = response.data; // ✅ Ensure backend returns these
      setProducts(data as ProductListingItem[]);
      setTotal(totalVariants);
      setTotalPages(totalPages || Math.ceil(total / limit)); // Save totalPages in state
      console.log(sellableCount, total);

      setOutOfStockOrUnpublished(totalVariants - sellableCount);


    } catch (err: any) {
      console.log('Error fetching product data:', err);
      setError('Error fetching products.');
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <PartnerDashboardShell
      businessName={businessData?.businessName}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    >
      <div className="space-y-6">
          {
            loading && (
              <LoadingPage />
            )
          }
          {
            error && (
              <NotFoundPage />
            )
          }
          <Suspense fallback={<DashboardLoadingBlock label="Loading business data…" />}>
            {businessData && (
              <>
                <DashboardPageHeader
                  eyebrow="Vendor dashboard"
                  title={businessData.businessName || "Business dashboard"}
                  description={`Manage this ${listingLabel.toLowerCase()}, review inventory readiness, and keep the storefront prepared for customers.`}
                  action={
                    <DashboardActionLink href={`/partners/${businessid}/inventory`}>
                      Manage inventory
                    </DashboardActionLink>
                  }
                />
                <div className="flex flex-wrap gap-2">
                  <DashboardStatusPill tone="neutral">{listingLabel}</DashboardStatusPill>
                  {subscriptionPlan?.name ? (
                    <DashboardStatusPill tone="gold">{subscriptionPlan.name}</DashboardStatusPill>
                  ) : null}
                </div>
                <OverviewCards listingType={businessData.listingType} total={total} totalReviews={0} totalOrdersOrBookings={0} outOfStockOrUnpublished={outOfStockOrUnpublished} />
                <div className="flex flex-col gap-6 lg:flex-row">
                  <div className="w-full lg:w-3/4">
                    <SalesSection business={businessData} />
                  </div>
                  <div className="w-full lg:w-1/4">
                    <SubscriptionPlan subscriptionPlan={subscriptionPlan} subscription={subscription} />
                  </div>
                </div>

                {business?.listingType === 'product' && (
                  <ProductTable
                    products={products}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      fetchProductData(businessData._id, page); // call API with new page
                    }}
                    isLoading={isLoading}
                    error={error}
                  />
                )}

                {business?.listingType === 'service' && business._id && (
                  <ServiceTable
                    services={services}
                    businessId={business._id}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      fetchServiceData(business._id, page);
                    }}
                    onServicesChanged={() => fetchServiceData(business._id, currentPage)}
                    isLoading={isLoading}
                    error={error}
                  />
                )}

                <ReviewSummary business={businessData} />
              </>
            )}
          </Suspense>
      </div>
    </PartnerDashboardShell>
  );
};

export default DashboardPage;
