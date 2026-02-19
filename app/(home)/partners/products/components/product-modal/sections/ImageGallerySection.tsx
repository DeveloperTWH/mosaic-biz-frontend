import React from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface Props {
  coverImage: string;
  galleryImages: string[];
  uploading: Record<string, boolean>;
  onCoverUpload: (file: File) => Promise<void>;
  onGalleryUpload: (file: File) => Promise<void>;
  onRemoveCover: () => void;
  onRemoveGallery: (index: number) => void;
  onImageClick: (image: string) => void;
}

export default function ImageGallerySection({
  coverImage,
  galleryImages,
  uploading,
  onCoverUpload,
  onGalleryUpload,
  onRemoveCover,
  onRemoveGallery,
  onImageClick
}: Props) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Product Images</h3>
      
      {/* Cover Image */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-2">Cover Image</label>
        <div className="flex items-center gap-4">
          {coverImage ? (
            <div className="relative w-32 h-32 group">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover rounded-lg border-2 border-[#c9a227] cursor-pointer"
                onClick={() => onImageClick(coverImage)}
              />
              <button
                onClick={onRemoveCover}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <input
            type="file"
            id="cover-upload"
            className="hidden"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await onCoverUpload(file);
            }}
          />
          <label
            htmlFor="cover-upload"
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 cursor-pointer flex items-center gap-1"
          >
            <Upload className="w-3 h-3" />
            {uploading['cover'] ? 'Uploading...' : 'Upload Cover'}
          </label>
        </div>
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-xs text-gray-500 mb-2">Gallery Images</label>
        <div className="flex flex-wrap gap-3">
          {galleryImages.map((img, index) => (
            <div key={index} className="relative w-20 h-20 group">
              <img
                src={img}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-200 cursor-pointer"
                onClick={() => onImageClick(img)}
              />
              <button
                onClick={() => onRemoveGallery(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          <input
            type="file"
            id="gallery-upload"
            className="hidden"
            accept="image/*"
            multiple
            onChange={async (e) => {
              const files = e.target.files;
              if (files) {
                for (let i = 0; i < files.length; i++) {
                  await onGalleryUpload(files[i]);
                }
              }
            }}
          />
          <label
            htmlFor="gallery-upload"
            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#c9a227] transition-colors cursor-pointer"
          >
            <Upload className="w-5 h-5 text-gray-400" />
          </label>
        </div>
      </div>
    </div>
  );
}