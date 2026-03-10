import React, { useState, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { Product } from '../../types/index';
import { useProductUpload } from '../../hooks/useProductUpload';

// Import sections
import ImageGallerySection from './sections/ImageGallerySection';
import BasicInfoSection from './sections/BasicInfoSection';
import AttributesSection from './sections/AttributesSection';
import VariantsSection from './sections/VariantsSection';
import ShippingSection from './sections/ShippingSection';
import MetaFieldsSection from './sections/MetaFieldsSection';
import DiscountSection from './sections/DiscountSection';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Props {
  product: Product;
  onClose: () => void;
  onSave: () => void;
}

export default function EditProductModal({ product, onClose, onSave }: Props) {
  const [loading, setLoading] = useState(false);
  const [variantLoading, setVariantLoading] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { uploading, handleFileUpload } = useProductUpload();
  
  // Product form state
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    attributes: [] as { name: string; values: string[] }[],
    shipping: { standard: 0, overnight: 0, local: 0 },
    coverImage: '',
    galleryImages: [] as string[],
    metaFields: [] as { key: string; value: string }[],
    discount: { type: 'percentage' as 'percentage' | 'fixed', amount: 0, minCartValue: 0 },
    isPublished: true
  });

  // Variants state
  const [variants, setVariants] = useState<any[]>([]);

  const parseNumber = (value: unknown): number => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    if (value && typeof value === 'object' && '$numberDecimal' in (value as Record<string, unknown>)) {
      const parsed = parseFloat(String((value as Record<string, unknown>).$numberDecimal));
      return Number.isFinite(parsed) ? parsed : 0;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  // Initialize form with product data
  useEffect(() => {
    if (product) {
      setProductForm({
        title: product.title || '',
        description: product.description || '',
        categoryId: product.categoryId?._id || '',
        subcategoryId: product.subcategoryId?._id || '',
        attributes: product.attributes || [],
        shipping: product.shipping || { standard: 0, overnight: 0, local: 0 },
        coverImage: product.coverImage || '',
        galleryImages: product.galleryImages || [],
        metaFields: product.metaFields?.map(m => ({ key: m.key, value: m.value })) || [],
        discount: product.discount ? {
          type: product.discount.type as 'percentage' | 'fixed',
          amount: product.discount.amount,
          minCartValue: product.discount.minCartValue
        } : { type: 'percentage', amount: 0, minCartValue: 0 },
        isPublished: product.isPublished
      });

      if (product.variants) {
        setVariants(product.variants.map(v => ({
          _id: v._id,
          attributes: v.attributes,
          sku: v.sku,
          price: parseNumber(v.price),
          salePrice: v.salePrice !== undefined && v.salePrice !== null ? parseNumber(v.salePrice) : undefined,
          stock: v.stock || 0,
          images: v.images || [],
          shipping: {
            standard: parseNumber(v.shipping?.standard ?? product.shipping?.standard),
            overnight: parseNumber(v.shipping?.overnight ?? product.shipping?.overnight),
            local: parseNumber(v.shipping?.local ?? product.shipping?.local)
          },
          isPublished: v.isPublished
        })));
      }
    }
  }, [product]);

  const handleProductSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/product/${product._id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm)
        }
      );
      const data = await response.json();
      if (data.success || data.message) {
        toast.success(data.message || 'Product updated successfully');
        onSave();
        onClose();
      } else {
        toast.error(data.error || 'Failed to update product');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const handleVariantUpdate = async (variantId: string, updatedData: any) => {
    try {
      setVariantLoading(variantId);
      const response = await fetch(
        `${API_BASE_URL}/api/product/update-variant/${product._id}/${variantId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success('Variant updated successfully');
        setVariants(prev => prev.map(v => v._id === variantId ? { ...v, ...updatedData } : v));
      } else {
        toast.error(data.error || 'Failed to update variant');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error updating variant');
    } finally {
      setVariantLoading(null);
    }
  };

  const handleAddVariant = async (newVariant: any) => {
    const tempId = `temp-${Date.now()}`;
    setVariants([...variants, { ...newVariant, _id: tempId }]);
    toast.success('New variant added (will be saved when you click Save Changes)');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        
        {/* Header - Gold background */}
        <div className="bg-[#c9a227] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">Edit Product</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          
          {/* Image Gallery Section */}
          <ImageGallerySection
            coverImage={productForm.coverImage}
            galleryImages={productForm.galleryImages}
            uploading={uploading}
            onCoverUpload={async (file: File) => {
              const url = await handleFileUpload('cover', file);
              setProductForm(prev => ({ ...prev, coverImage: url }));
            }}
            onGalleryUpload={async (file: File) => {
              const url = await handleFileUpload('gallery', file);
              setProductForm(prev => ({
                ...prev,
                galleryImages: [...prev.galleryImages, url]
              }));
            }}
            onRemoveCover={() => setProductForm(prev => ({ ...prev, coverImage: '' }))}
            onRemoveGallery={(index) => {
              setProductForm(prev => ({
                ...prev,
                galleryImages: prev.galleryImages.filter((_, i) => i !== index)
              }));
            }}
            onImageClick={setSelectedImage}
          />

          <BasicInfoSection
            product={product}
            formData={{ title: productForm.title, isPublished: productForm.isPublished }}
            onTitleChange={(title) => setProductForm({ ...productForm, title })}
            onStatusChange={(isPublished) => setProductForm({ ...productForm, isPublished })}
          />

          {/* Description */}
          {/* <div>
            <label className="block text-xs text-gray-500 uppercase mb-1">Description</label>
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            />
          </div> */}

          <AttributesSection
            attributes={productForm.attributes}
            onAddAttribute={(name, values) => 
              setProductForm({ ...productForm, attributes: [...productForm.attributes, { name, values }] })
            }
            onUpdateAttribute={(index, values) => {
              const newAttributes = [...productForm.attributes];
              newAttributes[index].values = values;
              setProductForm({ ...productForm, attributes: newAttributes });
            }}
            onRemoveAttribute={(index) => 
              setProductForm({ 
                ...productForm, 
                attributes: productForm.attributes.filter((_, i) => i !== index) 
              })
            }
          />

          <VariantsSection
            variants={variants}
            productAttributes={productForm.attributes}
            onAddVariant={handleAddVariant}
            onUpdateVariant={handleVariantUpdate}
            onVariantImageUpload={async (file: File, index: number) => {
              return await handleFileUpload('variant', file, index);
            }}
            uploading={uploading}
            loadingVariantId={variantLoading}
          />

          {/* <ShippingSection
            shipping={productForm.shipping}
            onChange={(shipping) => setProductForm({ ...productForm, shipping })}
          /> */}

          {productForm.metaFields.length > 0 && (
            <MetaFieldsSection
              metaFields={productForm.metaFields}
              onChange={(index, field, value) => {
                const newFields = [...productForm.metaFields];
                newFields[index][field] = value;
                setProductForm({ ...productForm, metaFields: newFields });
              }}
            />
          )}

          <DiscountSection
            discount={productForm.discount}
            onChange={(discount) => setProductForm({ ...productForm, discount })}
          />
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4">
            <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white">
              <X className="w-8 h-8" />
            </button>
            <img src={selectedImage} alt="Product" className="max-h-full max-w-full object-contain" />
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-gray-400 text-white text-sm font-medium rounded hover:bg-gray-500">
            Cancel
          </button>
          <button
            onClick={handleProductSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-900 text-white text-sm font-medium rounded hover:bg-blue-800 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
