"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Order } from "@/types/order";
import Link from "next/link";
import CustomerAccountShell from "../components/CustomerAccountShell";
import AccountStatusBadge, {
  getOrderStatusVariant,
} from "../components/AccountStatusBadge";
import AccountEmptyState from "@/components/ui/account-empty-state";
import AccountLoadingBlock from "@/components/ui/account-loading-block";
import ConfirmDialog from "@/app/(home)/partners/products/components/ConfirmDialog";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filters, setFilters] = useState({ status: "", time: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/user`,
        {
          params: { status: filters.status, search: searchQuery },
          withCredentials: true,
        }
      );

      setOrders(response.data.orders);
    } catch {
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters, searchQuery]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    type: string
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: e.target.value,
    }));
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}/cancel`,
        {},
        { withCredentials: true }
      );
      toast.success("Order cancelled successfully.");
      fetchOrders();
    } catch {
      toast.error("Failed to cancel order.");
    } finally {
      setCancelTarget(null);
    }
  };

  return (
    <CustomerAccountShell title="My Orders">
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="account-filter-panel lg:w-1/4">
          <h2 className="mb-4 font-poppins text-lg font-semibold text-brand-navy">
            Filters
          </h2>
          <FormField label="Order Status" htmlFor="order-status-filter" surface="auth">
            <Select
              id="order-status-filter"
              surface="auth"
              value={filters.status}
              onChange={(e) => handleFilterChange(e, "status")}
            >
              <option value="">All statuses</option>
              <option value="ordered">Ordered</option>
              <option value="accepted">Accepted</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </FormField>
          <FormField label="Order Time" htmlFor="order-time-filter" surface="auth">
            <Select
              id="order-time-filter"
              surface="auth"
              value={filters.time}
              onChange={(e) => handleFilterChange(e, "time")}
            >
              <option value="">Any time</option>
              <option value="last30">Last 30 days</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="older">Older</option>
            </Select>
          </FormField>
        </aside>

        <div className="lg:w-3/4">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
            <FormField
              label="Search orders"
              htmlFor="order-search"
              surface="auth"
              className="mb-0 flex-1"
            >
              <Input
                id="order-search"
                type="text"
                placeholder="Search by product or order details"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                surface="auth"
              />
            </FormField>
            <Button
              type="button"
              onClick={fetchOrders}
              size="sm"
              className="min-h-11 w-full sm:w-auto"
            >
              Search
            </Button>
          </div>

          {loading ? (
            <AccountLoadingBlock label="Loading your orders…" />
          ) : orders.length === 0 ? (
            <AccountEmptyState
              title="No orders yet"
              description="When you purchase products, your orders will appear here."
              ctaLabel="Browse products"
              ctaHref="/products"
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <article key={order._id} className="account-card">
                  {order.items.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="mb-3 flex items-center justify-between last:mb-0"
                    >
                      <Link
                        href={`/product/${item.productId._id}`}
                        className="flex min-h-11 items-center gap-4 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                      >
                        {item.productId?.coverImage ? (
                          <img
                            src={item.productId.coverImage}
                            alt={item.productId.title || "Product"}
                            className="h-16 w-16 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-brand-cream font-montserrat text-xs text-brand-muted">
                            No image
                          </div>
                        )}
                        <div>
                          <h3 className="font-poppins text-base font-semibold text-brand-navy">
                            {item.productId?.title || "Product"}
                          </h3>
                          {item.variantId?.color ? (
                            <p className="commerce-text-meta">
                              Color: {item.variantId.color}
                            </p>
                          ) : null}
                          <p className="font-poppins text-sm font-medium text-brand-navy">
                            ${item.price}
                          </p>
                          <p className="commerce-text-meta">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}

                  <div className="mt-4 flex flex-col gap-3 border-t border-border-warm pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <AccountStatusBadge
                        label={order.status}
                        variant={getOrderStatusVariant(order.status)}
                      />
                      <span className="commerce-text-meta">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {order.status === "shipped" &&
                        order.trackingInfo?.trackingUrl && (
                          <a
                            href={order.trackingInfo.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-11 inline-flex items-center font-montserrat text-sm font-medium text-brand-teal hover:text-brand-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                          >
                            Track order
                          </a>
                        )}

                      {order.status === "delivered" && (
                        <button
                          type="button"
                          className="min-h-11 font-montserrat text-sm font-medium text-brand-teal hover:text-brand-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                        >
                          Rate &amp; review
                        </button>
                      )}

                      {(order.status === "ordered" ||
                        order.status === "accepted") && (
                        <button
                          type="button"
                          onClick={() => setCancelTarget(order._id)}
                          className="min-h-11 font-montserrat text-sm font-medium text-red-600 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                        >
                          Cancel order
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={cancelTarget !== null}
        title="Cancel order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Cancel order"
        cancelText="Keep order"
        onConfirm={() => cancelTarget && handleCancelOrder(cancelTarget)}
        onCancel={() => setCancelTarget(null)}
      />
    </CustomerAccountShell>
  );
};

export default OrderPage;
