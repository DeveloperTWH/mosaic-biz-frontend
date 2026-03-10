'use client';

import React, { useState } from 'react';
import { X, Save, Loader, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Service, ChildService, BusinessHour } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Props {
  service: Service;
  onClose: () => void;
  onSave: () => void;
}

interface EditableChildService extends ChildService {
  _id?: string;
}

export default function EditServiceModal({ service, onClose, onSave }: Props) {
  const [saving, setSaving] = useState(false);
  
  // Form state - exactly as original
  const [title, setTitle] = useState(service.title);
  const [description, setDescription] = useState(service.description || '');
  const [categoryId, setCategoryId] = useState(service.categoryId?._id || '');
  const [subcategoryId, setSubcategoryId] = useState(service.subcategoryId?._id || '');
  const [price, setPrice] = useState(service.price);
  const [duration, setDuration] = useState(service.duration);
  const [coverImage, setCoverImage] = useState(service.coverImage);
  const [galleryImages] = useState<string[]>(
    service.images ||
      (service as any).galleryImages ||
      (service as any).serviceImages ||
      []
  );
  const [bookingToolLink, setBookingToolLink] = useState(service.bookingToolLink || '');
  const [isPublished, setIsPublished] = useState(service.isPublished);
  
  // Child services
  const [childServices, setChildServices] = useState<EditableChildService[]>(service.services || []);
  
  // Business hours
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(service.businessHours || []);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Add new child service
  const addChildService = () => {
    setChildServices([
      ...childServices,
      { name: '', description: '', durationMinutes: 60, price: 0 }
    ]);
  };

  // Update child service
  const updateChildService = (index: number, field: keyof ChildService, value: any) => {
    const updated = [...childServices];
    updated[index] = { ...updated[index], [field]: value };
    setChildServices(updated);
  };

  // Remove child service
  const removeChildService = (index: number) => {
    setChildServices(childServices.filter((_, i) => i !== index));
  };

  // Update business hour
  const updateBusinessHour = (index: number, field: keyof BusinessHour, value: any) => {
    const updated = [...businessHours];
    updated[index] = { ...updated[index], [field]: value };
    setBusinessHours(updated);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const normalizedServices = childServices
        .map((item) => ({
          ...item,
          name: (item.name || '').trim(),
          description: item.description || '',
          durationMinutes:
            typeof item.durationMinutes === 'number' && Number.isFinite(item.durationMinutes)
              ? item.durationMinutes
              : item.duration
              ? parseInt(String(item.duration), 10) || 60
              : 60,
          price:
            typeof item.price === 'number' && Number.isFinite(item.price)
              ? item.price
              : 0,
        }))
        .filter((item) => item.name.length > 0);
      
      const payload = {
        title,
        description,
        categoryId,
        subcategoryId,
        price,
        duration,
        coverImage,
        images: galleryImages,
        bookingToolLink,
        services: normalizedServices,
        businessHours,
        isPublished
      };
      
      const response = await fetch(
        `${API_BASE_URL}/api/service/${service._id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();
      if (data.message) {
        toast.success('Service updated successfully');
        onSave();
        onClose();
      } else {
        toast.error(data.error || 'Failed to update service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Error updating service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        
        {/* Header - Only CSS changed to gold */}
        <div className="bg-[#c9a227] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">Edit Service</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Exactly as original, no CSS changes to layout */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
                step="0.01"
                min="0"
              />
            </div> */}
          </div>

          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
                placeholder="e.g., 60 minutes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Tool Link</label>
              <input
                type="url"
                value={bookingToolLink}
                onChange={(e) => setBookingToolLink(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
                placeholder="https://calendly.com/ ..."
              />
            </div>
          </div> */}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
            {/* <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            /> */}
            {coverImage ? (
              <div className="mt-3 w-full max-w-sm h-40 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
            {galleryImages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {galleryImages.map((img, index) => (
                  <div key={`${img}-${index}`} className="w-20 h-20 overflow-hidden rounded border border-gray-200 bg-gray-100">
                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No gallery images available.</p>
            )}
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-[#c9a227] rounded"
              />
              <span className="text-sm font-medium text-gray-700">Published</span>
            </label>
          </div>

          {/* Child Services Section */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Services</h3>
              <button
                onClick={addChildService}
                className="px-3 py-1 bg-[#c9a227] text-white text-sm rounded-md hover:bg-[#b8921f] flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Service
              </button>
            </div>

            {childServices.map((service, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Name</label>
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => updateChildService(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) => updateChildService(index, 'price', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">Description</label>
                  <input
                    type="text"
                    value={service.description}
                    onChange={(e) => updateChildService(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div className="mb-3">
                  {/* <label className="block text-xs text-gray-500 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={service.image || ''}
                    onChange={(e) => updateChildService(index, 'image', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  /> */}
                  {service.image ? (
                    <div className="mt-2 w-24 h-24 overflow-hidden rounded border border-gray-200 bg-gray-100">
                      <img
                        src={service.image}
                        alt={`${service.name || 'Service'} image`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={service.durationMinutes}
                      onChange={(e) => updateChildService(index, 'durationMinutes', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="flex items-end justify-end">
                    <button
                      onClick={() => removeChildService(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {childServices.length === 0 && (
              <p className="text-center text-gray-500 py-4">No service added</p>
            )}
          </div>

          {/* Business Hours Section */}
          {businessHours.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
              {businessHours.map((hour, index) => (
                <div key={index} className="flex items-center gap-3 mb-3">
                  <div className="w-32 text-sm font-medium">{daysOfWeek[index]}</div>
                  <input
                    type="text"
                    value={hour.hours}
                    onChange={(e) => updateBusinessHour(index, 'hours', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="9:00 AM - 6:00 PM"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={hour.closed || false}
                      onChange={(e) => updateBusinessHour(index, 'closed', e.target.checked)}
                      className="w-4 h-4 text-[#c9a227] rounded"
                    />
                    Closed
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Only CSS changed */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
