import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ChildServiceRow, Service } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useServices = (businessId: string) => {
  const [parentServices, setParentServices] = useState<Service[]>([]);
  const [filteredChildServices, setFilteredChildServices] = useState<ChildServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'newest'
  });

  const mapChildServicesForListing = (apiServices: Service[]): ChildServiceRow[] => {
    return apiServices.flatMap((parentService) => {
      const childServices = Array.isArray(parentService.services) ? parentService.services : [];

      return childServices.map((childService, index) => ({
        ...childService,
        _id: childService._id || `${parentService._id}-${index}`,
        parentServiceId: parentService._id,
        parentServiceTitle: parentService.title,
        categoryId: parentService.categoryId,
        subcategoryId: parentService.subcategoryId,
        isPublished: parentService.isPublished,
        createdAt: parentService.createdAt,
        updatedAt: parentService.updatedAt,
      }));
    });
  };

  const fetchServices = async () => {
    if (!businessId) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/service/my-services`,
        { 
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const data = await response.json();
      if (data.services) {
        const normalizedParents = Array.isArray(data.services) ? data.services : [];
        setParentServices(normalizedParents);
        setFilteredChildServices(mapChildServicesForListing(normalizedParents));
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchServices();
    }
  }, [businessId]);

  // Filter and sort
  useEffect(() => {
    let result = mapChildServicesForListing(parentServices);

    if (filters.search) {
      result = result.filter(s => 
        s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status === 'published') {
      result = result.filter(s => s.isPublished);
    } else if (filters.status === 'draft') {
      result = result.filter(s => !s.isPublished);
    }

    if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    setFilteredChildServices(result);
  }, [filters, parentServices]);

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const deleteService = async (serviceId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/service/delete-service/${serviceId}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const data = await response.json();
      if (data.message) {
        toast.success(data.message);
        await fetchServices();
        return true;
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
    return false;
  };

  return {
    parentService: parentServices[0] || null,
    parentServices,
    childServices: filteredChildServices,
    loading,
    filters,
    updateFilter,
    deleteService,
    refreshServices: fetchServices
  };
};
