import React from 'react';
import { X, Image as ImageIcon, Plus } from 'lucide-react';
import VendorFormSection from '../../components/VendorFormSection';
import VendorUploadZone from '../../components/VendorUploadZone';

interface Props {
  featureImage: string;
  galleryImages: string[];
  errors?: Record<string, string>;
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
  errors,
  onFeatureUpload,
  onGalleryUpload,
  onRemoveFeature,
  onRemoveGallery,
  uploading,
  uploadProgress,
}: Props) {
  return (
    <VendorFormSection
      title="Product images"
      description="A strong feature image helps customers notice your listing in search and category pages."
    >
      <div className="space-y-6">
        <VendorUploadZone
          id="feature-upload"
          label="Feature image"
          helperText="Use a clear product photo. JPG or PNG, under 5 MB."
          accept="image/*"
          uploading={uploading.feature}
          uploadProgress={uploadProgress.feature}
          error={errors?.featureImage}
          emptyHint="Primary photo shown on cards and search results"
          onFileChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFeatureUpload(file);
          }}
          preview={
            featureImage ? (
              <div className="relative inline-block">
                <img
                  src={featureImage}
                  alt="Feature"
                  className="h-40 w-40 rounded-lg border border-dashboard-border-light object-cover"
                />
                <button
                  type="button"
                  onClick={onRemoveFeature}
                  className="absolute -right-2 -top-2 flex min-h-8 min-w-8 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                  aria-label="Remove feature image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : undefined
          }
        />

        <div>
          <label className="vendor-upload-zone-label">Gallery images</label>
          <p className="vendor-upload-zone-helper">
            Add extra angles or lifestyle shots. Limits may depend on your subscription tier.
          </p>
          <div className="flex flex-wrap gap-3">
            {galleryImages.map((img, index) => (
              <div key={index} className="group relative h-16 w-16">
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="h-full w-full rounded border border-dashboard-border-light object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveGallery(index)}
                  className="absolute -right-2 -top-2 flex min-h-7 min-w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label={`Remove gallery image ${index + 1}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-dashboard-border-light bg-surface-cream transition-colors hover:border-dashboard-gold">
              <input
                type="file"
                id="gallery-upload"
                className="sr-only"
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
              {uploading.gallery ? (
                <ImageIcon className="h-4 w-4 animate-pulse text-dashboard-gold" />
              ) : (
                <Plus className="h-4 w-4 text-dashboard-muted" />
              )}
            </label>
          </div>
          {errors?.galleryImages ? (
            <p className="vendor-upload-zone-error">{errors.galleryImages}</p>
          ) : null}
        </div>
      </div>
    </VendorFormSection>
  );
}
