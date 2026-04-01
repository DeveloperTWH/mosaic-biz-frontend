'use client';

import React, { useRef, useState } from 'react';
import { Loader, Save, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { ChildServiceRow, Service } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Props {
  parentService: Service;
  childService: ChildServiceRow;
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

export default function EditChildServiceModal({ parentService, childService, onClose, onSave }: Props) {
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [name, setName] = useState(childService.name || '');
  const [description, setDescription] = useState(childService.description || '');
  const [price, setPrice] = useState(childService.price || 0);
  const [durationMinutes, setDurationMinutes] = useState(
    typeof childService.durationMinutes === 'number'
      ? childService.durationMinutes
      : parseDurationToMinutes(childService.duration)
  );
  const [image, setImage] = useState(childService.image || '');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadImage = async (file: File) => {
    const response = await fetch(
      `${API_BASE_URL}/api/service/upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}&documentType=service-gallery`,
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const fileUrl = await uploadImage(file);
      setImage(fileUrl);
      toast.success('Service image updated');
    } catch (error) {
      console.error('Error uploading service image:', error);
      toast.error('Failed to upload service image');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const normalizedServices = (parentService.services || []).map((service) => {
        if (service._id !== childService._id) {
          return {
            ...service,
            durationMinutes:
              typeof service.durationMinutes === 'number' && Number.isFinite(service.durationMinutes)
                ? service.durationMinutes
                : parseDurationToMinutes(service.duration),
            images: Array.isArray(service.images) ? service.images : service.image ? [service.image] : [],
          };
        }

        return {
          ...service,
          _id: childService._id,
          name: name.trim(),
          description,
          price: Number.isFinite(price) ? price : 0,
          durationMinutes: Number.isFinite(durationMinutes) ? durationMinutes : 60,
          duration: `${Number.isFinite(durationMinutes) ? durationMinutes : 60} minutes`,
          image,
          images: image ? [image] : [],
        };
      });

      const payload = {
        title: parentService.title || '',
        description: parentService.description || '',
        categoryId: parentService.categoryId?._id || '',
        subcategoryId: parentService.subcategoryId?._id || '',
        price: parentService.price ?? 0,
        duration: parentService.duration || '60 minutes',
        coverImage: parentService.coverImage || '',
        images: parentService.images || [],
        bookingToolLink: parentService.bookingToolLink || '',
        location: parentService.location || '',
        services: normalizedServices,
        businessHours: parentService.businessHours || [],
        isPublished: parentService.isPublished,
      };

      const response = await fetch(`${API_BASE_URL}/api/service/${parentService._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update  service');
      }

      toast.success('Child service updated successfully');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating child service:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update  service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-[#c9a227] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">Edit  Service</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(parseFloat(event.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(event) => setDurationMinutes(parseInt(event.target.value, 10) || 60)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="1"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Service Image</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-blue-900 text-white text-sm rounded-md hover:bg-blue-800 flex items-center gap-2 disabled:opacity-50"
                disabled={uploadingImage}
              >
                {uploadingImage ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload Image
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {image ? (
              <div className="w-32 h-32 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                <img src={image} alt="Service preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <p className="text-sm text-gray-500">No image uploaded for this service.</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploadingImage}
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
