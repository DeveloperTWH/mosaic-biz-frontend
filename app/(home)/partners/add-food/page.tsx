'use client';

import { useRouter } from 'next/navigation';
import VendorApplicationShell from '../components/VendorApplicationShell';
import VendorOnboardingProgress from '../components/VendorOnboardingProgress';
import VendorFormSection from '../components/VendorFormSection';
import VendorFormActions from '../components/VendorFormActions';
import DashboardLoadingBlock from '@/components/ui/dashboard-loading-block';
import { useFoodForm } from './hooks/useServiceForm';
import ServiceCategory from './components/ServiceCategory';
import LocationField from './components/locationField';
import BusinessHours from './components/BusinessHours';
import BookingTool from './components/BookingTool';
import ServiceImages from './components/ServiceImages';
import MetaFields from './components/MetaFields';

export default function AddFoodPage() {
  const router = useRouter();

  const {
    loading,
    saving,
    formData,
    errors,
    businesses,
    categories,
    subcategories,
    uploading,
    uploadProgress,
    handleInputChange,
    handleSubmit,
    businessHours,
    updateBusinessHour,
    handleFileUpload,
    removeImage,
    addMetaField,
    updateMetaField,
    removeMetaField,
  } = useFoodForm();

  if (loading) {
    return (
      <VendorApplicationShell variant="dashboard" title="Add food">
        <DashboardLoadingBlock label="Loading food form…" minHeight="min-h-[50vh]" />
      </VendorApplicationShell>
    );
  }

  return (
    <VendorApplicationShell
      variant="dashboard"
      title="List a food offering"
      description="Share your menu, hours, and photos so hungry customers can find you."
      backHref="/partners/foods"
      backLabel="Back to foods"
    >
      <VendorOnboardingProgress
        currentStage={4}
        saveNote="Upload cover and menu images when ready — you can edit this listing later."
      />

      <div className="max-w-6xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <ServiceCategory
                formData={formData}
                errors={errors}
                businesses={businesses}
                categories={categories}
                subcategories={subcategories}
                onInputChange={handleInputChange}
              />

              <VendorFormSection
                title="Location & hours"
                description="Where customers can visit or pick up, and when you're open."
              >
                <LocationField
                  location={formData.location}
                  onLocationChange={(location) => handleInputChange('location', location)}
                />
                <div>
                  <h3 className="mb-3 font-poppins text-sm font-medium text-dashboard-text">Business hours</h3>
                  <BusinessHours businessHours={businessHours} onUpdate={updateBusinessHour} />
                </div>
              </VendorFormSection>

              <VendorFormSection
                title="Booking tool"
                description="Optional reservation or ordering link."
              >
                <BookingTool
                  bookingToolLink={formData.bookingToolLink}
                  onBookingLinkChange={(link) => handleInputChange('bookingToolLink', link)}
                />
              </VendorFormSection>
            </div>

            <div className="lg:col-span-1">
              <ServiceImages
                coverImage={formData.coverImage}
                galleryImages={formData.images}
                menuImage={formData.menuImage}
                coverError={errors.coverImage}
                galleryError={errors.images}
                onCoverUpload={(file) => handleFileUpload('cover', file)}
                onGalleryUpload={async (files) => {
                  for (const file of files) {
                    await handleFileUpload('gallery', file);
                  }
                }}
                onMenuUpload={(file) => handleFileUpload('menu', file)}
                onRemoveCover={() => removeImage('cover')}
                onRemoveGallery={(index) => removeImage('gallery', index)}
                onRemoveMenu={() => removeImage('menu')}
                onCoverUrlChange={(value) => handleInputChange('coverImage', value)}
                onMenuUrlChange={(value) => handleInputChange('menuImage', value)}
                uploading={uploading}
                uploadProgress={uploadProgress}
              />
            </div>
          </div>

          <VendorFormSection title="Additional details" description="Optional tags and notes for your food listing.">
            <MetaFields
              metaFields={formData.metaFields}
              onAdd={addMetaField}
              onUpdate={updateMetaField}
              onRemove={removeMetaField}
            />
          </VendorFormSection>

          <VendorFormActions
            hint="Cover image and title are the minimum to create a food listing."
            nextStepLabel="After listing food items, finish payout setup and final review to launch."
            tertiary={{
              label: 'Cancel',
              onClick: () => router.push('/partners/foods'),
            }}
            primary={{
              type: 'submit',
              label: saving ? 'Saving…' : formData.title ? 'Save food listing' : 'Create food listing',
              disabled: saving,
              loading: saving,
              loadingLabel: 'Saving…',
            }}
          />
        </form>
      </div>
    </VendorApplicationShell>
  );
}
