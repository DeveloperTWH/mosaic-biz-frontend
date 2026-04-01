'use client';

import React, { useRef, useState } from 'react';
import { ImagePlus, Loader, Save, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { BusinessHour, Service } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Props {
  service: Service;
  onClose: () => void;
  onSave: () => void;
}

const parseDurationToMinutes = (duration: unknown): number => {
  if (typeof duration === 'number' && Number.isFinite(duration)) {
    return Math.max(1, Math.round(duration));
  }

  if (typeof duration !== 'string') {
    return 60;
  }

  const match = duration.match(/(\d+(\.\d+)?)/);
  if (!match) {
    return 60;
  }

  const value = parseFloat(match[1]);
  if (!Number.isFinite(value)) {
    return 60;
  }

  return /hour/i.test(duration) ? Math.max(1, Math.round(value * 60)) : Math.max(1, Math.round(value));
};

const normalizeChildServices = (services: Service['services']) =>
  (services || [])
    .map((child) => ({
      ...child,
      name: String(child.name || '').trim(),
      description: child.description || '',
      durationMinutes:
        typeof child.durationMinutes === 'number' && Number.isFinite(child.durationMinutes)
          ? child.durationMinutes
          : parseDurationToMinutes(child.duration),
      duration: `${typeof child.durationMinutes === 'number' && Number.isFinite(child.durationMinutes)
        ? child.durationMinutes
        : parseDurationToMinutes(child.duration)} minutes`,
      price: typeof child.price === 'number' && Number.isFinite(child.price) ? child.price : 0,
      images: Array.isArray(child.images) ? child.images : child.image ? [child.image] : [],
    }))
    .filter((child) => child.name.length > 0);

export default function EditBusinessInfoModal({ service, onClose, onSave }: Props) {
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [coverImage, setCoverImage] = useState(service.coverImage || '');
  const [galleryImages, setGalleryImages] = useState<string[]>(service.images || []);
  const [location, setLocation] = useState(service.location || '');
  const [bookingToolLink, setBookingToolLink] = useState(service.bookingToolLink || '');
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(service.businessHours || []);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const uploadImage = async (file: File, documentType: 'service-cover' | 'service-gallery') => {
    const response = await fetch(
      `${API_BASE_URL}/api/service/upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}&documentType=${documentType}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { uploadUrl, fileUrl } = await response.json();

    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    return fileUrl as string;
  };

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCover(true);
      const fileUrl = await uploadImage(file, 'service-cover');
      setCoverImage(fileUrl);
      toast.success('Cover image updated');
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast.error('Failed to upload cover image');
    } finally {
      setUploadingCover(false);
      event.target.value = '';
    }
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      setUploadingGallery(true);
      const uploaded = await Promise.all(files.map((file) => uploadImage(file, 'service-gallery')));
      setGalleryImages((prev) => [...prev, ...uploaded]);
      toast.success('Gallery updated');
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      toast.error('Failed to upload gallery images');
    } finally {
      setUploadingGallery(false);
      event.target.value = '';
    }
  };

  const updateBusinessHour = (index: number, field: keyof BusinessHour, value: string | boolean) => {
    setBusinessHours((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const payload = {
        title: service.title || '',
        description: service.description || '',
        categoryId: service.categoryId?._id || '',
        subcategoryId: service.subcategoryId?._id || '',
        price: service.price ?? 0,
        duration: service.duration || '60 minutes',
        coverImage,
        images: galleryImages,
        bookingToolLink,
        location,
        services: normalizeChildServices(service.services),
        businessHours,
        isPublished: service.isPublished,
      };

      const response = await fetch(`${API_BASE_URL}/api/service/${service._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update business info');
      }

      toast.success('Business info updated successfully');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating business info:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update business info');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-[#c9a227] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">Edit Business Info</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Cover Image</label>
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="px-3 py-2 bg-[#c9a227] text-white text-sm rounded-md hover:bg-[#b8921f] flex items-center gap-2 disabled:opacity-50"
                disabled={uploadingCover}
              >
                {uploadingCover ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload Cover
              </button>
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
            {coverImage ? (
              <div className="w-full max-w-sm h-44 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full max-w-sm h-44 rounded-md border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-sm text-gray-500">
                No cover image uploaded
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Gallery Images</label>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="px-3 py-2 bg-blue-900 text-white text-sm rounded-md hover:bg-blue-800 flex items-center gap-2 disabled:opacity-50"
                disabled={uploadingGallery}
              >
                {uploadingGallery ? <Loader className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                Add Gallery Images
              </button>
            </div>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              className="hidden"
            />
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {galleryImages.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative border border-gray-200 rounded-md overflow-hidden bg-gray-100">
                    <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-28 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-red-600 hover:bg-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No gallery images available.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Tool Link</label>
            <input
              type="url"
              value={bookingToolLink}
              onChange={(event) => setBookingToolLink(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
              placeholder=""
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Map Location</label>
            <input
              type="url"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
              placeholder="https://www.google.com/maps"
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
            <div className="space-y-3">
              {businessHours.map((hour, index) => (
                <div key={`${hour.day}-${index}`} className="flex items-center gap-3">
                  <div className="w-28 text-sm font-medium text-gray-700">{hour.day}</div>
                  <input
                    type="text"
                    value={hour.hours}
                    onChange={(event) => updateBusinessHour(index, 'hours', event.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="09:00 AM - 06:00 PM"
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={hour.closed || false}
                      onChange={(event) => updateBusinessHour(index, 'closed', event.target.checked)}
                      className="w-4 h-4 text-[#c9a227] rounded"
                    />
                    Closed
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploadingCover || uploadingGallery}
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
