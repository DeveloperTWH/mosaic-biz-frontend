"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // Import Sidebar component
import Topbar from "../components/Topbar"; // Import Topbar component
import BusinessStatusModal from "../components/BusinessStatusModal";
import {
    getAdminBusinessRowState,
    isAdminBusinessActivated,
    resolveAdminBusinessCounts,
} from "@/lib/admin/businessStatusDisplay";

const BusinessPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [noBusinesses, setNoBusinesses] = useState<boolean>(false);
    const [totalBusiness, settotalBusiness] = useState<number>(0);
    const [activeBusinessCount, setActiveBusinessCount] = useState<number>(0);
    const [inactiveBusinessCount, setInactiveBusinessCount] = useState<number>(0);
    const [publicBusinessCount, setPublicBusinessCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [businessFilter, setBusinessFilter] = useState<"all" | "active" | "inactive">("all");
    const [statusModalOpen, setStatusModalOpen] = useState<boolean>(false);
    const [selectedBusinessIndex, setSelectedBusinessIndex] = useState<number | null>(null);
    const [deactivationRemark, setDeactivationRemark] = useState<string>("");
    const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

    const fetchBusinesses = async () => {
        setLoading(true);
        try {
            const filterQuery =
                businessFilter === "all" ? "" : `&isActive=${businessFilter === "active"}`;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/business?page=${currentPage}&limit=10${filterQuery}`,
                {
                    withCredentials: true,
                }
            );

            const data = Array.isArray(response.data.data) ? response.data.data : [];

            if (!data || data.length === 0) {
                setNoBusinesses(true);
                setBusinesses([]);
                settotalBusiness(0);
                setActiveBusinessCount(0);
                setInactiveBusinessCount(0);
                setPublicBusinessCount(0);
                setTotalPages(1);
            } else {
                setBusinesses(data);
                settotalBusiness(response.data.totalBusinesses ?? data.length);
                const counts = resolveAdminBusinessCounts(data, response.data);
                setActiveBusinessCount(counts.active);
                setInactiveBusinessCount(counts.inactive);
                setPublicBusinessCount(counts.publicListing);
                setTotalPages(response.data.totalPages || 1);
                setNoBusinesses(false);
            }

            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            if (error.response && error.response.status === 404) {
                setNoBusinesses(true);
                setBusinesses([]);
                settotalBusiness(0);
                setActiveBusinessCount(0);
                setInactiveBusinessCount(0);
                setPublicBusinessCount(0);
                setTotalPages(1);
            } else {
                toast.error("Failed to fetch businesses. Please try again later.");
                console.error("Error fetching businesses:", error);
            }
        }
    };


    // Call fetchBusinesses on component mount
    useEffect(() => {
        fetchBusinesses();
    }, [currentPage, businessFilter]);


    const updateBusinessStatus = async (index: number, nextStatus: boolean, remark?: string) => {
        const business = businesses[index];
        const statusLabel = nextStatus ? "activated" : "deactivated";

        try {
            setUpdatingStatus(true);
            // Send activate/deactivate request to the backend
            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/business/status/${business._id}`,
                {
                    isActive: nextStatus,
                    remark:
                        remark ||
                        (nextStatus
                            ? "Activated by admin from the business management screen."
                            : "Deactivated by admin from the business management screen."),
                },
                {
                    withCredentials: true,
                }
            );

            // Show success message
            toast.success(`${business.businessName} has been ${statusLabel}.`);
            setStatusModalOpen(false);
            setSelectedBusinessIndex(null);
            setDeactivationRemark("");
            await fetchBusinesses();
        } catch (error) {
            toast.error(
                `Failed to ${nextStatus ? "activate" : "deactivate"} ${business.businessName}.`
            );
            console.error("Error during active status update:", error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const openDeactivateModal = (index: number) => {
        setSelectedBusinessIndex(index);
        setDeactivationRemark("");
        setStatusModalOpen(true);
    };

    const confirmDeactivate = async () => {
        if (selectedBusinessIndex === null) return;
        if (!deactivationRemark.trim()) {
            toast.error("Please add a remark before deactivating this business.");
            return;
        }

        await updateBusinessStatus(selectedBusinessIndex, false, deactivationRemark.trim());
    };

    const activateBusiness = async (index: number) => {
        await updateBusinessStatus(index, true);
    };

    const handleFilterChange = (filter: "all" | "active" | "inactive") => {
        setBusinessFilter(filter);
        setCurrentPage(1);
    };

    if (loading) {
        return <div>Loading...</div>; // Display a loading message while businesses are being fetched
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Topbar Component */}
                <Topbar setIsSidebarOpen={setSidebarOpen} />

                <main className="flex-1 px-8 py-6 overflow-y-auto">
                    {/* Stats Section */}
                    <div className="grid grid-cols-1 gap-8 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="p-8 transition-all duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105">
                            <h3 className="text-lg font-semibold text-gray-800">Businesses</h3>
                            <p className="text-3xl font-bold text-indigo-600">{noBusinesses ? "N/A" : totalBusiness}</p>
                        </div>

                        <div className="p-8 transition-all duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105">
                            <h3 className="text-lg font-semibold text-gray-800">Publicly Listed</h3>
                            <p className="text-3xl font-bold text-indigo-600">{noBusinesses ? "N/A" : publicBusinessCount}</p>
                            <p className="mt-2 text-xs text-gray-500">Approved + active on /vendors</p>
                        </div>

                        <div className="p-8 transition-all duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105">
                            <h3 className="text-lg font-semibold text-gray-800">Admin Active</h3>
                            <p className="text-3xl font-bold text-green-600">{noBusinesses ? "N/A" : activeBusinessCount}</p>
                        </div>

                        <div className="p-8 transition-all duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105">
                            <h3 className="text-lg font-semibold text-gray-800">Not Publicly Listed</h3>
                            <p className="text-3xl font-bold text-orange-600">
                                {noBusinesses ? "N/A" : Math.max(totalBusiness - publicBusinessCount, 0)}
                            </p>
                        </div>
                    </div>

                    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                        <strong>Marketplace visibility:</strong> Customers only see vendors on{" "}
                        <code className="rounded bg-white px-1 py-0.5">/vendors</code> when a business is both{" "}
                        <strong>approved</strong> (vendor application finalized) and <strong>active</strong> (admin toggle).
                    </div>

                    <div className="mb-6 flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Filter
                        </span>
                        {(["all", "active", "inactive"] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => handleFilterChange(filter)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    businessFilter === filter
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                {filter === "all"
                                    ? "All Businesses"
                                    : filter === "active"
                                        ? "Active Only"
                                        : "Inactive Only"}
                            </button>
                        ))}
                    </div>

                    {/* No Businesses Found Message */}
                    {noBusinesses && (
                        <div className="mt-10 text-xl font-semibold text-center text-gray-700">
                            <p>No businesses available at the moment.</p>
                        </div>
                    )}

                    {/* Table for Business List */}
                    {!noBusinesses && (
                        <div className="p-8 bg-white rounded-lg shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Businesses List
                            </h3>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="text-gray-600 border-b">
                                            <th className="px-6 py-3 text-left">Name</th>
                                            <th className="px-6 py-3 text-left">Description</th>
                                            <th className="px-6 py-3 text-left">Marketplace</th>
                                            <th className="px-6 py-3 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {businesses.map((business, index) => {
                                            const rowState = getAdminBusinessRowState(business);
                                            const isActivated = isAdminBusinessActivated(business);

                                            return (
                                            <tr
                                                key={business._id}
                                                className="transition-all duration-300 hover:bg-gray-100"
                                            >
                                                <td className="px-6 py-4">{business.businessName}</td>
                                                <td className="px-6 py-4 text-gray-700">
                                                    {business.description}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1 text-sm">
                                                        <span className={rowState.approved ? "text-green-600" : "text-red-600"}>
                                                            {rowState.approvedLabel}
                                                        </span>
                                                        <span className={rowState.active ? "text-green-600" : "text-red-600"}>
                                                            Admin {rowState.activeLabel.toLowerCase()}
                                                        </span>
                                                        <span className={rowState.publicListing ? "font-semibold text-indigo-600" : "font-semibold text-orange-600"}>
                                                            {rowState.publicListingLabel} on marketplace
                                                        </span>
                                                        {rowState.showApprovalWarning ? (
                                                            <span className="text-xs text-amber-700">
                                                                Active but not approved — hidden from customers
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <button
                                                        className={`${isActivated
                                                            ? "bg-red-500 hover:bg-red-600"
                                                            : "bg-green-500 hover:bg-green-600"
                                                            } text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300`}
                                                        onClick={() =>
                                                            isActivated
                                                                ? openDeactivateModal(index)
                                                                : activateBusiness(index)
                                                        }
                                                    >
                                                        {isActivated ? "Deactivate" : "Activate"}
                                                    </button>
                                                </td>
                                            </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {/* Pagination Controls */}
                                {!noBusinesses && totalPages > 1 && (
                                    <div className="flex items-center justify-center mt-6 space-x-4">
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>

                                        <span className="font-semibold text-gray-700">
                                            Page {currentPage} of {totalPages}
                                        </span>

                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
            <BusinessStatusModal
                isOpen={statusModalOpen}
                businessName={selectedBusinessIndex !== null ? businesses[selectedBusinessIndex]?.businessName || "this business" : "this business"}
                remark={deactivationRemark}
                setRemark={setDeactivationRemark}
                loading={updatingStatus}
                onClose={() => {
                    setStatusModalOpen(false);
                    setSelectedBusinessIndex(null);
                    setDeactivationRemark("");
                }}
                onConfirm={confirmDeactivate}
            />
        </div>
    );
};

export default BusinessPage;
