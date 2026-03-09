import { useState } from 'react';
import { toast } from 'react-toastify';
import { Service, ChildService, BusinessHour } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const parseDurationToMinutes = (duration: unknown): number => {
  if (typeof duration === 'number' && Number.isFinite(duration)) {
    return duration;
  }

  if (typeof duration !== 'string') {
    return 60;
  }

  const match = duration.match(/(\d+(\.\d+)?)/);
  if (!match) {
    return 60;
  }

  const value = parseFloat(match[1]);
  return /hour/i.test(duration) ? Math.round(value * 60) : Math.round(value);
};

const normalizeBusinessHours = (hours: any[] = []) => {
  return hours.map((hour) => {
    if (typeof hour.hours === 'string') {
      return {
        day: hour.day,
        hours: hour.hours,
        closed: Boolean(hour.closed),
      };
    }

    const openTime = hour.openTime || '00:00';
    const closeTime = hour.closeTime || '00:00';

    return {
      day: hour.day,
      hours: `${openTime} - ${closeTime}`,
      closed: hour.isOpen === undefined ? Boolean(hour.closed) : !hour.isOpen,
    };
  });
};

const normalizeService = (service: Service): Service => {
  return {
    ...service,
    services: (service.services || []).map((childService: any) => ({
      ...childService,
      durationMinutes: parseDurationToMinutes(
        childService.duration ?? childService.durationMinutes
      ),
    })),
    businessHours: normalizeBusinessHours(service.businessHours as any[]),
  };
};

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
        setSelectedService(normalizeService(data.service));
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
        setSelectedService(normalizeService(data.service));
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
