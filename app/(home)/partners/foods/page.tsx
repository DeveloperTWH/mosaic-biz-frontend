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
<div className="mb-6 flex items-start justify-between">
  {/* Left: title */}
  <div>
    <h1 className="text-2xl font-bold text-gray-900">Food And Resturants</h1>
    <p className="text-sm text-gray-600 mt-1">Manage your food And Restorunts</p>
  </div>

  {/* Right: buttons stacked vertically */}
  <div className="flex flex-col gap-2">
    <button
      onClick={() => router.push('/partners/add-food')}
      className="px-4 py-2 bg-[#c9a227] text-white rounded-md hover:bg-[#b8921f] flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Add Food or restorant
    </button>

    <button
      onClick={() => router.push('/partners/final-review')}
      className="px-2 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Go Live
    </button>
  </div>
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
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div className="bg-white rounded-lg max-w-4xl w-full my-8">
      {/* Header */}
      <div className="bg-[#c9a227] px-6 py-4 flex items-center justify-between sticky top-0">
        <h2 className="text-white font-semibold text-lg">View Food Details</h2>
        <button onClick={closeModal} className="text-white hover:text-gray-200">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Main Info Row with Image */}
        <div className="flex gap-6 mb-8">
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
        </div>

        {/* Business Information Card */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Business Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Business Name</p>
              <p className="font-medium text-gray-900">{(selectedFood as any).businessName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Category</p>
              <p className="font-medium text-gray-900">
                {typeof selectedFood.categoryId === 'object' 
                  ? (selectedFood.categoryId as any)?.name 
                  : selectedFood.categoryId || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Subcategory</p>
              <p className="font-medium text-gray-900">
                {typeof selectedFood.subcategoryId === 'object' 
                  ? (selectedFood.subcategoryId as any)?.name 
                  : selectedFood.subcategoryId || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Food Type</p>
              <p className="font-medium text-gray-900">{(selectedFood as any).foodType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Brand</p>
              <p className="font-medium text-gray-900">{(selectedFood as any).brand || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Business Hours Card */}
        {(selectedFood as any).businessHours && (selectedFood as any).businessHours.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Business Hours</h3>
            <div className="grid grid-cols-2 gap-2">
              {(selectedFood as any).businessHours.map((day: any, index: number) => (
                <div key={day._id || index} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                  <span className="font-medium text-gray-700">{day.day}:</span>
                  <span className={day.closed ? 'text-red-500' : 'text-gray-600'}>
                    {day.closed ? 'Closed' : day.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Images */}
        {selectedFood.images && selectedFood.images.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Additional Images</h3>
            <div className="grid grid-cols-4 gap-3">
              {selectedFood.images.map((image: string, index: number) => (
                <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Food ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Image */}
        {(selectedFood as any).menuImage && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Menu Image</h3>
            <div className="relative w-32 h-32 border rounded-md overflow-hidden">
              <img 
                src={(selectedFood as any).menuImage} 
                alt="Menu" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image';
                }}
              />
            </div>
          </div>
        )}

        {/* Booking Tool Link */}
        {(selectedFood as any).bookingToolLink && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Booking Information</h3>
            <a 
              href={(selectedFood as any).bookingToolLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#c9a227] hover:underline break-all"
            >
              {(selectedFood as any).bookingToolLink}
            </a>
          </div>
        )}

        {/* Meta Fields */}
        {(selectedFood as any).metaFields && (selectedFood as any).metaFields.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {(selectedFood as any).metaFields.map((field: any, index: number) => (
                <div key={field._id || index}>
                  <p className="text-xs text-gray-500 uppercase mb-1">{field.key}</p>
                  <p className="text-sm text-gray-900">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 sticky bottom-0">
        <button 
          onClick={() => {
            closeModal();
            openEditModal(selectedFood._id);
          }}
          className="px-6 py-2 bg-[#c9a227] text-white text-sm font-medium rounded hover:bg-[#b8921f] transition-colors"
        >
          Edit Information
        </button>
        <button 
          onClick={closeModal}
          className="px-6 py-2 bg-gray-500 text-white text-sm font-medium rounded hover:bg-gray-600 transition-colors"
        >
          Close
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