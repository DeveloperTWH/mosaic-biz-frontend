"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  CreditCard,
  CheckCircle2,
  Clock3,
  XCircle,
  RotateCcw,
  Package,
  PackageCheck,
  Truck,
  BadgeCheck,
  Ban,
  Undo2,
} from "lucide-react";

type Order = {
  _id: string;
  groupOrderId: string;
  userId?: { _id: string; name: string; email: string } | string;
  vendorId?: { _id: string; name: string; email: string } | string;
  businessId?: { _id: string; businessName: string; slug: string } | string;
  totalAmount: number; // major units (USD)
  currency: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  status:
    | "created"
    | "ordered"
    | "accepted"
    | "rejected"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned"
    | "refunded";
  createdAt: string;
};

type PaymentSummary = {
  pending: number;
  paid: number;
  failed: number;
  refunded: number;
};

type StatusSummary = {
  created: number;
  ordered: number;
  accepted: number;
  rejected: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  returned: number;
  refunded: number;
};

const LIMIT = 20;

export default function OrdersPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary>({
    pending: 0,
    paid: 0,
    failed: 0,
    refunded: 0,
  });

  const [statusSummary, setStatusSummary] = useState<StatusSummary>({
    created: 0,
    ordered: 0,
    accepted: 0,
    rejected: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0,
    refunded: 0,
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/admin`,
        {
          withCredentials: true,
          params: { page, limit: LIMIT },
        }
      );

      const { data, pagination, summary } = res.data || {};
      setOrders(data || []);
      setTotal(pagination?.total || 0);
      setTotalPages(pagination?.totalPages || 1);

      if (summary?.payment) setPaymentSummary(summary.payment);
      if (summary?.status) setStatusSummary(summary.status);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const formatAmount = (n: number, ccy = "USD") =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: ccy,
      maximumFractionDigits: 2,
    }).format(n);

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString() : "-";

  const PaymentCard = ({
    title,
    value,
    icon,
    tone,
  }: {
    title: string;
    value: number;
    icon: ReactNode;
    tone: "blue" | "green" | "amber" | "red";
  }) => {
    const toneMap: Record<
      typeof tone,
      { bg: string; text: string; ring: string }
    > = {
      blue: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-100" },
      green: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        ring: "ring-emerald-100",
      },
      amber: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        ring: "ring-amber-100",
      },
      red: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-100" },
    };
    const t = toneMap[tone];
    return (
      <div
        className={`flex items-center justify-between p-5 bg-white rounded-xl shadow-sm ring-1 ${t.ring}`}
      >
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${t.bg}`}>
          <div className={t.text}>{icon}</div>
        </div>
      </div>
    );
  };

  const statusChips = useMemo(
    () => [
      { key: "created", label: "Created", count: statusSummary.created, icon: <Package className="w-4 h-4" /> },
      { key: "ordered", label: "Ordered", count: statusSummary.ordered, icon: <PackageCheck className="w-4 h-4" /> },
      { key: "accepted", label: "Accepted", count: statusSummary.accepted, icon: <CheckCircle2 className="w-4 h-4" /> },
      { key: "rejected", label: "Rejected", count: statusSummary.rejected, icon: <XCircle className="w-4 h-4" /> },
      { key: "shipped", label: "Shipped", count: statusSummary.shipped, icon: <Truck className="w-4 h-4" /> },
      { key: "delivered", label: "Delivered", count: statusSummary.delivered, icon: <BadgeCheck className="w-4 h-4" /> },
      { key: "cancelled", label: "Cancelled", count: statusSummary.cancelled, icon: <Ban className="w-4 h-4" /> },
      { key: "returned", label: "Returned", count: statusSummary.returned, icon: <Undo2 className="w-4 h-4" /> },
      { key: "refunded", label: "Refunded", count: statusSummary.refunded, icon: <RotateCcw className="w-4 h-4" /> },
    ],
    [statusSummary]
  );

  const Pagination = () => (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-sm text-gray-600">
        Showing page <b>{page}</b> of <b>{totalPages}</b> • Total <b>{total}</b> orders
      </p>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 text-sm bg-white border rounded-md disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Prev
        </button>
        <button
          className="px-3 py-1 text-sm bg-white border rounded-md disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar setIsSidebarOpen={setSidebarOpen} />

        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {/* Payment summary cards */}
          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
            <PaymentCard
              title="Paid"
              value={paymentSummary.paid}
              tone="green"
              icon={<CheckCircle2 className="w-6 h-6" />}
            />
            <PaymentCard
              title="Pending"
              value={paymentSummary.pending}
              tone="amber"
              icon={<Clock3 className="w-6 h-6" />}
            />
            <PaymentCard
              title="Failed"
              value={paymentSummary.failed}
              tone="red"
              icon={<XCircle className="w-6 h-6" />}
            />
            <PaymentCard
              title="Refunded"
              value={paymentSummary.refunded}
              tone="blue"
              icon={<RotateCcw className="w-6 h-6" />}
            />
          </div>

          {/* Status distribution */}
          <div className="p-5 mb-6 bg-white rounded-xl shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-4 text-lg font-semibold">Order Status</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
              {statusChips.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border"
                  title={s.label}
                >
                  <div className="flex items-center gap-2 text-gray-700">
                    {s.icon}
                    <span className="text-sm">{s.label}</span>
                  </div>
                  <span className="text-sm font-semibold">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Orders table */}
          <div className="overflow-hidden bg-white rounded-xl shadow-sm ring-1 ring-gray-100">
            <div className="px-5 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold">All Orders</h2>
            </div>

            {loading ? (
              <div className="p-6 text-sm text-gray-500">Loading orders…</div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">No orders found.</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-gray-600">
                        <th className="px-5 py-3 font-medium">Order ID</th>
                        <th className="px-5 py-3 font-medium">Group</th>
                        <th className="px-5 py-3 font-medium">Business</th>
                        <th className="px-5 py-3 font-medium">Vendor</th>
                        <th className="px-5 py-3 font-medium">Customer</th>
                        <th className="px-5 py-3 font-medium">Amount</th>
                        <th className="px-5 py-3 font-medium">Payment</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orders.map((o) => {
                        const businessName =
                          typeof o.businessId === "object"
                            ? (o.businessId as any).businessName
                            : String(o.businessId);
                        const vendorName =
                          typeof o.vendorId === "object"
                            ? (o.vendorId as any).name
                            : String(o.vendorId);
                        const userName =
                          typeof o.userId === "object"
                            ? (o.userId as any).name
                            : String(o.userId);

                        return (
                          <tr key={o._id} className="hover:bg-gray-50/60">
                            <td className="px-5 py-3 font-medium text-gray-900">
                              {o._id}
                            </td>
                            <td className="px-5 py-3">{o.groupOrderId}</td>
                            <td className="px-5 py-3">{businessName}</td>
                            <td className="px-5 py-3">{vendorName}</td>
                            <td className="px-5 py-3">{userName}</td>
                            <td className="px-5 py-3">
                              {formatAmount(o.totalAmount, o.currency)}
                            </td>
                            <td className="px-5 py-3">
                              <span
                                className={`px-2 py-1 rounded-md text-xs font-medium ${
                                  o.paymentStatus === "paid"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : o.paymentStatus === "pending"
                                    ? "bg-amber-100 text-amber-700"
                                    : o.paymentStatus === "failed"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {o.paymentStatus}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-md">
                                {o.status}
                              </span>
                            </td>
                            <td className="px-5 py-3">{formatDate(o.createdAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <Pagination />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
