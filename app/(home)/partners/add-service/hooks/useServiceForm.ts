import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  ServiceFormData, 
  FormErrors, 
  Category, 
  Subcategory,
  ChildService,
  BusinessHour
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const initialFormData: ServiceFormData = {
  title: '',
  description: '',
  categoryId: '',
  subcategoryId: '',
  businessId: '',
  bookingToolLink: '',
  services: [],
  coverImage: '',
  images: [],
  businessHours: [],
  location: {
    address: ''
  },
  isPublished: true
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const defaultHours = '09:00 AM - 06:00 PM';

const normalizeLocationAddress = (location: unknown): string => {
  if (typeof location === 'string') {
    return location;
  }

  if (location && typeof location === 'object' && 'address' in location) {
    return String((location as { address?: unknown }).address || '');
  }

  return '';
};

const normalizeBusinessHours = (hours: any[] = []) => {
  const hoursMap = new Map(
    hours.map((hour) => [hour.day, hour])
  );

  return daysOfWeek.map((day) => {
    const hour = hoursMap.get(day);

    if (!hour) {
      return {
        day,
        hours: defaultHours,
        closed: true,
      };
    }

    if (typeof hour.hours === 'string') {
      return {
        day,
        hours: hour.hours,
        closed: Boolean(hour.closed),
      };
    }

    const openTime = hour.openTime || '00:00';
    const closeTime = hour.closeTime || '00:00';

    return {
      day,
      hours: `${openTime} - ${closeTime}`,
      closed: hour.isOpen === undefined ? Boolean(hour.closed) : !hour.isOpen,
    };
  });
};

export const useServiceForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Data from APIs
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  
  // Upload states
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Initialize business hours with all days
  useEffect(() => {
    if (formData.businessHours.length === 0) {
      const initialHours = daysOfWeek.map(day => ({
        day,
        hours: defaultHours,
        closed: day === 'Saturday' || day === 'Sunday' // weekends closed by default
      }));
      setFormData(prev => ({ ...prev, businessHours: initialHours }));
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's businesses
      const businessRes = await axios.get(`${API_BASE_URL}/api/business/my`, {
        withCredentials: true,
      });
      setBusinesses(businessRes.data.businesses || []);
      
      // Fetch service categories
      await fetchCategories();
      
      const businessId = businessRes.data.businesses?.[0]?._id;
      if (businessId) {
        handleInputChange('businessId', businessId);
        
        // Fetch existing service data
        try {
          const serviceRes = await axios.get(
            `${API_BASE_URL}/api/service/business-service/${businessId}`,
            { withCredentials: true }
          );
          
          if (serviceRes.data.service) {
            const service = serviceRes.data.service;
            const normalizedBusinessId =
              typeof service.businessId === 'string'
                ? service.businessId
                : service.businessId?._id || businessId;

            setFormData({
              title: service.title || '',
              description: service.description || '',
              categoryId: service.categoryId?._id || '',
              subcategoryId: service.subcategoryId?._id || '',
              businessId: normalizedBusinessId,
              coverImage: service.coverImage || '',
              images: service.images || [],
              location: { address: normalizeLocationAddress(service.location) },
              businessHours: normalizeBusinessHours(service.businessHours),
              bookingToolLink: service.bookingToolLink || '',
              // Keep child services empty on add page to avoid duplicate re-submission
              services: [],
              isPublished: Boolean(service.isPublished)
            });
          }
        } catch (err) {
          // No existing service, continue with empty form
          console.log('No existing service found');
        }
      }
      
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load required data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories/services`);
      setCategories(response.data.data?.serviceCategories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/services/subcategories/${categoryId}`);
      setSubcategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  useEffect(() => {
    if (formData.categoryId) {
      fetchSubcategories(formData.categoryId);
    } else {
      setSubcategories([]);
    }
  }, [formData.categoryId]);

  const handleInputChange = (field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Child Services
  const addChildService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', description: '', durationMinutes: 60, price: 0, image: '' }]
    }));
  };

  const updateChildService = (index: number, field: keyof ChildService, value: any) => {
    const updated = [...formData.services];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, services: updated }));
  };

  const removeChildService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleChildServiceImageUpload = async (index: number, file: File): Promise<void> => {
    const uploadKey = `child-${index}`;

    try {
      setUploading(prev => ({ ...prev, [uploadKey]: true }));
      setUploadProgress(prev => ({ ...prev, [uploadKey]: 0 }));

      const interval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [uploadKey]: Math.min((prev[uploadKey] || 0) + 10, 90)
        }));
      }, 200);

      const response = await fetch(
        `${API_BASE_URL}/api/service/upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}&documentType=service-gallery`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, fileUrl } = await response.json();

      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      clearInterval(interval);
      setUploadProgress(prev => ({ ...prev, [uploadKey]: 100 }));
      updateChildService(index, 'image', fileUrl);
      toast.success('service image uploaded successfully!');
    } catch (error: any) {
      console.error(' image upload error:', error);
      toast.error(`Image upload failed: ${error.message}`);
    } finally {
      setUploading(prev => ({ ...prev, [uploadKey]: false }));
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, [uploadKey]: 0 }));
      }, 2000);
    }
  };

  const removeChildServiceImage = (index: number) => {
    updateChildService(index, 'image', '');
  };

  // Business Hours
  const updateBusinessHour = (index: number, field: keyof BusinessHour, value: any) => {
    const updated = [...formData.businessHours];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, businessHours: updated }));
  };

  // File Upload
  const handleFileUpload = async (type: 'cover' | 'gallery', file: File): Promise<void> => {
    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));

      const interval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [type]: Math.min((prev[type] || 0) + 10, 90)
        }));
      }, 200);

      const documentType = type === 'cover' ? 'service-cover' : 'service-gallery';
      
      const response = await fetch(
        `${API_BASE_URL}/api/service/upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}&documentType=${documentType}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, fileUrl } = await response.json();

      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      clearInterval(interval);
      setUploadProgress(prev => ({ ...prev, [type]: 100 }));

      if (type === 'cover') {
        handleInputChange('coverImage', fileUrl);
      } else {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, fileUrl]
        }));
      }

      toast.success('File uploaded successfully!');

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, [type]: 0 }));
      }, 2000);
    }
  };

  const removeImage = (type: 'cover' | 'gallery', index?: number) => {
    if (type === 'cover') {
      handleInputChange('coverImage', '');
    } else if (type === 'gallery' && index !== undefined) {
      const updated = formData.images.filter((_, i) => i !== index);
      handleInputChange('images', updated);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.subcategoryId) newErrors.subcategoryId = 'Subcategory is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      // Check if parent service exists
      let parentExists = false;
      try {
        const checkRes = await axios.get(
          `${API_BASE_URL}/api/service/business-service/${formData.businessId}`,
          { withCredentials: true }
        );
        parentExists = !!checkRes.data.service;
      } catch (err) {
        parentExists = false;
      }

      // Step 1: Create/Update parent service if needed
      if (!parentExists) {
        const parentPayload = {
          title: formData.title || 'Service',
          description: formData.description || 'Service description',
          categoryId: formData.categoryId,
          subcategoryId: formData.subcategoryId,
          businessId: formData.businessId,
          coverImage: formData.coverImage || '',
          images: formData.images || [],
          location: { address: formData.location?.address || '' },
          businessHours: formData.businessHours || [],
          bookingToolLink: formData.bookingToolLink || ''
        };
        
        await axios.post(
          `${API_BASE_URL}/api/service/parent`,
          parentPayload,
          { withCredentials: true }
        );
        // toast.success('Parent service created!');
      }

      // Step 2: Add child services
      if (formData.services.length > 0) {
        const childPayload = {
          businessId: formData.businessId,
          childServices: formData.services.map(s => ({
            name: s.name,
            price: s.price,
            duration: `${s.durationMinutes} minutes`,
            description: s.description,
            image: s.image || ''
          }))
        };

        await axios.post(
          `${API_BASE_URL}/api/service/add-child-services`,
          childPayload,
          { withCredentials: true }
        );
        toast.success('services added!');
      }

      toast.success('Service saved successfully!');
      router.push('/partners/services');
      
    } catch (error: any) {
      console.error('Error creating service:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to create service';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    formData,
    errors,
    businesses,
    categories,
    subcategories,
    uploading,
    uploadProgress,
    handleInputChange,
    handleSubmit,
    // Child Services
    childServices: formData.services,
    addChildService,
    updateChildService,
    removeChildService,
    handleChildServiceImageUpload,
    removeChildServiceImage,
    // Business Hours
    businessHours: formData.businessHours,
    updateBusinessHour,
    // Upload
    handleFileUpload,
    removeImage,
  };
};
