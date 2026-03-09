'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader, X } from 'lucide-react';
import { useFoods } from './hooks/useFoods';
import { useFoodModal } from './hooks/useFoodModal';
import FoodsTable from './components/FoodsTable';
import FoodFilters from './components/FoodFilters';
import ConfirmDialog from './components/ConfirmDialog';
import EditFoodModal from './components/EditFoodModal';

export default function FoodsPage() {
  const router = useRouter();
  const [businessId, setBusinessId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState<string | null>(null);

  const {
    foods,
    loading: foodsLoading,
    filters,
    updateFilter,
    deleteFood,
    refreshFoods
  } = useFoods(businessId);

  const {
    selectedFood,
    modalType,
    openViewModal,
    openEditModal,
    closeModal
  } = useFoodModal();

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
    setFoodToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!foodToDelete) return;
    const deleted = await deleteFood(foodToDelete);
    if (deleted) {
      setShowDeleteConfirm(false);
      setFoodToDelete(null);
      if (modalType === 'view' || modalType === 'edit') {
        closeModal();
      }
    }
  };

  const handleSaveSuccess = () => {
    refreshFoods();
  };

  if (loading || foodsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-12 h-12 text-[#c9a227] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Food Items</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your food menu</p>
          </div>
          <button
            onClick={() => router.push('/partners/add-food')}
            className="px-4 py-2 bg-[#c9a227] text-white rounded-md hover:bg-[#b8921f] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Food Item
          </button>
        </div>

        <FoodFilters
          filters={filters}
          onFilterChange={updateFilter}
          totalFoods={foods.length}
        />

        <div className="mt-4">
          <FoodsTable
            foods={foods}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* View Modal */}
      {modalType === 'view' && selectedFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden">
            {/* Header */}
            <div className="bg-[#c9a227] px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-semibold text-lg">View Food Details</h2>
              <button onClick={closeModal} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="flex gap-6">
                {/* Left - Image */}
                <div className="w-48 h-48 flex-shrink-0">
                  {selectedFood.coverImage ? (
                    <img 
                      src={selectedFood.coverImage} 
                      alt={selectedFood.title} 
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
                      <p className="text-xs text-gray-500 uppercase mb-1">Food Name</p>
                      <p className="font-semibold text-gray-900">{selectedFood.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Preparation Time</p>
                      <p className="font-semibold text-gray-900">{selectedFood.preparationTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Price</p>
                      <p className="font-semibold text-gray-900">${selectedFood.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-2">Description</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedFood.description}</p>
                  </div>

                  {/* Category Info */}
                  <div className="grid grid-cols-2 gap-6 pt-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Category</p>
                      <p className="text-sm text-gray-700">{selectedFood.categoryId?.name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Subcategory</p>
                      <p className="text-sm text-gray-700">{selectedFood.subcategoryId?.name || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 pb-6 flex gap-3">
              <button 
                onClick={() => {
                  closeModal();
                  openEditModal(selectedFood._id);
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

      {/* Edit Modal - You'll need to create EditFoodModal component similarly */}
      {modalType === 'edit' && selectedFood && (
        <EditFoodModal
          food={selectedFood}
          onClose={closeModal}
          onSave={handleSaveSuccess}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Food Item"
        message="Are you sure you want to delete this food item?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}