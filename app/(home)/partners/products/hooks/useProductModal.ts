import { useState } from 'react';
import { toast } from 'react-toastify';
import { Product } from '../types';
import { deleteVendorProduct } from '@/lib/api/vendorProducts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useProductModal = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | null>(null);

  const openViewModal = async (productId: string) => {
    console.log('Opening view modal for:', productId);
    try {
      setLoading(true);
      setModalType('view');
      
      const response = await fetch(
        `${API_BASE_URL}/api/product/${productId}`,
        {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      const data = await response.json();
      console.log('View modal response:', data);
      
      if (data.success) {
        setSelectedProduct(data.product);
      } else {
        toast.error('Failed to load product details');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error loading product details');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = async (productId: string) => {
    console.log('Opening edit modal for:', productId);
    try {
      setLoading(true);
      setModalType('edit');
      
      const response = await fetch(
        `${API_BASE_URL}/api/product/${productId}`,
        {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      const data = await response.json();
      console.log('Edit modal response:', data);
      
      if (data.success) {
        setSelectedProduct(data.product);
      } else {
        toast.error('Failed to load product for editing');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error loading product for editing');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    console.log('Closing modal');
    setSelectedProduct(null);
    setModalType(null);
  };

  const handleDelete = async (productId: string): Promise<boolean> => {
    if (!confirm('Are you sure you want to delete this product?')) return false;
    
    try {
      const result = await deleteVendorProduct(productId);
      toast.success(result.message);
      closeModal();
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error instanceof Error ? error.message : 'Error deleting product');
    }
    return false;
  };

  const saveEdit = () => {
    // This will be called after successful save to refresh
    console.log('Product saved, refreshing...');
  };

  return {
    selectedProduct,
    loading,
    modalType,
    openViewModal,
    openEditModal,
    closeModal,
    handleDelete,
    saveEdit
  };
};
