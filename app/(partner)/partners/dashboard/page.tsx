"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Navbar from "@/app/(home)/Components/Navbar";
import BusinessProfilePage from "@/app/(home)/partners/business-profile/page";
import ProductsPage from "@/app/(home)/partners/products/page";
import ServicesPage from "@/app/(home)/partners/services/page";
import FoodsPage from "@/app/(home)/partners/foods/page";
import InquiriesTable from "./components/InquiriesTable";
import OrdersTab from "./components/OrdersTab";
import BookingsTab from "./components/BookingsTab";
import ShippingSettingsTab from "./components/ShippingSettingsTab";
import TaxSettingsTab from "./components/TaxSettingsTab";
import PayoutSetupTab from "@/app/(home)/partners/payout-setup/page";
import LaunchReadinessPanel from "@/app/(home)/partners/components/LaunchReadinessPanel";
import Link from "next/link";

type ListingType = "product" | "service" | "food";
type DashboardTab =
  | "edit-profile"
  | "manage-listings"
  | "shipping-settings"
  | "payout-setup"
  | "tax-settings"
  | "location-timings"
  | "inquiries"
  | "analytics"
  | "bookings"
  | "orders";

interface Business {
  _id: string;
  isActive?: boolean;
  listingType?: ListingType;
  bookingToolLink?: string;
}

interface VendorInquiry {
  _id: string;
  businessId: string;
  businessName?: string;
  source?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  revealCount?: number;
  createdAt: string;
  lastRevealedAt?: string;
  customerId?: {
    _id?: string;
    name?: string;
    email?: string;
    mobile?: string;
  };
}

const baseDashboardTabs = [
  { key: "edit-profile", label: "Edit Profile" },
  { key: "manage-listings", label: "Add/Edit Product/Services" },
  { key: "inquiries", label: "Inquiries" },
  { key: "analytics", label: "Analytics" },
] as const;

function PartnerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>("edit-profile");
  const [inquiries, setInquiries] = useState<VendorInquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiriesError, setInquiriesError] = useState<string | null>(null);
  const [hasBookingLink, setHasBookingLink] = useState(false);

  useEffect(() => {
    const requestedTab = searchParams.get("tab");

    if (!requestedTab) {
      return;
    }

    const allowedTabs: DashboardTab[] = [
      "edit-profile",
      "manage-listings",
      "shipping-settings",
      "payout-setup",
      "tax-settings",
      "location-timings",
      "inquiries",
      "analytics",
      "bookings",
      "orders",
    ];

    if (allowedTabs.includes(requestedTab as DashboardTab)) {
      setActiveTab(requestedTab as DashboardTab);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/my`,
          { withCredentials: true }
        );

        setBusinesses(response.data.businesses ?? []);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const activeBusiness = useMemo(
    () => businesses.find((business) => business.isActive) ?? businesses[0],
    [businesses]
  );

  const listingType = useMemo<ListingType>(() => {
    return activeBusiness?.listingType ?? "product";
  }, [activeBusiness]);

  const listingLabel = useMemo(() => {
    if (listingType === "service") {
      return "Services";
    }

    if (listingType === "food") {
      return "Food";
    }

    return "Products";
  }, [listingType]);

  useEffect(() => {
    if (activeTab !== "inquiries") {
      return;
    }

    const fetchInquiries = async () => {
      try {
        setInquiriesLoading(true);
        setInquiriesError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enquiries/vendor`,
          { withCredentials: true }
        );

        setInquiries(response.data?.data ?? []);
      } catch (error: any) {
        console.error("Error fetching inquiries:", error);
        setInquiriesError(
          error?.response?.data?.message || "Failed to load inquiries."
        );
      } finally {
        setInquiriesLoading(false);
      }
    };

    fetchInquiries();
  }, [activeTab]);

  useEffect(() => {
    const resolveBookingAvailability = async () => {
      if (!activeBusiness?._id || activeBusiness.listingType === "product") {
        setHasBookingLink(false);
        return;
      }

      if ((activeBusiness.bookingToolLink ?? "").trim()) {
        setHasBookingLink(false);
        return;
      }

      try {
        if (activeBusiness.listingType === "service") {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/service/my-services`,
            { withCredentials: true }
          );

          const services = Array.isArray(response.data?.services)
            ? response.data.services
            : [];

          setHasBookingLink(
            !services.some(
              (service: { bookingToolLink?: string }) =>
                (service.bookingToolLink ?? "").trim().length > 0
            )
          );
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/food/my-foods`,
          { withCredentials: true }
        );

        const foods = Array.isArray(response.data?.foods) ? response.data.foods : [];

        setHasBookingLink(
          !foods.some(
            (food: { bookingToolLink?: string }) =>
              (food.bookingToolLink ?? "").trim().length > 0
          )
        );
      } catch (error) {
        console.error("Error resolving booking link availability:", error);
        setHasBookingLink(false);
      }
    };

    resolveBookingAvailability();
  }, [activeBusiness]);

  const dashboardTabs = useMemo(() => {
    const manageListingsLabel = `Add/Edit ${listingLabel}`;

    if (listingType === "product") {
      return [
        { key: "edit-profile", label: "Edit Profile" },
        { key: "tax-settings", label: "Tax Settings" },
        { key: "manage-listings", label: manageListingsLabel },
        { key: "shipping-settings", label: "Shipping Settings" },
        { key: "payout-setup", label: "Payout Setup" },
        { key: "orders", label: "Orders" },
        { key: "inquiries", label: "Inquiries" },
        { key: "analytics", label: "Analytics" },
      ] as const;
    }

    const baseTabs = [
      { key: "edit-profile", label: "Edit Profile" },
      { key: "manage-listings", label: manageListingsLabel },
      { key: "inquiries", label: "Inquiries" },
      { key: "analytics", label: "Analytics" },
    ] as const;

    if (hasBookingLink) {
      return [...baseTabs, { key: "bookings", label: "Bookings" }] as const;
    }

    return baseTabs;
  }, [hasBookingLink, listingType, listingLabel]);

  useEffect(() => {
    const isActiveTabVisible = dashboardTabs.some((tab) => tab.key === activeTab);

    if (!isActiveTabVisible) {
      setActiveTab("edit-profile");
    }
  }, [activeTab, dashboardTabs]);

  const selectedTab = dashboardTabs.find((tab) => tab.key === activeTab);
  const dashboardTabCount = Number(dashboardTabs.length);

  const renderTabContent = () => {
    if (activeTab === "edit-profile") {
      return <BusinessProfilePage embedded />;
    }

    if (activeTab === "manage-listings") {
      if (listingType === "service") {
        return <ServicesPage />;
      }

      if (listingType === "food") {
        return <FoodsPage />;
      }

      return <ProductsPage onNextTab={() => setActiveTab("shipping-settings")} />;
    }

    if (activeTab === "location-timings") {
      return (
        <div className="rounded-2xl border border-dashed border-[#d9d0c2] bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-[#1c1c1c]">
            Add/Edit Location and Timings
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            This section will stay static for now. I can wire the real location and
            timing form next.
          </p>
        </div>
      );
    }

    if (activeTab === "inquiries") {
      if (inquiriesLoading) {
        return (
          <div className="rounded-2xl border border-[#ebe2d3] bg-[#fcfaf6] p-8 text-center">
            <p className="text-sm font-medium text-gray-600">Loading inquiries...</p>
          </div>
        );
      }

      if (inquiriesError) {
        return (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-red-700">Inquiries</h2>
            <p className="mt-3 text-sm text-red-600">{inquiriesError}</p>
          </div>
        );
      }

      if (inquiries.length === 0) {
        return (
          <div className="rounded-2xl border border-dashed border-[#d9d0c2] bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-[#1c1c1c]">Inquiries</h2>
            <p className="mt-3 text-sm text-gray-600">No inquiries found.</p>
          </div>
        );
      }

      return <InquiriesTable inquiries={inquiries} />;
    }

    if (activeTab === "orders") {
      return (
        <OrdersTab
          businessId={activeBusiness?._id}
          isActive={activeTab === "orders"}
        />
      );
    }

    if (activeTab === "shipping-settings") {
      return (
        <ShippingSettingsTab
          businessId={activeBusiness?._id}
          isActive={activeTab === "shipping-settings"}
          onNextTab={() => setActiveTab("payout-setup")}
        />
      );
    }

    if (activeTab === "payout-setup") {
      return <PayoutSetupTab embedded onNextTab={() => router.push("/partners/final-review")} />;
    }

    if (activeTab === "tax-settings") {
      return (
        <TaxSettingsTab
          businessId={activeBusiness?._id}
          isActive={activeTab === "tax-settings"}
        />
      );
    }

    if (activeTab === "bookings") {
      return (
        <BookingsTab
          businessId={activeBusiness?._id}
          listingType={listingType === "food" ? "food" : "service"}
          isActive={activeTab === "bookings"}
        />
      );
    }

    return (
      <div className="rounded-2xl border border-dashed border-[#d9d0c2] bg-white p-8 text-center">
        <p className="mt-3 text-sm text-gray-600">No data found</p>
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f7f2eb] pt-[110px]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-center text-2xl font-bold uppercase tracking-wide text-gray-800">
            Vendor Dashboard
          </h1>
          {!loading && activeBusiness && (
            <div className="mb-8 space-y-4">
              <LaunchReadinessPanel currentStage={3} />
              <div className="rounded-xl border border-[#e8dfc8] bg-[#fcfaf6] px-5 py-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Your next steps</p>
              <p className="mt-1">
                Keep your profile current, manage listings, and monitor orders from this dashboard.
                {activeTab !== "manage-listings" ? (
                  <>
                    {" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("manage-listings")}
                      className="font-semibold text-[#8b6a15] underline"
                    >
                      Go to listings
                    </button>
                  </>
                ) : null}
              </p>
              <p className="mt-3">
                <Link href="/refer-a-vendor" className="font-semibold text-[#8b6a15] hover:underline">
                  Refer another vendor →
                </Link>
              </p>
            </div>
            </div>
          )}

          <div className="mb-8 overflow-x-auto">
            <div className="min-w-[760px] px-2">
              <div
                className={`grid gap-3 ${
                  dashboardTabCount === 8
                    ? "grid-cols-8"
                    : dashboardTabCount === 7
                    ? "grid-cols-7"
                    : dashboardTabCount === 6
                    ? "grid-cols-6"
                    : dashboardTabCount === 5
                      ? "grid-cols-5"
                      : "grid-cols-4"
                }`}
              >
                {dashboardTabs.map((tab) => {
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`min-h-[76px] rounded-xl border px-2.5 py-3.5 text-left transition-all ${
                        activeTab === tab.key
                          ? "border-[#c9a44a] bg-[#f7f2df] text-[#8b6a15] shadow-sm"
                          : "border-gray-200 bg-white text-gray-500 hover:border-[#d7c17d] hover:text-gray-700"
                      }`}
                    >
                      <span
                        className={`block text-xs md:text-sm font-semibold leading-tight break-words ${
                          activeTab === tab.key ? "text-[#8b6a15]" : "text-inherit"
                        }`}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-5 border-b border-gray-100 pb-3 font-semibold text-gray-900">
              {selectedTab?.label}
            </h3>

            {/* <div className="mb-6 rounded-xl bg-[#fcfaf7] px-4 py-3 text-sm text-gray-600">
              {activeTab === "manage-listings" ? (
                <>
                  Current listing type:{" "}
                  <span className="font-medium capitalize">
                    {loading ? "Loading..." : listingLabel}
                  </span>
                </>
              ) : (
                <></>
              )}
            </div> */}

            {!loading && (
              <div className="mb-4 text-sm text-gray-500">
                 Business type: <span className="font-medium capitalize">{listingLabel}</span>
              </div>
            )}

            {renderTabContent()}
          </div>
        </div>
      </main>
    </>
  );
}

export default function PartnerDashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f2eb] pt-[110px]">
          <div className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-gray-600">
            Loading dashboard...
          </div>
        </main>
      }
    >
      <PartnerDashboardContent />
    </Suspense>
  );
}
