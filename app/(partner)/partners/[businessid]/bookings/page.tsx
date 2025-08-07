'use client';

import { useBusinessStore } from '@/app/store/businessStore';
import { fetchBusinessBySlug } from '../utils/fetchBusiness';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingPage from '../components/LoadingPage';
import NotFoundPage from '../components/NotFoundPage';

interface Booking {
  _id: string;
  customerId: {
    name: string;
    email: string;
  };
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  serviceTitle: string;
  serviceItems: string[];
  date: string;
  time: string;
  amountPaid: number;
  status: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
}

const BookingsPage = () => {
  const { businessid } = useParams();
  const { business, setBusiness, clearBusiness } = useBusinessStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
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
        console.error('Error loading business:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusiness();
  }, [businessid]);

  // ✅ Load Bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!business?._id) return;

      if (business?.listingType !== 'service') {
        toast.error('Not Authorized to be on this page');
        router.push('/partners');
        return;
      }

      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings/vendor?businessId=${business._id}&status=${statusFilter}`,
          { withCredentials: true }
        );
        setBookings(res.data.bookings || []);
      } catch (err) {
        toast.error('Failed to fetch bookings');
        setError('Failed to fetch bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [business?._id, statusFilter]);

  const handleAction = async (bookingId: string, action: 'confirm' | 'complete' | 'cancel') => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings/${action}/${bookingId}`,
        {},
        { withCredentials: true }
      );
      toast.success(`Booking ${action}ed`);
      // Refresh bookings
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings/vendor?businessId=${business?._id}&status=${statusFilter}`,
        { withCredentials: true }
      );
      setBookings(res.data.bookings || []);
    } catch {
      toast.error(`Failed to ${action} booking`);
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

          {/* ✅ Filter */}
          <div className="mb-4">
            <label className="mr-2 text-sm font-semibold">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1 border rounded"
            >
              <option value="">All</option>
              <option value="Booked">Booked</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* ✅ Booking List */}
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            bookings.map(booking => (
              <div
                key={booking._id}
                className="p-6 mb-6 bg-white border border-gray-300 rounded-lg shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Booking</h2>
                    <p className="font-mono text-sm text-gray-500">Booking ID: {booking._id}</p>
                    <p className="text-sm text-gray-500">
                      Status: <span className="font-semibold text-blue-700">{booking.status}</span>
                    </p>
                  </div>
                  <div className="text-sm text-right text-gray-600">
                    <p><strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                  <h3 className="mb-1 font-semibold text-gray-800">Customer Info</h3>
                  <p className="text-sm text-gray-700">Name: {booking.customerInfo.name}</p>
                  <p className="text-sm text-gray-700">Email: {booking.customerInfo.email}</p>
                  <p className="text-sm text-gray-700">Phone: {booking.customerInfo.phone}</p>
                </div>

                {/* Booking Details */}
                <div className="mb-4">
                  <h3 className="mb-1 font-semibold text-gray-800">Service Info</h3>
                  <p className="text-sm font-medium text-gray-800">{booking.serviceTitle}</p>
                  <p className="text-sm text-gray-700">Booked Services: {booking.serviceItems.join(', ')}</p>
                  <p className="text-sm text-gray-700">Date: {new Date(booking.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-700">Time: {booking.time}</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  {booking.status === 'Booked' && (
                    <button
                      className="px-5 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                      onClick={() => handleAction(booking._id, 'confirm')}
                    >
                      Confirm
                    </button>
                  )}

                  {booking.status === 'confirmed' && (
                    <button
                      className="px-5 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                      onClick={() => handleAction(booking._id, 'complete')}
                    >
                      Complete
                    </button>
                  )}

                  {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                    <button
                      className="px-5 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                      onClick={() => handleAction(booking._id, 'cancel')}
                    >
                      Decline
                    </button>
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

export default BookingsPage;
