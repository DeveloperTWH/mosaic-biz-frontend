'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ViewDiscountsModal({ businessId, onClose }: any) {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/discounts/business/${businessId}`,
        {
          credentials: 'include', // ✅ cookie auth
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = await response.json();

      if (data.success) {
        setDiscounts(data.data);
      } else {
        toast.error('Failed to fetch discounts');
      }

    } catch (err) {
      console.error(err);
      toast.error('Error loading discounts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your  Discount coupens</h2>
          <button onClick={onClose}>✖</button>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : discounts.length === 0 ? (
          <p className="text-center text-gray-500">No discounts found</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {discounts.map((d) => (
              <div
                key={d._id}
                className="border p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-sm text-gray-500">
                    Code: {d.couponCode}
                  </p>
                  <p className="text-sm text-gray-600">
                    {d.type === 'percentage'
                      ? `${d.value}% OFF`
                      : `₹${d.value} OFF`}
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    d.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {d.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}