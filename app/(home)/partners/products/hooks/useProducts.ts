import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Product, FilterOptions } from '../types';
import { deleteVendorProduct } from '@/lib/api/vendorProducts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useProducts = (businessId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    search: '',
    sortBy: 'newest',
    priceRange: { min: 0, max: 10000 }
  });

  const fetchProducts = async () => {
    if (!businessId) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/product/business/${businessId}`,
        {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchProducts();
    }
  }, [businessId]);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    if (filters.search) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      if (filters.status === 'low-stock') {
        result = result.filter(p => (p.totalStock || 0) < 10);
      } else if (filters.status === 'available') {
        result = result.filter(p => (p.totalStock || 0) >= 10);
      } else if (filters.status === 'out-of-stock') {
        result = result.filter(p => (p.totalStock || 0) === 0);
      }
    }

    if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filters.sortBy === 'price-low') {
      result.sort((a, b) => (a.priceRange?.min || 0) - (b.priceRange?.min || 0));
    } else if (filters.sortBy === 'price-high') {
      result.sort((a, b) => (b.priceRange?.max || 0) - (a.priceRange?.max || 0));
    }

    setFilteredProducts(result);
  }, [filters, products]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStockStatus = (stock: number = 0): { label: string; className: string } => {
    if (stock === 0) return { label: 'Out of Stock', className: 'bg-red-100 text-red-600' };
    if (stock < 10) return { label: 'Low Stock', className: 'bg-yellow-100 text-yellow-600' };
    return { label: 'Available', className: 'bg-green-100 text-green-600' };
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    try {
      const result = await deleteVendorProduct(productId);
      toast.success(result.message);
      await refreshProducts();
      return true;
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Error deleting product');
      return false;
    }
  };

  return {
    products: filteredProducts,
    loading,
    filters,
    updateFilter,
    getStockStatus,
    deleteProduct,
    refreshProducts
  };
};
