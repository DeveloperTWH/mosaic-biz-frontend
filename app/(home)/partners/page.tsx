"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Lock, Plus } from "lucide-react"; // Import Lucide's Lock and Plus icon
import Link from "next/link"; // Import Next.js Link component

// Define the type for the business data you expect from the API
interface Business {
  _id: string;
  businessName: string;
  logo?: string;
  slug: string;
  isApproved: boolean;
  isActive: boolean;
}

const Page: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectStatus, setConnectStatus] = useState<
    Record<
      string,
      {
        onboardingStatus:
          | "not_started"
          | "in_progress"
          | "requirements_due"
          | "completed";
        chargesEnabled: boolean;
        payoutsEnabled: boolean;
      }
    >
  >({});
  const [connectLoadingIds, setConnectLoadingIds] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    // Fetch business data from the API
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/my`, {
        withCredentials: true, // Include credentials (cookies) in the request
      })
      .then((response) => {
        const list: Business[] = response.data.businesses;
        setBusinesses(list);
        setLoading(false);

        // fetch connect status for each business (especially useful for not-approved ones)
        list.forEach((b) => fetchConnectStatusFor(b._id));
      })
      .catch((error) => {
        console.error("Error fetching business data:", error);
        setLoading(false);
      });
  }, []);

  const fetchConnectStatusFor = async (businessId: string) => {
    try {
      setConnectLoadingIds((prev) => ({ ...prev, [businessId]: true }));
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/connect/${businessId}/status`,
        { withCredentials: true }
      );
      const d = res.data;
      setConnectStatus((prev) => ({
        ...prev,
        [businessId]: {
          onboardingStatus: d.onboardingStatus,
          chargesEnabled: !!d.chargesEnabled,
          payoutsEnabled: !!d.payoutsEnabled,
        },
      }));
    } catch (e) {
      console.error("Connect status error:", e);
    } finally {
      setConnectLoadingIds((prev) => ({ ...prev, [businessId]: false }));
    }
  };

  const startStripeOnboarding = async (businessId: string) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/connect/${businessId}/account-link`,
        {},
        { withCredentials: true }
      );
      if (res.data?.url) window.location.href = res.data.url;
    } catch (e: any) {
      alert(e?.message || "Unable to start onboarding");
    }
  };

  // Sort businesses with approved ones at the top
  const sortedBusinesses = [...businesses].sort(
    (a, b) => (b.isApproved ? 1 : 0) - (a.isApproved ? 1 : 0)
  );

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="container p-6 mx-auto">
      <h1 className="mb-6 text-3xl font-semibold text-center">Businesses</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* If no businesses, show a welcome message */}
        {businesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center col-span-4 p-4 text-center bg-gray-100 rounded-lg shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-700">
              Welcome! You don't have any businesses listed yet.
            </h3>
            <Link href="/partners/business/new" passHref>
              <button className="flex gap-1 px-3 py-2 font-bold text-white transition-all duration-300 rounded shadow-lg bg-custom-blue hover:scale-105">
                Create New Business <Plus size={24} />
              </button>
            </Link>
          </div>
        ) : (
          sortedBusinesses.map((business, index) => (
            <div
              key={business.slug}
              className="flex flex-col items-center p-4 overflow-hidden bg-white rounded-lg shadow-lg"
            >
              {/* Business logo or name */}
              <div className="flex items-center justify-center w-24 h-24 mb-4 overflow-hidden bg-gray-200 rounded-full">
                {business.logo ? (
                  <img
                    src={business.logo}
                    alt="Business Logo"
                    className="object-cover w-full h-full rounded-full shadow-md"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-gray-600">
                    {business.businessName.charAt(0)}
                  </span>
                )}
              </div>

              {/* Business name */}
              <h3 className="text-lg font-semibold text-center text-gray-800">
                {business.businessName}
              </h3>

              {/* Link or lock icon based on approval */}
              {(() => {
                const cs = connectStatus[business._id];
                const loadingCS = !!connectLoadingIds[business._id];
                const connected =
                  cs &&
                  cs.onboardingStatus === "completed" &&
                  cs.chargesEnabled &&
                  cs.payoutsEnabled;

                // Approved → go to dashboard
                if (business.isApproved) {
                  return (
                    <Link href={`/partners/${business.slug}`} passHref>
                      <button className="px-6 py-2 mt-4 text-white transition-all duration-300 bg-blue-500 rounded-md hover:bg-blue-600">
                        Go to Business
                      </button>
                    </Link>
                  );
                }

                // Not approved yet:
                //  - If not connected: show Connect with Stripe button
                //  - If connected: show Locked — waiting for admin approval
                if (!connected) {
                  return (
                    <div className="w-full mt-4">
                      <button
                        onClick={() => startStripeOnboarding(business._id)}
                        disabled={loadingCS}
                        className="w-full px-4 py-2 text-white bg-black rounded-md disabled:opacity-50"
                      >
                        {loadingCS ? "Checking…" : "Connect with Stripe"}
                      </button>
                      {cs && (
                        <p className="mt-2 text-xs text-gray-500 text-center">
                          Status: <b>{cs.onboardingStatus}</b> · Charges:{" "}
                          <b>{String(cs.chargesEnabled)}</b> · Payouts:{" "}
                          <b>{String(cs.payoutsEnabled)}</b>
                        </p>
                      )}
                    </div>
                  );
                }

                // Connected but not approved → locked banner
                return (
                  <div className="flex items-center mt-4 space-x-2 text-gray-600">
                    <Lock size={20} className="text-gray-500" />
                    <span
                      className="text-sm"
                      title="Waiting for admin approval"
                    >
                      Locked — waiting for admin approval
                    </span>
                  </div>
                );
              })()}
            </div>
          ))
        )}
        {businesses.length !== 0 ? (
          <div className="flex items-center justify-center lg:justify-start">
            <Link href="/partners/business/new" passHref>
              <button className="p-5 mt-4 text-white transition-all duration-300 bg-green-500 rounded-full shadow-lg hover:bg-green-600">
                <Plus size={24} />
              </button>
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Page;
