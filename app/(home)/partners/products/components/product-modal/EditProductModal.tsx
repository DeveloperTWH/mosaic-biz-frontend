'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { Product, TaxCategoryRate } from '../../types/index';
import { useProductUpload } from '../../hooks/useProductUpload';
import RichTextEditor from '../../../add-product/components/RichTextEditor';

// Import sections
import ImageGallerySection from './sections/ImageGallerySection';
import BasicInfoSection from './sections/BasicInfoSection';
import AttributesSection from './sections/AttributesSection';
import VariantsSection from './sections/VariantsSection';
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { uploading, handleFileUpload } = useProductUpload();
  const [taxCategories, setTaxCategories] = useState<TaxCategoryRate[]>([]);
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [registeredTaxState, setRegisteredTaxState] = useState('');
  const [taxLoading, setTaxLoading] = useState(false);
  
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
    isPublished: true,
    taxCategory: null as Product['taxCategory'],
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
        isPublished: product.isPublished,
        taxCategory: product.taxCategory || null,
      });

      if (product.variants) {
        setVariants(product.variants.map(v => ({
          _id: v._id,
          attributes: v.attributes,
          sku: v.sku,
          price: parseNumber(v.price),
          salePrice: v.salePrice !== undefined && v.salePrice !== null ? parseNumber(v.salePrice) : undefined,
          stock: v.stock || 0,
          images: (v.images || []).slice(0, 1),
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

  useEffect(() => {
    const fetchTaxSettings = async () => {
      if (!product?.businessId) {
        setTaxCategories([]);
        setTaxEnabled(false);
        setRegisteredTaxState('');
        return;
      }

      try {
        setTaxLoading(true);

        const response = await axios.get(
          `${API_BASE_URL}/api/business/${product.businessId}/tax-settings`,
          { withCredentials: true }
        );

        const settings = response.data?.taxSettings;
        const normalizedCategories: TaxCategoryRate[] = Array.isArray(settings?.categories)
          ? settings.categories.map((category: any) => ({
              code: category?.code ?? '',
              label: category?.label ?? 'Untitled Category',
              rate: Number(category?.rate ?? 0),
            }))
          : [];

        setTaxCategories(normalizedCategories);
        setTaxEnabled(Boolean(settings?.enabled));
        setRegisteredTaxState(settings?.registeredState ?? '');

        setProductForm((prev) => {
          const hasSelectedCategory = prev.taxCategory
            ? normalizedCategories.some((category) => category.code === prev.taxCategory?.code)
            : false;

          return {
            ...prev,
            taxCategory: hasSelectedCategory ? prev.taxCategory : null,
          };
        });
      } catch (error) {
        console.error('Error fetching tax settings:', error);
        setTaxCategories([]);
        setTaxEnabled(false);
        setRegisteredTaxState('');
      } finally {
        setTaxLoading(false);
      }
    };

    fetchTaxSettings();
  }, [product]);

  const toVariantPayload = (variant: any) => {
    const shipping = variant?.shipping || {};
    return {
      attributes: variant?.attributes || {},
      sku: variant?.sku || '',
      price: parseNumber(variant?.price),
      salePrice:
        variant?.salePrice !== undefined && variant?.salePrice !== null && variant?.salePrice !== ''
          ? parseNumber(variant?.salePrice)
          : undefined,
      stock: parseNumber(variant?.stock),
      images: Array.isArray(variant?.images) ? variant.images.slice(0, 1) : [],
      shipping: {
        standard: parseNumber(shipping?.standard),
        overnight: parseNumber(shipping?.overnight),
        local: parseNumber(shipping?.local)
      },
      isPublished: Boolean(variant?.isPublished)
    };
  };

  const handleAddVariant = () => {
    const tempId = `temp-${Date.now()}`;
    setVariants([
      ...variants,
      {
        sku: '',
        price: 0,
        stock: 0,
        images: [],
        shipping: { standard: 0, overnight: 0, local: 0 },
        isPublished: true,
        _id: tempId
      }
    ]);
    toast.success('New variant added (will be saved when you click Save Changes)');
  };

  const handleVariantLocalUpdate = async (variantId: string, updatedData: any) => {
    setVariants((prev) =>
      prev.map((v) => (v._id === variantId ? { ...v, ...updatedData } : v))
    );
  };

  const handleRemoveVariant = (variantId: string) => {
    setVariants((prev) => prev.filter((v) => v._id !== variantId));
  };

  const handleSaveAll = async () => {
    try {
      setLoading(true);

      // Update product + variants in a single request (backend upserts variants)
      const variantsPayload = variants.map((v) => {
        const basePayload = toVariantPayload(v);
        const isExistingId = typeof v?._id === 'string' && !v._id.startsWith('temp-');
        return isExistingId ? { _id: v._id, ...basePayload } : basePayload;
      });

      if (variantsPayload.some((v) => !String((v as any)?.sku || '').trim())) {
        throw new Error('Please enter SKU for all variants before saving.');
      }

      if (taxEnabled && !productForm.taxCategory) {
        throw new Error('Tax category is required when tax settings are enabled.');
      }

      const productRes = await fetch(`${API_BASE_URL}/api/product/${product._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          taxCategory: productForm.taxCategory || undefined,
          variants: variantsPayload,
        })
      });
      const productData = await productRes.json();
      if (!productRes.ok || !productData.success) {
        throw new Error(productData.error || 'Failed to update product');
      }

      toast.success(productData.message || 'Saved changes successfully');
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
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

          <div className="rounded-md border border-[#f0bc83] bg-[#fffaf4] p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-[#b45d19] mb-1">
                    Tax Category {taxEnabled ? '*' : ''}
                  </label>
                  <p className="text-sm text-gray-700">
                    Registered state: {registeredTaxState || 'Not configured'}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    taxEnabled
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {taxLoading ? 'Loading...' : taxEnabled ? 'Tax enabled' : 'Tax disabled'}
                </span>
              </div>

              <div>
                <select
                  value={productForm.taxCategory?.code || ''}
                  onChange={(e) => {
                    const selected = taxCategories.find((category) => category.code === e.target.value);
                    setProductForm((prev) => ({
                      ...prev,
                      taxCategory: selected
                        ? { code: selected.code, label: selected.label }
                        : null,
                    }));
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227] bg-white"
                  disabled={taxLoading || taxCategories.length === 0}
                >
                  <option value="">
                    {taxLoading
                      ? 'Loading tax categories...'
                      : taxCategories.length > 0
                        ? 'Choose Tax Category'
                        : 'No tax categories available'}
                  </option>
                  {taxCategories.map((category) => (
                    <option key={category.code} value={category.code}>
                      {category.label}
                    </option>
                  ))}
                </select>

                {productForm.taxCategory ? (
                  <p className="mt-2 text-xs text-gray-500">
                    Rate for this category:{' '}
                    {(
                      taxCategories.find((category) => category.code === productForm.taxCategory?.code)?.rate ?? 0
                    ).toFixed(2)}
                    %
                  </p>
                ) : taxEnabled ? (
                  <p className="mt-2 text-xs text-gray-500">
                    Select the tax category that matches this product.
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-gray-500">
                    Tax is currently disabled for this business.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-gray-500 uppercase mb-1">Description</label>
            <RichTextEditor
              value={productForm.description}
              onChange={(description) => setProductForm({ ...productForm, description })}
              placeholder="Enter product description"
            />
          </div>

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
            onUpdateVariant={handleVariantLocalUpdate}
            onRemoveVariant={handleRemoveVariant}
            onVariantImageUpload={async (file: File, variantKey: string) => {
              return await handleFileUpload('variant', file, variantKey);
            }}
            uploading={uploading}
            loadingVariantId={null}
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

          {/* <DiscountSection
            discount={productForm.discount}
            onChange={(discount) => setProductForm({ ...productForm, discount })}
          /> */}
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
            onClick={handleSaveAll}
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
