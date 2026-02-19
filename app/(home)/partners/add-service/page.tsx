'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader } from 'lucide-react';
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
    uploadProgress,
    handleInputChange,
    handleSubmit,
    childServices,
    addChildService,
    updateChildService,
    removeChildService,
    businessHours,
    updateBusinessHour,
    handleFileUpload,
    removeImage,
  } = useServiceForm();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-12 h-12 text-[#c9a227] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">LIST SERVICES</h1>
          <p className="text-sm text-gray-500 mt-1">Showcase all your services</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 1️⃣ Service Details */}
              <ServiceCategory
                formData={formData}
                errors={errors}
                businesses={businesses}
                categories={categories}
                subcategories={subcategories}
                onInputChange={handleInputChange}
              />

              {/* 2️⃣ Location & Hours Section */}
              <div className="bg-gray-100 border-2 border-blue-400 rounded-md p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4 border-l-4 border-[#c9a227] pl-3">Location & Hours</h2>
                
                {/* Map Location */}
                <LocationField
                  location={formData.location}
                  onLocationChange={(location) => handleInputChange('location', location)}
                />

                {/* Business Hours */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Add Hours</h3>
                  <BusinessHours
                    businessHours={businessHours}
                    onUpdate={updateBusinessHour}
                  />
                </div>
              </div>

              {/* 3️⃣ Booking Tool */}
              <div className="bg-gray-100 border border-gray-200 rounded-md p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4 border-l-4 border-[#c9a227] pl-3">Booking Tool</h2>
                <BookingTool
                  bookingToolLink={formData.bookingToolLink}
                  onBookingLinkChange={(link) => handleInputChange('bookingToolLink', link)}
                />
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="lg:col-span-1">
              <ServiceImages
                coverImage={formData.coverImage}
                galleryImages={formData.images}
                onCoverUpload={(file) => handleFileUpload('cover', file)}
                onGalleryUpload={(file) => handleFileUpload('gallery', file)}
                onRemoveCover={() => removeImage('cover')}
                onRemoveGallery={(index) => removeImage('gallery', index)}
                uploading={uploading}
                uploadProgress={uploadProgress}
              />
            </div>
          </div>

          {/* 5️⃣ Create Service (Child Services) */}
          <div className="bg-gray-100 border border-gray-200 rounded-md p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 border-l-4 border-[#c9a227] pl-3">Create Service</h2>
              <button
                type="button"
                onClick={addChildService}
                className="px-4 py-1.5 bg-blue-900 text-white text-sm rounded hover:bg-blue-800"
              >
                + Add Service
              </button>
            </div>
            <ChildServices
              childServices={childServices}
              onAdd={addChildService}
              onUpdate={updateChildService}
              onRemove={removeChildService}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-start gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-[#c9a227] text-white rounded text-sm font-medium hover:bg-[#b8921f] flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : null}
              Create Service
            </button>
            <button
              type="button"
              onClick={() => router.push('/partners/services')}
              className="px-8 py-2.5 bg-gray-400 text-white rounded text-sm font-medium hover:bg-gray-500"
            >
              Clear Response
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}