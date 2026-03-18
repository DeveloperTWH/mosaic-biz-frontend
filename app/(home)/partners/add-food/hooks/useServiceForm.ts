import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  FoodFormData,
  FormErrors,
  Category,
  Subcategory,
  BusinessHour,
  MetaField,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const defaultHours = '09:00 AM - 06:00 PM';

const initialFormData: FoodFormData = {
  title: '',
  description: '',
  price: 0,
  categoryId: '',
  subcategoryId: '',
  businessId: '',
  bookingToolLink: '',
  coverImage: '',
  images: [],
  menuImage: '',
  businessHours: [],
  metaFields: [],
  location: { address: '' },
  isPublished: false,
};

export const useFoodForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FoodFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const [businesses, setBusinesses] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.businessHours.length === 0) {
      const initialHours = daysOfWeek.map((day) => ({
        day,
        hours: defaultHours,
        closed: day === 'Saturday' || day === 'Sunday',
      }));
      setFormData((prev) => ({ ...prev, businessHours: initialHours }));
    }
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      fetchSubcategories(formData.categoryId);
    } else {
      setSubcategories([]);
    }
  }, [formData.categoryId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const businessRes = await axios.get(`${API_BASE_URL}/api/business/my`, {
        withCredentials: true,
      });

      const businessList = businessRes.data.businesses || [];
      setBusinesses(businessList);
      await fetchCategories();

      const defaultBusinessId = businessList[0]?._id;
      if (defaultBusinessId) {
        handleInputChange('businessId', defaultBusinessId);
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
      const response = await axios.get(`${API_BASE_URL}/api/categories/foods`);
      setCategories(response.data.data?.foodCategories || []);
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
      const response = await axios.get(`${API_BASE_URL}/api/foods/subcategories/${categoryId}`);
      setSubcategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Failed to load subcategories');
    }
  };

  const handleInputChange = (field: keyof FoodFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const updateBusinessHour = (index: number, field: keyof BusinessHour, value: any) => {
    const updated = [...formData.businessHours];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, businessHours: updated }));
  };

  const addMetaField = () => {
    setFormData((prev) => ({
      ...prev,
      metaFields: [...prev.metaFields, { key: '', value: '' }],
    }));
  };

  const updateMetaField = (index: number, field: keyof MetaField, value: string) => {
    const updated = [...formData.metaFields];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, metaFields: updated }));
  };

  const removeMetaField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      metaFields: prev.metaFields.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = async (
    type: 'cover' | 'gallery' | 'menu',
    file: File
  ): Promise<void> => {
    try {
      setUploading((prev) => ({ ...prev, [type]: true }));
      setUploadProgress((prev) => ({ ...prev, [type]: 0 }));

      const interval = setInterval(() => {
        setUploadProgress((prev) => ({
          ...prev,
          [type]: Math.min((prev[type] || 0) + 10, 90),
        }));
      }, 200);

      const documentType =
        type === 'cover' ? 'food-cover' : type === 'menu' ? 'food-menu' : 'food-gallery';

      const response = await fetch(
        `${API_BASE_URL}/api/food/upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}&documentType=${documentType}`,
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
      setUploadProgress((prev) => ({ ...prev, [type]: 100 }));

      if (type === 'cover') {
        handleInputChange('coverImage', fileUrl);
      } else if (type === 'menu') {
        handleInputChange('menuImage', fileUrl);
      } else {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, fileUrl],
        }));
        if (errors.images) {
          setErrors((prev) => {
            const next = { ...prev };
            delete next.images;
            return next;
          });
        }
      }

      toast.success('File uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
      }, 2000);
    }
  };

  const removeImage = (type: 'cover' | 'gallery' | 'menu', index?: number) => {
    if (type === 'cover') {
      handleInputChange('coverImage', '');
      return;
    }

    if (type === 'menu') {
      handleInputChange('menuImage', '');
      return;
    }

    if (index !== undefined) {
      const updated = formData.images.filter((_, i) => i !== index);
      handleInputChange('images', updated);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.businessId) newErrors.businessId = 'Business is required';
    if (Number.isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be 0 or greater';
    }
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.subcategoryId) newErrors.subcategoryId = 'Subcategory is required';
    if (!formData.coverImage) newErrors.coverImage = 'Please upload a banner image';
    if (formData.images.length === 0) newErrors.images = 'Please upload at least one gallery image';

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

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        businessId: formData.businessId,
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId,
        coverImage: formData.coverImage || '',
        images: formData.images || [],
        menuImage: formData.menuImage || '',
        businessHours: formData.businessHours || [],
        bookingToolLink: formData.bookingToolLink || '',
        metaFields: formData.metaFields.filter(
          (field) => field.key.trim() && field.value.trim()
        ),
        isPublished: Boolean(formData.isPublished),
        ...(formData.location?.address?.trim()
          ? { location: formData.location.address.trim() }
          : {}),
      };

      await axios.post(`${API_BASE_URL}/api/food/add-food`, payload, {
        withCredentials: true,
      });

      toast.success('Food saved successfully!');
      router.push('/partners/foods');
    } catch (error: any) {
      console.error('Error creating food:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to create food';
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
    businessHours: formData.businessHours,
    updateBusinessHour,
    handleFileUpload,
    removeImage,
    addMetaField,
    updateMetaField,
    removeMetaField,
  };
};
