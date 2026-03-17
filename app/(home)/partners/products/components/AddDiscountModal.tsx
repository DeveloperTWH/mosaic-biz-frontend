'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AddDiscountModal({ businessId, onClose }: any) {
  const [form, setForm] = useState({
    name: '',
    couponCode: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxDiscountAmount: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

const handleSubmit = async () => {
  try {
    setLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/api/discounts`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          ...form,
          value: Number(form.value),
          minOrderAmount: Number(form.minOrderAmount || 0),
          maxDiscountAmount: Number(form.maxDiscountAmount || 0)
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      toast.success('Discount created successfully');
      onClose();
    } else {
      toast.error(data.message || 'Failed to create discount');
    }

  } catch (err) {
    console.error(err);
    toast.error('Error creating discount');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 space-y-4">

        <h2 className="text-lg font-semibold">Add Discount</h2>

        {/* Name */}
        <input
          placeholder="Discount Name"
          className="w-full border px-3 py-2 rounded"
          onChange={(e) => handleChange('name', e.target.value)}
        />

        {/* Coupon */}
        <input
          placeholder="Coupon Code"
          className="w-full border px-3 py-2 rounded"
          onChange={(e) => handleChange('couponCode', e.target.value)}
        />

        {/* Type */}
        <select
          className="w-full border px-3 py-2 rounded"
          onChange={(e) => handleChange('type', e.target.value)}
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>

        {/* Value */}
        <input
          placeholder="Value"
          type="number"
          className="w-full border px-3 py-2 rounded"
          onChange={(e) => handleChange('value', e.target.value)}
        />

        {/* Min Order */}
        <input
          placeholder="Min Order Amount"
          type="number"
          className="w-full border px-3 py-2 rounded"
          onChange={(e) => handleChange('minOrderAmount', e.target.value)}
        />

        {/* Max Discount */}
        <input
          placeholder="Max Discount Amount"
          type="number"
          className="w-full border px-3 py-2 rounded"
          onChange={(e) => handleChange('maxDiscountAmount', e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-[#c9a227] text-white rounded"
          >
            {loading ? 'Saving...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}