"use client";
import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  ChevronDown, ChevronUp, Check, X, Eye,
  Building2, FileText, Calendar, DollarSign,
  User, Globe, Link as LinkIcon, MapPin, Clock,
  Phone, Mail, Award, CheckCircle, XCircle,
  Briefcase, Users, CalendarDays, FileCheck,
  BadgeCheck, Store, Image as ImageIcon
} from "lucide-react";
import TermsModal from "./components/TermsModal";
import Congratulations from "./components/Congratulations";

interface Business {
  _id: string;
  businessName: string;
  logo?: string;
  listingType?: "product" | "service" | "food";
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  isActive?: boolean;
  products?: Array<string | { _id?: string }>;
  services?: Array<string | { _id?: string }>;
  foods?: Array<string | { _id?: string }>;
}

interface OnboardingData {
  businessName: string;
  status: string;
  applicationId: string;
  currentStage: number;
  details: {
    stage1: {
      status: string;
      points: number;
      paymentStatus: string;
    };
    stage2: {
      status: string;
      plan: string | null;
      amount: number | null;
      subscribedAt: string | null;
    };
    stage3: {
      status: string;
      isComplete: boolean;
      hasLogo: boolean;
      hasBio: boolean;
      businessName?: string;
      businessEmail?: string;
      businessPhone?: string;
      businessBio?: string;
      logo?: string;
    };
    stage4: {
      status: string;
      message: string;
    };
  };
}

// Extended interfaces for detailed data
interface BusinessVerificationDetails {
  businessName: string;
  businessType: string;
  ownershipType: string;
  yearsInBusiness: string;
  employeesCount: string;
  einNumber: string;
  ssnLast9: string;
  hasBusinessLicense: boolean;
  licenseNumber: string;
  isMinorityOwned: boolean;
  minorityCategories: string[];
  otherMinorityCategory: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  primaryContactName: string;
  primaryContactDesignation: string;
  contactEmail: string;
  businessEmail: string;
  contactPhone: string;
  documents: {
    minorityProof: Array<{ url: string; verified: boolean }>;
    taxDocs: Array<{ url: string; verified: boolean }>;
    businessLicense: Array<{ url: string; verified: boolean }>;
  };
  verificationPoints: number;
  paymentStatus: string;
  submittedAt: string;
  status: string;
}

interface BusinessProfileDetails {
  businessName: string;
  businessBio: string;
  logo: string;
  featureBanner: string;
  businessEmail: string;
  businessPhone: string;
  alternatePhone: string;
  website: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  tiktok: string;
  language: string;
  googleReviewLink: string;
  communityServiceLink: string;
  businessHours?: Array<{ day: string; hours: string; closed?: boolean }>;
  location?: string;
  hasLogo: boolean;
  hasBio: boolean;
  isComplete: boolean;
}

export default function FinalReviewPage() {
  const router = useRouter();
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [agreeChecked, setAgreeChecked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"terms" | "privacy" | "directory">("terms");
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [verificationDetails, setVerificationDetails] = useState<BusinessVerificationDetails | null>(null);
  const [profileDetails, setProfileDetails] = useState<BusinessProfileDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Accordion state
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  // Fetch business data and onboarding status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // First, get application ID
        const appIdResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/applicationId`,
          { withCredentials: true }
        );

        if (appIdResponse.data.success && appIdResponse.data.applicationId) {
          const appId = appIdResponse.data.applicationId;

          // Fetch onboarding status using application ID
          const statusResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/status/${appId}`,
            { withCredentials: true }
          );

          if (statusResponse.data.success) {
            setOnboardingData(statusResponse.data.data);
          }

          // Fetch detailed onboarding data
          const detailedResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/onboarding-data`,
            { withCredentials: true }
          );

          if (detailedResponse.data.success) {
            const data = detailedResponse.data.data;

            // Set verification details
            setVerificationDetails({
              businessName: data.businessName || '',
              businessType: data.businessType || 'Not specified',
              ownershipType: data.ownershipType || 'Not specified',
              yearsInBusiness: data.yearsInBusiness || 'Not specified',
              employeesCount: data.employeesCount || 'Not specified',
              einNumber: data.einNumber || 'Not provided',
              ssnLast9: data.ssnLast9 ? '••••••' + data.ssnLast9.slice(-4) : 'Not provided',
              hasBusinessLicense: data.hasBusinessLicense || false,
              licenseNumber: data.licenseNumber || 'Not provided',
              isMinorityOwned: data.isMinorityOwned || false,
              minorityCategories: data.minorityCategories || [],
              otherMinorityCategory: data.otherMinorityCategory || '',
              address: data.address || {
                street: '', city: '', state: '', country: '', zipCode: ''
              },
              primaryContactName: data.primaryContactName || '',
              primaryContactDesignation: data.primaryContactDesignation || '',
              contactEmail: data.contactEmail || data.primaryEmail || '',
              businessEmail: data.businessEmail || data.secondaryBusinessEmail || '',
              contactPhone: data.contactPhone || data.primaryPhone || '',
              documents: {
                minorityProof: data.minorityProofDocuments || [],
                taxDocs: data.taxDocuments || [],
                businessLicense: data.businessLicenseDocuments || []
              },
              verificationPoints: data.totalVerificationPoints || 0,
              paymentStatus: data.verificationPayment?.status || 'pending',
              submittedAt: data.submittedAt || data.createdAt,
              status: data.status || 'pending'
            });

            // Set profile details
            setProfileDetails({
              businessName: data.businessName || '',
              businessBio: data.businessBio || '',
              logo: data.businessProfileImage?.url || '',
              featureBanner: data.featureBanner?.url || '',
              businessEmail: data.businessEmail || data.primaryEmail || '',
              businessPhone: data.businessPhone || data.primaryPhone || '',
              alternatePhone: data.alternatePhone || '',
              website: data.website || '',
              facebook: data.facebook || '',
              instagram: data.instagram || '',
              twitter: data.twitter || '',
              linkedin: data.linkedin || '',
              tiktok: data.tiktok || '',
              language: data.language || 'English',
              googleReviewLink: data.googleReviewLink || '',
              communityServiceLink: data.communityServiceLink || '',
              businessHours: data.businessHours || [],
              location: data.location?.address || '',
              hasLogo: !!data.businessProfileImage?.url,
              hasBio: !!data.businessBio,
              isComplete: !!(data.businessProfileImage?.url && data.businessBio)
            });
          }
        }

        // Fetch business details
        const businessResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/my`,
          { withCredentials: true }
        );

        if (businessResponse.data.businesses?.length > 0) {
          const currentBusiness =
            businessResponse.data.businesses.find((item: Business) => item.isActive) ??
            businessResponse.data.businesses[0];

          setBusiness(currentBusiness);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Determine step status based on onboarding data
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber === 6) {
      return business?.chargesEnabled && business?.payoutsEnabled
        ? "completed"
        : "incompleted";
    }

    if (!onboardingData) return "pending";

    switch (stepNumber) {
      case 1: // Business Verification
        return onboardingData.details.stage1.status === "submitted" ||
          onboardingData.details.stage1.status === "verified"
          ? "completed" : "pending";
      case 2: // Tier / Subscription Selection
        return onboardingData.details.stage2.status === "active"
          ? "completed" : "pending";
      case 3: // Subscription Payment
        return onboardingData.details.stage1.paymentStatus === "paid"
          ? "completed" : "pending";
      case 4: // Business Profile Setup
        return onboardingData.details.stage3.isComplete
          ? "completed" : "pending";
      case 5: // Product / Service Creation
        return onboardingData.currentStage && onboardingData.currentStage >= 4 ? "completed" : "pending";
      default:
        return "pending";
    }
  };

  const toggleStep = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  const steps = useMemo(() => {
    const baseSteps = [
      {
        number: "01",
        title: "Business Verification",
        status: getStepStatus(1),
        link: "/partners/business/new",
        details: onboardingData ? {
          points: onboardingData.details.stage1.points,
          paymentStatus: onboardingData.details.stage1.paymentStatus
        } : null
      },
      {
        number: "02",
        title: "Tier / Subscription Selection",
        status: getStepStatus(2),
        link: "/partners/tier-selection",
        details: onboardingData ? {
          plan: onboardingData.details.stage2.plan,
          amount: onboardingData.details.stage2.amount
        } : null
      },
      {
        number: "03",
        title: "Subscription Payment",
        status: getStepStatus(3),
        link: "/partners/tier-selection/success",
        details: onboardingData ? {
          status: onboardingData.details.stage1.paymentStatus,
          date: onboardingData.details.stage2.subscribedAt
        } : null
      },
      {
        number: "04",
        title: "Business Profile Setup",
        status: getStepStatus(4),
        link: "/partners/business-profile",
        details: onboardingData ? {
          hasLogo: onboardingData.details.stage3.hasLogo,
          hasBio: onboardingData.details.stage3.hasBio
        } : null
      },
      {
        number: "05",
        title: "Product / Service Creation",
        status: getStepStatus(5),
        link: "/partners/products"
      }
    ];

    // ✅ Only add Payout step if listingType is "product"
    if (business?.listingType === "product") {
      baseSteps.push({
        number: "06",
        title: "Payout & Bank Setup",
        status: getStepStatus(6),
        link: "/partners/payout-setup"
      });
    }

    return baseSteps;
  }, [business, onboardingData]);

  // const steps = [
  //   { 
  //     number: "01", 
  //     title: "Business Verification", 
  //     status: getStepStatus(1), 
  //     link: "/partners/business/new",
  //     details: onboardingData ? {
  //       points: onboardingData.details.stage1.points,
  //       paymentStatus: onboardingData.details.stage1.paymentStatus
  //     } : null
  //   },
  //   { 
  //     number: "02", 
  //     title: "Tier / Subscription Selection", 
  //     status: getStepStatus(2), 
  //     link: "/partners/tier-selection",
  //     details: onboardingData ? {
  //       plan: onboardingData.details.stage2.plan,
  //       amount: onboardingData.details.stage2.amount
  //     } : null
  //   },
  //   { 
  //     number: "03", 
  //     title: "Subscription Payment", 
  //     status: getStepStatus(3), 
  //     link: "/partners/tier-selection/success",
  //     details: onboardingData ? {
  //       status: onboardingData.details.stage1.paymentStatus,
  //       date: onboardingData.details.stage2.subscribedAt
  //     } : null
  //   },
  //   { 
  //     number: "04", 
  //     title: "Business Profile Setup", 
  //     status: getStepStatus(4), 
  //     link: "/partners/business-profile",
  //     details: onboardingData ? {
  //       hasLogo: onboardingData.details.stage3.hasLogo,
  //       hasBio: onboardingData.details.stage3.hasBio
  //     } : null
  //   },
  //   { 
  //     number: "05", 
  //     title: "Product / Service Creation", 
  //     status: getStepStatus(5), 
  //     link: "/partners/products" 
  //   },
  //   { 
  //     number: "06", 
  //     title: "Payout & Bank Setup", 
  //     status: "incompleted", 
  //     link: "/partners/payout-setup" 
  //   },
  // ];

  const openModal = (type: "terms" | "privacy" | "directory") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (confirmChecked && agreeChecked) {
      setShowCongratulations(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a227]"></div>
      </div>
    );
  }

  if (showCongratulations) {
    return <Congratulations business={business} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide">FINAL REVIEW</h1>
          <p className="text-gray-500 mt-2 text-sm">
            review and submit the profile
          </p>
          {onboardingData && (
            <p className="text-xs text-gray-400 mt-1">
              Application ID: {onboardingData.applicationId}
            </p>
          )}
        </div>

        {/* Steps List with Accordion */}
        <div className="space-y-3 mb-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-[#f5f5f0] rounded-lg overflow-hidden"
            >
              {/* Step Header - Always Visible */}
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => step.number === "06" ? router.push(step.link) : toggleStep(index + 1)}>
                <div className="flex items-center gap-4 flex-1">
                  {/* Number Badge */}
                  <span className="w-8 h-8 rounded-md bg-[#c9a227] flex items-center justify-center text-sm font-bold text-white">
                    {step.number}
                  </span>

                  {/* Title */}
                  <span className="font-semibold text-gray-800 text-sm">
                    {step.title}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Badge */}
                  <span className={`text-xs px-3 py-1 rounded-full border ${step.status === 'completed'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : step.status === 'incompleted'
                      ? 'border-red-400 text-red-500 bg-red-50'
                      : 'border-yellow-400 text-yellow-600 bg-yellow-50'
                    }`}>
                    {step.status === 'completed' ? 'Completed' :
                      step.status === 'incompleted' ? 'Incomplete' : 'Pending'}
                  </span>

                  {/* Expand/Collapse Arrow */}
                  {expandedStep === index + 1 ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Content - White background, shows when step is expanded */}
              {expandedStep === index + 1 && (
                <div className="bg-white px-4 pb-4 pt-3 border-t border-gray-200">
                  {/* Step 1 - Business Verification Details - FILLED WITH ALL DATA */}
                  {step.number === "01" && verificationDetails && (
                    <div className="space-y-4">
                      {/* Business Information Section */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#c9a227]" />
                          Business Information
                        </h4>
                        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg">
                          <div>
                            <p className="text-xs text-gray-500">Business Name</p>
                            <p className="text-sm font-medium">{verificationDetails.businessName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Business Type</p>
                            <p className="text-sm">{verificationDetails.businessType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Ownership Type</p>
                            <p className="text-sm">{verificationDetails.ownershipType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Years in Business</p>
                            <p className="text-sm">{verificationDetails.yearsInBusiness}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Employees</p>
                            <p className="text-sm">{verificationDetails.employeesCount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">EIN</p>
                            <p className="text-sm font-mono">{verificationDetails.einNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">License Number</p>
                            <p className="text-sm">{verificationDetails.licenseNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Has Business License</p>
                            <p className="text-sm">
                              {verificationDetails.hasBusinessLicense ? (
                                <span className="text-green-600 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Yes
                                </span>
                              ) : (
                                <span className="text-gray-400">No</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Minority Status Section */}
                      {verificationDetails.isMinorityOwned && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Award className="w-4 h-4 text-[#c9a227]" />
                            Minority Status
                          </h4>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {verificationDetails.minorityCategories.map((cat, idx) => (
                                <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                  {cat}
                                </span>
                              ))}
                            </div>
                            {verificationDetails.otherMinorityCategory && (
                              <p className="text-xs text-gray-600">
                                Other: {verificationDetails.otherMinorityCategory}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Address Section */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#c9a227]" />
                          Address
                        </h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm">{verificationDetails.address.street}</p>
                          <p className="text-sm">
                            {verificationDetails.address.city}, {verificationDetails.address.state} {verificationDetails.address.zipCode}
                          </p>
                          <p className="text-sm">{verificationDetails.address.country}</p>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-[#c9a227]" />
                          Primary Contact
                        </h4>
                        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg">
                          <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="text-sm">{verificationDetails.primaryContactName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Designation</p>
                            <p className="text-sm">{verificationDetails.primaryContactDesignation}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Contact Email</p>
                            <p className="text-sm">{verificationDetails.contactEmail}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Business Email</p>
                            <p className="text-sm">{verificationDetails.businessEmail}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm">{verificationDetails.contactPhone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Documents Section */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#c9a227]" />
                          Uploaded Documents
                        </h4>
                        <div className="space-y-3">
                          {/* Minority Proof Documents */}
                          {verificationDetails.documents.minorityProof.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs font-medium text-gray-600 mb-2">Minority Proof Documents</p>
                              <div className="space-y-2">
                                {verificationDetails.documents.minorityProof.map((doc, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => window.open(doc.url, '_blank')}
                                    className="flex items-center justify-between w-full p-2 bg-white rounded border hover:border-blue-300 transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-blue-500" />
                                      <span className="text-xs truncate max-w-[200px]">
                                        {doc.url.split('/').pop()}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {doc.verified && (
                                        <span className="text-xs text-green-600 flex items-center gap-1">
                                          <CheckCircle className="w-3 h-3" /> Verified
                                        </span>
                                      )}
                                      <Eye className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tax Documents */}
                          {verificationDetails.documents.taxDocs.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs font-medium text-gray-600 mb-2">Tax Documents</p>
                              <div className="space-y-2">
                                {verificationDetails.documents.taxDocs.map((doc, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => window.open(doc.url, '_blank')}
                                    className="flex items-center justify-between w-full p-2 bg-white rounded border hover:border-blue-300 transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-red-500" />
                                      <span className="text-xs truncate max-w-[200px]">
                                        {doc.url.split('/').pop()}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {doc.verified && (
                                        <span className="text-xs text-green-600 flex items-center gap-1">
                                          <CheckCircle className="w-3 h-3" /> Verified
                                        </span>
                                      )}
                                      <Eye className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Business License Documents */}
                          {verificationDetails.documents.businessLicense.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs font-medium text-gray-600 mb-2">Business License Documents</p>
                              <div className="space-y-2">
                                {verificationDetails.documents.businessLicense.map((doc, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => window.open(doc.url, '_blank')}
                                    className="flex items-center justify-between w-full p-2 bg-white rounded border hover:border-blue-300 transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-green-500" />
                                      <span className="text-xs truncate max-w-[200px]">
                                        {doc.url.split('/').pop()}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {doc.verified && (
                                        <span className="text-xs text-green-600 flex items-center gap-1">
                                          <CheckCircle className="w-3 h-3" /> Verified
                                        </span>
                                      )}
                                      <Eye className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Verification Summary */}
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BadgeCheck className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-gray-600">Verification Points:</span>
                            <span className="text-sm font-semibold text-blue-600">{verificationDetails.verificationPoints}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-gray-600">Payment:</span>
                            <span className={`text-xs font-medium capitalize ${verificationDetails.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                              }`}>
                              {verificationDetails.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4 - Business Profile Details - FILLED WITH ALL DATA */}
                  {step.number === "04" && profileDetails && (
                    <div className="space-y-4">
                      {/* Logo and Banner Section */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> Business Logo
                          </h4>
                          {profileDetails.logo ? (
                            <img
                              src={profileDetails.logo}
                              alt="Business Logo"
                              className="w-24 h-24 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setSelectedDoc(profileDetails.logo)}
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-400">No Logo</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> Feature Banner
                          </h4>
                          {profileDetails.featureBanner ? (
                            <img
                              src={profileDetails.featureBanner}
                              alt="Feature Banner"
                              className="w-24 h-24 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setSelectedDoc(profileDetails.featureBanner)}
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-400">No Banner</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Business Information */}
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-2">Business Information</h4>
                        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                          <div>
                            <p className="text-xs text-gray-500">Business Name</p>
                            <p className="text-sm font-medium">{profileDetails.businessName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Business Bio</p>
                            <p className="text-sm text-gray-700">{profileDetails.businessBio || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Language</p>
                            <p className="text-sm">{profileDetails.language}</p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-2">Contact Information</h4>
                        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg">
                          <div>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> Email
                            </p>
                            <p className="text-sm">{profileDetails.businessEmail || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> Phone
                            </p>
                            <p className="text-sm">{profileDetails.businessPhone || 'Not provided'}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> Alternate Phone
                            </p>
                            <p className="text-sm">{profileDetails.alternatePhone || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2 - Tier Selection Details */}
                  {step.number === "02" && step.details && step.details.plan && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Selected Plan</p>
                          <p className="font-medium">{step.details.plan}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="font-medium">${step.details.amount}</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Link href={step.link}>
                          <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            Change Plan
                            <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Step 3 - Payment Details */}
                  {step.number === "03" && step.details && step.details.status && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Payment Status</p>
                          <p className="font-medium capitalize">{step.details.status}</p>
                        </div>
                        {step.details.date && (
                          <div>
                            <p className="text-xs text-gray-500">Payment Date</p>
                            <p className="font-medium">{new Date(step.details.date).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <Link href={step.link}>
                          <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            View Payment Details
                            <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Step 5 - Product Creation */}
                  {step.number === "05" && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Manage Your  Products Or services
                      </p>
                      <div className="flex justify-end">
                        <Link href={step.link}>
                          <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            {onboardingData?.currentStage && onboardingData.currentStage >= 4 ? 'Manage Products' : 'Create Products'}
                            <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Step 6 - Payout Setup */}
                  {step.number === "06" && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Payout and bank setup is required to receive payments.
                      </p>
                      <div className="flex justify-end">
                        <Link href={step.link}>
                          <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            Setup Payout
                            <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Checkboxes */}
        <div className="mb-8 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
            />
            <span className="text-xs text-gray-600 leading-relaxed">
              I Certify That All The Business Information Provided Is True, Accurate, And Complete To The Best Of My Knowledge.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeChecked}
              onChange={(e) => setAgreeChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
            />
            <span className="text-xs text-gray-600 leading-relaxed">
              I Agree To Abide By Hub's{" "}
              <button
                type="button"
                onClick={() => openModal("terms")}
                className="text-[#1e3a5f] hover:text-[#c9a227] underline font-medium transition-colors"
              >
                Terms And Conditions
              </button>{" "}
              And{" "}
              <button
                type="button"
                onClick={() => openModal("privacy")}
                className="text-[#1e3a5f] hover:text-[#c9a227] underline font-medium transition-colors"
              >
                Privacy Policy
              </button>
              {" "}And{" "}
              <button
                type="button"
                onClick={() => openModal("directory")}
                className="text-[#1e3a5f] hover:text-[#c9a227] underline font-medium transition-colors"
              >
                Directory Policy
              </button>.
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!confirmChecked || !agreeChecked}
            className={`px-8 py-2.5 rounded text-sm font-medium transition-colors ${confirmChecked && agreeChecked
              ? 'bg-[#1e3a5f] text-white hover:bg-[#152a45] cursor-pointer'
              : 'bg-[#1e3a5f] text-white opacity-50 cursor-not-allowed'
              }`}
          >
            Publish Profile and Products
          </button>
          {/* <button
            onClick={() => {
              setConfirmChecked(false);
              setAgreeChecked(false);
            }}
            className="px-8 py-2.5 rounded text-sm font-medium bg-gray-400 text-white hover:bg-gray-500 transition-colors"
          >
            Clear Response
          </button> */}
        </div>
      </div>

      {/* Terms Modal */}
      <TermsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />

      {/* Image Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[70] flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedDoc(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>
          <img src={selectedDoc} alt="Preview" className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}
