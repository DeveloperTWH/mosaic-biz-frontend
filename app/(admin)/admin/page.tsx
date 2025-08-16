"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import Sidebar from "./components/Sidebar"; // Import Sidebar component
import Topbar from "./components/Topbar"; // Import Topbar component
import Link from "next/link";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [noBusinesses, setNoBusinesses] = useState<boolean>(false); // State to check if there are no businesses
  const [notApprovedCount, setNotApprovedCount] = useState<number>(0); // Track count of not approved businesses
  const router = useRouter();

  // Function to fetch all businesses from the backend
  const fetchBusinesses = async () => {
    try {
      const response = await axios.get(
        // Example with limit and page:
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/api/business?limit=4&page=1`,
        {
          withCredentials: true, // Ensures that credentials (cookies) are sent with the request
        }
      );

      // Check if businesses exist
      if (response.data.data.length === 0) {
        setNoBusinesses(true); // If no businesses are found
      } else {
        setBusinesses(response.data.data); // Assuming the response structure has `data`
        setNotApprovedCount(response.data.notApprovedCount); // Set count of not approved businesses
        setNoBusinesses(false); // Businesses found, reset state
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        // Handle the case where businesses are not found
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
  }, []);

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
                {noBusinesses ? "N/A" : businesses.length}
              </p>
            </div>

            {/* Stats Card 2 */}
            <div className="p-8 transition-all duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105">
              <h3 className="text-lg font-semibold text-gray-800">
                Pending Approvals
              </h3>
              <p className="text-3xl font-bold text-orange-600">
                {noBusinesses ? "N/A" : notApprovedCount}
              </p>
            </div>

            {/* Stats Card 3 */}
            <div className="p-8 transition-all duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105">
              <h3 className="text-lg font-semibold text-gray-800">Customers</h3>
              <p className="text-3xl font-bold text-green-600">120</p>
            </div>

            {/* Stats Card 4 (Revenue) */}
            <div className="p-8 transition-all duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105">
              <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
              <p className="text-3xl font-bold text-teal-600">$15000</p>
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
              </div>

              {/* View More Button */}
              <div className="mt-6 text-right">
                <Link href="/admin/businesses">
                  <span className="px-6 py-2 text-white transition-all duration-300 bg-indigo-600 rounded-lg shadow-md cursor-pointer hover:bg-indigo-700">
                    View More
                  </span>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
