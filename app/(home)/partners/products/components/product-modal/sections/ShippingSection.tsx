import React from 'react';

interface Props {
  shipping: {
    standard: number;
    overnight: number;
    local: number;
  };
  onChange: (shipping: any) => void;
}

export default function ShippingSection({ shipping, onChange }: Props) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Shipping Options</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Standard ($)</label>
          <input
            type="number"
            value={shipping.standard}
            onChange={(e) => onChange({ ...shipping, standard: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            step="0.01"
            min="0"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Overnight ($)</label>
          <input
            type="number"
            value={shipping.overnight}
            onChange={(e) => onChange({ ...shipping, overnight: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            step="0.01"
            min="0"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Local ($)</label>
          <input
            type="number"
            value={shipping.local}
            onChange={(e) => onChange({ ...shipping, local: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            step="0.01"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}