import React from 'react';
import { Product } from '../../../types';

interface Props {
  product: Product;
  formData: {
    title: string;
    isPublished: boolean;
  };
  onTitleChange: (title: string) => void;
  onStatusChange: (isPublished: boolean) => void;
}

export default function BasicInfoSection({ product, formData, onTitleChange, onStatusChange }: Props) {
  return (
    <>
      {/* Product Title & Basic Info */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <p className="text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {product.categoryId?.name || '-'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub Category
            </label>
            <p className="text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {product.subcategoryId?.name || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Product ID, Stock, Status */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product ID
          </label>
          <p className="text-base font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
            #SKU {product._id.slice(-4)}
          </p>
        </div>
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Stock
          </label>
          <p className="text-base font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
            {product.totalStock || 0}
          </p>
        </div> */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.isPublished ? 'published' : 'draft'}
            onChange={(e) => onStatusChange(e.target.value === 'published')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div> */}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.title} // Note: This should be description, fix in main component
          onChange={(e) => onTitleChange(e.target.value)} // Fix this
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
        />
      </div>
    </>
  );
}