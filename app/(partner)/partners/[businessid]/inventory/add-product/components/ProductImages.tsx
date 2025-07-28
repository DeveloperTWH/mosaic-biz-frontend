"use client";

import React, { useRef } from "react";

interface ProductImagesProps {
  productData: any;
  setProductData: React.Dispatch<React.SetStateAction<any>>;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  productData,
  setProductData,
}) => {
  const featureInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const handleFeatureImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductData((prev: any) => ({ ...prev, featureImage: file }));
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setProductData((prev: any) => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), ...newFiles],
      }));
    }
  };

  const removeGalleryImage = (index: number) => {
    setProductData((prev: any) => {
      const updated = [...prev.galleryImages];
      updated.splice(index, 1);
      return { ...prev, galleryImages: updated };
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Product Images</h2>

      {/* Feature Image */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Feature Image</label>
        <input
          type="file"
          accept="image/*"
          ref={featureInputRef}
          onChange={handleFeatureImageChange}
          className="block w-full text-sm text-gray-500 border rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
        />
        {productData.featureImage && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(productData.featureImage)}
              alt="Feature"
              className="object-cover w-32 h-32 rounded-md"
            />
          </div>
        )}
      </div>

      {/* Gallery Images */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Product Gallery</label>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={galleryInputRef}
          onChange={handleGalleryImagesChange}
          className="block w-full text-sm text-gray-500 border rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
        />

        {/* Gallery Preview */}
        {productData.galleryImages.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {productData.galleryImages.map((img: File, index: number) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Gallery ${index}`}
                  className="object-cover w-24 h-24 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-0 right-0 p-1 text-xs text-white bg-red-500 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImages;
