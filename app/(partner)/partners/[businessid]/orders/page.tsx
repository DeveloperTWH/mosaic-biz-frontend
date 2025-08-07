'use client';

import { useBusinessStore } from '@/app/store/businessStore';
import { fetchBusinessBySlug } from '../utils/fetchBusiness';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import axios from 'axios';
import Image from 'next/image';
import { toast } from 'react-toastify';
import LoadingPage from '../components/LoadingPage';
import NotFoundPage from '../components/NotFoundPage';

interface VariantSize {
    size: string;
    stock: number;
    price: number;
    salePrice?: number;
}

interface OrderItem {
    productId: { title: string; coverImage?: string };
    variantId: { color: string; sizes: VariantSize[] };
    quantity: number;
    size: string;
    price: number;
}

interface Order {
    _id: string;
    userId: {
        name: string;
        email: string;
    };
    vendorId: string;
    items: Array<{
        productId: {
            title: string;
            coverImage: string;
        };
        variantId: {
            color: string;
        };
        size: string;
        quantity: number;
        price: number;
        sku: string;
    }>;
    totalAmount: number;
    currency: string;
    status: string;
    paymentStatus: "pending" | "paid" | "failed" | "refunded"; // ✅ Fix 1
    shippingAddress: { // ✅ Fix 2
        fullName: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
    createdAt: string;
}


const page = () => {
    const { businessid } = useParams();
    const { business, setBusiness, clearBusiness } = useBusinessStore();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [statusFilter, setStatusFilter] = useState('');

    const router = useRouter();

    // ✅ Load Business
    useEffect(() => {
        if (!businessid) return;

        const loadBusiness = async () => {
            try {
                if (business && business.slug === businessid) return;
                if (business && business.slug !== businessid) clearBusiness();

                const fetchedBusiness = await fetchBusinessBySlug(businessid as string);
                setBusiness(fetchedBusiness);
            } catch (error) {
                console.error("Error loading business:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadBusiness();
    }, [businessid]);

    // ✅ Load Orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (!business?._id) return;

            if (business?.listingType !== "product") {
                toast.error("Not Authorized to be in the page")
                router.push("/partners")
                return;
            }

            setIsLoading(true); // ✅ start loading
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/vendor?businessId=${business._id}&status=${statusFilter}`,
                    { withCredentials: true }
                );
                setOrders(res.data.orders || []);
            } catch (err) {
                toast.error("Failed to fetch orders");
            } finally {
                setIsLoading(false); // ✅ stop loading
            }
        };

        fetchOrders();
    }, [business?._id, statusFilter]);

    const handleAction = async (orderId: string, action: 'accept' | 'reject') => {
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${action}/${orderId}`,
                {},
                { withCredentials: true }
            );
            toast.success(`Order ${action}ed`);
            // Refresh orders
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/vendor?businessId=${business?._id}&status=${statusFilter}`,
                { withCredentials: true }
            );
            setOrders(res.data.orders || []);
        } catch {
            toast.error(`Failed to ${action} order`);
        }
    };

    return (
        <div className="flex h-screen bg-[#EBEAE2]">
            <Sidebar businessName={business?.businessName} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 p-2 space-y-6 overflow-y-auto lg:p-6">
                    {isLoading && <LoadingPage />}
                    {error && <NotFoundPage />}

                    {/* ✅ Order Filter */}
                    <div className="mb-4">
                        <label className="mr-2 text-sm font-semibold">Filter by Status:</label>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="px-3 py-1 border rounded"
                        >
                            <option value="">All</option>
                            <option value="ordered">Ordered</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="returned">Returned</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>

                    {/* ✅ Order List */}
                    {orders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        orders.map(order => (
                            <div
                                key={order._id}
                                className="p-6 mb-8 bg-white border border-gray-300 rounded-lg shadow print:border-black print:shadow-none"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">Order Receipt</h2>
                                        <p className="font-mono text-sm text-gray-500">Order ID: {order._id}</p>
                                        <p className="text-sm text-gray-500">
                                            Status: <span className="font-semibold text-blue-700">{order.status}</span>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Payment Status: <span className="font-medium text-green-700">{order.paymentStatus}</span>
                                        </p>
                                    </div>
                                    <div className="text-sm text-right text-gray-600">
                                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Buyer & Shipping Info */}
                                <div className="grid grid-cols-1 gap-6 mb-4 md:grid-cols-2">
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-800">Buyer Info</h3>
                                        <p className="text-sm text-gray-700">{order.userId.name}</p>
                                        <p className="text-sm text-gray-700">{order.userId.email}</p>
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-800">Shipping Address</h3>
                                        <p className="text-sm text-gray-700">{order.shippingAddress.fullName}</p>
                                        <p className="text-sm text-gray-700">{order.shippingAddress.phone}</p>
                                        <p className="text-sm text-gray-700">{order.shippingAddress.addressLine1}</p>
                                        {order.shippingAddress.addressLine2 && (
                                            <p className="text-sm text-gray-700">{order.shippingAddress.addressLine2}</p>
                                        )}
                                        <p className="text-sm text-gray-700">
                                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                        </p>
                                        <p className="text-sm text-gray-700">{order.shippingAddress.country}</p>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="mb-4 overflow-hidden border rounded-md">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-start gap-4 px-4 py-3 border-b last:border-none">
                                            {item.productId.coverImage && (
                                                <div className="w-20 h-20 overflow-hidden border rounded">
                                                    <Image
                                                        src={item.productId.coverImage}
                                                        alt={item.productId.title}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-auto h-full"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex flex-col text-sm text-gray-800">
                                                <p className="font-semibold">{item.productId.title}</p>
                                                <p>Color: {item.variantId.color}</p>
                                                <p>SKU: {item.sku}</p>
                                                <p>Size: {item.size}</p>
                                                <p>Qty: {item.quantity}</p>
                                                <p className="font-medium text-gray-900">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Total & Action Buttons */}
                                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                    <span className="text-lg font-bold text-gray-900">
                                        Total: ₹{order.totalAmount.toFixed(2)}
                                    </span>

                                    {order.status === 'ordered' && (
                                        <div className="flex space-x-3">
                                            <button
                                                className="px-5 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                                                onClick={() => handleAction(order._id, 'accept')}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="px-5 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                                                onClick={() => handleAction(order._id, 'reject')}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </main>
            </div>
        </div>
    );
};

export default page;
