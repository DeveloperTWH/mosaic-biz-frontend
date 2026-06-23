'use client';

import { useRouter } from 'next/navigation';
import VendorApplicationShell from '../components/VendorApplicationShell';
import VendorOnboardingProgress from '../components/VendorOnboardingProgress';
import VendorFormSection from '../components/VendorFormSection';
import VendorFormActions from '../components/VendorFormActions';
import DashboardLoadingBlock from '@/components/ui/dashboard-loading-block';
import { useServiceForm } from './hooks/useServiceForm';
import ServiceCategory from './components/ServiceCategory';
import LocationField from './components/locationField';
import BusinessHours from './components/BusinessHours';
import BookingTool from './components/BookingTool';
import ServiceImages from './components/ServiceImages';
import ChildServices from './components/ChildServices';

export default function AddServicePage() {
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
    isUploading,
    uploadProgress,
    handleInputChange,
    handleSubmit,
    childServices,
    addChildService,
    updateChildService,
    removeChildService,
    handleChildServiceImageUpload,
    removeChildServiceImage,
    businessHours,
    updateBusinessHour,
    handleFileUpload,
    removeImage,
  } = useServiceForm();

  if (loading) {
    return (
      <VendorApplicationShell variant="dashboard" title="Add service">
        <DashboardLoadingBlock label="Loading service form…" minHeight="min-h-[50vh]" />
      </VendorApplicationShell>
    );
  }

  return (
    <VendorApplicationShell
      variant="dashboard"
      title="List a service"
      description="Describe your service, set hours and location, then add individual offerings customers can book."
      backHref="/partners/services"
      backLabel="Back to services"
    >
      <VendorOnboardingProgress
        currentStage={4}
        saveNote="Save a draft anytime, or publish when your service details and images are ready."
      />

      <div className="max-w-6xl">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit(false);
          }}
          className="space-y-6"
        >
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
                description="Help customers find you and know when you're available."
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
                description="Optional link to Calendly, Acuity, or another booking page."
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
                coverError={errors.coverImage}
                error={errors.images}
                onCoverUpload={(file) => handleFileUpload('cover', file)}
                onGalleryUpload={async (files) => {
                  for (const file of files) {
                    await handleFileUpload('gallery', file);
                  }
                }}
                onRemoveCover={() => removeImage('cover')}
                onRemoveGallery={(index) => removeImage('gallery', index)}
                uploading={uploading}
                uploadProgress={uploadProgress}
              />
            </div>
          </div>

          <VendorFormSection
            title="Service offerings"
            description="Add one or more bookable services with pricing and descriptions."
          >
            <ChildServices
              childServices={childServices}
              onAdd={addChildService}
              onUpdate={updateChildService}
              onRemove={removeChildService}
              onUploadImage={handleChildServiceImageUpload}
              onRemoveImage={removeChildServiceImage}
              uploading={uploading || {}}
              uploadProgress={uploadProgress || {}}
            />
          </VendorFormSection>

          <VendorFormActions
            hint="Cover image and at least one service offering are needed before publishing."
            nextStepLabel="Published services appear on your storefront after final review."
            tertiary={{
              label: 'Cancel',
              onClick: () => router.push('/partners/services'),
            }}
            secondary={{
              label: isUploading ? 'Uploading images…' : saving ? 'Saving draft…' : 'Save draft',
              type: 'submit',
              disabled: saving || isUploading,
              loading: saving && !isUploading,
              loadingLabel: 'Saving draft…',
            }}
            primary={{
              label: saving || isUploading ? 'Working…' : 'Publish service',
              onClick: () => handleSubmit(true),
              disabled: saving || isUploading,
              loading: saving || isUploading,
              loadingLabel: isUploading ? 'Uploading images…' : 'Publishing…',
            }}
          />
        </form>
      </div>
    </VendorApplicationShell>
  );
}
