'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#c9a227] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">LIST PRODUCTS</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showcase all your products along with all the variations
          </p>
        </div>

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
    </div>
  );
}
