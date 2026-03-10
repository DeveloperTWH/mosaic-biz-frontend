'use client';

import React, { useState } from 'react';
import { X, Save, Loader, Plus, Trash2, Clock, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { Food } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Use type intersection instead of interface extension to avoid conflicts
type ExtendedFood = Food & {
  menuImage?: string;
  businessHours?: Array<{
    day: string;
    hours: string;
    closed: boolean;
    _id: string;
  }>;
  bookingToolLink?: string;
  metaFields?: Array<{
    key: string;
    value: string;
    _id?: string;
  }>;
  businessName?: string;
  // Make these optional without changing the base type
  categoryId?: any;
  subcategoryId?: any;
};

interface Props {
  food: ExtendedFood;
  onClose: () => void;
  onSave: () => void;
}

export default function EditFoodModal({ food, onClose, onSave }: Props) {
  const [loading, setLoading] = useState(false);
  
  // Only the fields we want to show/edit
  const [formData, setFormData] = useState({
    coverImage: food.coverImage || '',
    images: food.images || [],
    menuImage: food.menuImage || '',
    businessHours: food.businessHours || [],
    bookingToolLink: food.bookingToolLink || '',
    metaFields: food.metaFields || [],
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()]
      });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i: number) => i !== index)
    });
  };

  const updateBusinessHour = (index: number, field: string, value: any) => {
    const updatedHours = [...formData.businessHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setFormData({ ...formData, businessHours: updatedHours });
  };

  const updateMetaField = (index: number, field: 'key' | 'value', value: string) => {
    const updatedMeta = [...formData.metaFields];
    updatedMeta[index] = { ...updatedMeta[index], [field]: value };
    setFormData({ ...formData, metaFields: updatedMeta });
  };

  const addMetaField = () => {
    setFormData({
      ...formData,
      metaFields: [...formData.metaFields, { key: '', value: '' }]
    });
  };

  const removeMetaField = (index: number) => {
    setFormData({
      ...formData,
      metaFields: formData.metaFields.filter((_, i: number) => i !== index)
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Send only the fields we're editing
      const updateData = {
        coverImage: formData.coverImage,
        images: formData.images,
        menuImage: formData.menuImage,
        businessHours: formData.businessHours,
        bookingToolLink: formData.bookingToolLink,
        metaFields: formData.metaFields.filter((mf: { key: string; value: string }) => mf.key && mf.value) // Remove empty meta fields
      };
      
      const response = await fetch(
        `${API_BASE_URL}/api/food/update-food/${food._id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        }
      );

      const data = await response.json();
      if (data.message) {
        toast.success('Food item updated successfully');
        onSave();
        onClose();
      } else {
        toast.error(data.error || 'Failed to update food item');
      }
    } catch (error) {
      console.error('Error updating food:', error);
      toast.error('Error updating food item');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get category name
  const getCategoryName = (category: any): string => {
    if (!category) return 'Not set';
    if (typeof category === 'object' && category !== null) {
      return category.name || 'Unknown';
    }
    return String(category);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header with Business Info */}
        <div className="sticky top-0 bg-[#c9a227] px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white font-semibold text-lg">Edit Food Item</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Business Info Summary */}
          <div className="text-white text-sm">
            <p className="font-medium">{food.businessName || 'Business name not available'}</p>
            <div className="flex gap-4 mt-1 text-white/80">
              <span>Category: {getCategoryName(food.categoryId)}</span>
              <span>Subcategory: {getCategoryName(food.subcategoryId)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Images Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#c9a227]" />
              Images
            </h3>
            
            {/* Cover Image */}
            <div className="mb-4">
              {formData.coverImage && (
                <div className="mt-2 relative w-32 h-32 border rounded-md overflow-hidden">
                  <img 
                    src={formData.coverImage} 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Menu Image */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Menu Image</label>
              {formData.menuImage && (
                <div className="mt-2 relative w-32 h-32 border rounded-md overflow-hidden">
                  <img 
                    src={formData.menuImage} 
                    alt="Menu" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image';
                    }}
                  />
                </div>
              )}
            </div>

          </div>

          {/* Business Hours */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#c9a227]" />
              Business Hours
            </h3>
            
            <div className="space-y-2">
              {formData.businessHours.map((day: any, index: number) => (
                <div key={day._id || index} className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-2 text-sm font-medium">{day.day}:</span>
                  <input
                    type="text"
                    value={day.hours}
                    onChange={(e) => updateBusinessHour(index, 'hours', e.target.value)}
                    className="col-span-7 px-3 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] text-sm"
                    disabled={day.closed}
                  />
                  <label className="col-span-3 flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={day.closed}
                      onChange={(e) => updateBusinessHour(index, 'closed', e.target.checked)}
                      className="w-4 h-4 text-[#c9a227] rounded"
                    />
                    Closed
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Tool Link */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Booking Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Tool Link</label>
              <input
                type="url"
                value={formData.bookingToolLink}
                onChange={(e) => setFormData({ ...formData, bookingToolLink: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227]"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Meta Fields */}
          {formData.metaFields && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Additional Information</h3>
                <button
                  type="button"
                  onClick={addMetaField}
                  className="text-[#c9a227] hover:text-[#b8921f] text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Field
                </button>
              </div>
              
              <div className="space-y-2">
                {formData.metaFields.map((field: any, index: number) => (
                  <div key={field._id || index} className="flex gap-2">
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) => updateMetaField(index, 'key', e.target.value)}
                      placeholder="Key"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] text-sm"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => updateMetaField(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] text-sm"
                    />
                    <button
                      onClick={() => removeMetaField(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-[#c9a227] text-white rounded-md hover:bg-[#b8921f] flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}