'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Loader2, X } from 'lucide-react';
import { toast } from 'react-toastify';

type CategoryRequestType = 'product' | 'service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categoryType: CategoryRequestType;
  initialCategoryName?: string;
  initialSubcategoryName?: string;
}

interface CategoryRequestForm {
  categoryName: string;
  subcategoryName: string;
  description: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const initialFormState: CategoryRequestForm = {
  categoryName: '',
  subcategoryName: '',
  description: '',
};

export default function CategoryRequestModal({
  isOpen,
  onClose,
  categoryType,
  initialCategoryName = '',
  initialSubcategoryName = '',
}: Props) {
  const [formData, setFormData] = useState<CategoryRequestForm>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData({
      categoryName: initialCategoryName,
      subcategoryName: initialSubcategoryName,
      description: '',
    });
  }, [initialCategoryName, initialSubcategoryName, isOpen]);

  if (!isOpen || !mounted) {
    return null;
  }

  const handleChange = (field: keyof CategoryRequestForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = (force = false) => {
    if (submitting && !force) {
      return;
    }

    setFormData(initialFormState);
    onClose();
  };

  const handleCloseClick = () => {
    handleClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const payload = {
      categoryName: formData.categoryName.trim(),
      subcategoryName: formData.subcategoryName.trim(),
      description: formData.description.trim(),
      categoryType,
    };

    if (!payload.categoryName) {
      toast.error('Category name is required');
      return;
    }

    if (!payload.description) {
      toast.error('Description is required');
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/category-requests`,
        payload,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.success) {
        toast.success('Your request has been sent to admin. Wait for admin approval.');
      } else {
        toast.success(response.data?.message || 'Category request submitted successfully');
      }
      handleClose(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to submit category request';

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formattedType = categoryType.charAt(0).toUpperCase() + categoryType.slice(1);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={handleCloseClick}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close category request modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 pr-8">
          <h3 className="text-lg font-semibold text-gray-900">Request Category Creation</h3>
          <p className="mt-1 text-sm text-gray-500">
            Submit a request for a new {categoryType} category or subcategory.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category Type
            </label>
            <input
              type="text"
              value={formattedType}
              readOnly
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.categoryName}
              onChange={(e) => handleChange('categoryName', e.target.value)}
              placeholder="Enter category name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Subcategory Name
            </label>
            <input
              type="text"
              value={formData.subcategoryName}
              onChange={(e) => handleChange('subcategoryName', e.target.value)}
              placeholder="Enter subcategory name if needed"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the category you want to add and why you need it"
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCloseClick}
              disabled={submitting}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md bg-[#c9a227] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b8921f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
