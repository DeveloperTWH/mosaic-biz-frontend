import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Food } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useFoods = (businessId: string) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'newest'
  });

  const fetchFoods = async () => {
    if (!businessId) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/food/my-foods`,
        { 
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const data = await response.json();
      if (data.foods) {
        setFoods(data.foods);
        setFilteredFoods(data.foods);
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
      toast.error('Failed to load foods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchFoods();
    }
  }, [businessId]);

  // Filter and sort
  useEffect(() => {
    let result = [...foods];

    if (filters.search) {
      result = result.filter(f => 
        f.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        f.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status === 'published') {
      result = result.filter(f => f.isPublished);
    } else if (filters.status === 'draft') {
      result = result.filter(f => !f.isPublished);
    }

    if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filters.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredFoods(result);
  }, [filters, foods]);

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const deleteFood = async (foodId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/food/delete-food/${foodId}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const data = await response.json();
      if (data.message) {
        toast.success(data.message);
        await fetchFoods();
        return true;
      }
    } catch (error) {
      console.error('Error deleting food:', error);
      toast.error('Failed to delete food');
    }
    return false;
  };

  return {
    foods: filteredFoods,
    loading,
    filters,
    updateFilter,
    deleteFood,
    refreshFoods: fetchFoods
  };
};