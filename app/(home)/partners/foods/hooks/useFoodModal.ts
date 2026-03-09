import { useState } from 'react';
import { toast } from 'react-toastify';
import { Food } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useFoodModal = () => {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | null>(null);

  const openViewModal = async (foodId: string) => {
    try {
      setLoading(true);
      setModalType('view');
      
      const response = await fetch(
        `${API_BASE_URL}/api/food/food-by-id/${foodId}`,
        { 
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const data = await response.json();
      if (data.food) {
        setSelectedFood(data.food);
      } else {
        toast.error('Failed to load food details');
      }
    } catch (error) {
      console.error('Error fetching food:', error);
      toast.error('Error loading food details');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = async (foodId: string) => {
    try {
      setLoading(true);
      setModalType('edit');
      
      const response = await fetch(
        `${API_BASE_URL}/api/food/food-by-id/${foodId}`,
        { 
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const data = await response.json();
      if (data.food) {
        setSelectedFood(data.food);
      } else {
        toast.error('Failed to load food for editing');
      }
    } catch (error) {
      console.error('Error fetching food:', error);
      toast.error('Error loading food for editing');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedFood(null);
    setModalType(null);
  };

  return {
    selectedFood,
    loading,
    modalType,
    openViewModal,
    openEditModal,
    closeModal
  };
};