'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader, X } from 'lucide-react';
import { useServices } from './hooks/useServices';
import { useServiceModal } from './hooks/useServiceModal';
import ServicesTable from './components/ServicesTable';
import ServiceFilters from './components/ServiceFilters';
import ConfirmDialog from './components/ConformDialog';
import EditServiceModal from './components/EditServiceModal';

export default function ServicesPage() {
  const router = useRouter();
  const [businessId, setBusinessId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const {
    services,
    loading: servicesLoading,
    filters,
    updateFilter,
    deleteService,
    refreshServices
  } = useServices(businessId);

  const {
    selectedService,
    modalType,
    openViewModal,
    openEditModal,
    closeModal
  } = useServiceModal();

  useEffect(() => {
    fetchBusinessId();
  }, []);

  const fetchBusinessId = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/my`,
        { credentials: 'include' }
      );
      const data = await response.json();
      if (data.businesses?.length > 0) {
        setBusinessId(data.businesses[0]._id);
      }
    } catch (error) {
      console.error('Error fetching business:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setServiceToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    const deleted = await deleteService(serviceToDelete);
    if (deleted) {
      setShowDeleteConfirm(false);
      setServiceToDelete(null);
      if (modalType === 'view' || modalType === 'edit') {
        closeModal();
      }
    }
  };

  const handleSaveSuccess = () => {
    refreshServices();
  };

  if (loading || servicesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-12 h-12 text-[#c9a227] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
<div className="mb-6 flex items-start justify-between">
  {/* Left: title */}
  <div>
    <h1 className="text-2xl font-bold text-gray-900">Services</h1>
    <p className="text-sm text-gray-600 mt-1">Manage your services</p>
  </div>

  {/* Right: buttons stacked vertically */}
  <div className="flex flex-col gap-2">
    <button
      onClick={() => router.push('/partners/add-service')}
      className="px-4 py-2 bg-[#c9a227] text-white rounded-md hover:bg-[#b8921f] flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Add Service
    </button>

    <button
      onClick={() => router.push('/partners/final-review')}
      className="px-2 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      publish
    </button>
  </div>
</div>

        <ServiceFilters
          filters={filters}
          onFilterChange={updateFilter}
          totalServices={services.length}
        />

        <div className="mt-4">
          <ServicesTable
            services={services}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* View Modal - Only CSS changed to match design */}
      {modalType === 'view' && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden">
            {/* Header */}
            <div className="bg-[#c9a227] px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-semibold text-lg">View Service Details</h2>
              <button onClick={closeModal} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="flex gap-6">
                {/* Left - Image */}
                <div className="w-48 h-48 flex-shrink-0">
                  {selectedService.coverImage ? (
                    <img 
                      src={selectedService.coverImage} 
                      alt={selectedService.title} 
                      className="w-full h-full object-cover rounded-lg" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Right - Details */}
                <div className="flex-1 space-y-4">
                  {/* Top Row */}
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Service Title</p>
                      <p className="font-semibold text-gray-900">{selectedService.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Service Duration</p>
                      <p className="font-semibold text-gray-900">{selectedService.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Price</p>
                      <p className="font-semibold text-gray-900">${selectedService.price}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-2">Description</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedService.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 pb-6 flex gap-3">
              <button 
                onClick={() => {
                  closeModal();
                  openEditModal(selectedService._id);
                }}
                className="px-6 py-2 bg-blue-900 text-white text-sm font-medium rounded hover:bg-blue-800"
              >
                Edit Information
              </button>
              <button 
                onClick={closeModal}
                className="px-6 py-2 bg-gray-400 text-white text-sm font-medium rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalType === 'edit' && selectedService && (
        <EditServiceModal
          service={selectedService}
          onClose={closeModal}
          onSave={handleSaveSuccess}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Service"
        message="Are you sure you want to delete this service?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}