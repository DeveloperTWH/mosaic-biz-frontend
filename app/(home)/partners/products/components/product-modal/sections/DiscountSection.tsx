import React from 'react';

interface Props {
  discount: {
    type: 'percentage' | 'fixed';
    amount: number;
    minCartValue: number;
  };
  onChange: (discount: any) => void;
}

export default function DiscountSection({ discount, onChange }: Props) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Discount</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Type</label>
          <select
            value={discount.type}
            onChange={(e) => onChange({ ...discount, type: e.target.value as 'percentage' | 'fixed' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Amount</label>
          <input
            type="number"
            value={discount.amount}
            onChange={(e) => onChange({ ...discount, amount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            step="0.01"
            min="0"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Min Cart Value</label>
          <input
            type="number"
            value={discount.minCartValue}
            onChange={(e) => onChange({ ...discount, minCartValue: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            step="0.01"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}