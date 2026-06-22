"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  X,
  Lock,
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
import VendorApplicationShell from "./components/VendorApplicationShell";
import { useRouter } from "next/navigation";
import {
  clearStaleClientSession,
  getAuthenticatedUser,
  isBusinessOwner,
  persistClientSession,
} from "@/utils/authUtils";
import {
  submitStage1,
  VendorSubmissionError,
  waitForStage1PaymentConfirmation,
} from "@/lib/api/vendorOnboarding";

interface Business {
  _id: string;
  businessName: string;
  logo?: string;
  slug: string;
  isApproved: boolean;
  isActive: boolean;
  listingType?: "product" | "service" | "food";
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
        status:
          | "pending"
          | "draft"
          | "submitted"
          | "under_review"
          | "approved"
          | "verified"
          | "rejected";
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

function getStage1StatusLabel(status: string): string {
  switch (status) {
    case "rejected":
      return "Rejected";
    case "verified":
      return "Verified";
    case "approved":
      return "Approved";
    case "submitted":
      return "Submitted";
    case "under_review":
      return "Under Review";
    case "draft":
      return "Draft";
    case "pending":
      return "Pending";
    default:
      return status;
  }
}

function isStage1Complete(status: string): boolean {
  return status === "verified" || status === "approved";
}

function isPaidNeedsSubmit(
  status: string,
  paymentStatus: string
): boolean {
  return (
    paymentStatus === "paid" &&
    (status === "draft" || status === "pending")
  );
}

const Page: React.FC = () => {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [hasApplication, setHasApplication] = useState<boolean>(false);
  const [onboardingLoading, setOnboardingLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stripeReturnProcessing, setStripeReturnProcessing] = useState(false);

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

  useEffect(() => {
    let cancelled = false;

    const redirectToVendorLogin = () => {
      clearStaleClientSession();
      router.push("/login?type=vendor&redirect=%2Fpartners");
    };

    const loadPartnerHub = async () => {
      const user = await getAuthenticatedUser();
      if (cancelled) return;

      if (!user || !isBusinessOwner(user)) {
        redirectToVendorLogin();
        return;
      }

      persistClientSession(user);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/my`,
          { withCredentials: true }
        );
        if (cancelled) return;

        const list: Business[] = response.data.businesses ?? [];
        setBusinesses(list);
        await checkApplicationId();
      } catch (error: any) {
        if (cancelled) return;

        console.error("Error fetching business data:", error);
        const status = error.response?.status;

        if (status === 401) {
          const recheck = await getAuthenticatedUser();
          if (!recheck || !isBusinessOwner(recheck)) {
            redirectToVendorLogin();
            return;
          }
        }

        setBusinesses([]);
        await checkApplicationId();
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPartnerHub();

    return () => {
      cancelled = true;
    };
  }, [router]);

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

  const confirmAndSubmitApplication = async (appId: string) => {
    setSubmitLoading(true);
    setSubmitError(null);

    try {
      const ready = await waitForStage1PaymentConfirmation();
      if (!ready) {
        setSubmitError(
          "Payment is still being confirmed. Please wait a moment and try again."
        );
        return false;
      }

      await submitStage1();
      await fetchOnboardingStatus(appId);
      return true;
    } catch (err) {
      if (err instanceof VendorSubmissionError && err.status === 402) {
        setSubmitError(
          "Payment confirmation is still processing. Please try again shortly."
        );
      } else {
        setSubmitError(
          err instanceof Error
            ? err.message
            : "Failed to submit application. Please try again."
        );
      }
      return false;
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!applicationId) return;
    await confirmAndSubmitApplication(applicationId);
  };

  useEffect(() => {
    if (typeof window === "undefined" || loading || !applicationId) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const paymentIntentId = params.get("payment_intent");
    const redirectStatus = params.get("redirect_status");

    if (!paymentIntentId || redirectStatus !== "succeeded") {
      return;
    }

    const processedKey = `vendor_stage1_submit_${paymentIntentId}`;
    if (sessionStorage.getItem(processedKey) === "done") {
      router.replace("/partners");
      return;
    }

    let cancelled = false;

    const runStripeReturnSubmit = async () => {
      setStripeReturnProcessing(true);
      sessionStorage.setItem(processedKey, "done");

      const succeeded = await confirmAndSubmitApplication(applicationId);
      if (cancelled) return;

      setStripeReturnProcessing(false);
      router.replace("/partners");

      if (!succeeded) {
        sessionStorage.removeItem(processedKey);
      }
    };

    runStripeReturnSubmit();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, applicationId]);

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
      case "under_review":
      case "in_progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "approved":
      case "verified":
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
      case "under_review":
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
      case "verified":
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

  const listingManagement = useMemo(() => {
    const primaryBusiness = businesses.find((b) => b.isActive) ?? businesses[0];
    const listingType = primaryBusiness?.listingType;

    if (listingType === "service") {
      return {
        label: "Manage Services",
        href: "/partners/services",
      };
    }

    if (listingType === "food") {
      return {
        label: "Manage Foods",
        href: "/partners/foods",
      };
    }

    return {
      label: "Manage Products",
      href: "/partners/products",
    };
  }, [businesses]);

  const renderSelectedStageCard = () => {
    if (!onboardingStatus) return null;

    if (selectedStage === 1) {
      const stage1 = onboardingStatus.data.details.stage1;
      const paidNeedsSubmit = isPaidNeedsSubmit(
        stage1.status,
        stage1.paymentStatus
      );

      return (
        <div className="space-y-4">
          {stripeReturnProcessing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
              <p className="text-sm text-blue-800">
                Payment received. Submitting your application for admin review…
              </p>
            </div>
          )}

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
                  {getStage1StatusLabel(onboardingStatus.data.details.stage1.status)}
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

          {paidNeedsSubmit && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    Payment received — one step left
                  </p>
                  <p className="text-sm text-amber-800 mt-1">
                    Submit your application to send it to the admin review queue.
                    Your application is not under review until submission completes.
                  </p>
                </div>
              </div>
              {submitError && (
                <p className="text-sm text-red-700">{submitError}</p>
              )}
              <div className="flex flex-wrap justify-end gap-2">
                <Link href="/partners/business/new">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Edit application
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  disabled={submitLoading || stripeReturnProcessing}
                  className="px-6 py-2 bg-indigo-900 text-white text-sm font-medium rounded-lg hover:bg-indigo-800 transition-colors disabled:opacity-60"
                >
                  {submitLoading ? "Submitting…" : "Submit application"}
                </button>
              </div>
            </div>
          )}

          {stage1.status === "draft" && !paidNeedsSubmit && (
            <div className="flex justify-end">
              <Link href="/partners/business/new">
                <button className="px-6 py-2 bg-indigo-900 text-white text-sm font-medium rounded-lg hover:bg-indigo-800 transition-colors">
                  Continue Draft
                </button>
              </Link>
            </div>
          )}

          {stage1.status === "pending" && !paidNeedsSubmit && stage1.paymentStatus !== "paid" && (
            <div className="flex justify-end">
              <Link href="/partners/business/new">
                <button className="px-6 py-2 bg-indigo-900 text-white text-sm font-medium rounded-lg hover:bg-indigo-800 transition-colors">
                  Continue application
                </button>
              </Link>
            </div>
          )}

          {onboardingStatus.data.details.stage1.status === "submitted" && (
            <p className="text-xs text-gray-500">Awaiting admin review (24-48 hours)</p>
          )}

          {onboardingStatus.data.details.stage1.status === "under_review" && (
            <p className="text-xs text-gray-500">Your application is under admin review.</p>
          )}

          {isStage1Complete(onboardingStatus.data.details.stage1.status) && (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  Verification complete. Continue to the next onboarding step below.
                </p>
              </div>
              {onboardingStatus.data.currentStage >= 3 && (
                <Link href="/partners/business-profile">
                  <button className="px-6 py-2 bg-indigo-900 text-white text-sm font-medium rounded-lg hover:bg-indigo-800 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Continue to Business Profile
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              )}
            </div>
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
              <button className="w-full md:w-auto px-5 py-2.5 bg-brand-navy-light hover:bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-navy transition-colors flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Select Plan
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          )}

          {onboardingStatus.data.currentStage < 2 && (
            <div className="p-3 bg-gray-50 rounded flex items-start gap-2">
              <Lock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-dashboard-muted">Complete Stage 1 first</p>
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
              <button className="w-full md:w-auto px-5 py-2.5 bg-brand-navy-light hover:bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-navy transition-colors flex items-center justify-center gap-2">
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
            <Link href={listingManagement.href}>
              <button className="w-full md:w-auto px-5 py-2.5 bg-brand-navy-light hover:bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <Package className="w-4 h-4" />
                {listingManagement.label}
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
            <button className="w-full md:w-auto px-5 py-2.5 bg-brand-navy-light hover:bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
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
          <button className="w-full md:w-auto px-5 py-2.5 bg-brand-navy-light hover:bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
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
      <VendorApplicationShell variant="dashboard">
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-dashboard-gold" />
        </div>
      </VendorApplicationShell>
    );
  }

  return (
    <VendorApplicationShell variant="dashboard">
      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <button
              type="button"
              aria-label="Close registration popup"
              onClick={() => setShowRegistrationModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] px-8 py-6 text-white">

              <h2 className="mt-2 text-3xl font-bold">Before You Get Started</h2>
            </div>

            <div className="space-y-6 px-8 py-8">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-sm font-semibold text-amber-900">
                  To join MosaicBizHub, a few details are mandatory for approval:
                </p>
                <ul className="mt-4 space-y-3 text-sm text-amber-950">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-600" />
                    <span>Minority-Owned Business status</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-600" />
                    <span>EIN / SSN</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-600" />
                    <span>Business License Number &amp; Supporting Document Upload</span>
                  </li>
                </ul>
                <p className="mt-4 text-sm font-medium text-amber-900">
                  These are required for verification. Applications without them will not be approved.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-slate-900">Build Your Trust Score</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Additional details you provide will earn trust points, helping you unlock higher trust badges.
                  This improves your visibility and allows customers to filter your business based on credibility
                  and transparency.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowRegistrationModal(false);
                    router.push("/partners/business/new");
                  }}
                  className="rounded-xl bg-[#c9a44a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b59138]"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!onboardingLoading && hasApplication && onboardingStatus && (
        <h1 className="mb-8 text-center text-2xl font-bold uppercase tracking-wide text-dashboard-text">
          Business Profile Status
        </h1>
      )}

      {!onboardingLoading && hasApplication && onboardingStatus && (
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between rounded-lg border border-border-warm bg-surface-panel p-4">
            <div>
              <h2 className="text-lg font-semibold text-dashboard-text">Onboarding Status</h2>
              <p className="text-sm text-dashboard-muted">
                Step {onboardingStatus.data.currentStage} of {onboardingSteps.length}: complete each stage to launch your storefront.
              </p>
              <p className="text-sm text-dashboard-muted">{onboardingStatus.data.businessName}</p>
              <p className="text-xs text-dashboard-muted">Application ID: {onboardingStatus.data.applicationId}</p>
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
            {/* <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus className="w-10 h-10 text-blue-600" />
            </div> */}
            <h2 className="mb-4 text-2xl font-bold text-dashboard-text">Start Your Vendor Journey</h2>
            <p className="mb-6 text-dashboard-muted">
              List your business on our platform and start reaching new customers.
              Complete our simple 6-step verification process to get started.
            </p>
            <button
              type="button"
              onClick={() => setShowRegistrationModal(true)}
              className="rounded-lg bg-dashboard-gold px-8 py-3 text-lg font-bold text-white shadow-lg transition-colors duration-300 hover:bg-brand-gold"
            >
              Start Vendor Onboarding
            </button>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">1-3</span>
                </div>
                <h4 className="font-semibold mb-2">Setup & Verification</h4>
                <p className="text-sm text-dashboard-muted">Business verification, profile, and products</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">4-5</span>
                </div>
                <h4 className="font-semibold mb-2">Payments & Payouts</h4>
                <p className="text-sm text-dashboard-muted">Setup payment methods and bank details</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">6</span>
                </div>
                <h4 className="font-semibold mb-2">Final Review</h4>
                <p className="text-sm text-dashboard-muted">Final verification and business launch</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </VendorApplicationShell>
  );
};

export default Page;
