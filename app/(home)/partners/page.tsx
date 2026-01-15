"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Lock, Plus, Clock, CheckCircle, AlertCircle, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Business {
  _id: string;
  businessName: string;
  logo?: string;
  slug: string;
  isApproved: boolean;
  isActive: boolean;
}

interface OnboardingStatus {
  success: boolean;
  data: {
    applicationId: string;
    businessName: string;
    currentStage: number;
    status: string;
    nextAction: string;
    details: {
      stage1: {
        status: "pending" | "draft" | "submitted" | "approved" | "rejected";
        points: number;
        paymentStatus: "pending" | "paid" | "failed";
      };
      stage2: {
        status: "pending" | "in_progress" | "completed";
      };
      stage3: {
        status: "not_started" | "in_progress" | "completed";
        totalPoints: number;
      };
    };
  };
}

const Page: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [hasApplication, setHasApplication] = useState<boolean>(false);
  const [connectStatus, setConnectStatus] = useState<
    Record<
      string,
      {
        onboardingStatus: "not_started" | "in_progress" | "requirements_due" | "completed";
        chargesEnabled: boolean;
        payoutsEnabled: boolean;
      }
    >
  >({});
  const [connectLoadingIds, setConnectLoadingIds] = useState<Record<string, boolean>>({});
  const [onboardingLoading, setOnboardingLoading] = useState(true);

  useEffect(() => {
    // Fetch business data from the API
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/my`, {
        withCredentials: true,
      })
      .then((response) => {
        const list: Business[] = response.data.businesses;
        setBusinesses(list);
        setLoading(false);

        // Step 1: First check if user has an application ID
        checkApplicationId();

        // fetch connect status for each business
        list.forEach((b) => fetchConnectStatusFor(b._id));
      })
      .catch((error) => {
        console.error("Error fetching business data:", error);
        setLoading(false);
        setOnboardingLoading(false);
      });
  }, []);

  // Step 1: Check if user has an application ID
  const checkApplicationId = async () => {
    try {
      setOnboardingLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/applicationId`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            // Add Authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }
      );
      
      if (response.data.success && response.data.applicationId) {
        // User has an application ID
        setApplicationId(response.data.applicationId);
        setHasApplication(true);
        
        // Step 2: Fetch detailed status using the application ID
        fetchOnboardingStatus(response.data.applicationId);
      } else {
        // No application ID found
        setHasApplication(false);
        setOnboardingStatus(null);
      }
      
    } catch (error: any) {
      // If 404 or no application found, it's normal - user hasn't started
      if (error.response?.status === 404 || error.code === 'ERR_BAD_REQUEST') {
        setHasApplication(false);
        setOnboardingStatus(null);
      } else {
        console.error("Error checking application ID:", error);
      }
    } finally {
      setOnboardingLoading(false);
    }
  };

  // Step 2: Fetch detailed status using application ID
  const fetchOnboardingStatus = async (appId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/status/${appId}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data.success) {
        setOnboardingStatus(response.data);
      }
    } catch (error) {
      console.error("Error fetching onboarding status:", error);
    }
  };

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

  const getStatusIcon = (stageStatus: string, paymentStatus?: string) => {
    switch (stageStatus) {
      case "draft":
        return <FileText className="w-5 h-5 text-gray-500" />;
      case "submitted":
      case "in_progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "approved":
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return paymentStatus === "paid" 
          ? <Clock className="w-5 h-5 text-yellow-500" />
          : <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (stageStatus: string) => {
    switch (stageStatus) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "submitted":
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Sort businesses with approved ones at the top
  const sortedBusinesses = [...businesses].sort(
    (a, b) => (b.isApproved ? 1 : 0) - (a.isApproved ? 1 : 0)
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="container p-6 mx-auto">
      <h1 className="mb-6 text-3xl font-semibold text-center">Businesses</h1>

      {/* Onboarding Status Card (if user has application ID and status) */}
      {!onboardingLoading && hasApplication && onboardingStatus && (
        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Onboarding Status</h2>
              <p className="text-gray-600">{onboardingStatus.data.businessName}</p>
              <p className="text-sm text-gray-900">Application ID: {onboardingStatus.data.applicationId}</p>
            </div>
            <div className={`mt-2 md:mt-0 px-4 py-2 rounded-full font-semibold ${getStatusColor(onboardingStatus.data.details.stage1.status)}`}>
              {onboardingStatus.data.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Stage 1 */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(onboardingStatus.data.details.stage1.status, onboardingStatus.data.details.stage1.paymentStatus)}
                <h3 className="font-semibold">Stage 1: Business Verification</h3>
              </div>
              <p className="text-sm">Status: <span className="font-medium">{onboardingStatus.data.details.stage1.status}</span></p>
              <p className="text-sm">Payment: <span className="font-medium">{onboardingStatus.data.details.stage1.paymentStatus}</span></p>
              <p className="text-sm">Points <span className="font-medium">{onboardingStatus.data.details.stage1.points}</span></p>
              
              {/* Action buttons for Stage 1 */}
              {onboardingStatus.data.details.stage1.status === "draft" && (
                <Link href="partners/business/new">
                  <button className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Continue Draft
                  </button>
                </Link>
              )}
              {onboardingStatus.data.details.stage1.status === "submitted" && (
                <p className="text-xs text-gray-500 mt-2">Awaiting admin review (24-48 hours)</p>
              )}
            </div>

            {/* Stage 2 */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(onboardingStatus.data.details.stage2.status)}
                <h3 className="font-semibold">Stage 2: Tier Selection</h3>
              </div>
              <p className="text-sm">Status: <span className="font-medium">{onboardingStatus.data.details.stage2.status}</span></p>
              {onboardingStatus.data.details.stage2.status === "pending" && onboardingStatus.data.details.stage1.status === "approved" && (
                <Link href="/partners/business/new">
                  <button className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Start Stripe Setup
                  </button>
                </Link>
              )}
            </div>

            {/* Stage 3 */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(onboardingStatus.data.details.stage3.status)}
                <h3 className="font-semibold">Stage 3: Profile Completion</h3>
              </div>
              <p className="text-sm">Status: <span className="font-medium">{onboardingStatus.data.details.stage3.status}</span></p>
              <p className="text-sm">Points: <span className="font-medium">{onboardingStatus.data.details.stage3.totalPoints}</span></p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">Next Action:</p>
                <p className="text-blue-700">{onboardingStatus.data.nextAction}</p>
              </div>
              {onboardingStatus.data.details.stage1.status === "draft" && (
                <Link href="partners/business/new">
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                    Continue Application
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* "Start Vendor Onboarding" Section (if no application exists) */}
      {!onboardingLoading && !hasApplication && (
        <div className="mb-8 p-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Vendor Journey</h2>
            <p className="text-gray-600 mb-6">
              List your business on our platform and start reaching new customers. 
              Complete our simple 3-step verification process to get started.
            </p>
            <Link href="partners/business/new" passHref>
              <button className="px-8 py-3 text-lg font-bold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
                Start Vendor Onboarding
              </button>
            </Link>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold mb-2">Business Verification</h4>
                <p className="text-sm text-gray-500">Submit your business details and documents</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold mb-2">Payment Setup</h4>
                <p className="text-sm text-gray-500">Connect Stripe to receive payments</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">3</span>
                </div>
                <h4 className="font-semibold mb-2">Profile Completion</h4>
                <p className="text-sm text-gray-500">Complete your business profile</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing Businesses Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sortedBusinesses.map((business, index) => (
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
        ))}

        {/* Add New Business Button (only show if there are existing businesses) */}
        {businesses.length > 0 && (
          <div className="flex items-center justify-center">
            <Link href="/partners/business/new" passHref>
              <button className="flex flex-col items-center justify-center p-6 mt-4 text-white transition-all duration-300 bg-green-500 rounded-lg shadow-lg hover:bg-green-600 w-full h-full">
                <Plus size={32} className="mb-2" />
                <span className="font-medium">Add New Business</span>
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Show Become Vendor button if has businesses but no onboarding */}
      {!onboardingLoading && !hasApplication && businesses.length > 0 && (
        <div className="mt-8 text-center">
          <Link href="/vendor/onboarding" passHref>
            <button className="px-6 py-3 font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 mx-auto">
              <Plus className="w-5 h-5" />
              Start Vendor Onboarding
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;