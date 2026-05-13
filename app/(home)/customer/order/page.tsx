'use client'; // Add this at the top to make this a Client Component

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Order } from '@/types/order'

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filters, setFilters] = useState({ status: "", time: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch orders from the backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/user`, {
        params: { status: filters.status, search: searchQuery },
        withCredentials: true, // Ensure cookies are sent with the request if needed (for authentication)
      });

      setOrders(response.data.orders);
    } catch (error) {
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters, searchQuery]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>, type: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: e.target.value,
    }));
  };


  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}/cancel`,
        {},
        { withCredentials: true }
      );
      toast.success("Order cancelled successfully.");
      fetchOrders(); // refresh the list
    } catch (error) {
      toast.error("Failed to cancel order.");
    }
  };


  return (
    <div className="bg-[#ebeae2]">
      <div className="container px-4 pt-5 pb-5 mx-auto">
        <div className="flex flex-col gap-6 mb-8 lg:flex-row">

          {/* Filters (Right Side) */}
          <div className="border rounded-lg lg:w-1/4">
            <div className="p-4 bg-gray-50">
              <h3 className="mb-4 text-xl font-semibold">Filters</h3>
              <div className="mb-4">
                <label className="block text-gray-700">Order Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange(e, "status")}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Status</option>
                  <option value="ordered">Ordered</option>
                  <option value="accepted">Accepted</option>
                  {/* <option value="rejected">Rejected</option> */}
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  {/* <option value="returned">Returned</option>
                  <option value="refunded">Refunded</option> */}
                </select>
              </div>

              <div>
                <label className="block text-gray-700">Order Time</label>
                <select
                  value={filters.time}
                  onChange={(e) => handleFilterChange(e, "time")}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Time</option>
                  <option value="last30">Last 30 days</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="older">Older</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List (Left Side) */}
          <div className="lg:w-3/4">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  placeholder="Search Orders"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-3/4 p-2 border rounded"
                />
                <button
                  onClick={fetchOrders}
                  className="px-4 py-2 ml-4 text-white bg-blue-500 rounded-lg"
                >
                  Search Orders
                </button>
              </div>

              {/* Loading Indicator */}
              {loading && <div className="py-6 text-center">Loading...</div>}

              {/* Orders List */}
              {!loading && orders.length === 0 && (
                <div className="py-6 text-center">No orders found.</div>
              )}

              {orders.map((order) => (
                <div
                  key={order._id}
                  className="p-4 mb-4 bg-white border rounded-lg shadow-md"
                >
                  {/* Loop through each item in the order */}
                  {order.items.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="flex items-center justify-between mb-3 last:mb-0"
                    >
                      <div className="flex items-center">
                        {/* Product Image */}
                        {item.productId?.coverImage && (
                          <img
                            src={item.productId.coverImage}
                            alt={item.productId.title}
                            className="object-cover w-16 h-16 mr-4 rounded-md"
                          />
                        )}
                        <div>
                          <h4 className="text-lg font-semibold">{item.productId?.title}</h4>
                          <p className="text-sm text-gray-500">
                            Color: {item.variantId?.color}
                          </p>
                          <p className="text-gray-700">${item.price}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Order Meta (status, date, etc.) */}
                  <div className="flex flex-col items-end mt-2">
                    <p
                      className={`text-base capitalize ${order.status === "delivered" || order.status === "refunded"
                        ? "text-green-600"
                        : order.status === "created"
                          ? "text-blue-600"
                          : order.status === "ordered"
                            ? "text-yellow-600"
                            : order.status === "accepted"
                              ? "text-indigo-600"
                              : order.status === "rejected"
                                ? "text-red-600"
                                : order.status === "shipped"
                                  ? "text-orange-600"
                                  : order.status === "cancelled"
                                    ? "text-gray-600"
                                    : order.status === "returned"
                                      ? "text-purple-600"
                                      : "text-gray-500"
                        }`}
                    >
                      {order.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Tracking / Review / Cancel */}
                  <div className="flex items-center justify-between w-full mt-2">
                    <div className="flex gap-4">
                      {order.status === "shipped" && order.trackingInfo?.trackingUrl && (
                        <a
                          href={order.trackingInfo.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Track Order
                        </a>
                      )}

                      {order.status === "delivered" && (
                        <button className="text-sm text-blue-500 hover:underline">
                          Rate & Review Product
                        </button>
                      )}

                      {/* {(order.status === "ordered" || order.status === "accepted") && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Cancel Order
                        </button>
                      )} */}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="text-blue-500 hover:underline">Load More Items</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderPage;
