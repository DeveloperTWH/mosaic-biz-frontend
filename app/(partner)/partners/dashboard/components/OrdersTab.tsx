"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLoadingBlock from "@/components/ui/dashboard-loading-block";
import DashboardEmptyState from "@/components/ui/dashboard-empty-state";

interface OrdersTabProps {
  businessId?: string;
  isActive: boolean;
}

interface OrderItem {
  productId?: {
    _id?: string;
    title?: string;
    coverImage?: string;
  };
  color?: string;
  size?: string;
  sku?: string;
  quantity?: number;
  price?: number;
}

interface OrderStatusHistory {
  _id: string;
  status: string;
  updatedAt: string;
}

interface DashboardOrder {
  _id: string;
  groupOrderId?: string;
  totalAmount: number;
  currency?: string;
  status: string;
  paymentStatus?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt?: string;
  vendorNote?: string;
  userNote?: string;
  items: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  trackingInfo?: {
    trackingId?: string;
    trackingUrl?: string;
  };
}

interface TrackingDraft {
  trackingId: string;
  trackingUrl: string;
  vendorNote: string;
}

const defaultTrackingDraft: TrackingDraft = {
  trackingId: "",
  trackingUrl: "",
  vendorNote: "",
};

export default function OrdersTab({ businessId, isActive }: OrdersTabProps) {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [trackingDrafts, setTrackingDrafts] = useState<Record<string, TrackingDraft>>({});

  const fetchOrders = async () => {
    if (!businessId) {
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/vendor`,
        {
          withCredentials: true,
          params: {
            businessId,
            status: statusFilter || undefined,
          },
        }
      );

      setOrders(Array.isArray(response.data?.orders) ? response.data.orders : []);
    } catch (fetchError: any) {
      console.error("Error fetching orders:", fetchError);
      setError(fetchError?.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isActive) {
      return;
    }

    fetchOrders();
  }, [businessId, isActive, statusFilter]);

  const updateTrackingDraft = (
    orderId: string,
    field: keyof TrackingDraft,
    value: string
  ) => {
    setTrackingDrafts((prev) => ({
      ...prev,
      [orderId]: {
        ...defaultTrackingDraft,
        ...prev[orderId],
        [field]: value,
      },
    }));
  };

  const handleOrderAction = async (
    orderId: string,
    action: "accept" | "ship" | "deliver" | "return"
  ) => {
    if (!businessId) {
      return;
    }

    const trackingDraft = trackingDrafts[orderId] ?? defaultTrackingDraft;

    if (
      action === "ship" &&
      (!trackingDraft.trackingId.trim() ||
        !trackingDraft.trackingUrl.trim() ||
        !trackingDraft.vendorNote.trim())
    ) {
      setError("Tracking ID, tracking URL, and vendor note are required to ship an order.");
      return;
    }

    try {
      setActionLoadingId(orderId);
      setError(null);

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${action}/${orderId}`,
        action === "ship"
          ? {
              trackingId: trackingDraft.trackingId.trim(),
              trackingUrl: trackingDraft.trackingUrl.trim(),
              vendorNote: trackingDraft.vendorNote.trim(),
            }
          : {},
        { withCredentials: true }
      );

      if (action === "ship") {
        setTrackingDrafts((prev) => ({
          ...prev,
          [orderId]: defaultTrackingDraft,
        }));
      }

      await fetchOrders();
    } catch (actionError: any) {
      console.error(`Error running ${action} on order:`, actionError);
      setError(
        actionError?.response?.data?.message || `Failed to ${action} order.`
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return <DashboardLoadingBlock label="Loading orders…" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-[#ebe2d3] bg-[#fcfaf6] p-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#1c1c1c]">Manage Your Orders</h2>
        </div>

        <div className="w-full md:w-[220px]">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Filter by status
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#c9a44a]"
          >
            <option value="">All Orders</option>
            <option value="ordered">Ordered</option>
            <option value="accepted">Accepted</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!error && orders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#d9d0c2] bg-[#fcfaf6] p-8 text-center">
          <h2 className="text-xl font-semibold text-[#1c1c1c]">No orders yet</h2>
          <p className="mt-3 text-sm text-gray-600">
            When customers purchase from your store, orders will appear here for fulfillment and tracking updates.
          </p>
        </div>
      )}

      {orders.map((order) => {
        const trackingDraft = trackingDrafts[order._id] ?? {
          trackingId: order.trackingInfo?.trackingId || "",
          trackingUrl: order.trackingInfo?.trackingUrl || "",
          vendorNote: order.vendorNote || "",
        };

        return (
          <div
            key={order._id}
            className="rounded-2xl border border-[#ebe2d3] bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[#1c1c1c]">
                  Order #{order._id.slice(-8)}
                </h3>
                <p className="text-sm text-gray-600">
                  Customer: {order.shippingAddress?.fullName || order.userId?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {order.userId?.email || "N/A"}
                </p>
                {/* <p className="text-sm text-gray-600">
                  Group Order ID: {order.groupOrderId || "N/A"}
                </p> */}
              </div>

              <div className="space-y-1 text-sm text-gray-600 md:text-right">
                <p>Status: <span className="font-medium capitalize text-[#1c1c1c]">{order.status}</span></p>
                <p>Payment: <span className="font-medium capitalize text-[#1c1c1c]">{order.paymentStatus || "N/A"}</span></p>
                <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
                <p className="text-base font-semibold text-[#1c1c1c]">
                  {order.currency || "USD"} {order.totalAmount}
                </p>
              </div>
            </div>

            <div className="grid gap-5 py-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Items
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className="rounded-xl border border-gray-100 bg-[#fcfaf6] p-3"
                      >
                        <p className="font-medium text-[#1c1c1c]">
                          {item.productId?.title || "Untitled Product"}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Qty: {item.quantity || 0} | Price: {item.price || 0} | SKU: {item.sku || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Color: {item.color || "default"} | Size: {item.size || "default"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Shipping Address
                  </h4>
                  <div className="rounded-xl border border-gray-100 bg-[#fcfaf6] p-3 text-sm text-gray-600">
                    <p>{order.shippingAddress?.fullName || "N/A"}</p>
                    <p>{order.shippingAddress?.phone || "N/A"}</p>
                    <p>{order.shippingAddress?.addressLine1 || "N/A"}</p>
                    {order.shippingAddress?.addressLine2 && (
                      <p>{order.shippingAddress.addressLine2}</p>
                    )}
                    <p>
                      {order.shippingAddress?.city || "N/A"}, {order.shippingAddress?.state || "N/A"}
                    </p>
                    <p>{order.shippingAddress?.country || "N/A"}</p>
                  </div>
                </div>

                {order.statusHistory && order.statusHistory.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Status History
                    </h4>
                    <div className="rounded-xl border border-gray-100 bg-[#fcfaf6] p-3">
                      <div className="flex flex-wrap gap-2">
                        {order.statusHistory.map((history) => (
                          <span
                            key={history._id}
                            className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-gray-700"
                          >
                            {history.status} - {new Date(history.updatedAt).toLocaleString()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-gray-100 bg-[#fcfaf6] p-4">
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Tracking Details
                  </h4>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={trackingDraft.trackingId}
                      onChange={(event) =>
                        updateTrackingDraft(order._id, "trackingId", event.target.value)
                      }
                      placeholder="Tracking ID"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#c9a44a]"
                    />

                    <input
                      type="url"
                      value={trackingDraft.trackingUrl}
                      onChange={(event) =>
                        updateTrackingDraft(order._id, "trackingUrl", event.target.value)
                      }
                      placeholder="Tracking URL"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#c9a44a]"
                    />

                    <textarea
                      value={trackingDraft.vendorNote}
                      onChange={(event) =>
                        updateTrackingDraft(order._id, "vendorNote", event.target.value)
                      }
                      placeholder="Vendor note"
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#c9a44a]"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-[#fcfaf6] p-4">
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {order.status === "ordered" && (
                      <button
                        type="button"
                        onClick={() => handleOrderAction(order._id, "accept")}
                        disabled={actionLoadingId === order._id}
                        className="rounded-xl bg-[#c9a44a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b18d35] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Accept
                      </button>
                    )}

                    {order.status === "accepted" && (
                      <button
                        type="button"
                        onClick={() => handleOrderAction(order._id, "ship")}
                        disabled={actionLoadingId === order._id}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Mark as Shipped
                      </button>
                    )}

                    {order.status === "shipped" && (
                      <button
                        type="button"
                        onClick={() => handleOrderAction(order._id, "deliver")}
                        disabled={actionLoadingId === order._id}
                        className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Mark as Delivered
                      </button>
                    )}

                    {order.status === "returned" && (
                      <button
                        type="button"
                        onClick={() => handleOrderAction(order._id, "return")}
                        disabled={actionLoadingId === order._id}
                        className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Accept Return
                      </button>
                    )}
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
