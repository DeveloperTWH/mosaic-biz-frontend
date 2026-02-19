import React from 'react';
import { ProductFormData, Business, Category, Subcategory } from '../types';

interface Props {
  formData: ProductFormData;
  errors: any;
  businesses: Business[];
  categories: Category[];
  subcategories: Subcategory[];
  onInputChange: (field: keyof ProductFormData, value: any) => void;
  onToggleVariants: (value: boolean) => void;
}

export default function ProductDetails({
  formData,
  errors,
  businesses,
  categories,
  subcategories,
  onInputChange,
  onToggleVariants,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
        Product Details
      </h2>
      
      <div className="space-y-4">
        {/* Business Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Business
          </label>
          <select
            value={formData.businessId}
            onChange={(e) => onInputChange('businessId', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227] bg-white"
          >
            <option value="">Select Business</option>
            {businesses.map(b => (
              <option key={b._id} value={b._id}>{b.businessName}</option>
            ))}
          </select>
          {errors.businessId && <p className="mt-1 text-xs text-red-600">{errors.businessId}</p>}
        </div>

        {/* Product Title */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Product Title
          </label>
          <input
            type="text"
            value={formData.productTitle}
            onChange={(e) => onInputChange('productTitle', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            placeholder="Enter product title"
          />
          {errors.productTitle && <p className="mt-1 text-xs text-red-600">{errors.productTitle}</p>}
        </div>

        {/* Category and Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Product Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => onInputChange('categoryId', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227] bg-white"
            >
              <option value="">Choose Category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Product Sub Category
            </label>
            <select
              value={formData.subCategoryId}
              onChange={(e) => onInputChange('subCategoryId', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227] bg-white"
              disabled={!formData.categoryId}
            >
              <option value="">Choose Sub Category</option>
              {subcategories.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
            {errors.subCategoryId && <p className="mt-1 text-xs text-red-600">{errors.subCategoryId}</p>}
          </div>
        </div>

        {/* Product Description */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Product Description
          </label>
          <textarea
            value={formData.productDescription}
            onChange={(e) => onInputChange('productDescription', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227] resize-none"
            placeholder="Enter product description"
          />
          {errors.productDescription && <p className="mt-1 text-xs text-red-600">{errors.productDescription}</p>}
        </div>

        {/* Has Variants Toggle */}
        <div className="pt-2">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Has Variants
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.hasVariants === true}
                onChange={() => onToggleVariants(true)}
                className="w-4 h-4 text-[#c9a227] border-gray-300 focus:ring-[#c9a227]"
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.hasVariants === false}
                onChange={() => onToggleVariants(false)}
                className="w-4 h-4 text-[#c9a227] border-gray-300 focus:ring-[#c9a227]"
              />
              <span className="text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}