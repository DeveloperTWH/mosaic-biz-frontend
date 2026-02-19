import React from 'react';
import { X, Package, DollarSign } from 'lucide-react';
import { Variant } from '../types';

interface Props {
  variants: Variant[];
  onUpdate: (index: number, field: keyof Variant, value: any) => void;
  onUpdateAllShipping: (field: 'standardShipping' | 'overnightShipping' | 'localShipping', value: number) => void;
  onRemove: (index: number) => void;
}

export default function VariantsTable({
  variants,
  onUpdate,
  onUpdateAllShipping,
  onRemove,
}: Props) {
  
  if (variants.length === 0) {
    return null;
  }

  const firstVariant = variants[0];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-[#c9a227]" />
        <h2 className="text-lg font-semibold text-gray-900">Variant Combinations</h2>
        <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
          {variants.length} variants
        </span>
      </div>

      {/* Bulk Shipping Update */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-[#c9a227]" />
          Bulk Update Shipping
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">standardShipping</label>
            <input
              type="number"
              value={firstVariant.standardShipping}
              onChange={(e) => onUpdateAllShipping('standardShipping', parseFloat(e.target.value))}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">overnightShipping</label>
            <input
              type="number"
              value={firstVariant.overnightShipping}
              onChange={(e) => onUpdateAllShipping('overnightShipping', parseFloat(e.target.value))}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">localShipping</label>
            <input
              type="number"
              value={firstVariant.localShipping}
              onChange={(e) => onUpdateAllShipping('localShipping', parseFloat(e.target.value))}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
              step="0.01"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-medium text-gray-600">SKU</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">attribute1Name</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">attribute1Value</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">attribute2Name</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">attribute2Value</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">price</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">stock</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">availability</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">standard</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">overnight</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">local</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-2">
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => onUpdate(index, 'sku', e.target.value)}
                    className="w-28 px-2 py-1 border border-gray-300 rounded-md text-xs font-mono"
                  />
                </td>
                <td className="py-2 px-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {variant.attribute1Name}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {variant.attribute1Value}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {variant.attribute2Name}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {variant.attribute2Value}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <div className="relative w-20">
                    <DollarSign className="absolute left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => onUpdate(index, 'price', parseFloat(e.target.value))}
                      className="w-full pl-5 pr-1 py-1 border border-gray-300 rounded-md text-sm"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => onUpdate(index, 'stock', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                    min="0"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    value={variant.availability}
                    onChange={(e) => onUpdate(index, 'availability', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                    min="0"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    value={variant.standardShipping}
                    onChange={(e) => onUpdate(index, 'standardShipping', parseFloat(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    value={variant.overnightShipping}
                    onChange={(e) => onUpdate(index, 'overnightShipping', parseFloat(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    value={variant.localShipping}
                    onChange={(e) => onUpdate(index, 'localShipping', parseFloat(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td className="py-2 px-2">
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}