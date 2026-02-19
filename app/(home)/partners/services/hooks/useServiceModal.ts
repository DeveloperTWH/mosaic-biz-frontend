import { useState } from 'react';
import { toast } from 'react-toastify';
import { Service, ChildService, BusinessHour } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useServiceModal = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | null>(null);

  const openViewModal = async (serviceId: string) => {
    try {
      setLoading(true);
      setModalType('view');
      
      const response = await fetch(
        `${API_BASE_URL}/api/service/${serviceId}`,
        { 
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const data = await response.json();
      if (data.service) {
        setSelectedService(data.service);
      } else {
        toast.error('Failed to load service details');
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Error loading service details');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = async (serviceId: string) => {
    try {
      setLoading(true);
      setModalType('edit');
      
      const response = await fetch(
        `${API_BASE_URL}/api/service/${serviceId}`,
        { 
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const data = await response.json();
      if (data.service) {
        setSelectedService(data.service);
      } else {
        toast.error('Failed to load service for editing');
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Error loading service for editing');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedService(null);
    setModalType(null);
  };

  return {
    selectedService,
    loading,
    modalType,
    openViewModal,
    openEditModal,
    closeModal
  };
};