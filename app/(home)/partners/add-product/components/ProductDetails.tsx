'use client';

import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { ProductFormData, Business, Category, Subcategory, TaxCategoryRate } from '../types';
import RichTextEditor from './RichTextEditor';
import CategoryRequestModal from '../../components/CategoryRequestModal';
import TaxSettingsTab from '@/app/(partner)/partners/dashboard/components/TaxSettingsTab';

interface Props {
  formData: ProductFormData;
  errors: any;
  businesses: Business[];
  categories: Category[];
  subcategories: Subcategory[];
  taxCategories: TaxCategoryRate[];
  taxEnabled: boolean;
  registeredTaxState: string;
  taxLoading: boolean;
  onInputChange: (field: keyof ProductFormData, value: any) => void;
  onToggleVariants: (value: boolean) => void;
  onTaxSettingsUpdated: () => void;
}

export default function ProductDetails({
  formData,
  errors,
  businesses,
  categories,
  subcategories,
  taxCategories,
  taxEnabled,
  registeredTaxState,
  taxLoading,
  onInputChange,
  onToggleVariants,
  onTaxSettingsUpdated,
}: Props) {
  const [isCategoryRequestOpen, setIsCategoryRequestOpen] = useState(false);
  const [isTaxSettingsOpen, setIsTaxSettingsOpen] = useState(false);

  const selectedCategory = categories.find((category) => category._id === formData.categoryId);
  const selectedSubcategory = subcategories.find(
    (subcategory) => subcategory._id === formData.subCategoryId
  );
  const selectedTaxCategory = taxCategories.find(
    (category) => category.code === formData.taxCategory?.code
  );

  return (
    <>
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
              {/* <option value="">Select Business</option> */}
              {businesses.map(b => (
                <option key={b._id} value={b._id}>{b.businessName}</option>
              ))}
            </select>
            {errors.businessId && <p className="mt-1 text-xs text-red-600">{errors.businessId}</p>}
          </div>

          <div className="rounded-md border border-gray-200 bg-[#fcfaf7] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Tax Configuration
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  Registered state: {registeredTaxState || 'Not configured'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={taxEnabled}
                onClick={() => setIsTaxSettingsOpen(true)}
                disabled={!formData.businessId || taxLoading}
                className="inline-flex w-full items-center justify-between gap-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-left transition hover:border-[#c9a227] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-[#c9a227]" />
                  <span className="text-sm font-medium text-gray-800">
                    {taxLoading ? 'Loading taxes...' : taxEnabled ? 'Manage taxes' : 'Enable taxes'}
                  </span>
                </span>
                <span
                  className={`relative h-5 w-9 rounded-full transition ${
                    taxEnabled ? 'bg-[#c9a227]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
                      taxEnabled ? 'left-4' : 'left-0.5'
                    }`}
                  />
                </span>
              </button>
            </div>
            {!formData.businessId && (
              <p className="mt-2 text-xs text-gray-500">
                Select a business before configuring taxes.
              </p>
            )}
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

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Tax Category {taxEnabled ? '*' : ''}
            </label>
            <select
              value={formData.taxCategory?.code || ''}
              onChange={(e) => {
                const selected = taxCategories.find((category) => category.code === e.target.value);
                onInputChange('taxCategory', selected ? {
                  code: selected.code,
                  label: selected.label,
                } : null);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227] bg-white"
              disabled={taxLoading || taxCategories.length === 0}
            >
              <option value="">
                {taxLoading
                  ? 'Loading tax categories...'
                  : taxCategories.length > 0
                    ? 'Choose Tax Category'
                    : 'No tax categories available'}
              </option>
              {taxCategories.map((category) => (
                <option key={category.code} value={category.code}>
                  {category.label}
                </option>
              ))}
            </select>
            {selectedTaxCategory ? (
              <p className="mt-1 text-xs text-gray-500">
                Rate for this category: {selectedTaxCategory.rate.toFixed(2)}%
              </p>
            ) : taxEnabled ? (
              <p className="mt-1 text-xs text-gray-500">
                Select the tax category that matches this product.
              </p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">
                Tax is currently disabled for this business.
              </p>
            )}
            {errors.taxCategory && <p className="mt-1 text-xs text-red-600">{errors.taxCategory}</p>}
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

          <button
            type="button"
            onClick={() => setIsCategoryRequestOpen(true)}
            className="text-left text-sm text-[#c9a227] transition-colors hover:text-[#b8921f]"
          >
            Can&apos;t find your category here?{' '}
            <span className="underline">Request Category Creation</span>
          </button>

          {/* Product Description */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Product Description
            </label>
            <RichTextEditor
              value={formData.productDescription}
              onChange={(value) => onInputChange('productDescription', value)}
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

      <CategoryRequestModal
        isOpen={isCategoryRequestOpen}
        onClose={() => setIsCategoryRequestOpen(false)}
        categoryType="product"
        initialCategoryName={selectedCategory?.name}
        initialSubcategoryName={selectedSubcategory?.name}
      />

      {isTaxSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-md bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tax Management</h3>
                <p className="text-sm text-gray-500">
                  Enable tax collection and manage category rates for this business.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTaxSettingsOpen(false)}
                className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close tax management"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">
              <TaxSettingsTab
                businessId={formData.businessId}
                isActive={isTaxSettingsOpen}
                onSettingsSaved={onTaxSettingsUpdated}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
