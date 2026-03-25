'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader } from 'lucide-react';
import { useProducts } from './hooks/useProducts';
import { useProductModal } from './hooks/useProductModal';
import ProductsTable from './components/ProductsTable';
import ProductFilters from './components/ProductFilters';
import ViewProductModal from './components/ViewProductModal';
import EditProductModal from './components/product-modal/EditProductModal';
import ConfirmDialog from './components/ConfirmDialog'; // You'll need to create this
import AddDiscountModal from './components/AddDiscountModal';
import ViewDiscountsModal from './components/ViewDiscountsModal';

export default function ProductsPage() {
  const router = useRouter();
  const [businessId, setBusinessId] = useState<string>('');
  const [loadingBusiness, setLoadingBusiness] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showDiscountListModal, setShowDiscountListModal] = useState(false);
  
  const {
    products,
    loading: productsLoading,
    filters,
    updateFilter,
    getStockStatus,
    deleteProduct,
    refreshProducts
  } = useProducts(businessId);

  const {
    selectedProduct,
    modalType,
    openViewModal,
    openEditModal,
    closeModal,
    handleDelete,
    saveEdit
  } = useProductModal();

  // Fetch business ID on mount
  useEffect(() => {
    fetchBusinessId();
  }, []);

  const fetchBusinessId = async () => {
    try {
      setLoadingBusiness(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/my`,
        {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      const data = await response.json();
      if (data.businesses?.length > 0) {
        setBusinessId(data.businesses[0]._id);
      }
    } catch (error) {
      console.error('Error fetching business:', error);
    } finally {
      setLoadingBusiness(false);
    }
  };

  const handleViewProduct = (productId: string) => {
    openViewModal(productId);
  };

  const handleEditProduct = (productId: string) => {
    openEditModal(productId);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    setShowConfirmDialog(false);
    const deleted = await deleteProduct(productToDelete);
    if (deleted) {
      await refreshProducts(); // Refresh the list
      setProductToDelete(null);
      
      // If there's an open modal, close it
      if (modalType === 'view' && selectedProduct?._id === productToDelete) {
        closeModal();
      }
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setProductToDelete(null);
  };

  const handleProductSaved = () => {
    refreshProducts(); // Refresh after save
    closeModal();
  };

  if (loadingBusiness || productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#c9a227] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
 {/* Header */}
<div className="mb-6 flex justify-between items-start">
  {/* Left: title */}
  <div>
    <h1 className="text-2xl font-bold text-gray-900">Added Products</h1>
    <p className="text-sm text-gray-600 mt-1">
      Manage your products
    </p>
  </div>

  {/* Right: buttons stacked vertically */}
  <div className="flex flex-col gap-2">
    <button
      onClick={() => router.push('/partners/add-product')}
      className="px-4 py-2 bg-[#c9a227] text-white text-sm font-medium rounded-md hover:bg-[#b8921f] transition-colors flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Add Product
    </button>

    <button
      onClick={() => router.push('/partners/final-review')}
      className="px-4 py-1 bg-blue-900 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
    >
      publish
    </button>
  </div>
</div>
        {/* Filters */}
        <ProductFilters
          filters={filters}
          onFilterChange={updateFilter}
          totalProducts={products.length}
        />
        
        

        {/* Products Table */}
        <div className="mt-4">
          
          <ProductsTable
            products={products}
            onView={handleViewProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteClick}
            getStockStatus={getStockStatus}
          />
        </div>
        <div className="mt-6 flex justify-end">
<div className="flex items-center gap-2">
  <button
    onClick={() => setShowDiscountModal(true)}
    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
  >
    + Add discount
  </button>

  <button
    onClick={() => setShowDiscountListModal(true)}
    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
  >
    View
  </button>
</div>
</div>
      </div>

      {/* View Modal */}
      {modalType === 'view' && selectedProduct && (
        <ViewProductModal
          product={selectedProduct}
          onClose={closeModal}
          onEdit={() => {
            closeModal();
            openEditModal(selectedProduct._id);
          }}
          onDelete={() => handleDeleteClick(selectedProduct._id)}
        />
      )}

      {/* Edit Modal */}
      {modalType === 'edit' && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={closeModal}
          onSave={handleProductSaved}
        />
      )}
{/* add discount model */}
      {showDiscountModal && (
  <AddDiscountModal
    businessId={businessId}
    onClose={() => setShowDiscountModal(false)}
  />
)}

{/* view discount model */}
{showDiscountListModal && (
  <ViewDiscountsModal
    businessId={businessId}
    onClose={() => setShowDiscountListModal(false)}
  />
)}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      
    </div>
  );
}