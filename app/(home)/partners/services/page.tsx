'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader } from 'lucide-react';
import { useServices } from './hooks/useServices';
import { ChildServiceRow, Service } from './types';
import BusinessInfoTable from './components/BusinessInfoTable';
import ServicesTable from './components/ServicesTable';
import ServiceFilters from './components/ServiceFilters';
import ConfirmDialog from './components/ConformDialog';
import EditBusinessInfoModal from './components/EditBusinessInfoModal';
import EditChildServiceModal from './components/EditChildServiceModal';

export default function ServicesPage() {
  const router = useRouter();
  const [businessId, setBusinessId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [editingBusinessService, setEditingBusinessService] = useState<Service | null>(null);
  const [editingChildService, setEditingChildService] = useState<{
    parentService: Service;
    childService: ChildServiceRow;
  } | null>(null);

  const {
    parentService,
    parentServices,
    childServices,
    loading: servicesLoading,
    filters,
    updateFilter,
    deleteService,
    refreshServices
  } = useServices(businessId);

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
    }
  };

  const handleSaveSuccess = () => {
    setEditingBusinessService(null);
    setEditingChildService(null);
    refreshServices();
  };

  const handleEditChild = (childService: ChildServiceRow) => {
    const matchedParentService = parentServices.find((service) => service._id === childService.parentServiceId);
    if (!matchedParentService) {
      return;
    }

    setEditingChildService({
      parentService: matchedParentService,
      childService,
    });
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
    <h1>Service and business info</h1>
    <p className="text-sm text-gray-600 mt-1">Manage your services and bussiness info</p>
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
          totalServices={childServices.length}
        />

        <div className="mt-4">
          <BusinessInfoTable
            service={parentService}
            onEdit={setEditingBusinessService}
          />
        </div>

        <div className="mt-6">
          <ServicesTable
            services={childServices}
            onEdit={handleEditChild}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Service"
        message="Are you sure you want to delete this  service?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {editingBusinessService && (
        <EditBusinessInfoModal
          service={editingBusinessService}
          onClose={() => setEditingBusinessService(null)}
          onSave={handleSaveSuccess}
        />
      )}

      {editingChildService && (
        <EditChildServiceModal
          parentService={editingChildService.parentService}
          childService={editingChildService.childService}
          onClose={() => setEditingChildService(null)}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
}
