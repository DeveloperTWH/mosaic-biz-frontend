"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "@/app/(home)/Components/Navbar";
import BusinessProfilePage from "@/app/(home)/partners/business-profile/page";
import ProductsPage from "@/app/(home)/partners/products/page";
import ServicesPage from "@/app/(home)/partners/services/page";
import FoodsPage from "@/app/(home)/partners/foods/page";

type ListingType = "product" | "service" | "food";
type DashboardTab =
  | "edit-profile"
  | "manage-listings"
  | "location-timings"
  | "inquiries"
  | "analytics";

interface Business {
  _id: string;
  isActive?: boolean;
  listingType?: ListingType;
}

const dashboardTabs = [
  { key: "edit-profile", label: "Edit Profile" },
  { key: "manage-listings", label: "Add/Edit Product/Services" },
  { key: "inquiries", label: "Inquiries" },
  { key: "analytics", label: "Analytics" },
] as const;

export default function PartnerDashboardPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>("edit-profile");

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

  const listingType = useMemo<ListingType>(() => {
    const activeBusiness = businesses.find((business) => business.isActive) ?? businesses[0];
    return activeBusiness?.listingType ?? "product";
  }, [businesses]);

  const listingLabel = useMemo(() => {
    if (listingType === "service") {
      return "Services";
    }

    if (listingType === "food") {
      return "Food";
    }

    return "Products";
  }, [listingType]);

  const selectedTab = dashboardTabs.find((tab) => tab.key === activeTab);

  const renderTabContent = () => {
    if (activeTab === "edit-profile") {
      return <BusinessProfilePage />;
    }

    if (activeTab === "manage-listings") {
      if (listingType === "service") {
        return <ServicesPage />;
      }

      if (listingType === "food") {
        return <FoodsPage />;
      }

      return <ProductsPage />;
    }

    if (activeTab === "location-timings") {
      return (
        <div className="rounded-2xl border border-dashed border-[#d9d0c2] bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-[#1c1c1c]">
            Add/Edit Location and Timings
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            This section will stay static for now. I can wire the real location and timing form next.
          </p>
        </div>
      );
    }

    if (activeTab === "inquiries") {
      return (
        <div className="rounded-2xl border border-dashed border-[#d9d0c2] bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-[#1c1c1c]">Inquiries</h2>
          <p className="mt-3 text-sm text-gray-600">
           +No Data found
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-dashed border-[#d9d0c2] bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-[#1c1c1c]">Analytics</h2>
        <p className="mt-3 text-sm text-gray-600">
          No data found
        </p>
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f7f2eb] pt-[110px]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-2xl font-bold text-center text-gray-800 uppercase tracking-wide">
            Vendor Dashboard
          </h1>

          <div className="mb-8 overflow-x-auto">
            <div className="min-w-[760px] px-2">
              <div className="grid grid-cols-4 gap-3">
                {dashboardTabs.map((tab) => {
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`min-h-[76px] rounded-xl border px-4 py-4 text-left transition-all ${
                        activeTab === tab.key
                          ? "border-[#c9a44a] bg-[#f7f2df] text-[#8b6a15] shadow-sm"
                          : "border-gray-200 bg-white text-gray-500 hover:border-[#d7c17d] hover:text-gray-700"
                      }`}
                    >
                      <span
                        className={`block text-sm font-semibold leading-5 ${
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

            {renderTabContent()}
          </div>
        </div>
      </main>
    </>
  );
}
