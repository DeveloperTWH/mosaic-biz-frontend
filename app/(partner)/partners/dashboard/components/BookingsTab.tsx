"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  approveVendorBooking,
  fetchVendorBookings,
  rejectVendorBooking,
  requestVendorBookingPayment,
  VendorBooking,
  VendorListingType,
} from "@/lib/api/vendorBookings";
import DashboardLoadingBlock from "@/components/ui/dashboard-loading-block";
import DashboardEmptyState from "@/components/ui/dashboard-empty-state";

interface BookingsTabProps {
  businessId?: string;
  listingType: VendorListingType;
  isActive: boolean;
}

type BookingActionDraft = {
  paymentLink: string;
  paymentNote: string;
  decisionNote: string;
  rejectionNote: string;
};

const defaultDraft: BookingActionDraft = {
  paymentLink: "",
  paymentNote: "",
  decisionNote: "",
  rejectionNote: "",
};

function formatBookingStatus(status?: string) {
  if (!status) return "Unknown";
  return status
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function BookingsTab({
  businessId,
  listingType,
  isActive,
}: BookingsTabProps) {
  const [bookings, setBookings] = useState<VendorBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, BookingActionDraft>>({});

  const loadBookings = async () => {
    if (!businessId) {
      setBookings([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchVendorBookings(listingType, businessId);
      setBookings(data);
    } catch (fetchError: any) {
      setError(fetchError?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isActive) return;
    loadBookings();
  }, [businessId, isActive, listingType]);

  const updateDraft = (
    bookingId: string,
    field: keyof BookingActionDraft,
    value: string
  ) => {
    setDrafts((prev) => ({
      ...prev,
      [bookingId]: {
        ...defaultDraft,
        ...prev[bookingId],
        [field]: value,
      },
    }));
  };

  const handleRequestPayment = async (bookingId: string) => {
    const draft = drafts[bookingId] ?? defaultDraft;

    if (!draft.paymentLink.trim()) {
      toast.error("Payment link is required.");
      return;
    }
    try {
      setActionLoadingId(bookingId);
      setError(null);
      await requestVendorBookingPayment(listingType, bookingId, {
        paymentLink: draft.paymentLink.trim(),
        note: draft.paymentNote.trim(),
      });
      toast.success("Payment link sent successfully.");
      await loadBookings();
    } catch (actionError: any) {
      const message = actionError?.message || "Failed to send payment link.";
      setError(message);
      toast.error(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApprove = async (bookingId: string) => {
    const draft = drafts[bookingId] ?? defaultDraft;


    try {
      setActionLoadingId(bookingId);
      setError(null);
      await approveVendorBooking(listingType, bookingId, draft.decisionNote.trim());
      toast.success("Booking approved successfully.");
      await loadBookings();
    } catch (actionError: any) {
      const message = actionError?.message || "Failed to approve booking.";
      setError(message);
      toast.error(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (bookingId: string) => {
    const draft = drafts[bookingId] ?? defaultDraft;

    if (!draft.rejectionNote.trim()) {
      toast.error("Rejection note is required.");
      return;
    }

    try {
      setActionLoadingId(bookingId);
      setError(null);
      await rejectVendorBooking(listingType, bookingId, draft.rejectionNote.trim());
      toast.success("Booking rejected successfully.");
      await loadBookings();
    } catch (actionError: any) {
      const message = actionError?.message || "Failed to reject booking.";
      setError(message);
      toast.error(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return <DashboardLoadingBlock label="Loading bookings…" />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#ebe2d3] bg-[#fcfaf6] p-4">
        <h2 className="text-lg font-semibold text-[#1c1c1c]">Manage Your Bookings</h2>
        <p className="mt-1 text-sm text-gray-600">
          Review incoming bookings, request payment, approve confirmed appointments, or reject unavailable slots.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!error && bookings.length === 0 && (
        <DashboardEmptyState
          title="No bookings yet"
          description="Incoming customer bookings will appear here for review and approval."
        />
      )}

      {bookings.map((booking) => {
        const actionDraft = drafts[booking._id] ?? {
          paymentLink: booking.paymentLink || "",
          paymentNote: booking.vendorDecisionNote || "",
          decisionNote: booking.vendorDecisionNote || "",
          rejectionNote: "",
        };
        const selectedServices =
          booking.services && booking.services.length > 0
            ? booking.services
            : booking.serviceItems || [];
        const canMutate =
          booking.status === "pending_vendor_action" ||
          booking.status === "payment_requested";

        return (
          <div
            key={booking._id}
            className="rounded-2xl border border-[#ebe2d3] bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[#1c1c1c]">
                  {booking.serviceTitle?.trim() || `${listingType === "food" ? "Food" : "Service"} Booking`}
                </h3>
                <p className="text-sm text-gray-600">
                  Customer: {booking.customerInfo?.name || booking.customerId?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {booking.customerInfo?.email || booking.customerId?.email || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {booking.customerInfo?.phone || "N/A"}
                </p>
              </div>

              <div className="space-y-1 text-sm text-gray-600 md:text-right">
                <p>
                  Status:{" "}
                  <span className="font-medium text-[#1c1c1c]">
                    {formatBookingStatus(booking.status)}
                  </span>
                </p>
                <p>
                  Payment:{" "}
                  <span className="font-medium text-[#1c1c1c]">
                    {formatBookingStatus(booking.paymentStatus)}
                  </span>
                </p>
                <p>
                  Date:{" "}
                  {booking.date ? new Date(booking.date).toLocaleDateString() : "N/A"}
                </p>
                <p>Time: {booking.slot || booking.time || "N/A"}</p>
                <p>Created: {new Date(booking.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="grid gap-5 py-4 lg:grid-cols-[1.1fr_1fr]">
              <div className="space-y-4">
                <div className="rounded-xl border border-gray-100 bg-[#fcfaf6] p-4">
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Booking Details
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      Booking ID: <span className="font-medium text-[#1c1c1c]">{booking._id}</span>
                    </p>
                    <p>
                      Type:{" "}
                      <span className="font-medium capitalize text-[#1c1c1c]">
                        {booking.bookingType || listingType}
                      </span>
                    </p>
                    <p>
                      Items:{" "}
                      <span className="font-medium text-[#1c1c1c]">
                        {selectedServices.length > 0 ? selectedServices.join(", ") : "N/A"}
                      </span>
                    </p>
                    <p>
                      Vendor note:{" "}
                      <span className="font-medium text-[#1c1c1c]">
                        {booking.vendorDecisionNote || "N/A"}
                      </span>
                    </p>
                    {booking.paymentLink ? (
                      <p>
                        Payment link:{" "}
                        <a
                          href={booking.paymentLink}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-[#1A1F71] underline break-all"
                        >
                          {booking.paymentLink}
                        </a>
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-gray-100 bg-[#fcfaf6] p-4">
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Payment Request
                  </h4>

                  <div className="space-y-3">
                    <input
                      type="url"
                      value={actionDraft.paymentLink}
                      onChange={(event) =>
                        updateDraft(booking._id, "paymentLink", event.target.value)
                      }
                      placeholder="https://your-payment-link.com/pay/abc123"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#c9a44a]"
                    />

                    <textarea
                      value={actionDraft.paymentNote}
                      onChange={(event) =>
                        updateDraft(booking._id, "paymentNote", event.target.value)
                      }
                      placeholder="Please pay to confirm your appointment."
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#c9a44a]"
                    />

                    <button
                      type="button"
                      onClick={() => handleRequestPayment(booking._id)}
                      disabled={!canMutate || actionLoadingId === booking._id}
                      className="rounded-xl bg-[#c9a44a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b18d35] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {actionLoadingId === booking._id ? "Processing..." : "Send Payment Link"}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-[#fcfaf6] p-4">
                  {/* <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Vendor Decision
                  </h4> */}

                  <div className="space-y-3">
                    {/* <textarea
                      value={actionDraft.decisionNote}
                      onChange={(event) =>
                        updateDraft(booking._id, "decisionNote", event.target.value)
                      }
                      placeholder="Approved. See you soon."
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#c9a44a]"
                    /> */}

                    <button
                      type="button"
                      onClick={() => handleApprove(booking._id)}
                      disabled={!canMutate || actionLoadingId === booking._id}
                      className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {actionLoadingId === booking._id ? "Processing..." : "Approve Booking"}
                    </button>

                    <textarea
                      value={actionDraft.rejectionNote}
                      onChange={(event) =>
                        updateDraft(booking._id, "rejectionNote", event.target.value)
                      }
                      placeholder="Sorry, no availability for this slot."
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#c9a44a]"
                    />

                    <button
                      type="button"
                      onClick={() => handleReject(booking._id)}
                      disabled={!canMutate || actionLoadingId === booking._id}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {actionLoadingId === booking._id ? "Processing..." : "Reject Booking"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
