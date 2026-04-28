'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type CustomerBooking = {
  _id: string;
  bookingType?: string;
  serviceTitle?: string;
  serviceId?: {
    _id?: string;
    title?: string;
  } | string;
  businessId?: {
    _id?: string;
    businessName?: string;
    email?: string;
  } | string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  serviceItems?: string[];
  services?: string[];
  date?: string;
  time?: string;
  slot?: string;
  status?: string;
  paymentStatus?: string;
  paymentLink?: string;
  paymentRequestedAt?: string;
  vendorDecisionNote?: string;
  vendorDecisionAt?: string;
  createdAt: string;
  updatedAt?: string;
};

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token") || localStorage.getItem("token");
};

const getStatusClassName = (status?: string) => {
  switch (status) {
    case "approved":
      return "text-green-600";
    case "pending_vendor_action":
      return "text-amber-600";
    case "rejected":
    case "cancelled":
      return "text-red-600";
    case "completed":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

const formatStatus = (status?: string) => {
  if (!status) return "Unknown";
  return status.replace(/_/g, " ");
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBookings = async () => {
    setLoading(true);

    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings/customer`,
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      const allBookings = Array.isArray(response.data?.bookings) ? response.data.bookings : [];
      const normalizedQuery = searchQuery.trim().toLowerCase();

      const filteredBookings = allBookings.filter((booking: CustomerBooking) => {
        const matchesStatus = !statusFilter || booking.status === statusFilter;
        const businessName =
          typeof booking.businessId === "object" ? booking.businessId?.businessName || "" : "";
        const serviceTitle =
          booking.serviceTitle ||
          (typeof booking.serviceId === "object" ? booking.serviceId?.title || "" : "");
        const serviceNames = [...(booking.serviceItems || []), ...(booking.services || [])].join(" ");
        const matchesSearch =
          !normalizedQuery ||
          businessName.toLowerCase().includes(normalizedQuery) ||
          serviceTitle.toLowerCase().includes(normalizedQuery) ||
          serviceNames.toLowerCase().includes(normalizedQuery) ||
          booking._id.toLowerCase().includes(normalizedQuery);

        return matchesStatus && matchesSearch;
      });

      setBookings(filteredBookings);
    } catch (error) {
      toast.error("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, searchQuery]);

  return (
    <div className="bg-[#ebeae2]">
      <div className="container px-4 pt-5 pb-5 mx-auto">
        <div className="flex flex-col gap-6 mb-8 lg:flex-row">
          <div className="border rounded-lg lg:w-1/4">
            <div className="p-4 bg-gray-50">
              <h3 className="mb-4 text-xl font-semibold">Filters</h3>

              <div className="mb-4">
                <label className="block text-gray-700">Booking Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Statuses</option>
                  <option value="pending_vendor_action">Pending Vendor Action</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  placeholder="Search Bookings"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-3/4 p-2 border rounded"
                />
                <button
                  onClick={fetchBookings}
                  className="px-4 py-2 ml-4 text-white bg-blue-500 rounded-lg"
                >
                  Search Bookings
                </button>
              </div>

              {loading && <div className="py-6 text-center">Loading...</div>}

              {!loading && bookings.length === 0 && (
                <div className="py-6 text-center">No bookings found.</div>
              )}

              {bookings.map((booking) => {
                const businessName =
                  typeof booking.businessId === "object"
                    ? booking.businessId?.businessName
                    : "Business";
                const serviceTitle =
                  booking.serviceTitle ||
                  (typeof booking.serviceId === "object" ? booking.serviceId?.title : "") ||
                  "Service booking";
                const selectedServices = booking.serviceItems?.length
                  ? booking.serviceItems
                  : booking.services || [];

                return (
                  <div
                    key={booking._id}
                    className="p-4 mb-4 bg-white border rounded-lg shadow-md"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{businessName}</h3>
                          {/* <p className="text-sm text-gray-500">Booking ID: {booking._id}</p> */}
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">{serviceTitle}</p>
                          {selectedServices.length > 0 && (
                            <p className="text-sm text-gray-600">
                              Items: {selectedServices.join(", ")}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-1 text-sm text-gray-600">
                          <p>Date: {booking.date ? new Date(booking.date).toLocaleDateString() : "N/A"}</p>
                          <p>Time: {booking.time || booking.slot || "N/A"}</p>
                          {/* <p className="capitalize">Payment: {booking.paymentStatus || "N/A"}</p> */}
                        </div>

                        {booking.vendorDecisionNote && (
                          <p className="text-sm text-gray-700">
                            Vendor Note: {booking.vendorDecisionNote}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 md:items-end">
                        <p className={`text-base font-medium capitalize ${getStatusClassName(booking.status)}`}>
                          {formatStatus(booking.status)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </p>

                        {booking.paymentLink && booking.status === "approved" && (
                          <a
                            href={booking.paymentLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Complete Payment
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
