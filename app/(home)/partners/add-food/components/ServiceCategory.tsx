import React from 'react';
import { FoodFormData, Category, Subcategory } from '../types';

interface Props {
  formData: FoodFormData;
  errors: Record<string, string>;
  businesses: any[];
  categories: Category[];
  subcategories: Subcategory[];
  onInputChange: (field: keyof FoodFormData, value: any) => void;
}

export default function ServiceCategory({
  formData,
  errors,
  businesses,
  categories,
  subcategories,
  onInputChange,
}: Props) {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-md p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4 border-l-4 border-[#c9a227] pl-3">
        Food Details
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.businessId}
            onChange={(e) => onInputChange('businessId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
          >
            <option value="">Select Business</option>
            {businesses.map((business) => (
              <option key={business._id} value={business._id}>
                {business.businessName}
              </option>
            ))}
          </select>
          {errors.businessId ? <p className="mt-1 text-xs text-red-600">{errors.businessId}</p> : null}
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => onInputChange('price', Number(e.target.value))}
            step="0.01"
            min="0"
            placeholder="12.5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
          />
          {errors.price ? <p className="mt-1 text-xs text-red-600">{errors.price}</p> : null}
        </div> */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => onInputChange('categoryId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            >
              <option value="">-- Choose Category --</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId ? <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p> : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Sub Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.subcategoryId}
              onChange={(e) => onInputChange('subcategoryId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
              disabled={!formData.categoryId}
            >
              <option value="">-- Choose Sub Category --</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
            {errors.subcategoryId ? <p className="mt-1 text-xs text-red-600">{errors.subcategoryId}</p> : null}
          </div>
        </div>

                <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
           Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            placeholder="e.g., Paneer Tikka"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
          />
          {errors.title ? <p className="mt-1 text-xs text-red-600">{errors.title}</p> : null}
        </div> 

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            rows={3}
            placeholder="Describe your food item..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
          />
          {errors.description ? <p className="mt-1 text-xs text-red-600">{errors.description}</p> : null}
        </div>

        {/* <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) => onInputChange('isPublished', e.target.checked)}
            className="w-4 h-4 text-[#c9a227] rounded"
          />
          <span className="text-sm text-gray-700">Publish now</span>
        </label> */}
      </div>
    </div>
  );
}
