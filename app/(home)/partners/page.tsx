"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Lock,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  ArrowRight,
  Zap,
  Package,
  CreditCard,
  Globe,
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

const onboardingSteps = [
  { number: 1, label: "Business Verification" },
  { number: 2, label: "Tier Selection" },
  { number: 3, label: "Business Profile Setup" },
  { number: 4, label: "Product / Service Creation" },
  { number: 5, label: "Payout & Bank Setup" },
  { number: 6, label: "Final Review" },
];

const Page: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [hasApplication, setHasApplication] = useState<boolean>(false);
  const [onboardingLoading, setOnboardingLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<number>(1);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/my`, {
        withCredentials: true,
      })
      .then((response) => {
        const list: Business[] = response.data.businesses;
        setBusinesses(list);
        setLoading(false);
        checkApplicationId();
      })
      .catch((error) => {
        console.error("Error fetching business data:", error);
        setLoading(false);
        setOnboardingLoading(false);
      });
  }, []);

  const checkApplicationId = async () => {
    try {
      setOnboardingLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/applicationId`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
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
      if (error.response?.status === 404 || error.code === "ERR_BAD_REQUEST") {
        setHasApplication(false);
        setOnboardingStatus(null);
      } else {
        console.error("Error checking application ID:", error);
      }
    } finally {
      setOnboardingLoading(false);
    }
  };

  const fetchOnboardingStatus = async (appId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/status/${appId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setOnboardingStatus(response.data);
      }
    } catch (error) {
      console.error("Error fetching onboarding status:", error);
    } finally {
      setOnboardingLoading(false);
    }
  };

  useEffect(() => {
    if (onboardingStatus?.data?.currentStage) {
      setSelectedStage(onboardingStatus.data.currentStage);
    }
  }, [onboardingStatus]);

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
        return paymentStatus === "paid" ? (
          <Clock className="w-5 h-5 text-yellow-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-gray-400" />
        );
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

  const getStripStatus = (stepNumber: number) => {
    if (!onboardingStatus) return "locked";
    const current = onboardingStatus.data.currentStage;
    if (stepNumber < current) return "completed";
    if (stepNumber === current) return "active";
    return "locked";
  };

  const progressWidth = useMemo(() => {
    if (!onboardingStatus) return 0;
    const current = Math.min(Math.max(onboardingStatus.data.currentStage, 1), onboardingSteps.length);
    return ((current - 1) / (onboardingSteps.length - 1)) * 100;
  }, [onboardingStatus]);

  const renderSelectedStageCard = () => {
    if (!onboardingStatus) return null;

    if (selectedStage === 1) {
      return (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <div className="flex items-center gap-2">
                {getStatusIcon(
                  onboardingStatus.data.details.stage1.status,
                  onboardingStatus.data.details.stage1.paymentStatus
                )}
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    onboardingStatus.data.details.stage1.status
                  )}`}
                >
                  {onboardingStatus.data.details.stage1.status === "rejected"
                    ? "Rejected"
                    : onboardingStatus.data.details.stage1.status}
                </span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Payment</p>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  onboardingStatus.data.details.stage1.paymentStatus === "paid"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {onboardingStatus.data.details.stage1.paymentStatus === "paid"
                  ? "Paid"
                  : onboardingStatus.data.details.stage1.paymentStatus}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Points</p>
              <p className="font-semibold text-gray-800">{onboardingStatus.data.details.stage1.points}</p>
            </div>
          </div>

          {onboardingStatus.data.details.stage1.status === "rejected" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                Your application is rejected due to not meeting verification criteria. Our team will contact you.
              </p>
            </div>
          )}

          {onboardingStatus.data.details.stage1.status === "draft" && (
            <div className="flex justify-end">
              <Link href="/partners/business/new">
                <button className="px-6 py-2 bg-indigo-900 text-white text-sm font-medium rounded-lg hover:bg-indigo-800 transition-colors">
                  Continue Draft
                </button>
              </Link>
            </div>
          )}

          {onboardingStatus.data.details.stage1.status === "submitted" && (
            <p className="text-xs text-gray-500">Awaiting admin review (24-48 hours)</p>
          )}
        </div>
      );
    }

    if (selectedStage === 2) {
      return (
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(onboardingStatus.data.details.stage2.status)}`}>
              {onboardingStatus.data.details.stage2.status === "pending"
                ? "Pending"
                : onboardingStatus.data.details.stage2.status}
            </span>
          </div>

          {onboardingStatus.data.currentStage === 2 && (
            <Link href={`/partners/tier-selection?appId=${onboardingStatus.data.applicationId}`}>
              <button className="w-full md:w-auto px-5 py-2.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Select Plan
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          )}

          {onboardingStatus.data.currentStage < 2 && (
            <div className="p-3 bg-gray-50 rounded flex items-start gap-2">
              <Lock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-500">Complete Stage 1 first</p>
            </div>
          )}
        </div>
      );
    }

    if (selectedStage === 3) {
      return (
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(onboardingStatus.data.details.stage3.status)}`}>
              {onboardingStatus.data.details.stage3.status === "not_started"
                ? "Not Started"
                : onboardingStatus.data.details.stage3.status}
            </span>
          </div>

          {onboardingStatus.data.currentStage === 3 && (
            <Link href="/partners/business-profile">
              <button className="w-full md:w-auto px-5 py-2.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Complete Profile
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          )}
        </div>
      );
    }

    if (selectedStage === 4) {
      return (
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                onboardingStatus.data.currentStage >= 4
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {onboardingStatus.data.currentStage >= 4 ? "Ready" : "Locked"}
            </span>
          </div>

          {onboardingStatus.data.currentStage >= 4 ? (
            <Link href="/partners/add-product">
              <button className="w-full md:w-auto px-5 py-2.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <Package className="w-4 h-4" />
                Add Product
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          ) : (
            <div className="p-3 bg-gray-50 rounded flex items-start gap-2">
              <Lock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-500">Complete Stage 3 first</p>
            </div>
          )}
        </div>
      );
    }

    if (selectedStage === 5) {
      return (
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                onboardingStatus.data.currentStage >= 5
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {onboardingStatus.data.currentStage >= 5 ? "Ready" : "Locked"}
            </span>
          </div>

          <Link href="/partners/payout-setup">
            <button className="w-full md:w-auto px-5 py-2.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" />
              Setup Payout
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              onboardingStatus.data.currentStage >= 6
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {onboardingStatus.data.currentStage >= 6 ? "Ready" : "Locked"}
          </span>
        </div>

        <Link href="/partners/final-review">
          <button className="w-full md:w-auto px-5 py-2.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
            <Globe className="w-4 h-4" />
            Launch Business
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container p-6 mx-auto max-w-6xl">
      <h1 className="mb-8 text-2xl font-bold text-center text-gray-800 uppercase tracking-wide">
        Business Profile Status
      </h1>

      {!onboardingLoading && hasApplication && onboardingStatus && (
        <div className="mb-8">
          <div className="bg-gray-100 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Onboarding Status</h2>
              <p className="text-sm text-gray-600">{onboardingStatus.data.businessName}</p>
              <p className="text-xs text-gray-500">Application ID: {onboardingStatus.data.applicationId}</p>
            </div>
            <span className="px-4 py-1.5 bg-red-100 text-red-600 text-sm font-medium rounded-full">
              {onboardingStatus.data.status}
            </span>
          </div>

          <div className="mb-8 overflow-x-auto">
            <div className="min-w-[980px] px-2">
              <div className="relative flex items-start justify-between">
                <div className="absolute top-6 left-6 right-6 h-[2px] bg-gray-200 -z-10">
                  <div
                    className="h-full bg-[#c9a44a] transition-all duration-300"
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>

                {onboardingSteps.map((step) => {
                  const stripStatus = getStripStatus(step.number);
                  return (
                    <button
                      key={step.number}
                      type="button"
                      onClick={() => setSelectedStage(step.number)}
                      className="w-40 text-center flex flex-col items-center gap-3"
                    >
                      <span
                        className={`w-12 h-12 rounded-full border flex items-center justify-center font-semibold transition-colors ${
                          stripStatus === "completed"
                            ? "bg-[#c9a44a] border-[#c9a44a] text-white"
                            : stripStatus === "active"
                            ? "bg-[#f7f2df] border-[#c9a44a] text-[#c9a44a]"
                            : "bg-[#d7d7d7] border-[#d7d7d7] text-white"
                        }`}
                      >
                        {step.number}
                      </span>
                      <span
                        className={`text-sm font-semibold leading-5 ${
                          stripStatus === "locked" ? "text-gray-400" : "text-[#c9a44a]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
              Stage {selectedStage}: {onboardingSteps.find((step) => step.number === selectedStage)?.label}
            </h3>
            {renderSelectedStageCard()}
          </div>
        </div>
      )}

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
