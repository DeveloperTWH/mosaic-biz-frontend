'use client';

import React, { useState } from 'react';
import { ServiceFormData, Category, Subcategory } from '../types';
import CategoryRequestModal from '../../components/CategoryRequestModal';

interface Props {
  formData: ServiceFormData;
  errors: any;
  businesses: any[];
  categories: Category[];
  subcategories: Subcategory[];
  onInputChange: (field: keyof ServiceFormData, value: any) => void;
}

export default function ServiceCategory({
  formData,
  errors,
  businesses,
  categories,
  subcategories,
  onInputChange,
}: Props) {
  const [isCategoryRequestOpen, setIsCategoryRequestOpen] = useState(false);

  const selectedCategory = categories.find((category) => category._id === formData.categoryId);
  const selectedSubcategory = subcategories.find(
    (subcategory) => subcategory._id === formData.subcategoryId
  );

  return (
    <>
      <div className="bg-gray-100 border border-gray-200 rounded-md p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4 border-l-4 border-[#c9a227] pl-3">Service Details</h2>
        
        <div className="space-y-4">
          {/* Business Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.businessId}
              onChange={(e) => onInputChange('businessId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            >
              {/* <option value="">Select Business</option> */}
              {businesses.map(b => (
                <option key={b._id} value={b._id}>{b.businessName}</option>
              ))}
            </select>
            {errors.businessId && <p className="mt-1 text-xs text-red-600">{errors.businessId}</p>}
          </div>

          {/* Title */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => onInputChange('title', e.target.value)}
              placeholder="e.g., Salon Services"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div> */}

          {/* Description */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => onInputChange('description', e.target.value)}
              placeholder="Describe your service..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
          </div> */}

          {/* Category & Subcategory Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Service Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => onInputChange('categoryId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
              >
                <option value="">-- Choose Category --</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>}
            </div>

            {/* Service Sub-Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Sub Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.subcategoryId}
                onChange={(e) => onInputChange('subcategoryId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
                disabled={!formData.categoryId}
              >
                <option value="">-- Choose Sub Category --</option>
                {subcategories.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
              {errors.subcategoryId && <p className="mt-1 text-xs text-red-600">{errors.subcategoryId}</p>}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCategoryRequestOpen(true)}
            className="text-left text-sm text-[#c9a227] transition-colors hover:text-[#b8921f]"
          >
            Can&apos;t find your category here?{' '}
            <span className="underline">Request Category Creation</span>
          </button>
        </div>
      </div>

      <CategoryRequestModal
        isOpen={isCategoryRequestOpen}
        onClose={() => setIsCategoryRequestOpen(false)}
        categoryType="service"
        initialCategoryName={selectedCategory?.name}
        initialSubcategoryName={selectedSubcategory?.name}
      />
    </>
  );
}
