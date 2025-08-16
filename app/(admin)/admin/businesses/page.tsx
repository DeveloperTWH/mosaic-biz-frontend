"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // Import Sidebar component
import Topbar from "../components/Topbar"; // Import Topbar component

const BusinessPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [noBusinesses, setNoBusinesses] = useState<boolean>(false);
    const [totalBusiness, settotalBusiness] = useState<number>(0);
    const [notApprovedCount, setNotApprovedCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const router = useRouter();

    const fetchBusinesses = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/api/business?limit=10&page=${currentPage}`,
                {
                    withCredentials: true,
                }
            );

            const { data } = response.data;

            if (!data || data.length === 0) {
                setNoBusinesses(true);
            } else {
                setBusinesses(data);
                settotalBusiness(response.data.totalBusinesses);
                setNotApprovedCount(response.data.notApprovedCount);
                setTotalPages(response.data.totalPages || 1);
                setNoBusinesses(false);
            }

            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            if (error.response && error.response.status === 404) {
                setNoBusinesses(true);
            } else {
                toast.error("Failed to fetch businesses. Please try again later.");
                console.error("Error fetching businesses:", error);
            }
        }
    };


    // Call fetchBusinesses on component mount
    useEffect(() => {
        fetchBusinesses();
    }, [currentPage]);


    // Function to toggle the approval status
    const toggleApproval = async (index: number) => {
        const business = businesses[index];
        const updatedBusinesses = [...businesses];
        const status = business.isApproved ? "Disapproved" : "Approved";

        try {
            // Send approval/disapproval request to the backend
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/api/business/approve/${business._id}`,
                {},
                {
                    withCredentials: true, // Ensure cookies are sent with the request
                }
            );

            // Update the state after toggling
            updatedBusinesses[index].isApproved =
                !updatedBusinesses[index].isApproved;
            setBusinesses(updatedBusinesses);

            // Update the notApprovedCount
            const updatedNotApprovedCount = updatedBusinesses.filter(
                (business) => !business.isApproved
            ).length;

            // Set the new count of not approved businesses
            setNotApprovedCount(updatedNotApprovedCount);

            // Show success message
            toast.success(`${business.businessName} has been ${status}.`);
        } catch (error) {
            toast.error(
                `Failed to ${status.toLowerCase()} ${business.businessName}.`
            );
            console.error("Error during approval/disapproval:", error);
        }
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
                    <div className="grid grid-cols-1 gap-8 mb-8 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Stats Card 1 */}
                        <div className="p-8 transition-all duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Businesses
                            </h3>
                            <p className="text-3xl font-bold text-indigo-600">
                                {noBusinesses ? "N/A" : totalBusiness}
                            </p>
                        </div>

                        {/* Stats Card 2 */}
                        <div className="p-8 transition-all duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105">
                            <h3 className="text-lg font-semibold text-gray-800">Approved Business</h3>
                            <p className="text-3xl font-bold text-green-600">{noBusinesses ? "N/A" : totalBusiness - notApprovedCount}</p>
                        </div>

                        {/* Stats Card 3 */}
                        <div className="p-8 transition-all duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Pending Approvals
                            </h3>
                            <p className="text-3xl font-bold text-orange-600">
                                {noBusinesses ? "N/A" : notApprovedCount}
                            </p>
                        </div>
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
                                            <th className="px-6 py-3 text-left">Status</th>
                                            <th className="px-6 py-3 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {businesses.map((business, index) => (
                                            <tr
                                                key={business._id}
                                                className="transition-all duration-300 hover:bg-gray-100"
                                            >
                                                <td className="px-6 py-4">{business.businessName}</td>
                                                <td className="px-6 py-4 text-gray-700">
                                                    {business.description}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={
                                                            business.isApproved
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }
                                                    >
                                                        {business.isApproved ? "Approved" : "Not Approved"}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <button
                                                        className={`${business.isApproved
                                                            ? "bg-red-500 hover:bg-red-600"
                                                            : "bg-green-500 hover:bg-green-600"
                                                            } text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300`}
                                                        onClick={() => toggleApproval(index)}
                                                    >
                                                        {business.isApproved ? "Disapprove" : "Approve"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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
        </div>
    );
};

export default BusinessPage;
