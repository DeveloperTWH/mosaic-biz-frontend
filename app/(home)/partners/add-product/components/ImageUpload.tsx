import React from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';

interface Props {
  featureImage: string;
  galleryImages: string[];
  onFeatureUpload: (file: File) => Promise<void>;
  onGalleryUpload: (file: File) => Promise<void>;
  onRemoveFeature: () => void;
  onRemoveGallery: (index: number) => void;
  uploading: Record<string, boolean>;
  uploadProgress: Record<string, number>;
}

export default function ImageUpload({
  featureImage,
  galleryImages,
  onFeatureUpload,
  onGalleryUpload,
  onRemoveFeature,
  onRemoveGallery,
  uploading,
  uploadProgress,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Product Images</h2>

      <div className="space-y-6">
        {/* Feature Image */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Feature Image
          </label>
          {featureImage ? (
            <div className="relative w-40 h-40">
              <img
                src={featureImage}
                alt="Feature"
                className="w-full h-full object-cover rounded border border-gray-200"
              />
              <button
                type="button"
                onClick={onRemoveFeature}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded p-6 text-center hover:border-[#c9a227] transition-colors">
              <input
                type="file"
                id="feature-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFeatureUpload(file);
                }}
              />
              <label
                htmlFor="feature-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Click to upload</span>
              </label>
            </div>
          )}
        </div>

        {/* Product Gallery */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Product Gallery
          </label>
          <div className="flex flex-wrap gap-3">
            {galleryImages.map((img, index) => (
              <div key={index} className="relative w-16 h-16 group">
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover rounded border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => onRemoveGallery(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <div className="w-16 h-16 border border-dashed border-gray-300 rounded flex items-center justify-center hover:border-[#c9a227] transition-colors">
              <input
                type="file"
                id="gallery-upload"
                className="hidden"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length === 0) return;

                  for (const file of files) {
                    await onGalleryUpload(file);
                  }

                  e.target.value = '';
                }}
              />
              <label htmlFor="gallery-upload" className="cursor-pointer">
                <Plus className="w-4 h-4 text-gray-400" />
              </label>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
           maximum 5 image allowed baced on your subscription plan
          </p>
        </div>
      </div>
    </div>
  );
}
