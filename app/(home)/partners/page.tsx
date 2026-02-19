"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Lock, Plus, Clock, CheckCircle, AlertCircle, FileText, 
  ArrowRight, Zap, Package, CreditCard, Globe, Shield 
} from "lucide-react";
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
      stage4?: {
        status: "ready" | "locked";
        message: string;
      };
      stage5?: {
        status: "not_started" | "in_progress" | "completed";
        message: string;
      };
      stage6?: {
        status: "not_started" | "in_progress" | "completed";
        message: string;
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

        // Check if user has an application ID
        checkApplicationId();
      })
      .catch((error) => {
        console.error("Error fetching business data:", error);
        setLoading(false);
        setOnboardingLoading(false);
      });
  }, []);

  // Check if user has an application ID
  const checkApplicationId = async () => {
    try {
      setOnboardingLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/applicationId`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data.success && response.data.applicationId) {
        setApplicationId(response.data.applicationId);
        setHasApplication(true);
        fetchOnboardingStatus(response.data.applicationId);
      } else {
        setHasApplication(false);
        setOnboardingStatus(null);
      }
      
    } catch (error: any) {
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

  // Fetch detailed status using application ID
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
        console.log("Onboarding Status:", response.data);
      }
    } catch (error) {
      console.error("Error fetching onboarding status:", error);
    } finally {
      setOnboardingLoading(false);
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="container p-6 mx-auto max-w-6xl">
      {/* Title */}
      <h1 className="mb-8 text-2xl font-bold text-center text-gray-800 uppercase tracking-wide">
        Business Profile Status
      </h1>

      {/* Onboarding Status Card (if user has application ID and status) */}
      {!onboardingLoading && hasApplication && onboardingStatus && (
        <div className="mb-8">
          {/* Onboarding Status Header */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Onboarding Status</h2>
              <p className="text-sm text-gray-600">{onboardingStatus.data.businessName}</p>
              <p className="text-xs text-gray-500">Application ID: {onboardingStatus.data.applicationId}</p>
            </div>
            <span className="px-4 py-1.5 bg-red-100 text-red-600 text-sm font-medium rounded-full">
              {onboardingStatus.data.status}
            </span>
          </div>

          {/* Six Stage Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            {/* Stage 1 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-indigo-900 mb-4 text-sm border-b border-gray-100 pb-2">
                Stage 1: Business Verification
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Status :</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(onboardingStatus.data.details.stage1.status)}`}>
                    {onboardingStatus.data.details.stage1.status === 'rejected' ? 'Rejected' : onboardingStatus.data.details.stage1.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Payment :</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    onboardingStatus.data.details.stage1.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {onboardingStatus.data.details.stage1.paymentStatus === 'paid' ? 'Paid' : onboardingStatus.data.details.stage1.paymentStatus}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Points :</span>
                  <span className="font-semibold text-gray-800">{onboardingStatus.data.details.stage1.points}</span>
                </div>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-indigo-900 mb-4 text-sm border-b border-gray-100 pb-2">
                Stage 2: Tier Selection
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Status :</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(onboardingStatus.data.details.stage2.status)}`}>
                    {onboardingStatus.data.details.stage2.status === 'pending' ? 'Pending' : onboardingStatus.data.details.stage2.status}
                  </span>
                </div>
                
                {/* Tier Selection Button - Show when currentStage = 2 */}
                {onboardingStatus.data.currentStage === 2 && (
                  <Link href={`/partners/tier-selection?appId=${onboardingStatus.data.applicationId}`}>
                    <button className="w-full mt-3 px-4 py-2 bg-blue-800 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group">
                      <Zap className="w-4 h-4" />
                      <span>Select Plan</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                )}
                
                {/* Locked message when Stage 1 not completed */}
                {onboardingStatus.data.currentStage < 2 && (
                  <div className="mt-2 p-2 bg-gray-50 rounded flex items-start gap-2">
                    <Lock className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-500">Complete Stage 1 first</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stage 3 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-indigo-900 mb-4 text-sm border-b border-gray-100 pb-2">
                Stage 3: Profile Completion
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Status :</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(onboardingStatus.data.details.stage3.status)}`}>
                    {onboardingStatus.data.details.stage3.status === 'not_started' ? 'Not Started' : onboardingStatus.data.details.stage3.status}
                  </span>
                </div>
                
                {/* Proceed with Business Profile Button - Show when currentStage = 3 */}
                {onboardingStatus.data.currentStage === 3 && (
                  <div className="mt-4">
                    <Link href={`/partners/business-profile`}>
                      <button className="w-full px-4 py-2.5 bg-blue-800 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 group">
                        <CheckCircle className="w-4 h-4" />
                        <span>Complete Profile</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Stage 4 - Product Creation */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-green-600 mb-4 text-sm border-b border-gray-100 pb-2">
                Stage 4: Product Creation
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Status :</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    onboardingStatus.data.currentStage >= 4 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {onboardingStatus.data.currentStage >= 4 ? 'Ready' : 'Locked'}
                  </span>
                </div>
                
                {/* Product Creation Button - Show when currentStage >= 4 */}
                {onboardingStatus.data.currentStage >= 4 && (
                  <div className="mt-4">
                    <Link href={`/partners/add-product`}>
                      <button className="w-full px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>Add Product</span>
                      </button>
                    </Link>
                  </div>
                )}
                
                {/* Locked message when Stage 3 not completed */}
                {onboardingStatus.data.currentStage < 4 && (
                  <div className="mt-2 p-2 bg-gray-50 rounded flex items-start gap-2">
                    <Lock className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-500">Complete Stage 3 first</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stage 5 - Payout & Bank Setup */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-purple-600 mb-4 text-sm border-b border-gray-100 pb-2">
                Stage 5: Payout & Bank
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600">Status :</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    onboardingStatus.data.currentStage >= 5 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {onboardingStatus.data.currentStage >= 5 ? 'Ready' : 'Locked'}
                  </span>
                </div>
                
                {/* Payout Setup Button - ALWAYS VISIBLE */}
                <div className="mt-4">
                  <Link href={`/partners/payout-setup`}>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Setup Payout</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Stage 6 - Final Review & Launch */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-amber-600 mb-4 text-sm border-b border-gray-100 pb-2">
                Stage 6: Final Review
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span className="text-gray-600">Status :</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    onboardingStatus.data.currentStage >= 6 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {onboardingStatus.data.currentStage >= 6 ? 'Ready' : 'Locked'}
                  </span>
                </div>
                
                {/* Launch Button - ALWAYS VISIBLE */}
                <div className="mt-4">
                  <Link href={`/partners/final-review`}>
                    <button className="w-full px-4 py-2 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Launch Business</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Rejection Alert */}
          {onboardingStatus.data.details.stage1.status === "rejected" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                Your application is rejected due to Not Qualified our Verification Criteria. Our team will contact you for further assistance. Thank you.
              </p>
            </div>
          )}

          {/* Action buttons for Stage 1 & 2 */}
          {onboardingStatus.data.details.stage1.status === "draft" && (
            <div className="mt-4 flex justify-end">
              <Link href="/partners/business/new">
                <button className="px-6 py-2 bg-indigo-900 text-white text-sm font-medium rounded-lg hover:bg-indigo-800 transition-colors">
                  Continue Draft
                </button>
              </Link>
            </div>
          )}
          {onboardingStatus.data.details.stage1.status === "submitted" && (
            <p className="text-xs text-gray-500 mt-4">⏱️ Awaiting admin review (24-48 hours)</p>
          )}
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
              Complete our simple 6-step verification process to get started.
            </p>
            <Link href="/partners/business/new" passHref>
              <button className="px-8 py-3 text-lg font-bold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
                Start Vendor Onboarding
              </button>
            </Link>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">1-3</span>
                </div>
                <h4 className="font-semibold mb-2">Setup & Verification</h4>
                <p className="text-sm text-gray-500">Business verification, profile, and products</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">4-5</span>
                </div>
                <h4 className="font-semibold mb-2">Payments & Payouts</h4>
                <p className="text-sm text-gray-500">Setup payment methods and bank details</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">6</span>
                </div>
                <h4 className="font-semibold mb-2">Final Review</h4>
                <p className="text-sm text-gray-500">Final verification and business launch</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;