"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CustomerAccountShell from "../components/CustomerAccountShell";
import AccountStatusBadge, {
  formatBookingStatus,
  getBookingStatusVariant,
} from "../components/AccountStatusBadge";
import AccountEmptyState from "@/components/ui/account-empty-state";
import AccountLoadingBlock from "@/components/ui/account-loading-block";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

      const allBookings = Array.isArray(response.data?.bookings)
        ? response.data.bookings
        : [];
      const normalizedQuery = searchQuery.trim().toLowerCase();

      const filteredBookings = allBookings.filter((booking: CustomerBooking) => {
        const matchesStatus = !statusFilter || booking.status === statusFilter;
        const businessName =
          typeof booking.businessId === "object"
            ? booking.businessId?.businessName || ""
            : "";
        const serviceTitle =
          booking.serviceTitle ||
          (typeof booking.serviceId === "object"
            ? booking.serviceId?.title || ""
            : "");
        const serviceNames = [
          ...(booking.serviceItems || []),
          ...(booking.services || []),
        ].join(" ");
        const matchesSearch =
          !normalizedQuery ||
          businessName.toLowerCase().includes(normalizedQuery) ||
          serviceTitle.toLowerCase().includes(normalizedQuery) ||
          serviceNames.toLowerCase().includes(normalizedQuery) ||
          booking._id.toLowerCase().includes(normalizedQuery);

        return matchesStatus && matchesSearch;
      });

      setBookings(filteredBookings);
    } catch {
      toast.error("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, searchQuery]);

  return (
    <CustomerAccountShell title="My Bookings">
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="account-filter-panel lg:w-1/4">
          <h2 className="mb-4 font-poppins text-lg font-semibold text-brand-navy">
            Filters
          </h2>
          <FormField
            label="Booking Status"
            htmlFor="booking-status-filter"
            surface="auth"
          >
            <Select
              id="booking-status-filter"
              surface="auth"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="pending_vendor_action">Pending vendor action</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </FormField>
        </aside>

        <div className="lg:w-3/4">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
            <FormField
              label="Search bookings"
              htmlFor="booking-search"
              surface="auth"
              className="mb-0 flex-1"
            >
              <Input
                id="booking-search"
                type="text"
                placeholder="Search by business, service, or booking ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                surface="auth"
              />
            </FormField>
            <Button
              type="button"
              onClick={fetchBookings}
              size="sm"
              className="min-h-11 w-full sm:w-auto"
            >
              Search
            </Button>
          </div>

          {loading ? (
            <AccountLoadingBlock label="Loading your bookings…" />
          ) : bookings.length === 0 ? (
            <AccountEmptyState
              title="No bookings yet"
              description="When you book a service, your appointments will appear here."
              ctaLabel="Browse services"
              ctaHref="/services"
            />
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const businessName =
                  typeof booking.businessId === "object"
                    ? booking.businessId?.businessName
                    : "Business";
                const serviceTitle =
                  booking.serviceTitle ||
                  (typeof booking.serviceId === "object"
                    ? booking.serviceId?.title
                    : "") ||
                  "Service booking";
                const selectedServices = booking.serviceItems?.length
                  ? booking.serviceItems
                  : booking.services || [];

                return (
                  <article key={booking._id} className="account-card">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-poppins text-lg font-semibold text-brand-navy">
                            {businessName}
                          </h3>
                        </div>

                        <div>
                          <p className="font-poppins text-sm font-medium text-brand-navy">
                            {serviceTitle}
                          </p>
                          {selectedServices.length > 0 && (
                            <p className="commerce-text-meta">
                              Items: {selectedServices.join(", ")}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-1">
                          <p className="commerce-text-meta">
                            Date:{" "}
                            {booking.date
                              ? new Date(booking.date).toLocaleDateString()
                              : "Not scheduled"}
                          </p>
                          <p className="commerce-text-meta">
                            Time: {booking.time || booking.slot || "Not set"}
                          </p>
                        </div>

                        {booking.vendorDecisionNote && (
                          <p className="rounded-lg border border-border-warm bg-brand-cream px-3 py-2 font-montserrat text-sm text-brand-navy">
                            Vendor note: {booking.vendorDecisionNote}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 md:items-end">
                        <AccountStatusBadge
                          label={formatBookingStatus(booking.status)}
                          variant={getBookingStatusVariant(booking.status)}
                        />
                        <p className="commerce-text-meta">
                          Booked on{" "}
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>

                        {booking.paymentLink && booking.status === "approved" && (
                          <a
                            href={booking.paymentLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center font-montserrat text-sm font-medium text-brand-teal hover:text-brand-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                          >
                            Complete payment
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </CustomerAccountShell>
  );
};

export default BookingsPage;
