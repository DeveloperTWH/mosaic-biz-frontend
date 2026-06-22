import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  getOnboardingData, 
  updateBusinessProfile 
} from '@/lib/api/vendorOnboarding';
import { 
  BusinessProfileData, 
  BusinessProfileUpdatePayload,
  FormErrors 
} from '../types';

const TIER_CHARACTER_LIMITS = {
  basic: 150,
  standard: 225,
  premium: 500
};

export const useBusinessProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Separate state for prefilled and form data
  const [prefilledData, setPrefilledData] = useState<BusinessProfileData['prefilled']>({
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    ownershipType: '',
    businessType: '',
    yearsInBusiness: '',
    employeesCount: ''
  });
  
  // Form state for editable fields
  const [formData, setFormData] = useState<BusinessProfileUpdatePayload>({
    firstName: '',
    lastName: '',
    primaryEmail: '',
    primaryPhone: '',
    language: '',
    licenseNumber: '',
    businessBio: '',
    characterLimit: TIER_CHARACTER_LIMITS.standard,
    businessProfileImage: { url: '', verified: false },
    businessEmail: '',
    businessPhone: '',
    alternatePhone: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    tiktok: '',
    refundPolicyDocument: { url: '', verified: false },
    termsDocument: { url: '', verified: false },
    googleReviewLink: '',
    communityServiceLink: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [characterCount, setCharacterCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    setCharacterCount(formData.businessBio?.length || 0);
  }, [formData.businessBio]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const data = await getOnboardingData();
      if (!data) {
        return;
      }
      
      // Set prefilled non-editable data
      setPrefilledData({
        businessName: data.businessName || '',
        businessEmail: data.secondaryBusinessEmail || data.businessEmail || '',
        businessPhone: data.businessPhone || data.primaryPhone || '',
        address: {
          street: data.address?.street || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          country: data.address?.country || '',
          zipCode: data.address?.zipCode || '',
        },
        ownershipType: data.ownershipType || '',
        businessType: data.businessType || '',
        yearsInBusiness: data.yearsInBusiness || '',
        employeesCount: data.employeesCount || ''
      });

      // Set editable form data
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        primaryEmail: data.primaryEmail || '',
        primaryPhone: data.primaryPhone || '',
        language: data.language || '',
        licenseNumber: data.licenseNumber || '',
        businessBio: data.businessBio || '',
        characterLimit: data.characterLimit || TIER_CHARACTER_LIMITS.standard,
        businessProfileImage: data.businessProfileImage || { url: '', verified: false },
        businessEmail: data.businessEmail || '',
        businessPhone: data.businessPhone || '',
        alternatePhone: data.alternatePhone || '',
        website: data.website || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        twitter: data.twitter || '',
        linkedin: data.linkedin || '',
        tiktok: data.tiktok || '',
        refundPolicyDocument: data.refundPolicyDocument || { url: '', verified: false },
        termsDocument: data.termsDocument || { url: '', verified: false },
        googleReviewLink: data.googleReviewLink || '',
        communityServiceLink: data.communityServiceLink || '',
      });

    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BusinessProfileUpdatePayload, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Personal Information
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.primaryEmail?.trim()) newErrors.primaryEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryEmail)) {
      newErrors.primaryEmail = 'Invalid email format';
    }
    if (!formData.primaryPhone?.trim()) newErrors.primaryPhone = 'Phone number is required';

    // Business Information
    if (!formData.businessBio?.trim()) newErrors.businessBio = 'Business bio is required';
    else if (formData.businessBio.length > (formData.characterLimit || 225)) {
      newErrors.businessBio = `Bio exceeds ${formData.characterLimit || 225} character limit`;
    }

    // Contact Information
    if (!formData.businessEmail?.trim()) newErrors.businessEmail = 'Business email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail)) {
      newErrors.businessEmail = 'Invalid email format';
    }
    if (!formData.businessPhone?.trim()) newErrors.businessPhone = 'Business phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return false;
    }

    try {
      setSaving(true);
      
      await updateBusinessProfile(formData);
      toast.success('Business profile updated successfully!');
      return true;
      
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to save profile');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (type: 'profile' | 'refund' | 'terms', file: File) => {
    try {
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));

      const documentType = type === 'profile' ? 'business-profile' : 
                          type === 'refund' ? 'refund-policy' : 'terms-service';
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/stage1/upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}&documentType=${documentType}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const { uploadUrl, fileUrl } = await response.json();

      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (type === 'profile') {
        handleInputChange('businessProfileImage', { url: fileUrl, verified: false });
      } else if (type === 'refund') {
        handleInputChange('refundPolicyDocument', { url: fileUrl, verified: false });
      } else if (type === 'terms') {
        handleInputChange('termsDocument', { url: fileUrl, verified: false });
      }

      setUploadProgress(prev => ({ ...prev, [type]: 100 }));
      toast.success('File uploaded successfully!');

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, [type]: 0 }));
      }, 2000);
    }
  };

  return {
    loading,
    saving,
    prefilledData,
    formData,
    errors,
    characterCount,
    uploadProgress,
    handleInputChange,
    handleSubmit,
    handleFileUpload,
  };
};