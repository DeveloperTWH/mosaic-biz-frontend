import { useState } from 'react';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useProductUpload = () => {
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const handleFileUpload = async (
    type: 'cover' | 'gallery' | 'variant',
    file: File,
    variantKey?: string | number
  ): Promise<string> => {
    try {
      const uploadKey = type === 'variant' ? `variant-${variantKey ?? 'unknown'}` : type;
      setUploading(prev => ({ ...prev, [uploadKey]: true }));

      const documentType = type === 'cover' ? 'product-cover' : 
                          type === 'gallery' ? 'product-gallery' : 'product-variant';
      
      const response = await fetch(
        `${API_BASE_URL}/api/product/upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}&documentType=${documentType}`,
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

      toast.success('File uploaded successfully!');
      return fileUrl;

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
      throw error;
    } finally {
      const uploadKey = type === 'variant' ? `variant-${variantKey ?? 'unknown'}` : type;
      setUploading(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  return { uploading, handleFileUpload };
};
