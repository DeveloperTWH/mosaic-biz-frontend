"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  Eye,
  ChevronRight,
  Building,
  DollarSign,
  UserCheck,
  RefreshCw
} from "lucide-react";

type VendorApplication = {
  _id: string;
  applicationId: string;
  businessName: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "verified";
  totalVerificationPoints: number;
  isMinorityOwned: boolean;
  minorityCategories: string[];
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  verificationPayment: {
    status: "pending" | "paid" | "failed";
    paidAt?: string;
  };
  verificationChecklist: {
    minorityDocs: boolean;
    taxDocs: boolean;
    businessLicense: boolean;
    website: boolean;
    facebook: boolean;
    instagram: boolean;
    linkedin: boolean;
    tiktok: boolean;
  };
  createdAt: string;
  submittedAt?: string;
};

const VendorApplicationsPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Use the exact API endpoint from your curl
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/pending`,
        { 
          withCredentials: true, // This sends cookies automatically
          // No need for Authorization header, cookies handle it
        }
      );
      
      console.log("API Response:", res.data); // Debug log
      
      if (res.data.success) {
        setApplications(res.data.data || []);
      }
    } catch (err: any) {
      console.error("Error fetching applications:", err);
      toast.error(err.response?.data?.message || "Failed to fetch applications");
      // Set empty array if error
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString() : "-";

  const formatDateTime = (iso?: string) =>
    iso ? new Date(iso).toLocaleString() : "-";

  const getStatusIcon = (status: VendorApplication["status"]) => {
    switch (status) {
      case "draft":
        return <FileText className="w-4 h-4 text-gray-500" />;
      case "submitted":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "under_review":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: VendorApplication["status"]) => {
    const map: Record<VendorApplication["status"], string> = {
      draft: "bg-gray-100 text-gray-700",
      submitted: "bg-yellow-100 text-yellow-700",
      under_review: "bg-blue-100 text-blue-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      verified: "bg-green-100 text-green-700",
    };
    
    const label: Record<VendorApplication["status"], string> = {
      draft: "Draft",
      submitted: "Submitted",
      under_review: "Under Review",
      approved: "Approved",
      rejected: "Rejected",
      verified: "verified",
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${map[status]}`}>
        {getStatusIcon(status)}
        {label[status]}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const map: Record<string, string> = {
      pending: "bg-gray-100 text-gray-700",
      paid: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
    };
    
    const label: Record<string, string> = {
      pending: "Pending",
      paid: "Paid",
      failed: "Failed",
    };

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${map[paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
        {label[paymentStatus] || paymentStatus}
      </span>
    );
  };

  const viewApplicationDetails = (applicationId: string) => {
    router.push(`/admin/vendor-applications/${applicationId}`);
  };

  const filteredApplications = applications.filter(app => {
    // Filter by status
    if (selectedStatus !== "all" && app.status !== selectedStatus) return false;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        app.businessName?.toLowerCase().includes(term) ||
        app.userId?.name?.toLowerCase().includes(term) ||
        app.userId?.email?.toLowerCase().includes(term) ||
        app.applicationId?.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar setIsSidebarOpen={setSidebarOpen} />

        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Applications</h1>
              <p className="text-gray-600">Review and verify business onboarding applications</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchApplications}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Simple Stats */}
          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm ring-1 ring-gray-100">
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="mt-1 text-3xl font-semibold">{applications.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm ring-1 ring-gray-100">
              <div>
                <p className="text-sm text-gray-500">Submitted</p>
                <p className="mt-1 text-3xl font-semibold">
                  {applications.filter(app => app.status === "submitted").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-50">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm ring-1 ring-gray-100">
              <div>
                <p className="text-sm text-gray-500">Paid Applications</p>
                <p className="mt-1 text-3xl font-semibold">
                  {applications.filter(app => app.verificationPayment?.status === "paid").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 mb-6 bg-white rounded-xl shadow-sm ring-1 ring-gray-100">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by business, name, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:w-64"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="overflow-hidden bg-white rounded-xl shadow-sm ring-1 ring-gray-100">
            <div className="px-5 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold">
                Applications ({filteredApplications.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-500">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-6 text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No applications found</p>
                <button
                  onClick={fetchApplications}
                  className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-600">
                      <th className="px-5 py-3 font-medium">Application ID</th>
                      <th className="px-5 py-3 font-medium">Business</th>
                      <th className="px-5 py-3 font-medium">Applicant</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Payment</th>
                      <th className="px-5 py-3 font-medium">Points</th>
                      <th className="px-5 py-3 font-medium">Submitted</th>
                      <th className="px-5 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50/60">
                        <td className="px-5 py-3">
                          <div className="font-mono text-xs text-gray-900">
                            {app.applicationId}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="font-medium text-gray-900">
                            {app.businessName}
                          </div>
                          {app.isMinorityOwned && (
                            <div className="mt-1 text-xs text-purple-600">
                              Minority Owned
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <div className="font-medium">{app.userId?.name || "N/A"}</div>
                          <div className="text-xs text-gray-500">{app.userId?.email || "N/A"}</div>
                        </td>
                        <td className="px-5 py-3">
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="px-5 py-3">
                          {getPaymentBadge(app.verificationPayment?.status || "pending")}
                        </td>
                        <td className="px-5 py-3">
                          <div className="font-semibold">{app.totalVerificationPoints}</div>
                        </td>
                        <td className="px-5 py-3">
                          {formatDate(app.submittedAt || app.createdAt)}
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => viewApplicationDetails(app.applicationId)}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            Review
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorApplicationsPage;