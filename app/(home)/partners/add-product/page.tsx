'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import VendorApplicationShell from '../components/VendorApplicationShell';
import DashboardLoadingBlock from '@/components/ui/dashboard-loading-block';
import { useProductForm } from './hooks/useProductForm';
import ProductDetails from './components/ProductDetails';
import VariationAttributes from './components/VariationAttributes';
import VariantsTable from './components/VariantsTable';
import MetaFields from './components/MetaFields';
import Discounts from './components/Discounts';
import ImageUpload from './components/ImageUpload';

export default function AddProductPage() {
  const router = useRouter();
  const {
    loading,
    saving,
    formData,
    errors,
    businesses,
    categories,
    subcategories,
    taxCategories,
    taxEnabled,
    registeredTaxState,
    taxLoading,
    refreshTaxSettings,
    uploading,
    uploadProgress,
    handleInputChange,
    handleSubmit,
    toggleHasVariants,
    attributes,
    addAttribute,
    updateAttribute,
    removeAttribute,
    addAttributeValue,
    removeAttributeValue,
    generateVariants,
    variants,
    updateVariant,
    updateAllShipping,
    removeVariant,
    metaFields,
    addMetaField,
    updateMetaField,
    removeMetaField,
    discount,
    updateDiscount,
    handleFileUpload,
    removeImage,
   handleVariantImageUpload,
  } = useProductForm();

  if (loading) {
    return (
      <VendorApplicationShell variant="dashboard" title="Add product">
        <DashboardLoadingBlock label="Loading product form…" minHeight="min-h-[50vh]" />
      </VendorApplicationShell>
    );
  }

  return (
    <VendorApplicationShell
      variant="dashboard"
      title="List products"
      description="Showcase all your products along with all the variations"
      backHref="/partners/products"
      backLabel="Back to products"
    >
      <div className="max-w-6xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Product Details */}
              <ProductDetails
                formData={formData}
                errors={errors}
                businesses={businesses}
                categories={categories}
                subcategories={subcategories}
                taxCategories={taxCategories}
                taxEnabled={taxEnabled}
                registeredTaxState={registeredTaxState}
                taxLoading={taxLoading}
                onTaxSettingsUpdated={refreshTaxSettings}
                onInputChange={handleInputChange}
                onToggleVariants={toggleHasVariants}
              />

              {/* Variation Attributes */}
              <VariationAttributes
                attributes={attributes}
                onAdd={addAttribute}
                onUpdate={updateAttribute}
                onRemove={removeAttribute}
                onAddValue={addAttributeValue}
                onRemoveValue={removeAttributeValue}
                onGenerateVariants={generateVariants}
                disabled={!formData.hasVariants}
              />

              {/* Variants Table */}
{variants.length > 0 && (
  <VariantsTable
    variants={variants}
    hasVariants={formData.hasVariants}
    onUpdate={updateVariant}
    onUpdateAllShipping={updateAllShipping}
    onRemove={removeVariant}
    onImageUpload={handleVariantImageUpload}
  />
)}
            </div>

            {/* Right Column - Images */}
            <div className="lg:col-span-1">
              <ImageUpload
                featureImage={formData.featureImage}
                galleryImages={formData.galleryImages}
                errors={errors}
                onFeatureUpload={(file) => handleFileUpload('feature', file)}
                onGalleryUpload={(file) => handleFileUpload('gallery', file)}
                onRemoveFeature={() => removeImage('feature')}
                onRemoveGallery={(index) => removeImage('gallery', index)}
                uploading={uploading}
                uploadProgress={uploadProgress}
              />
            </div>
          </div>

          {/* Bottom Row - Meta Fields and Discounts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Meta Fields */}
            <MetaFields
              metaFields={metaFields}
              onAdd={addMetaField}
              onUpdate={updateMetaField}
              onRemove={removeMetaField}
            />

            {/* Discounts */}
            {/* <Discounts
              discount={discount}
              onUpdate={updateDiscount}
            /> */}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-start gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-[#c9a227] text-white text-sm font-medium rounded hover:bg-[#b8921f] flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : null}
              Create Product
            </button>
            <button
              type="button"
              onClick={() => router.push('/partners/products')}
              className="px-8 py-2.5 bg-gray-400 text-white text-sm font-medium rounded hover:bg-gray-500"
            >
              Clear Response
            </button>
          </div>
        </form>
      </div>
    </VendorApplicationShell>
  );
}
