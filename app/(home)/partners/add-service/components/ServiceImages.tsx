import React from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface Props {
  coverImage: string;
  galleryImages: string[];
  coverError?: string;
  error?: string;
  onCoverUpload: (file: File) => Promise<void>;
  onGalleryUpload: (files: File[]) => Promise<void>;
  onRemoveCover: () => void;
  onRemoveGallery: (index: number) => void;
  uploading: Record<string, boolean>;
  uploadProgress: Record<string, number>;
}

export default function ServiceImages({
  coverImage,
  galleryImages,
  coverError,
  error,
  onCoverUpload,
  onGalleryUpload,
  onRemoveCover,
  onRemoveGallery,
  uploading,
  uploadProgress,
}: Props) {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-md p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4 border-l-4 border-[#c9a227] pl-3">Feature Banner Image</h2>

      {/* Feature Image */}
      <div className="mb-6">
        {coverError ? (
          <p className="mb-3 text-xs text-red-600">{coverError}</p>
        ) : null}
        {coverImage ? (
          <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <button
              onClick={onRemoveCover}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <input
              type="file"
              id="cover-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  const maxSize = 5 * 1024 * 1024; // 5MB

                  if (file.size > maxSize) {
                    alert('Image must be less than 5MB');
                    e.currentTarget.value = '';
                    return;
                  }

                  onCoverUpload(file);
                }

                e.currentTarget.value = '';
              }}
            />

            <label
              htmlFor="cover-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-xs text-gray-400">
                Max 5MB
              </p>
            </label>
          </div>
        )}
      </div>

      {/* Service Gallery */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1 border-l-4 border-[#c9a227] pl-3">Service Gallery</h3>
        <p className="text-xs text-gray-500 mb-3 pl-4">uploding gallary images allowed baced on your subsritpion plan</p>
        {error ? (
          <p className="mb-3 pl-4 text-xs text-red-600">{error}</p>
        ) : null}

        {/* Add Photo Button */}
        <div className="mb-3">
          <input
            type="file"
            id="gallery-upload"
            className="hidden"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              const maxSize = 5 * 1024 * 1024; // 5MB

              const validFiles = files.filter((file) => {
                if (file.size > maxSize) {
                  alert(`${file.name} is larger than 5MB`);
                  return false;
                }
                return true;
              });

              if (validFiles.length > 0) {
                onGalleryUpload(validFiles);
              }

              e.currentTarget.value = '';
            }}
          />
          <label
            htmlFor="gallery-upload"
            className="inline-block px-6 py-2 bg-[#c9a227] text-white text-sm rounded cursor-pointer hover:bg-[#b8921f]"
          >
            Add Photo
          </label>
          <p className="text-xs text-gray-400 mb-3">
            Preferred image size: 1080 × 1080 pixels
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="flex flex-wrap gap-3">
          {galleryImages.map((img, index) => (
            <div key={index} className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={img}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onRemoveGallery(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {galleryImages.length < 5 && (
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <label htmlFor="gallery-upload" className="cursor-pointer">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
