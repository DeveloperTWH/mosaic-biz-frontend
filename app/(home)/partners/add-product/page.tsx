'use client';

import { useRouter } from 'next/navigation';
import VendorApplicationShell from '../components/VendorApplicationShell';
import VendorOnboardingProgress from '../components/VendorOnboardingProgress';
import VendorFormActions from '../components/VendorFormActions';
import DashboardLoadingBlock from '@/components/ui/dashboard-loading-block';
import { useProductForm } from './hooks/useProductForm';
import ProductDetails from './components/ProductDetails';
import VariationAttributes from './components/VariationAttributes';
import VariantsTable from './components/VariantsTable';
import MetaFields from './components/MetaFields';
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
      title="List a product"
      description="Add the essentials first — name, category, and photos. Variants and extra details are optional."
      backHref="/partners/products"
      backLabel="Back to products"
    >
      <VendorOnboardingProgress
        currentStage={4}
        saveNote="Your listing is created when you submit. You can add more products later from the products page."
      />

      <div className="max-w-6xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
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

              {variants.length > 0 ? (
                <VariantsTable
                  variants={variants}
                  hasVariants={formData.hasVariants}
                  onUpdate={updateVariant}
                  onUpdateAllShipping={updateAllShipping}
                  onRemove={removeVariant}
                  onImageUpload={handleVariantImageUpload}
                />
              ) : null}
            </div>

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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MetaFields
              metaFields={metaFields}
              onAdd={addMetaField}
              onUpdate={updateMetaField}
              onRemove={removeMetaField}
            />
          </div>

          <VendorFormActions
            hint="Feature image and product name are required for a complete listing."
            nextStepLabel="After your first listing, connect payouts and complete final review to go live."
            tertiary={{
              label: "Cancel",
              onClick: () => router.push('/partners/products'),
            }}
            primary={{
              type: 'submit',
              label: saving ? 'Creating product…' : 'Create product',
              disabled: saving,
              loading: saving,
              loadingLabel: 'Creating product…',
            }}
          />
        </form>
      </div>
    </VendorApplicationShell>
  );
}
