"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Music,
  DollarSign,
  Calendar,
  CheckSquare,
  XSquare,
  Shield,
  Users,
  Award,
  Clock,
  ExternalLink,
  Download,
  AlertCircle,
  User,
  Briefcase,
  Home,
  CreditCard,
  FileCheck,
  RefreshCw,
  Loader2,
  Eye,
  Check,
  X,
  CheckCheck,
  AlertTriangle
} from "lucide-react";

type Document = {
  url: string;
  verified: boolean;
  _id: string;
};

type VerifiableAsset = {
  url?: string;
  verified: boolean;
};

type VerificationChecklist = {
  minorityDocs: boolean;
  taxDocs: boolean;
  businessLicense: boolean;
  website: boolean;
  facebook: boolean;
  instagram: boolean;
  linkedin: boolean;
  tiktok: boolean;
  businessProfileImage?: boolean;
  businessBio?: boolean;
  refundPolicyDocument?: boolean;
  termsDocument?: boolean;
  googleReviewLink?: boolean;
  communityServiceLink?: boolean;
  [key: string]: boolean | undefined;
};

type VendorApplication = {
  _id: string;
  applicationId: string;
  businessName: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "verified";
  totalVerificationPoints: number;
  isMinorityOwned: boolean;
  minorityCategories: string[];
  hasEIN: boolean;
  hasBusinessLicense: boolean;
  einNumber: string;
  licenseNumber:string;
  ssnLast9: string;
  yearsInBusiness: string;
  isFranchise: boolean;
  franchiseName: string | null;
  businessType: string;
  hasPhysicalLocation: boolean;
  primaryContactName: string;
  primaryContactDesignation: string;
  secondaryBusinessEmail: string;
  usesThirdPartyBooking: boolean;
  ownershipType: string;
  employeesCount: string;
  website: string;
  facebook: string;
  instagram: string;
  linkedin: string | null;
  tiktok: string | null;
  businessBio?: string;
  googleReviewLink?: string;
  communityServiceLink?: string;
  businessProfileImage?: VerifiableAsset | null;
  refundPolicyDocument?: VerifiableAsset | null;
  termsDocument?: VerifiableAsset | null;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  verificationPayment: {
    status: "pending" | "paid" | "failed";
  };
  verificationChecklist: VerificationChecklist;
  minorityProofDocuments: Document[];
  taxDocuments: Document[];
  businessLicenseDocuments: Document[];
  acceptedTerms: boolean;
  declarationAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  badge?: string;
  primaryPhone?: string;
  businessEmail?: string;
};

// Base verification types that are always present
const baseVerificationTypes = [
  { 
    key: "website", 
    checklistKey: "website",
    label: "Website Verification", 
    icon: Globe,
    description: "Check if website is valid",
    points: 5,
    required: false,
    hasValue: (app: VendorApplication) => app.website && app.website.trim() !== ""
  },
  { 
    key: "facebook", 
    checklistKey: "facebook",
    label: "Facebook Page", 
    icon: Facebook,
    description: "Verify Facebook business page",
    points: 5,
    required: false,
    hasValue: (app: VendorApplication) => app.facebook && app.facebook.trim() !== ""
  },
  { 
    key: "instagram", 
    checklistKey: "instagram",
    label: "Instagram Account", 
    icon: Instagram,
    description: "Verify Instagram business account",
    points: 5,
    required: false,
    hasValue: (app: VendorApplication) => app.instagram && app.instagram.trim() !== ""
  },
  { 
    key: "linkedin", 
    checklistKey: "linkedin",
    label: "LinkedIn Profile", 
    icon: Linkedin,
    description: "Verify LinkedIn business profile",
    points: 5,
    required: false,
    hasValue: (app: VendorApplication) => app.linkedin && app.linkedin.trim() !== ""
  },
  { 
    key: "tiktok", 
    checklistKey: "tiktok",
    label: "TikTok Account", 
    icon: Music,
    description: "Verify TikTok business account",
    points: 5,
    required: false,
    hasValue: (app: VendorApplication) => app.tiktok && app.tiktok.trim() !== ""
  },
  {
    key: "business-profile-image",
    checklistKey: "businessProfileImage",
    label: "Business Profile Image",
    icon: Building,
    description: "Verify business profile image/logo",
    points: 5,
    required: false,
    hasValue: (app: VendorApplication) => app.businessProfileImage?.url && app.businessProfileImage.url.trim() !== ""
  },
  {
    key: "business-bio",
    checklistKey: "businessBio",
    label: "Business Bio",
    icon: FileText,
    description: "Verify business bio content",
    points: 5,
    required: false,
    hasValue: (app: VendorApplication) => app.businessBio && app.businessBio.trim() !== ""
  },
  {
    key: "refund-policy-document",
    checklistKey: "refundPolicyDocument",
    label: "Refund Policy Document",
    icon: FileCheck,
    description: "Verify refund policy document",
    points: 5,
    required: false,
    hasValue: (app: VendorApplication) => app.refundPolicyDocument?.url && app.refundPolicyDocument.url.trim() !== ""
  },
  {
    key: "terms-document",
    checklistKey: "termsDocument",
    label: "Terms Document",
    icon: FileCheck,
    description: "Verify terms and conditions document",
    points: 5,
    required: false,
    hasValue: (app: VendorApplication) => app.termsDocument?.url && app.termsDocument.url.trim() !== ""
  },
  {
    key: "google-review-link",
    checklistKey: "googleReviewLink",
    label: "Google Review Link",
    icon: ExternalLink,
    description: "Verify Google review link",
    points: 5,
    required: false,
    hasValue: (app: VendorApplication) => app.googleReviewLink && app.googleReviewLink.trim() !== ""
  },
  {
    key: "community-service-link",
    checklistKey: "communityServiceLink",
    label: "Community Service Link",
    icon: ExternalLink,
    description: "Verify community service link",
    points: 5,
    required: false,
    hasValue: (app: VendorApplication) => app.communityServiceLink && app.communityServiceLink.trim() !== ""
  },
];

export default function ApplicationDetailPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [application, setApplication] = useState<VendorApplication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [verifying, setVerifying] = useState<Record<string, boolean>>({});
  const [finalizing, setFinalizing] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    type: string;
    doc: Document;
    index: number;
  } | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

const normalizeUrl = (url?: string) => {
  if (!url) return undefined;
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/${applicationId}`,
        { 
          withCredentials: true
        }
      );
      
      if (res.data.success) {
        setApplication(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to load application");
        router.push("/admin/vendor-applications");
      }
    } catch (err: any) {
      console.error("Error fetching application:", err);
      toast.error(err.response?.data?.message || "Failed to fetch application details");
      router.push("/admin/vendor-applications");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCategory = async (verificationType: string, isVerified: boolean) => {
    if (!application) return;
    
    try {
      setVerifying(prev => ({ ...prev, [verificationType]: true }));
      
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/${applicationId}/verify`,
        {
          verificationType,
          isVerified
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (res.data.success) {
        toast.success(`${verificationType.replace('-', ' ')} ${isVerified ? 'verified' : 'rejected'}`);
        fetchApplicationDetails(); // Refresh data
      } else {
        toast.error(res.data.message || "Verification failed");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setVerifying(prev => ({ ...prev, [verificationType]: false }));
    }
  };

  const handleVerifyDocument = async (verificationType: string, documentIndex: number, isVerified: boolean) => {
    if (!application) return;
    
    try {
      const key = `${verificationType}_${documentIndex}`;
      setVerifying(prev => ({ ...prev, [key]: true }));
      
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/${applicationId}/verify`,
        {
          verificationType,
          documentIndex,
          isVerified
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (res.data.success) {
        toast.success(`Document ${isVerified ? 'verified' : 'rejected'}`);
        fetchApplicationDetails(); // Refresh data
      } else {
        toast.error(res.data.message || "Document verification failed");
      }
    } catch (err: any) {
      console.error("Document verification error:", err);
      toast.error(err.response?.data?.message || "Document verification failed");
    } finally {
      setVerifying(prev => ({ ...prev, [`${verificationType}_${documentIndex}`]: false }));
    }
  };

  const handleFinalizeApplication = async () => {
    if (!application) return;
    
    try {
      setFinalizing(true);
      
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/${applicationId}/finalize`,
        {},
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (res.data.success) {
        toast.success("Application finalized successfully");
        setShowFinalizeModal(false);
        router.push("/admin/vendor-applications");
      } else {
        toast.error(res.data.message || "Finalization failed");
      }
    } catch (err: any) {
      console.error("Finalization error:", err);
      toast.error(err.response?.data?.message || "Finalization failed");
    } finally {
      setFinalizing(false);
    }
  };

  const canFinalize = () => {
    return true;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "verified": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "submitted": return "bg-yellow-100 text-yellow-800";
      case "under_review": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getChecklistStatus = (checklistKey?: string) => {
    if (!application?.verificationChecklist || !checklistKey) return false;
    return Boolean(application.verificationChecklist[checklistKey]);
  };

  const getFieldVerificationStatus = (field: "businessBio" | "googleReviewLink" | "communityServiceLink") => {
    if (!application) return false;

    const maybeApp = application as VendorApplication & Record<string, unknown>;
    const directFlag = maybeApp[`${field}Verified`];
    if (typeof directFlag === "boolean") {
      return directFlag;
    }

    const checklistFlag = application.verificationChecklist?.[field];
    if (typeof checklistFlag === "boolean") {
      return checklistFlag;
    }

    return false;
  };

  const getVerificationStatus = (verificationType: string, checklistKey?: string) => {
    if (!application) return false;

    switch (verificationType) {
      case "business-profile-image":
        return Boolean(application.businessProfileImage?.verified) || getChecklistStatus(checklistKey);
      case "refund-policy-document":
        return Boolean(application.refundPolicyDocument?.verified) || getChecklistStatus(checklistKey);
      case "terms-document":
        return Boolean(application.termsDocument?.verified) || getChecklistStatus(checklistKey);
      case "business-bio":
        return getFieldVerificationStatus("businessBio");
      case "google-review-link":
        return getFieldVerificationStatus("googleReviewLink");
      case "community-service-link":
        return getFieldVerificationStatus("communityServiceLink");
      default:
        return getChecklistStatus(checklistKey);
    }
  };

  const openDocument = (type: string, doc: Document, index: number) => {
    setSelectedDocument({ type, doc, index });
    setShowDocumentModal(true);
  };

  const getVerificationTypeForDocument = (type: string) => {
    switch (type) {
      case 'minorityProofDocuments': return 'minority-proof';
      case 'taxDocuments': return 'tax-doc';
      case 'businessLicenseDocuments': return 'business-license';
      default: return type;
    }
  };

  const getDocumentCategoryVerified = (
    checklistKey: keyof VerificationChecklist,
    docs?: Document[] | null
  ) => {
    const checklistVerified = Boolean(application?.verificationChecklist?.[checklistKey]);
    const allDocsVerified = Boolean(docs?.length) && docs!.every((doc) => Boolean(doc.verified));
    return checklistVerified || allDocsVerified;
  };

  const getVerificationProgress = () => {
    if (!application) {
      return {
        required: 0,
        optional: 0,
        totalRequired: 0,
        totalOptional: 0
      };
    }

    const requiredDocumentCategories = [
      {
        key: "minorityDocs" as const,
        applicable: Boolean(application.isMinorityOwned),
        verified: getDocumentCategoryVerified("minorityDocs", application.minorityProofDocuments),
      },
      {
        key: "taxDocs" as const,
        applicable: true,
        verified: getDocumentCategoryVerified("taxDocs", application.taxDocuments),
      },
      {
        key: "businessLicense" as const,
        applicable: true,
        verified: getDocumentCategoryVerified("businessLicense", application.businessLicenseDocuments),
      },
    ].filter((item) => item.applicable);

    // Optional verification types are the non-document items that have values
    const optionalVerificationTypes = baseVerificationTypes.filter((type) =>
      type.hasValue(application)
    );

    const requiredVerified = requiredDocumentCategories.filter((item) => item.verified).length;
    const optionalVerified = optionalVerificationTypes.filter((item) =>
      getVerificationStatus(item.key, item.checklistKey)
    ).length;

    return {
      required: requiredVerified,
      optional: optionalVerified,
      totalRequired: requiredDocumentCategories.length,
      totalOptional: optionalVerificationTypes.length
    };
  };

  // Get only verification types that have values
  const getAvailableVerificationTypes = () => {
    if (!application) return [];
    return baseVerificationTypes.filter(type => type.hasValue(application));
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar setIsSidebarOpen={setSidebarOpen} />
          <main className="flex items-center justify-center flex-1">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading application details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const progress = getVerificationProgress();
  const availableVerificationTypes = getAvailableVerificationTypes();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar setIsSidebarOpen={setSidebarOpen} />

        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/admin/vendor-applications")}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <Building className="w-6 h-6 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    {application.businessName}
                  </h1>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    ID: {application.applicationId}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {application.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4" />
                    {application.totalVerificationPoints} points
                  </div>
                  {application.badge && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4 text-yellow-500" />
                      Badge: {application.badge}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchApplicationDetails}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              
              {canFinalize() && (
                <button
                  onClick={() => setShowFinalizeModal(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Finalize Application
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Business Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Business Information Card */}
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Business Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Business Type</p>
                      <p className="font-medium mt-1 capitalize">{application.businessType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Years in Business</p>
                      <p className="font-medium mt-1">{application.yearsInBusiness}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Number of Employees</p>
                      <p className="font-medium mt-1">{application.employeesCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ownership Type</p>
                      <p className="font-medium mt-1">{application.ownershipType}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Tax Identification</p>
                      <p className="font-medium mt-1">
                        {application.hasEIN ? `EIN: ${application.einNumber}` : application.ssnLast9 ? `SSN: ${application.ssnLast9}` : "Not provided"}
                      </p>
                    </div>
  <div>
  <p className="text-sm text-gray-500">Business License</p>
  <p className="font-medium mt-1">
    {application.licenseNumber ? application.licenseNumber : "Not provided"}
  </p>
</div>
                    <div>
                      <p className="text-sm text-gray-500">Physical Location</p>
                      <p className="font-medium mt-1">
                        {application.hasPhysicalLocation ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Uses Third Party Booking</p>
                      <p className="font-medium mt-1">
                        {application.usesThirdPartyBooking ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Minority Status */}
                {application.isMinorityOwned && application.minorityCategories && application.minorityCategories.length > 0 && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-2 text-purple-700 mb-2">
                      <Users className="w-5 h-5" />
                      <span className="font-semibold">Minority-Owned Business</span>
                    </div>
                    <p className="text-sm text-purple-600">
                      Categories: {application.minorityCategories.join(", ")}
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Information Card */}
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Primary Contact</p>
                      <p className="font-medium mt-1">{application.primaryContactName}</p>
                      {application.primaryContactDesignation && (
                        <p className="text-sm text-gray-600 mt-1">{application.primaryContactDesignation}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Primary Phone</p>
                      {application.primaryPhone && (
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <p className="font-medium">{application.primaryPhone}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">User Email</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="font-medium">{application.userId.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Business Email</p>
                      {application.businessEmail && (
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p className="font-medium">{application.businessEmail}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Secondary Business Email</p>
                      {application.secondaryBusinessEmail ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p className="font-medium">{application.secondaryBusinessEmail}</p>
                        </div>
                      ) : (
                        <p className="font-medium mt-1 text-gray-400">Not provided</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">User Name</p>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <p className="font-medium">{application.userId.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Business Address
                </h2>
                <div className="space-y-3">
                  <p className="font-medium text-lg">{application.address.street}</p>
                  <p className="text-gray-700">
                    {application.address.city}, {application.address.state} {application.address.zipCode}
                  </p>
                  <p className="text-gray-600">{application.address.country}</p>
                </div>
              </div>

              {/* Online Presence Card - Only show if any social media exists */}
{(application.website || application.facebook || application.instagram || 
  application.linkedin || application.tiktok) && (
  <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
    <h2 className="text-lg font-semibold mb-6 pb-3 border-b">Online Presence</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {application.website && (
        <a
          href={normalizeUrl(application.website)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Globe className="w-5 h-5 text-blue-500" />
          <div className="flex-1 min-w-0">
            <p className="font-medium">Website</p>
            <p className="text-xs text-gray-500 truncate">{application.website}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
        </a>
      )}

      {application.facebook && (
        <a
          href={normalizeUrl(application.facebook)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Facebook className="w-5 h-5 text-blue-700" />
          <div className="flex-1 min-w-0">
            <p className="font-medium">Facebook</p>
            <p className="text-xs text-gray-500 truncate">{application.facebook}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
        </a>
      )}

      {application.instagram && (
        <a
          href={normalizeUrl(application.instagram)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Instagram className="w-5 h-5 text-pink-600" />
          <div className="flex-1 min-w-0">
            <p className="font-medium">Instagram</p>
            <p className="text-xs text-gray-500 truncate">{application.instagram}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
        </a>
      )}

      {application.linkedin && (
        <a
          href={normalizeUrl(application.linkedin)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Linkedin className="w-5 h-5 text-blue-800" />
          <div className="flex-1 min-w-0">
            <p className="font-medium">LinkedIn</p>
            <p className="text-xs text-gray-500 truncate">{application.linkedin}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
        </a>
      )}

      {application.tiktok && (
        <a
          href={normalizeUrl(application.tiktok)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Music className="w-5 h-5 text-black" />
          <div className="flex-1 min-w-0">
            <p className="font-medium">TikTok</p>
            <p className="text-xs text-gray-500 truncate">{application.tiktok}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
        </a>
      )}

    </div>
  </div>
)}

              {/* Business Profile Details - Only show if any of these fields exist */}
              {(application.businessBio ||
                application.businessProfileImage?.url ||
                application.refundPolicyDocument?.url ||
                application.termsDocument?.url ||
                application.googleReviewLink ||
                application.communityServiceLink) && (
                <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
                  <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Business Profile Details
                  </h2>

                  <div className="space-y-6">
                    {application.businessBio && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Business Bio</p>
                        <p className="text-sm text-gray-800 leading-6 bg-gray-50 border rounded-lg p-4">
                          {application.businessBio}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {application.businessProfileImage?.url && (
                        <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Business Profile Image</p>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              application.businessProfileImage.verified
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {application.businessProfileImage.verified ? "Verified" : "Pending"}
                            </span>
                          </div>
                          <img
                            src={application.businessProfileImage.url}
                            alt="Business profile"
                            className="w-full h-32 object-contain bg-gray-50 border rounded-lg"
                          />
                          <a
                            href={application.businessProfileImage.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open image
                          </a>
                        </div>
                      )}

                      {application.refundPolicyDocument?.url && (
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="font-medium">Refund Policy Document</p>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              application.refundPolicyDocument.verified
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {application.refundPolicyDocument.verified ? "Verified" : "Pending"}
                            </span>
                          </div>
                          <a
                            href={application.refundPolicyDocument.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                          >
                            <FileText className="w-4 h-4" />
                            Open refund policy
                          </a>
                        </div>
                      )}

                      {application.termsDocument?.url && (
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="font-medium">Terms Document</p>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              application.termsDocument.verified
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {application.termsDocument.verified ? "Verified" : "Pending"}
                            </span>
                          </div>
                          <a
                            href={application.termsDocument.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                          >
                            <FileText className="w-4 h-4" />
                            Open terms document
                          </a>
                        </div>
                      )}
                    </div>

                    {(application.googleReviewLink || application.communityServiceLink) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {application.googleReviewLink && (
                          <a
                            href={application.googleReviewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-blue-600" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">Google Review Link</p>
                              <p className="text-xs text-gray-500 truncate">{application.googleReviewLink}</p>
                            </div>
                          </a>
                        )}
                        {application.communityServiceLink && (
                          <a
                            href={application.communityServiceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-blue-600" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">Community Service Link</p>
                              <p className="text-xs text-gray-500 truncate">{application.communityServiceLink}</p>
                            </div>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Verification & Actions */}
            <div className="space-y-6">
              {/* Verification Progress Card */}
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Verification Progress
                </h2>
                
                <div className="space-y-6">
                  {/* Progress Bars */}
                  {progress.totalRequired > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Required Verifications</span>
                        <span className="text-sm font-bold text-gray-900">
                          {progress.required}/{progress.totalRequired}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-300"
                          style={{ width: progress.totalRequired ? `${(progress.required / progress.totalRequired) * 100}%` : "0%" }}
                        />
                      </div>
                      {progress.required === progress.totalRequired ? (
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          All required verifications completed
                        </p>
                      ) : (
                        <p className="text-xs text-yellow-600 mt-2">
                          {progress.totalRequired - progress.required} required verifications pending
                        </p>
                      )}
                    </div>
                  )}
                  
                  {progress.totalOptional > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Optional Verifications</span>
                        <span className="text-sm font-bold text-gray-900">
                          {progress.optional}/{progress.totalOptional}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: progress.totalOptional ? `${(progress.optional / progress.totalOptional) * 100}%` : "0%" }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Points Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Total Points</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {application.totalVerificationPoints}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Points are awarded for each verified item
                    </p>
                  </div>
                  
                  {/* Finalize Button */}
                  {canFinalize() && (
                    <button
                      onClick={() => setShowFinalizeModal(true)}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <CheckCheck className="w-5 h-5" />
                      Finalize Application
                    </button>
                  )}
                </div>
              </div>

                            {/* Required Documents Verification Section */}
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Required Verifications
                </h2>
                
                <div className="space-y-6">
                  {/* Minority Documents */}
                  {application.isMinorityOwned && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Minority Proof Documents ({application.minorityProofDocuments?.length ?? 0})
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          getDocumentCategoryVerified("minorityDocs", application.minorityProofDocuments)
                            ? "bg-green-100 text-green-700" 
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {getDocumentCategoryVerified("minorityDocs", application.minorityProofDocuments) ? "Verified" : "Pending"}
                        </span>
                      </div>
                      {Boolean(application.minorityProofDocuments?.length) ? (
                        <div className="space-y-2">
                          {application.minorityProofDocuments.map((doc, index) => (
                            <div 
                              key={doc._id} 
                              className={`flex items-center justify-between p-3 rounded-lg border ${
                                doc.verified 
                                  ? "border-green-200 bg-green-50" 
                                  : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <FileText className={`w-4 h-4 ${doc.verified ? "text-green-500" : "text-gray-500"}`} />
                                <span className={`text-sm truncate ${doc.verified ? "text-green-800" : "text-gray-800"}`}>
                                  Minority Proof Document {index + 1}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openDocument('minorityProofDocuments', doc, index)}
                                  className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                  title="View Document"
                                >
                                  <Eye className="w-4 h-4 text-blue-600" />
                                </button>
                                <button
                                  onClick={() => handleVerifyDocument('minority-proof', index, true)}
                                  disabled={verifying[`minority-proof_${index}`] || doc.verified}
                                  className={`p-1.5 rounded transition-colors ${
                                    doc.verified 
                                      ? "bg-green-100 text-green-700" 
                                      : "bg-green-500 text-white hover:bg-green-600"
                                  } disabled:opacity-50`}
                                  title="Verify Document"
                                >
                                  {verifying[`minority-proof_${index}`] ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Check className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500 border rounded-lg bg-gray-50">
                          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No minority proof documents uploaded</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tax Documents */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Tax Documents ({application.taxDocuments?.length ?? 0})
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getDocumentCategoryVerified("taxDocs", application.taxDocuments) 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {getDocumentCategoryVerified("taxDocs", application.taxDocuments) ? "Verified" : "Pending"}
                      </span>
                    </div>

                    {Boolean(application.taxDocuments?.length) ? (
                      <div className="space-y-2">
                        {application.taxDocuments.map((doc, index) => (
                          <div 
                            key={doc._id} 
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              doc.verified 
                                ? "border-green-200 bg-green-50" 
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className={`w-4 h-4 ${doc.verified ? "text-green-500" : "text-gray-500"}`} />
                              <span className={`text-sm truncate ${doc.verified ? "text-green-800" : "text-gray-800"}`}>
                                Tax Document {index + 1}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openDocument('taxDocuments', doc, index)}
                                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                title="View Document"
                              >
                                <Eye className="w-4 h-4 text-blue-600" />
                              </button>
                              <button
                                onClick={() => handleVerifyDocument('tax-doc', index, true)}
                                disabled={verifying[`tax-doc_${index}`] || doc.verified}
                                className={`p-1.5 rounded transition-colors ${
                                  doc.verified 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-green-500 text-white hover:bg-green-600"
                                } disabled:opacity-50`}
                                title="Verify Document"
                              >
                                {verifying[`tax-doc_${index}`] ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 border rounded-lg bg-gray-50">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No tax documents uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Business License Documents */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Business License Documents ({application.businessLicenseDocuments?.length ?? 0})
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getDocumentCategoryVerified("businessLicense", application.businessLicenseDocuments) 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {getDocumentCategoryVerified("businessLicense", application.businessLicenseDocuments) ? "Verified" : "Pending"}
                      </span>
                    </div>

                    {Boolean(application.businessLicenseDocuments?.length) ? (
                      <div className="space-y-2">
                        {application.businessLicenseDocuments.map((doc, index) => (
                          <div 
                            key={doc._id} 
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              doc.verified 
                                ? "border-green-200 bg-green-50" 
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className={`w-4 h-4 ${doc.verified ? "text-green-500" : "text-gray-500"}`} />
                              <span className={`text-sm truncate ${doc.verified ? "text-green-800" : "text-gray-800"}`}>
                                Business License {index + 1}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openDocument('businessLicenseDocuments', doc, index)}
                                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                title="View Document"
                              >
                                <Eye className="w-4 h-4 text-blue-600" />
                              </button>
                              <button
                                onClick={() => handleVerifyDocument('business-license', index, true)}
                                disabled={verifying[`business-license_${index}`] || doc.verified}
                                className={`p-1.5 rounded transition-colors ${
                                  doc.verified 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-green-500 text-white hover:bg-green-600"
                                } disabled:opacity-50`}
                                title="Verify Document"
                              >
                                {verifying[`business-license_${index}`] ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 border rounded-lg bg-gray-50">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No business license documents uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional Verifications Card */}
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Optional Verifications
                </h2>
                
                <div className="space-y-4">
                  {availableVerificationTypes.map(({ key, checklistKey, label, icon: Icon, description, points, required }) => {
                    const isVerified = getVerificationStatus(key, checklistKey);
                    const isLoading = verifying[key];
                    
                    return (
                      <div 
                        key={key} 
                        className={`p-4 rounded-lg border transition-all duration-200 ${
                          isVerified 
                            ? "border-green-200 bg-green-50" 
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              isVerified ? "bg-green-100" : "bg-gray-100"
                            }`}>
                              <Icon className={`w-5 h-5 ${isVerified ? "text-green-600" : "text-gray-600"}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`font-medium ${isVerified ? "text-green-800" : "text-gray-800"}`}>
                                  {label}
                                </span>
                                {required && (
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
                                )}
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">+{points} pts</span>
                              </div>
                              <p className="text-xs text-gray-500">{description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              isVerified 
                                ? "bg-green-100 text-green-700 border border-green-200" 
                                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            }`}>
                              {isVerified ? "Verified" : "Pending"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVerifyCategory(key, true)}
                            disabled={isLoading || isVerified}
                            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                              isVerified 
                                ? "bg-green-100 text-green-700 cursor-default" 
                                : "bg-green-500 text-white hover:bg-green-600"
                            } disabled:opacity-50`}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            {isVerified ? "Verified" : "Verify"}
                          </button>
                          <button
                            onClick={() => handleVerifyCategory(key, false)}
                            disabled={isLoading || !isVerified}
                            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                              !isVerified 
                                ? "bg-gray-100 text-gray-400 cursor-default" 
                                : "bg-red-500 text-white hover:bg-red-600"
                            } disabled:opacity-50`}
                          >
                            <X className="w-4 h-4" />
                            Unverify
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {availableVerificationTypes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No verification items available</p>
                      <p className="text-xs mt-1">The vendor hasn't provided any data to verify yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline Card */}
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timeline
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium text-sm">
                      {new Date(application.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium text-sm">
                      {new Date(application.updatedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 text-gray-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Status: {application.status.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Document Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Document Preview</h3>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <iframe
                src={selectedDocument.doc.url}
                className="w-full h-full"
                title="Document Preview"
              />
            </div>
            
            <div className="flex items-center justify-between p-6 border-t">
              <a
                href={selectedDocument.doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open in new tab
              </a>
              
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedDocument.doc.verified 
                    ? "bg-green-100 text-green-700" 
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {selectedDocument.doc.verified ? "Verified" : "Pending"}
                </span>
                
                {!selectedDocument.doc.verified && (
                  <button
                    onClick={() => {
                      const verificationType = getVerificationTypeForDocument(selectedDocument.type);
                      handleVerifyDocument(verificationType, selectedDocument.index, true);
                      setShowDocumentModal(false);
                    }}
                    disabled={verifying[`${getVerificationTypeForDocument(selectedDocument.type)}_${selectedDocument.index}`]}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {verifying[`${getVerificationTypeForDocument(selectedDocument.type)}_${selectedDocument.index}`] ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Verify Document
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Finalize Application Modal */}
      {showFinalizeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckCheck className="w-5 h-5 text-green-600" />
                Finalize Application
              </h3>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                  <CheckCheck className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-center mb-2">
                  Ready to Finalize
                </h4>
                <p className="text-gray-600 text-center text-sm mb-6">
                  All required verifications are completed. This action will mark the application as approved and notify the vendor.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h5 className="font-medium text-gray-700 mb-2">Verification Summary</h5>
                  <div className="space-y-2">
                    {progress.totalRequired > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Required Verifications:</span>
                        <span className="font-medium text-green-600">
                          {progress.required}/{progress.totalRequired} completed
                        </span>
                      </div>
                    )}
                    {progress.totalOptional > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Optional Verifications:</span>
                        <span className="font-medium text-gray-700">
                          {progress.optional}/{progress.totalOptional} completed
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Points Awarded:</span>
                      <span className="font-bold text-gray-900">
                        {application.totalVerificationPoints} pts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFinalizeModal(false)}
                  disabled={finalizing}
                  className="flex-1 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalizeApplication}
                  disabled={finalizing}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {finalizing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCheck className="w-4 h-4" />
                      Finalize Application
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-700">
                    This action cannot be undone. The vendor will be notified and the application status will be updated to "approved".
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { toast } from "react-toastify";
// import axios from "axios";
// import Sidebar from "../../components/Sidebar";
// import Topbar from "../../components/Topbar";
// import { 
//   ArrowLeft,
//   CheckCircle,
//   XCircle,
//   FileText,
//   Building,
//   MapPin,
//   Phone,
//   Mail,
//   Globe,
//   Facebook,
//   Instagram,
//   Linkedin,
//   Music,
//   DollarSign,
//   Calendar,
//   CheckSquare,
//   XSquare,
//   Shield,
//   Users,
//   Award,
//   Clock,
//   ExternalLink,
//   Download,
//   AlertCircle,
//   User,
//   Briefcase,
//   Home,
//   CreditCard,
//   FileCheck,
//   RefreshCw,
//   Loader2,
//   Eye,
//   Check,
//   X,
//   CheckCheck,
//   AlertTriangle
// } from "lucide-react";

// type Document = {
//   url: string;
//   verified: boolean;
//   _id: string;
// };

// type VerifiableAsset = {
//   url: string;
//   verified: boolean;
// };

// type VerificationChecklist = {
//   minorityDocs: boolean;
//   taxDocs: boolean;
//   businessLicense: boolean;
//   website: boolean;
//   facebook: boolean;
//   instagram: boolean;
//   linkedin: boolean;
//   tiktok: boolean;
//   businessProfileImage?: boolean;
//   businessBio?: boolean;
//   refundPolicyDocument?: boolean;
//   termsDocument?: boolean;
//   googleReviewLink?: boolean;
//   communityServiceLink?: boolean;
//   [key: string]: boolean | undefined;
// };

// type VendorApplication = {
//   _id: string;
//   applicationId: string;
//   businessName: string;
//   status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "verified";
//   totalVerificationPoints: number;
//   isMinorityOwned: boolean;
//   minorityCategories: string[];
//   hasEIN: boolean;
//   einNumber: string;
//   ssnLast9: string;
//   hasBusinessLicense: boolean;
//   yearsInBusiness: string;
//   isFranchise: boolean;
//   franchiseName: string | null;
//   businessType: string;
//   hasPhysicalLocation: boolean;
//   primaryContactName: string;
//   primaryContactDesignation: string;
//   secondaryBusinessEmail: string;
//   usesThirdPartyBooking: boolean;
//   ownershipType: string;
//   employeesCount: string;
//   website: string;
//   facebook: string;
//   instagram: string;
//   linkedin: string | null;
//   tiktok: string | null;
//   businessBio?: string;
//   googleReviewLink?: string;
//   communityServiceLink?: string;
//   businessProfileImage?: VerifiableAsset | null;
//   refundPolicyDocument?: VerifiableAsset | null;
//   termsDocument?: VerifiableAsset | null;
//   userId: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     country: string;
//     zipCode: string;
//   };
//   verificationPayment: {
//     status: "pending" | "paid" | "failed";
//   };
//   verificationChecklist: VerificationChecklist;
//   minorityProofDocuments: Document[];
//   taxDocuments: Document[];
//   businessLicenseDocuments: Document[];
//   acceptedTerms: boolean;
//   declarationAccepted: boolean;
//   createdAt: string;
//   updatedAt: string;
// };

// const verificationTypes = [
//   // { 
//   //   key: "minority-proof", 
//   //   checklistKey: "minorityDocs",
//   //   label: "Minority Proof Documents", 
//   //   icon: Users,
//   //   description: "Verify minority ownership documents",
//   //   points: 10,
//   //   required: true
//   // },
//   // { 
//   //   key: "tax-doc", 
//   //   checklistKey: "taxDocs",
//   //   label: "Tax Documents", 
//   //   icon: FileText,
//   //   description: "Verify EIN/SSN documents",
//   //   points: 10,
//   //   required: true
//   // },
//   // { 
//   //   key: "business-license", 
//   //   checklistKey: "businessLicense",
//   //   label: "Business License", 
//   //   icon: Shield,
//   //   description: "Verify business license documents",
//   //   points: 10,
//   //   required: true
//   // },
//   { 
//     key: "website", 
//     checklistKey: "website",
//     label: "Website Verification", 
//     icon: Globe,
//     description: "Check if website is valid",
//     points: 5,
//     required: false
//   },
//   { 
//     key: "facebook", 
//     checklistKey: "facebook",
//     label: "Facebook Page", 
//     icon: Facebook,
//     description: "Verify Facebook business page",
//     points: 5,
//     required: false
//   },
//   { 
//     key: "instagram", 
//     checklistKey: "instagram",
//     label: "Instagram Account", 
//     icon: Instagram,
//     description: "Verify Instagram business account",
//     points: 5,
//     required: false
//   },
//   { 
//     key: "linkedin", 
//     checklistKey: "linkedin",
//     label: "LinkedIn Profile", 
//     icon: Linkedin,
//     description: "Verify LinkedIn business profile",
//     points: 5,
//     required: false
//   },
//   { 
//     key: "tiktok", 
//     checklistKey: "tiktok",
//     label: "TikTok Account", 
//     icon: Music,
//     description: "Verify TikTok business account",
//     points: 5,
//     required: false
//   },
//   {
//     key: "business-profile-image",
//     checklistKey: "businessProfileImage",
//     label: "Business Profile Image",
//     icon: Building,
//     description: "Verify business profile image/logo",
//     points: 5,
//     required: false
//   },
//   {
//     key: "business-bio",
//     checklistKey: "businessBio",
//     label: "Business Bio",
//     icon: FileText,
//     description: "Verify business bio content",
//     points: 5,
//     required: false
//   },
//   {
//     key: "refund-policy-document",
//     checklistKey: "refundPolicyDocument",
//     label: "Refund Policy Document",
//     icon: FileCheck,
//     description: "Verify refund policy document",
//     points: 5,
//     required: false
//   },
//   {
//     key: "terms-document",
//     checklistKey: "termsDocument",
//     label: "Terms Document",
//     icon: FileCheck,
//     description: "Verify terms and conditions document",
//     points: 5,
//     required: false
//   },
//   {
//     key: "google-review-link",
//     checklistKey: "googleReviewLink",
//     label: "Google Review Link",
//     icon: ExternalLink,
//     description: "Verify Google review link",
//     points: 5,
//     required: false
//   },
//   {
//     key: "community-service-link",
//     checklistKey: "communityServiceLink",
//     label: "Community Service Link",
//     icon: ExternalLink,
//     description: "Verify community service link",
//     points: 5,
//     required: false
//   },
// ];

// export default function ApplicationDetailPage() {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [application, setApplication] = useState<VendorApplication | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [verifying, setVerifying] = useState<Record<string, boolean>>({});
//   const [finalizing, setFinalizing] = useState<boolean>(false);
//   const [selectedDocument, setSelectedDocument] = useState<{
//     type: string;
//     doc: Document;
//     index: number;
//   } | null>(null);
//   const [showDocumentModal, setShowDocumentModal] = useState(false);
//   const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  
//   const router = useRouter();
//   const params = useParams();
//   const applicationId = params.id as string;

//   useEffect(() => {
//     if (applicationId) {
//       fetchApplicationDetails();
//     }
//   }, [applicationId]);

//   const fetchApplicationDetails = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/${applicationId}`,
//         { 
//           withCredentials: true
//         }
//       );
      
//       if (res.data.success) {
//         setApplication(res.data.data);
//       } else {
//         toast.error(res.data.message || "Failed to load application");
//         router.push("/admin/vendor-applications");
//       }
//     } catch (err: any) {
//       console.error("Error fetching application:", err);
//       toast.error(err.response?.data?.message || "Failed to fetch application details");
//       router.push("/admin/vendor-applications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyCategory = async (verificationType: string, isVerified: boolean) => {
//     if (!application) return;
    
//     try {
//       setVerifying(prev => ({ ...prev, [verificationType]: true }));
      
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/${applicationId}/verify`,
//         {
//           verificationType,
//           isVerified
//         },
//         { 
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         }
//       );

//       if (res.data.success) {
//         toast.success(`${verificationType.replace('-', ' ')} ${isVerified ? 'verified' : 'rejected'}`);
//         fetchApplicationDetails(); // Refresh data
//       } else {
//         toast.error(res.data.message || "Verification failed");
//       }
//     } catch (err: any) {
//       console.error("Verification error:", err);
//       toast.error(err.response?.data?.message || "Verification failed");
//     } finally {
//       setVerifying(prev => ({ ...prev, [verificationType]: false }));
//     }
//   };

//   const handleVerifyDocument = async (verificationType: string, documentIndex: number, isVerified: boolean) => {
//     if (!application) return;
    
//     try {
//       const key = `${verificationType}_${documentIndex}`;
//       setVerifying(prev => ({ ...prev, [key]: true }));
      
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/${applicationId}/verify`,
//         {
//           verificationType,
//           documentIndex,
//           isVerified
//         },
//         { 
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         }
//       );

//       if (res.data.success) {
//         toast.success(`Document ${isVerified ? 'verified' : 'rejected'}`);
//         fetchApplicationDetails(); // Refresh data
//       } else {
//         toast.error(res.data.message || "Document verification failed");
//       }
//     } catch (err: any) {
//       console.error("Document verification error:", err);
//       toast.error(err.response?.data?.message || "Document verification failed");
//     } finally {
//       setVerifying(prev => ({ ...prev, [`${verificationType}_${documentIndex}`]: false }));
//     }
//   };

//   const handleFinalizeApplication = async () => {
//     if (!application) return;
    
//     try {
//       setFinalizing(true);
      
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/${applicationId}/finalize`,
//         {},
//         { 
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         }
//       );

//       if (res.data.success) {
//         toast.success("Application finalized successfully");
//         setShowFinalizeModal(false);
//         router.push("/admin/vendor-applications");
//       } else {
//         toast.error(res.data.message || "Finalization failed");
//       }
//     } catch (err: any) {
//       console.error("Finalization error:", err);
//       toast.error(err.response?.data?.message || "Finalization failed");
//     } finally {
//       setFinalizing(false);
//     }
//   };

//   const canFinalize = () => {
//     return true;
//   };


//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "approved": return "bg-green-100 text-green-800";
//       case "verified": return "bg-green-100 text-green-800";
//       case "rejected": return "bg-red-100 text-red-800";
//       case "submitted": return "bg-yellow-100 text-yellow-800";
//       case "under_review": return "bg-blue-100 text-blue-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getChecklistStatus = (checklistKey?: string) => {
//     if (!application?.verificationChecklist || !checklistKey) return false;
//     return Boolean(application.verificationChecklist[checklistKey]);
//   };

//   const getFieldVerificationStatus = (field: "businessBio" | "googleReviewLink" | "communityServiceLink") => {
//     if (!application) return false;

//     const maybeApp = application as VendorApplication & Record<string, unknown>;
//     const directFlag = maybeApp[`${field}Verified`];
//     if (typeof directFlag === "boolean") {
//       return directFlag;
//     }

//     const checklistFlag = application.verificationChecklist?.[field];
//     if (typeof checklistFlag === "boolean") {
//       return checklistFlag;
//     }

//     return false;
//   };

//   const getVerificationStatus = (verificationType: string, checklistKey?: string) => {
//     if (!application) return false;

//     switch (verificationType) {
//       case "business-profile-image":
//         return Boolean(application.businessProfileImage?.verified) || getChecklistStatus(checklistKey);
//       case "refund-policy-document":
//         return Boolean(application.refundPolicyDocument?.verified) || getChecklistStatus(checklistKey);
//       case "terms-document":
//         return Boolean(application.termsDocument?.verified) || getChecklistStatus(checklistKey);
//       case "business-bio":
//         return getFieldVerificationStatus("businessBio");
//       case "google-review-link":
//         return getFieldVerificationStatus("googleReviewLink");
//       case "community-service-link":
//         return getFieldVerificationStatus("communityServiceLink");
//       default:
//         return getChecklistStatus(checklistKey);
//     }
//   };

//   const hasVerificationSource = (verificationType: string) => {
//     if (!application) return false;

//     switch (verificationType) {
//       case "business-profile-image":
//         return Boolean(application.businessProfileImage?.url);
//       case "business-bio":
//         return Boolean(application.businessBio?.trim());
//       case "refund-policy-document":
//         return Boolean(application.refundPolicyDocument?.url);
//       case "terms-document":
//         return Boolean(application.termsDocument?.url);
//       case "google-review-link":
//         return Boolean(application.googleReviewLink?.trim());
//       case "community-service-link":
//         return Boolean(application.communityServiceLink?.trim());
//       default:
//         return true;
//     }
//   };

//   const openDocument = (type: string, doc: Document, index: number) => {
//     setSelectedDocument({ type, doc, index });
//     setShowDocumentModal(true);
//   };

//   const getVerificationTypeForDocument = (type: string) => {
//     switch (type) {
//       case 'minorityProofDocuments': return 'minority-proof';
//       case 'taxDocuments': return 'tax-doc';
//       case 'businessLicenseDocuments': return 'business-license';
//       default: return type;
//     }
//   };

//   const getVerificationProgress = () => {
//     const requiredTypes = verificationTypes.filter((item) => item.required);
//     const optionalTypes = verificationTypes.filter((item) => !item.required);

//     if (!application) {
//       return {
//         required: 0,
//         optional: 0,
//         totalRequired: requiredTypes.length,
//         totalOptional: optionalTypes.length
//       };
//     }

//     const requiredVerified = requiredTypes.filter((item) =>
//       getVerificationStatus(item.key, item.checklistKey)
//     ).length;
//     const optionalVerified = optionalTypes.filter((item) =>
//       getVerificationStatus(item.key, item.checklistKey)
//     ).length;

//     return {
//       required: requiredVerified,
//       optional: optionalVerified,
//       totalRequired: requiredTypes.length,
//       totalOptional: optionalTypes.length
//     };
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen bg-gray-50">
//         <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
//         <div className="flex flex-col flex-1 overflow-hidden">
//           <Topbar setIsSidebarOpen={setSidebarOpen} />
//           <main className="flex items-center justify-center flex-1">
//             <div className="text-center">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//               <p className="mt-4 text-gray-600">Loading application details...</p>
//             </div>
//           </main>
//         </div>
//       </div>
//     );
//   }

//   if (!application) {
//     return null;
//   }

//   const progress = getVerificationProgress();

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

//       <div className="flex flex-col flex-1 overflow-hidden">
//         <Topbar setIsSidebarOpen={setSidebarOpen} />

//         <main className="flex-1 px-6 py-6 overflow-y-auto">
//           {/* Header */}
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => router.push("/admin/vendor-applications")}
//                 className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//               </button>
//               <div>
//                 <div className="flex items-center gap-3">
//                   <Building className="w-6 h-6 text-blue-600" />
//                   <h1 className="text-2xl font-bold text-gray-900">
//                     {application.businessName}
//                   </h1>
//                 </div>
//                 <div className="flex items-center gap-4 mt-2">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <FileText className="w-4 h-4" />
//                     ID: {application.applicationId}
//                   </div>
//                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
//                     {application.status.replace('_', ' ').toUpperCase()}
//                   </span>
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Award className="w-4 h-4" />
//                     {application.totalVerificationPoints} points
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex flex-col sm:flex-row gap-3">
//               <button
//                 onClick={fetchApplicationDetails}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 Refresh
//               </button>
              
//               {canFinalize() && (
//                 <button
//                   onClick={() => setShowFinalizeModal(true)}
//                   className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
//                 >
//                   <CheckCheck className="w-4 h-4" />
//                   Finalize Application
//                 </button>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left Column - Business Details */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Business Information Card */}
//               <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
//                 <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
//                   <Building className="w-5 h-5" />
//                   Business Information
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-sm text-gray-500">Business Type</p>
//                       <p className="font-medium mt-1 capitalize">{application.businessType}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Years in Business</p>
//                       <p className="font-medium mt-1">{application.yearsInBusiness}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Number of Employees</p>
//                       <p className="font-medium mt-1">{application.employeesCount}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Ownership Type</p>
//                       <p className="font-medium mt-1">{application.ownershipType}</p>
//                     </div>
//                   </div>
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-sm text-gray-500">Tax Identification</p>
//                       <p className="font-medium mt-1">
//                         {application.hasEIN ? `EIN: ${application.einNumber}` : `SSN: ${application.ssnLast9}`}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Business License</p>
//                       <p className="font-medium mt-1">
//                         {application.hasBusinessLicense ? "Yes" : "No"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Physical Location</p>
//                       <p className="font-medium mt-1">
//                         {application.hasPhysicalLocation ? "Yes" : "No"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Uses Third Party Booking</p>
//                       <p className="font-medium mt-1">
//                         {application.usesThirdPartyBooking ? "Yes" : "No"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Minority Status */}
//                 {application.isMinorityOwned && (
//                   <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
//                     <div className="flex items-center gap-2 text-purple-700 mb-2">
//                       <Users className="w-5 h-5" />
//                       <span className="font-semibold">Minority-Owned Business</span>
//                     </div>
//                     <p className="text-sm text-purple-600">
//                       Categories: {application.minorityCategories.join(", ")}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Contact Information Card */}
//               <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
//                 <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
//                   <User className="w-5 h-5" />
//                   Contact Information
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-sm text-gray-500">Primary Contact</p>
//                       <p className="font-medium mt-1">{application.primaryContactName}</p>
//                       {application.primaryContactDesignation && (
//                         <p className="text-sm text-gray-600 mt-1">{application.primaryContactDesignation}</p>
//                       )}
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">User Email</p>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Mail className="w-4 h-4 text-gray-400" />
//                         <p className="font-medium">{application.userId.email}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-sm text-gray-500">Secondary Business Email</p>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Mail className="w-4 h-4 text-gray-400" />
//                         <p className="font-medium">{application.secondaryBusinessEmail || "Not provided"}</p>
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">User Name</p>
//                       <div className="flex items-center gap-2 mt-1">
//                         <User className="w-4 h-4 text-gray-400" />
//                         <p className="font-medium">{application.userId.name}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Address Card */}
//               <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
//                 <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
//                   <MapPin className="w-5 h-5" />
//                   Business Address
//                 </h2>
//                 <div className="space-y-3">
//                   <p className="font-medium text-lg">{application.address.street}</p>
//                   <p className="text-gray-700">
//                     {application.address.city}, {application.address.state} {application.address.zipCode}
//                   </p>
//                   <p className="text-gray-600">{application.address.country}</p>
//                 </div>
//               </div>

//               {/* Online Presence Card */}
//               {(application.website || application.facebook || application.instagram || 
//                 application.linkedin || application.tiktok) && (
//                 <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
//                   <h2 className="text-lg font-semibold mb-6 pb-3 border-b">Online Presence</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {application.website && (
//                       <a href={application.website} target="_blank" rel="noopener noreferrer"
//                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
//                         <Globe className="w-5 h-5 text-blue-500" />
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium">Website</p>
//                           <p className="text-xs text-gray-500 truncate">{application.website}</p>
//                         </div>
//                         <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
//                       </a>
//                     )}
                    
//                     {application.facebook && (
//                       <a href={application.facebook} target="_blank" rel="noopener noreferrer"
//                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
//                         <Facebook className="w-5 h-5 text-blue-700" />
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium">Facebook</p>
//                           <p className="text-xs text-gray-500 truncate">{application.facebook}</p>
//                         </div>
//                         <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
//                       </a>
//                     )}
                    
//                     {application.instagram && (
//                       <a href={application.instagram} target="_blank" rel="noopener noreferrer"
//                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
//                         <Instagram className="w-5 h-5 text-pink-600" />
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium">Instagram</p>
//                           <p className="text-xs text-gray-500 truncate">{application.instagram}</p>
//                         </div>
//                         <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
//                       </a>
//                     )}
                    
//                     {application.linkedin && (
//                       <a href={application.linkedin} target="_blank" rel="noopener noreferrer"
//                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
//                         <Linkedin className="w-5 h-5 text-blue-800" />
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium">LinkedIn</p>
//                           <p className="text-xs text-gray-500 truncate">{application.linkedin}</p>
//                         </div>
//                         <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
//                       </a>
//                     )}
                    
//                     {application.tiktok && (
//                       <a href={application.tiktok} target="_blank" rel="noopener noreferrer"
//                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
//                         <Music className="w-5 h-5 text-black" />
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium">TikTok</p>
//                           <p className="text-xs text-gray-500 truncate">{application.tiktok}</p>
//                         </div>
//                         <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {(application.businessBio ||
//                 application.businessProfileImage?.url ||
//                 application.refundPolicyDocument?.url ||
//                 application.termsDocument?.url ||
//                 application.googleReviewLink ||
//                 application.communityServiceLink) && (
//                 <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
//                   <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
//                     <Briefcase className="w-5 h-5" />
//                     Business Profile Details
//                   </h2>

//                   <div className="space-y-6">
//                     {application.businessBio && (
//                       <div>
//                         <p className="text-sm text-gray-500 mb-2">Business Bio</p>
//                         <p className="text-sm text-gray-800 leading-6 bg-gray-50 border rounded-lg p-4">
//                           {application.businessBio}
//                         </p>
//                       </div>
//                     )}

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {application.businessProfileImage?.url && (
//                         <div className="border rounded-lg p-4 space-y-3">
//                           <div className="flex items-center justify-between">
//                             <p className="font-medium">Business Profile Image</p>
//                             <span className={`px-2 py-1 rounded text-xs font-medium ${
//                               application.businessProfileImage.verified
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-yellow-100 text-yellow-700"
//                             }`}>
//                               {application.businessProfileImage.verified ? "Verified" : "Pending"}
//                             </span>
//                           </div>
//                           <img
//                             src={application.businessProfileImage.url}
//                             alt="Business profile"
//                             className="w-full h-32 object-contain bg-gray-50 border rounded-lg"
//                           />
//                           <a
//                             href={application.businessProfileImage.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
//                           >
//                             <ExternalLink className="w-4 h-4" />
//                             Open image
//                           </a>
//                         </div>
//                       )}

//                       {application.refundPolicyDocument?.url && (
//                         <div className="border rounded-lg p-4">
//                           <div className="flex items-center justify-between mb-3">
//                             <p className="font-medium">Refund Policy Document</p>
//                             <span className={`px-2 py-1 rounded text-xs font-medium ${
//                               application.refundPolicyDocument.verified
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-yellow-100 text-yellow-700"
//                             }`}>
//                               {application.refundPolicyDocument.verified ? "Verified" : "Pending"}
//                             </span>
//                           </div>
//                           <a
//                             href={application.refundPolicyDocument.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
//                           >
//                             <FileText className="w-4 h-4" />
//                             Open refund policy
//                           </a>
//                         </div>
//                       )}

//                       {application.termsDocument?.url && (
//                         <div className="border rounded-lg p-4">
//                           <div className="flex items-center justify-between mb-3">
//                             <p className="font-medium">Terms Document</p>
//                             <span className={`px-2 py-1 rounded text-xs font-medium ${
//                               application.termsDocument.verified
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-yellow-100 text-yellow-700"
//                             }`}>
//                               {application.termsDocument.verified ? "Verified" : "Pending"}
//                             </span>
//                           </div>
//                           <a
//                             href={application.termsDocument.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
//                           >
//                             <FileText className="w-4 h-4" />
//                             Open terms document
//                           </a>
//                         </div>
//                       )}
//                     </div>

//                     {(application.googleReviewLink || application.communityServiceLink) && (
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {application.googleReviewLink && (
//                           <a
//                             href={application.googleReviewLink}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
//                           >
//                             <ExternalLink className="w-4 h-4 text-blue-600" />
//                             <div className="flex-1 min-w-0">
//                               <p className="font-medium">Google Review Link</p>
//                               <p className="text-xs text-gray-500 truncate">{application.googleReviewLink}</p>
//                             </div>
//                           </a>
//                         )}
//                         {application.communityServiceLink && (
//                           <a
//                             href={application.communityServiceLink}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
//                           >
//                             <ExternalLink className="w-4 h-4 text-blue-600" />
//                             <div className="flex-1 min-w-0">
//                               <p className="font-medium">Community Service Link</p>
//                               <p className="text-xs text-gray-500 truncate">{application.communityServiceLink}</p>
//                             </div>
//                           </a>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Right Column - Verification & Actions */}
//             <div className="space-y-6">
//               {/* Verification Progress Card */}
//               <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
//                 <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
//                   <CheckSquare className="w-5 h-5" />
//                   Verification Progress
//                 </h2>
                
//                 <div className="space-y-6">
//                   {/* Progress Bars */}
//                   <div className="space-y-4">
//                     <div>
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="text-sm font-medium text-gray-700">Required Verifications</span>
//                         <span className="text-sm font-bold text-gray-900">
//                           {progress.required}/{progress.totalRequired}
//                         </span>
//                       </div>
//                       <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                         <div 
//                           className="h-full bg-green-500 transition-all duration-300"
//                           style={{ width: progress.totalRequired ? `${(progress.required / progress.totalRequired) * 100}%` : "0%" }}
//                         />
//                       </div>
//                       {progress.required === progress.totalRequired ? (
//                         <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
//                           <Check className="w-3 h-3" />
//                           All required verifications completed
//                         </p>
//                       ) : (
//                         <p className="text-xs text-yellow-600 mt-2">
//                           {progress.totalRequired - progress.required} required verifications pending
//                         </p>
//                       )}
//                     </div>
                    
//                     <div>
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="text-sm font-medium text-gray-700">Optional Verifications</span>
//                         <span className="text-sm font-bold text-gray-900">
//                           {progress.optional}/{progress.totalOptional}
//                         </span>
//                       </div>
//                       <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                         <div 
//                           className="h-full bg-blue-500 transition-all duration-300"
//                           style={{ width: progress.totalOptional ? `${(progress.optional / progress.totalOptional) * 100}%` : "0%" }}
//                         />
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Points Summary */}
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Award className="w-5 h-5 text-blue-600" />
//                         <span className="font-medium">Total Points</span>
//                       </div>
//                       <span className="text-2xl font-bold text-gray-900">
//                         {application.totalVerificationPoints}
//                       </span>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-2">
//                       Points are awarded for each verified item
//                     </p>
//                   </div>
                  
//                   {/* Finalize Button */}
//                   {canFinalize() && (
//                     <button
//                       onClick={() => setShowFinalizeModal(true)}
//                       className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
//                     >
//                       <CheckCheck className="w-5 h-5" />
//                       Finalize Application
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Verification Checklist Card */}
//               <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
//                 <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
//                   <CheckSquare className="w-5 h-5" />
//                   Verification Checklist
//                 </h2>

//                               <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
//                 <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
//                   <FileCheck className="w-5 h-5" />
//                   Document Verification
//                 </h2>
                
//                 <div className="space-y-6">
//                   {/* Minority Documents */}
//                   {application.minorityProofDocuments.length > 0 && (
//                     <div>
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="font-semibold text-gray-700 flex items-center gap-2">
//                           <Shield className="w-4 h-4" />
//                           Minority Proof Documents ({application.minorityProofDocuments.length})
//                         </h3>
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${
//                           application.verificationChecklist.minorityDocs 
//                             ? "bg-green-100 text-green-700" 
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}>
//                           {application.verificationChecklist.minorityDocs ? "Verified" : "Pending"}
//                         </span>
//                       </div>
//                       <div className="space-y-2">
//                         {application.minorityProofDocuments.map((doc, index) => (
//                           <div 
//                             key={doc._id} 
//                             className={`flex items-center justify-between p-3 rounded-lg border ${
//                               doc.verified 
//                                 ? "border-green-200 bg-green-50" 
//                                 : "border-gray-200 bg-gray-50"
//                             }`}
//                           >
//                             <div className="flex items-center gap-3 flex-1 min-w-0">
//                               <FileText className={`w-4 h-4 ${doc.verified ? "text-green-500" : "text-gray-500"}`} />
//                               <span className={`text-sm truncate ${doc.verified ? "text-green-800" : "text-gray-800"}`}>
//                                 Minority Proof Document {index + 1}
//                               </span>
//                               <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
//                                 doc.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
//                               }`}>
//                                 {doc.verified ? "Verified" : "Pending"}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() => openDocument('minorityProofDocuments', doc, index)}
//                                 className="p-1.5 hover:bg-gray-200 rounded transition-colors"
//                                 title="View Document"
//                               >
//                                 <Eye className="w-4 h-4 text-blue-600" />
//                               </button>
//                               <button
//                                 onClick={() => handleVerifyDocument('minority-proof', index, true)}
//                                 disabled={verifying[`minority-proof_${index}`] || doc.verified}
//                                 className={`p-1.5 rounded transition-colors ${
//                                   doc.verified 
//                                     ? "bg-green-100 text-green-700" 
//                                     : "bg-green-500 text-white hover:bg-green-600"
//                                 } disabled:opacity-50`}
//                                 title="Verify Document"
//                               >
//                                 {verifying[`minority-proof_${index}`] ? (
//                                   <Loader2 className="w-4 h-4 animate-spin" />
//                                 ) : (
//                                   <Check className="w-4 h-4" />
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Tax Documents */}
//                   {application.taxDocuments.length > 0 && (
//                     <div>
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="font-semibold text-gray-700 flex items-center gap-2">
//                           <FileText className="w-4 h-4" />
//                           Tax Documents ({application.taxDocuments.length})
//                         </h3>
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${
//                           application.verificationChecklist.taxDocs 
//                             ? "bg-green-100 text-green-700" 
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}>
//                           {application.verificationChecklist.taxDocs ? "Verified" : "Pending"}
//                         </span>
//                       </div>
//                       <div className="space-y-2">
//                         {application.taxDocuments.map((doc, index) => (
//                           <div 
//                             key={doc._id} 
//                             className={`flex items-center justify-between p-3 rounded-lg border ${
//                               doc.verified 
//                                 ? "border-green-200 bg-green-50" 
//                                 : "border-gray-200 bg-gray-50"
//                             }`}
//                           >
//                             <div className="flex items-center gap-3 flex-1 min-w-0">
//                               <FileText className={`w-4 h-4 ${doc.verified ? "text-green-500" : "text-gray-500"}`} />
//                               <span className={`text-sm truncate ${doc.verified ? "text-green-800" : "text-gray-800"}`}>
//                                 Tax Document {index + 1}
//                               </span>
//                               <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
//                                 doc.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
//                               }`}>
//                                 {doc.verified ? "Verified" : "Pending"}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() => openDocument('taxDocuments', doc, index)}
//                                 className="p-1.5 hover:bg-gray-200 rounded transition-colors"
//                                 title="View Document"
//                               >
//                                 <Eye className="w-4 h-4 text-blue-600" />
//                               </button>
//                               <button
//                                 onClick={() => handleVerifyDocument('tax-doc', index, true)}
//                                 disabled={verifying[`tax-doc_${index}`] || doc.verified}
//                                 className={`p-1.5 rounded transition-colors ${
//                                   doc.verified 
//                                     ? "bg-green-100 text-green-700" 
//                                     : "bg-green-500 text-white hover:bg-green-600"
//                                 } disabled:opacity-50`}
//                                 title="Verify Document"
//                               >
//                                 {verifying[`tax-doc_${index}`] ? (
//                                   <Loader2 className="w-4 h-4 animate-spin" />
//                                 ) : (
//                                   <Check className="w-4 h-4" />
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Business License Documents */}
//                   {application.businessLicenseDocuments.length > 0 && (
//                     <div>
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="font-semibold text-gray-700 flex items-center gap-2">
//                           <Briefcase className="w-4 h-4" />
//                           Business License Documents ({application.businessLicenseDocuments.length})
//                         </h3>
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${
//                           application.verificationChecklist.businessLicense 
//                             ? "bg-green-100 text-green-700" 
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}>
//                           {application.verificationChecklist.businessLicense ? "Verified" : "Pending"}
//                         </span>
//                       </div>
//                       <div className="space-y-2">
//                         {application.businessLicenseDocuments.map((doc, index) => (
//                           <div 
//                             key={doc._id} 
//                             className={`flex items-center justify-between p-3 rounded-lg border ${
//                               doc.verified 
//                                 ? "border-green-200 bg-green-50" 
//                                 : "border-gray-200 bg-gray-50"
//                             }`}
//                           >
//                             <div className="flex items-center gap-3 flex-1 min-w-0">
//                               <FileText className={`w-4 h-4 ${doc.verified ? "text-green-500" : "text-gray-500"}`} />
//                               <span className={`text-sm truncate ${doc.verified ? "text-green-800" : "text-gray-800"}`}>
//                                 Business License {index + 1}
//                               </span>
//                               <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
//                                 doc.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
//                               }`}>
//                                 {doc.verified ? "Verified" : "Pending"}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() => openDocument('businessLicenseDocuments', doc, index)}
//                                 className="p-1.5 hover:bg-gray-200 rounded transition-colors"
//                                 title="View Document"
//                               >
//                                 <Eye className="w-4 h-4 text-blue-600" />
//                               </button>
//                               <button
//                                 onClick={() => handleVerifyDocument('business-license', index, true)}
//                                 disabled={verifying[`business-license_${index}`] || doc.verified}
//                                 className={`p-1.5 rounded transition-colors ${
//                                   doc.verified 
//                                     ? "bg-green-100 text-green-700" 
//                                     : "bg-green-500 text-white hover:bg-green-600"
//                                 } disabled:opacity-50`}
//                                 title="Verify Document"
//                               >
//                                 {verifying[`business-license_${index}`] ? (
//                                   <Loader2 className="w-4 h-4 animate-spin" />
//                                 ) : (
//                                   <Check className="w-4 h-4" />
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {application.minorityProofDocuments.length === 0 && 
//                    application.taxDocuments.length === 0 && 
//                    application.businessLicenseDocuments.length === 0 && (
//                     <div className="text-center py-4 text-gray-500">
//                       <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
//                       <p className="text-sm">No documents uploaded yet</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
                
//                 <div className="space-y-4">
//                   {verificationTypes.map(({ key, checklistKey, label, icon: Icon, description, points, required }) => {
//                     const isVerified = getVerificationStatus(key, checklistKey);
//                     const isLoading = verifying[key];
//                     const hasSourceData = hasVerificationSource(key);
                    
//                     return (
//                       <div 
//                         key={key} 
//                         className={`p-4 rounded-lg border transition-all duration-200 ${
//                           isVerified 
//                             ? "border-green-200 bg-green-50" 
//                             : "border-gray-200 bg-gray-50 hover:bg-gray-100"
//                         }`}
//                       >
//                         <div className="flex items-start justify-between mb-3">
//                           <div className="flex items-start gap-3">
//                             <div className={`p-2 rounded-lg ${
//                               isVerified ? "bg-green-100" : "bg-gray-100"
//                             }`}>
//                               <Icon className={`w-5 h-5 ${isVerified ? "text-green-600" : "text-gray-600"}`} />
//                             </div>
//                             <div className="flex-1">
//                               <div className="flex items-center gap-2 mb-1">
//                                 <span className={`font-medium ${isVerified ? "text-green-800" : "text-gray-800"}`}>
//                                   {label}
//                                 </span>
//                                 {required && (
//                                   <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
//                                 )}
//                                 <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">+{points} pts</span>
//                               </div>
//                               <p className="text-xs text-gray-500">{description}</p>
//                               {!hasSourceData && !isVerified && (
//                                 <p className="text-xs text-amber-600 mt-1">No value provided by vendor yet</p>
//                               )}
//                             </div>
//                           </div>
//                           <div className="flex flex-col items-end gap-2">
//                             <span className={`px-2 py-1 rounded text-xs font-medium ${
//                               isVerified 
//                                 ? "bg-green-100 text-green-700 border border-green-200" 
//                                 : hasSourceData
//                                   ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
//                                   : "bg-gray-100 text-gray-600 border border-gray-200"
//                             }`}>
//                               {isVerified ? "Verified" : hasSourceData ? "Pending" : "Not Provided"}
//                             </span>
//                           </div>
//                         </div>
                        
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleVerifyCategory(key, true)}
//                             disabled={isLoading || isVerified || (!hasSourceData && !isVerified)}
//                             className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
//                               isVerified 
//                                 ? "bg-green-100 text-green-700 cursor-default" 
//                                 : hasSourceData
//                                   ? "bg-green-500 text-white hover:bg-green-600"
//                                   : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                             } disabled:opacity-50`}
//                           >
//                             {isLoading ? (
//                               <Loader2 className="w-4 h-4 animate-spin" />
//                             ) : (
//                               <Check className="w-4 h-4" />
//                             )}
//                             {isVerified ? "Verified" : hasSourceData ? "Verify" : "No Data"}
//                           </button>
//                           <button
//                             onClick={() => handleVerifyCategory(key, false)}
//                             disabled={isLoading || !isVerified}
//                             className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
//                               !isVerified 
//                                 ? "bg-gray-100 text-gray-400 cursor-default" 
//                                 : "bg-red-500 text-white hover:bg-red-600"
//                             } disabled:opacity-50`}
//                           >
//                             <X className="w-4 h-4" />
//                             Unverify
//                           </button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Documents Verification Section */}
//               <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
//                 <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
//                   <FileCheck className="w-5 h-5" />
//                   Document Verification
//                 </h2>
                
//                 <div className="space-y-6">
//                   {/* Minority Documents */}
//                   {application.minorityProofDocuments.length > 0 && (
//                     <div>
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="font-semibold text-gray-700 flex items-center gap-2">
//                           <Shield className="w-4 h-4" />
//                           Minority Proof Documents ({application.minorityProofDocuments.length})
//                         </h3>
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${
//                           application.verificationChecklist.minorityDocs 
//                             ? "bg-green-100 text-green-700" 
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}>
//                           {application.verificationChecklist.minorityDocs ? "Verified" : "Pending"}
//                         </span>
//                       </div>
//                       <div className="space-y-2">
//                         {application.minorityProofDocuments.map((doc, index) => (
//                           <div 
//                             key={doc._id} 
//                             className={`flex items-center justify-between p-3 rounded-lg border ${
//                               doc.verified 
//                                 ? "border-green-200 bg-green-50" 
//                                 : "border-gray-200 bg-gray-50"
//                             }`}
//                           >
//                             <div className="flex items-center gap-3 flex-1 min-w-0">
//                               <FileText className={`w-4 h-4 ${doc.verified ? "text-green-500" : "text-gray-500"}`} />
//                               <span className={`text-sm truncate ${doc.verified ? "text-green-800" : "text-gray-800"}`}>
//                                 Minority Proof Document {index + 1}
//                               </span>
//                               <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
//                                 doc.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
//                               }`}>
//                                 {doc.verified ? "Verified" : "Pending"}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() => openDocument('minorityProofDocuments', doc, index)}
//                                 className="p-1.5 hover:bg-gray-200 rounded transition-colors"
//                                 title="View Document"
//                               >
//                                 <Eye className="w-4 h-4 text-blue-600" />
//                               </button>
//                               <button
//                                 onClick={() => handleVerifyDocument('minority-proof', index, true)}
//                                 disabled={verifying[`minority-proof_${index}`] || doc.verified}
//                                 className={`p-1.5 rounded transition-colors ${
//                                   doc.verified 
//                                     ? "bg-green-100 text-green-700" 
//                                     : "bg-green-500 text-white hover:bg-green-600"
//                                 } disabled:opacity-50`}
//                                 title="Verify Document"
//                               >
//                                 {verifying[`minority-proof_${index}`] ? (
//                                   <Loader2 className="w-4 h-4 animate-spin" />
//                                 ) : (
//                                   <Check className="w-4 h-4" />
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Tax Documents */}
//                   {application.taxDocuments.length > 0 && (
//                     <div>
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="font-semibold text-gray-700 flex items-center gap-2">
//                           <FileText className="w-4 h-4" />
//                           Tax Documents ({application.taxDocuments.length})
//                         </h3>
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${
//                           application.verificationChecklist.taxDocs 
//                             ? "bg-green-100 text-green-700" 
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}>
//                           {application.verificationChecklist.taxDocs ? "Verified" : "Pending"}
//                         </span>
//                       </div>
//                       <div className="space-y-2">
//                         {application.taxDocuments.map((doc, index) => (
//                           <div 
//                             key={doc._id} 
//                             className={`flex items-center justify-between p-3 rounded-lg border ${
//                               doc.verified 
//                                 ? "border-green-200 bg-green-50" 
//                                 : "border-gray-200 bg-gray-50"
//                             }`}
//                           >
//                             <div className="flex items-center gap-3 flex-1 min-w-0">
//                               <FileText className={`w-4 h-4 ${doc.verified ? "text-green-500" : "text-gray-500"}`} />
//                               <span className={`text-sm truncate ${doc.verified ? "text-green-800" : "text-gray-800"}`}>
//                                 Tax Document {index + 1}
//                               </span>
//                               <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
//                                 doc.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
//                               }`}>
//                                 {doc.verified ? "Verified" : "Pending"}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() => openDocument('taxDocuments', doc, index)}
//                                 className="p-1.5 hover:bg-gray-200 rounded transition-colors"
//                                 title="View Document"
//                               >
//                                 <Eye className="w-4 h-4 text-blue-600" />
//                               </button>
//                               <button
//                                 onClick={() => handleVerifyDocument('tax-doc', index, true)}
//                                 disabled={verifying[`tax-doc_${index}`] || doc.verified}
//                                 className={`p-1.5 rounded transition-colors ${
//                                   doc.verified 
//                                     ? "bg-green-100 text-green-700" 
//                                     : "bg-green-500 text-white hover:bg-green-600"
//                                 } disabled:opacity-50`}
//                                 title="Verify Document"
//                               >
//                                 {verifying[`tax-doc_${index}`] ? (
//                                   <Loader2 className="w-4 h-4 animate-spin" />
//                                 ) : (
//                                   <Check className="w-4 h-4" />
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Business License Documents */}
//                   {application.businessLicenseDocuments.length > 0 && (
//                     <div>
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="font-semibold text-gray-700 flex items-center gap-2">
//                           <Briefcase className="w-4 h-4" />
//                           Business License Documents ({application.businessLicenseDocuments.length})
//                         </h3>
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${
//                           application.verificationChecklist.businessLicense 
//                             ? "bg-green-100 text-green-700" 
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}>
//                           {application.verificationChecklist.businessLicense ? "Verified" : "Pending"}
//                         </span>
//                       </div>
//                       <div className="space-y-2">
//                         {application.businessLicenseDocuments.map((doc, index) => (
//                           <div 
//                             key={doc._id} 
//                             className={`flex items-center justify-between p-3 rounded-lg border ${
//                               doc.verified 
//                                 ? "border-green-200 bg-green-50" 
//                                 : "border-gray-200 bg-gray-50"
//                             }`}
//                           >
//                             <div className="flex items-center gap-3 flex-1 min-w-0">
//                               <FileText className={`w-4 h-4 ${doc.verified ? "text-green-500" : "text-gray-500"}`} />
//                               <span className={`text-sm truncate ${doc.verified ? "text-green-800" : "text-gray-800"}`}>
//                                 Business License {index + 1}
//                               </span>
//                               <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
//                                 doc.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
//                               }`}>
//                                 {doc.verified ? "Verified" : "Pending"}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() => openDocument('businessLicenseDocuments', doc, index)}
//                                 className="p-1.5 hover:bg-gray-200 rounded transition-colors"
//                                 title="View Document"
//                               >
//                                 <Eye className="w-4 h-4 text-blue-600" />
//                               </button>
//                               <button
//                                 onClick={() => handleVerifyDocument('business-license', index, true)}
//                                 disabled={verifying[`business-license_${index}`] || doc.verified}
//                                 className={`p-1.5 rounded transition-colors ${
//                                   doc.verified 
//                                     ? "bg-green-100 text-green-700" 
//                                     : "bg-green-500 text-white hover:bg-green-600"
//                                 } disabled:opacity-50`}
//                                 title="Verify Document"
//                               >
//                                 {verifying[`business-license_${index}`] ? (
//                                   <Loader2 className="w-4 h-4 animate-spin" />
//                                 ) : (
//                                   <Check className="w-4 h-4" />
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {application.minorityProofDocuments.length === 0 && 
//                    application.taxDocuments.length === 0 && 
//                    application.businessLicenseDocuments.length === 0 && (
//                     <div className="text-center py-4 text-gray-500">
//                       <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
//                       <p className="text-sm">No documents uploaded yet</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Timeline Card */}
//               <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
//                 <h2 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
//                   <Clock className="w-5 h-5" />
//                   Timeline
//                 </h2>
//                 <div className="space-y-4">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Created:</span>
//                     <span className="font-medium text-sm">
//                       {new Date(application.createdAt).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Last Updated:</span>
//                     <span className="font-medium text-sm">
//                       {new Date(application.updatedAt).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="pt-3 border-t">
//                     <div className="flex items-center gap-2 text-gray-600">
//                       <AlertCircle className="w-4 h-4" />
//                       <span className="text-sm">Status: {application.status.toUpperCase()}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* Document Modal */}
//       {showDocumentModal && selectedDocument && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col">
//             <div className="flex items-center justify-between p-6 border-b">
//               <h3 className="text-lg font-semibold">Document Preview</h3>
//               <button
//                 onClick={() => setShowDocumentModal(false)}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
            
//             <div className="flex-1 overflow-hidden">
//               <iframe
//                 src={selectedDocument.doc.url}
//                 className="w-full h-full"
//                 title="Document Preview"
//               />
//             </div>
            
//             <div className="flex items-center justify-between p-6 border-t">
//               <a
//                 href={selectedDocument.doc.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//               >
//                 <ExternalLink className="w-4 h-4" />
//                 Open in new tab
//               </a>
              
//               <div className="flex items-center gap-3">
//                 <span className={`px-3 py-1 rounded-full text-sm ${
//                   selectedDocument.doc.verified 
//                     ? "bg-green-100 text-green-700" 
//                     : "bg-yellow-100 text-yellow-700"
//                 }`}>
//                   {selectedDocument.doc.verified ? "Verified" : "Pending"}
//                 </span>
                
//                 {!selectedDocument.doc.verified && (
//                   <button
//                     onClick={() => {
//                       const verificationType = getVerificationTypeForDocument(selectedDocument.type);
//                       handleVerifyDocument(verificationType, selectedDocument.index, true);
//                       setShowDocumentModal(false);
//                     }}
//                     disabled={verifying[`${getVerificationTypeForDocument(selectedDocument.type)}_${selectedDocument.index}`]}
//                     className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
//                   >
//                     {verifying[`${getVerificationTypeForDocument(selectedDocument.type)}_${selectedDocument.index}`] ? (
//                       <>
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         Verifying...
//                       </>
//                     ) : (
//                       <>
//                         <Check className="w-4 h-4" />
//                         Verify Document
//                       </>
//                     )}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Finalize Application Modal */}
//       {showFinalizeModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl w-full max-w-md">
//             <div className="p-6 border-b">
//               <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                 <CheckCheck className="w-5 h-5 text-green-600" />
//                 Finalize Application
//               </h3>
//             </div>
            
//             <div className="p-6">
//               <div className="mb-6">
//                 <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
//                   <CheckCheck className="w-8 h-8 text-green-600" />
//                 </div>
//                 <h4 className="text-lg font-semibold text-center mb-2">
//                   Ready to Finalize
//                 </h4>
//                 <p className="text-gray-600 text-center text-sm mb-6">
//                   All required verifications are completed. This action will mark the application as approved and notify the vendor.
//                 </p>
                
//                 <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                   <h5 className="font-medium text-gray-700 mb-2">Verification Summary</h5>
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-gray-600">Required Verifications:</span>
//                       <span className="font-medium text-green-600">
//                         {progress.required}/{progress.totalRequired} completed
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-gray-600">Optional Verifications:</span>
//                       <span className="font-medium text-gray-700">
//                         {progress.optional}/{progress.totalOptional} completed
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-gray-600">Total Points Awarded:</span>
//                       <span className="font-bold text-gray-900">
//                         {application.totalVerificationPoints} pts
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowFinalizeModal(false)}
//                   disabled={finalizing}
//                   className="flex-1 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleFinalizeApplication}
//                   disabled={finalizing}
//                   className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//                 >
//                   {finalizing ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <CheckCheck className="w-4 h-4" />
//                       Finalize Application
//                     </>
//                   )}
//                 </button>
//               </div>
              
//               <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
//                 <div className="flex items-start gap-2">
//                   <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
//                   <p className="text-xs text-yellow-700">
//                     This action cannot be undone. The vendor will be notified and the application status will be updated to "approved".
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
