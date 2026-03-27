'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import TermsModal from "../final-review/components/TermsModal";
import { 
  getOnboardingData, 
  updateBusinessProfile 
} from '@/lib/api/vendorOnboarding';
import { 
  ArrowLeft, 
  Save, 
  Loader,
  Upload,
  Link as LinkIcon,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  FileText,
  Image as ImageIcon,
  X
} from 'lucide-react';

// Types
interface PrefilledData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  ownershipType: string;
  businessType: string;
  yearsInBusiness: string;
  employeesCount: string;
  minorityCategories: string[];
  establishedDate?: string;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  primaryPhone: string;
}

interface FormData {
  // Personal Information
  language: string;
  customLanguage?: string; // Added customLanguage to the interface
  
  // Business Information
  licenseNumber: string;
  businessBio: string;
  characterLimit: number;
  businessProfileImage: {
    url: string;
    verified: boolean;
  };
  featureBanner: {
    url: string;
    verified: boolean;
  };
  
  // Contact Information
  alternatePhone: string;
  
  // Social Media
  website: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  tiktok: string;
  
  // Additional Documents & Links
  refundPolicyDocument: {
    url: string;
    verified: boolean;
  };
  termsDocument: {
    url: string;
    verified: boolean;
  };
  googleReviewLink: string;
  communityServiceLink: string;
}

interface FormErrors {
  [key: string]: string;
}

interface SelectedFile {
  name: string;
  type: string;
}

// Character limit based on tier plan
const TIER_CHARACTER_LIMITS = {
  basic: 150,
  standard: 225,
  premium: 500
};

// Validate file
const validateFile = async (
  file: File,
  type: 'image' | 'document',
  uploadType?: 'profile' | 'banner' | 'refund' | 'terms'
): Promise<{ isValid: boolean; error?: string }> => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  
  if (file.size > MAX_SIZE) {
    return { isValid: false, error: 'File must be under 5MB' };
  }
  
  if (type === 'image') {
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
      return { isValid: false, error: 'Only JPG, PNG, GIF, WEBP images allowed' };
    }

    // Keep logo rule strict: exact 500x500.
    if (uploadType === 'profile') {
      return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          if (img.width !== 500 || img.height !== 500) {
            resolve({ isValid: false, error: 'Logo must be exactly 500x500 pixels' });
          } else {
            resolve({ isValid: true });
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve({ isValid: false, error: 'Invalid image file' });
        };

        img.src = objectUrl;
      });
    }
  } else {
    const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!ALLOWED_DOC_TYPES.includes(file.type)) {
      return { isValid: false, error: 'Only PDF, DOC, DOCX files allowed' };
    }
  }
  
  return { isValid: true };
};

// Function to get upload URL from backend
const getUploadUrl = async (fileName: string, fileType: string, documentType: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/stage1/upload-url?fileName=${encodeURIComponent(fileName)}&fileType=${encodeURIComponent(fileType)}&documentType=${documentType}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get upload URL' }));
    throw new Error(error.message || 'Failed to get upload URL');
  }
  return response.json();
};

// Function to upload file to S3
const uploadToS3 = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  
  if (!response.ok) throw new Error('Failed to upload file');
};

export default function BusinessProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Upload states - same as Stage 1
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, SelectedFile | null>>({});
  
  // Pre-filled non-editable data from Stage 1
  const [prefilledData, setPrefilledData] = useState<PrefilledData>({
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
    employeesCount: '',
    minorityCategories: [],
    establishedDate: '',
    firstName: '',
    lastName: '',
    primaryEmail: '',
    primaryPhone: ''
  });
  
  // Editable form data
  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    language: '',
    customLanguage: '',

    // Business Information
    licenseNumber: '',
    businessBio: '',
    characterLimit: TIER_CHARACTER_LIMITS.standard,
    businessProfileImage: { url: '', verified: false },
    featureBanner: { url: '', verified: false },
    
    // Contact Information
    alternatePhone: '',
    
    // Social Media
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    tiktok: '',
    
    // Additional Documents & Links
    refundPolicyDocument: { url: '', verified: false },
    termsDocument: { url: '', verified: false },
    googleReviewLink: '',
    communityServiceLink: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [characterCount, setCharacterCount] = useState(0);

  //state for policy agreement

const [hasOwnPolicy, setHasOwnPolicy] = useState(true); // default YES
const [acceptMosaicPolicy, setAcceptMosaicPolicy] = useState(false);
const [modalOpen, setModalOpen] = useState(false);
const [modalType, setModalType] = useState<"terms" | "privacy" | "refund" | null>(null);

const openModal = (type: "terms" | "privacy" | "refund") => {
  setModalType(type);
  setModalOpen(true);
};

const closeModal = () => {
  setModalOpen(false);
  setModalType(null);
};

  // Fetch onboarding data on mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Update character count when bio changes
  useEffect(() => {
    setCharacterCount(formData.businessBio?.length || 0);
  }, [formData.businessBio]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const data = await getOnboardingData();
      
      // Set prefilled non-editable data
      setPrefilledData({
        businessName: data.businessName || '',
        businessEmail: data.secondaryBusinessEmail || data.businessEmail || '',
        businessPhone: data.businessPhone || data.primaryPhone || '',
        address: data.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: ''
        },
        ownershipType: data.ownershipType || '',
        businessType: data.businessType || '',
        yearsInBusiness: data.yearsInBusiness || '',
        employeesCount: data.employeesCount || '',
        minorityCategories: data.minorityCategories || [''],
        establishedDate: data.yearsInBusiness || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        primaryEmail: data.primaryEmail || '',
        primaryPhone: data.primaryPhone || ''
      });

      // Set editable form data
      setFormData({
        // Personal Information
        language: data.language || '',
        customLanguage: data.customLanguage || '', // Initialize customLanguage from fetched data
        
        // Business Information
        licenseNumber: data.licenseNumber || '',
        businessBio: data.businessBio || '',
        characterLimit: data.characterLimit || TIER_CHARACTER_LIMITS.standard,
        businessProfileImage: data.businessProfileImage || { url: '', verified: false },
        featureBanner: data.featureBanner || { url: '', verified: false },
        
        // Contact Information
        alternatePhone: data.alternatePhone || '',
        
        // Social Media
        website: data.website || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        twitter: data.twitter || '',
        linkedin: data.linkedin || '',
        tiktok: data.tiktok || '',
        
        // Additional Documents & Links
        refundPolicyDocument: data.refundPolicyDocument || { url: '', verified: false },
        termsDocument: data.termsDocument || { url: '', verified: false },
        googleReviewLink: data.googleReviewLink || '',
        communityServiceLink: data.communityServiceLink || ''
      });

    } catch (error: any) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

const validateForm = (): boolean => {
  const newErrors: FormErrors = {};

  // Business Bio - REQUIRED
  if (!formData.businessBio?.trim()) {
    newErrors.businessBio = 'Business bio is required';
  } else if (formData.businessBio.length > (formData.characterLimit || 225)) {
    newErrors.businessBio = `Bio exceeds ${formData.characterLimit || 225} character limit`;
  }

  // Business Logo - REQUIRED
  if (!formData.businessProfileImage?.url) {
    newErrors.businessProfileImage = 'Business logo is required';
  }

  // ✅ NEW: Policy checkbox validation
  if (!hasOwnPolicy && !acceptMosaicPolicy) {
    newErrors.acceptMosaicPolicy = 'You must accept Mosaic Terms & Policy';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    try {
      setSaving(true);
      
      await updateBusinessProfile({
        language: formData.language === "Other" ? formData.customLanguage : formData.language, // Conditionally send customLanguage
        licenseNumber: formData.licenseNumber,
        businessBio: formData.businessBio,
        characterLimit: formData.characterLimit,
        businessProfileImage: formData.businessProfileImage,
        featureBanner: formData.featureBanner,
        alternatePhone: formData.alternatePhone,
        website: formData.website,
        facebook: formData.facebook,
        instagram: formData.instagram,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        tiktok: formData.tiktok,
        refundPolicyDocument: formData.refundPolicyDocument,
        termsDocument: formData.termsDocument,
        googleReviewLink: formData.googleReviewLink,
        communityServiceLink: formData.communityServiceLink
      });

      toast.success('Business profile updated successfully!');
      router.push('/partners');
      
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // ============ FILE UPLOAD HANDLERS - SAME AS STAGE 1 ============
  
  const handleFileSelect = async (
    uploadType: 'profile' | 'banner' | 'refund' | 'terms',
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file based on type
    const fileType = (uploadType === 'profile' || uploadType === 'banner') ? 'image' : 'document';
    const validation = await validateFile(file, fileType, uploadType);
    
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setSelectedFiles(prev => ({ ...prev, [uploadType]: { name: file.name, type: file.type } }));
    
    try {
      setUploading(prev => ({ ...prev, [uploadType]: true }));
      
      // Map to document type for backend
      const documentType = uploadType === 'profile' ? 'business-profile' : 
                          uploadType === 'banner' ? 'feature-banner' :
                          uploadType === 'refund' ? 'refund-policy' : 'terms-service';
      
      // Get upload URL
      const { uploadUrl, fileUrl } = await getUploadUrl(
        `${Date.now()}-${file.name}`,
        file.type,
        documentType
      );
      
      // Upload to S3
      await uploadToS3(uploadUrl, file);
      
      // Update form state with new document
      const newDoc = { url: fileUrl, verified: false };
      
      switch (uploadType) {
        case 'profile':
          handleInputChange('businessProfileImage', newDoc);
          break;
        case 'banner':
          handleInputChange('featureBanner', newDoc);
          break;
        case 'refund':
          handleInputChange('refundPolicyDocument', newDoc);
          break;
        case 'terms':
          handleInputChange('termsDocument', newDoc);
          break;
      }
      
      toast.success('File uploaded successfully!');
      
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(prev => ({ ...prev, [uploadType]: false }));
      setSelectedFiles(prev => ({ ...prev, [uploadType]: null }));
      
      // Clear the input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const removeDocument = (uploadType: 'profile' | 'banner' | 'refund' | 'terms') => {
    switch (uploadType) {
      case 'profile':
        handleInputChange('businessProfileImage', { url: '', verified: false });
        break;
      case 'banner':
        handleInputChange('featureBanner', { url: '', verified: false });
        break;
      case 'refund':
        handleInputChange('refundPolicyDocument', { url: '', verified: false });
        break;
      case 'terms':
        handleInputChange('termsDocument', { url: '', verified: false });
        break;
    }
    toast.success('Document removed');
  };

  // ============ END FILE UPLOAD HANDLERS ============

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#c9a227] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your business profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-3 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900">Set Up Your Business Profile</h1>
          {/* <p className="text-sm text-gray-600 mt-1">
            Create a public profile to showcase your business, products, and services
          </p> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Personal Information - ALL DISABLED except Language */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-[#c9a227]" />
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
                <input
                  type="text"
                  value={prefilledData.firstName}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
                <input
                  type="text"
                  value={prefilledData.lastName}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                <input
                  type="email"
                  value={prefilledData.primaryEmail}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={prefilledData.primaryPhone}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                />
              </div>
<div>
  <label className="block text-xs font-medium text-gray-500 mb-1">
    Language
  </label>

  <select
    value={formData.language === "Other" ? "Other" : formData.language}
    onChange={(e) => handleInputChange('language', e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a227] focus:border-transparent bg-white text-sm"
  >
    {/* <option value="">-- choose language --</option> */}
    <option value="English">English</option>
    <option value="Spanish">Spanish</option>
    <option value="French">French</option>
    <option value="Chinese">Chinese</option>
    <option value="Other">Other</option>
  </select>

  {/* ✅ Show input when "Other" is selected */}
  {formData.language === "Other" && (
    <input
      type="text"
      placeholder="Enter language"
      value={formData.customLanguage || ""}
      onChange={(e) =>
        handleInputChange('customLanguage', e.target.value)
      }
      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a227] focus:border-transparent text-sm"
    />
  )}
</div>

              {/* <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a227] focus:border-transparent bg-white text-sm"
                >
                  <option value="">-- choose language --</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div> */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Minority Type</label>
                <input
                  type="text"
                  value={prefilledData.minorityCategories.join(', ')}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Established In</label>
                <input
                  type="text"
                  value={prefilledData.establishedDate}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-[#c9a227]" />
              <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
            </div>

            <div className="space-y-4">
              {/* Business Name, License, Type - DISABLED */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={prefilledData.businessName}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">License Number</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    disabled
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a227] focus:border-transparent text-sm"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Business Type</label>
                  <input
                    type="text"
                    value={prefilledData.ownershipType}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Business Bio */}
              <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-gray-500">
    Business Bio <span className="text-red-500">*</span>
  </label>
                  <span className={`text-xs ${
                    characterCount > (formData.characterLimit || 225) 
                      ? 'text-red-600' 
                      : 'text-gray-400'
                  }`}>
                    {characterCount}/{formData.characterLimit || 225}
                  </span>
                </div>
                <textarea
                  value={formData.businessBio}
                  onChange={(e) => handleInputChange('businessBio', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#c9a227] focus:border-transparent text-sm resize-none ${
                    errors.businessBio ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter Your Business Bio"
                />
                {errors.businessBio ? (
                  <p className="mt-1 text-xs text-red-600">{errors.businessBio}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-400">
                    Character Limit: 225 (Based On Selected Tier Plan)
                  </p>
                )}
              </div>

              {/* Business Logo - Same as Stage 1 */}
       {/* Business Logo - Required */}
<div>
  <label className="block text-xs font-medium text-gray-500 mb-1">
    Business Logo <span className="text-red-500">*</span>
  </label>
  <div className="flex items-center gap-4">
    <div className={`flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-gray-500 text-sm ${
      errors.businessProfileImage ? 'border-red-500' : 'border-gray-300'
    }`}>
      {selectedFiles['profile'] ? selectedFiles['profile']?.name : 
       formData.businessProfileImage?.url ? 'Logo uploaded' : 'No file chosen'}
    </div>
    <input
      type="file"
      id="profile-upload"
      className="hidden"
      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
      onChange={(e) => handleFileSelect('profile', e)}
      disabled={uploading['profile']}
    />
    <label
      htmlFor="profile-upload"
      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer font-medium flex items-center gap-2 text-sm"
    >
      {uploading['profile'] ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Upload className="w-4 h-4" />
      )}
      {uploading['profile'] ? 'Uploading...' : '+ Upload Image'}
    </label>
    {formData.businessProfileImage?.url && (
      <button
        type="button"
        onClick={() => removeDocument('profile')}
        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
  {errors.businessProfileImage && (
    <p className="mt-1 text-xs text-red-600">{errors.businessProfileImage}</p>
  )}
  <p className="mt-1 text-xs text-gray-500">Logo size must be 500x500 pixels</p>
  {formData.businessProfileImage?.url && (
    <div className="mt-2 flex items-center gap-2">
      <a
        href={formData.businessProfileImage.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
      >
        <ImageIcon className="w-3 h-3" />
        View uploaded logo
      </a>
    </div>
  )}
</div>

              {/* Feature Banner */}
<div>
  <label className="block text-xs font-medium text-gray-500 mb-1">
    Feature Banner
  </label>
  <div className="flex items-center gap-4">
    <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
      {selectedFiles['banner'] ? selectedFiles['banner']?.name : 
       formData.featureBanner?.url ? 'Banner uploaded' : 'No file chosen'}
    </div>
    <input
      type="file"
      id="banner-upload"
      className="hidden"
      accept="image/*,.jpg,.jpeg,.png"
      onChange={(e) => handleFileSelect('banner', e)}
      disabled={uploading['banner']}
    />
    <label
      htmlFor="banner-upload"
      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer font-medium flex items-center gap-2 text-sm"
    >
      {uploading['banner'] ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Upload className="w-4 h-4" />
      )}
      {uploading['banner'] ? 'Uploading...' : '+ Upload Image'}
    </label>
    {formData.featureBanner?.url && (
      <button
        type="button"
        onClick={() => removeDocument('banner')}
        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      
    )}
  </div>
    <p className="mt-1 text-xs text-gray-500">Preferred size should be 2200 x 1000 pixels</p>
  {formData.featureBanner?.url && (
    <div className="mt-2 flex items-center gap-2">
      <a
        href={formData.featureBanner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
      >
        <ImageIcon className="w-3 h-3" />
        View uploaded banner
      </a>
      
    </div>
    
  )}
</div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-[#c9a227]" />
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
            </div>

            <div className="space-y-4">
              {/* Business Email & Phone - DISABLED */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Business Email Address</label>
                  <input
                    type="email"
                    value={prefilledData.businessEmail}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Business Contact Number</label>
                  <input
                    type="tel"
                    value={prefilledData.businessPhone}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Alternate Phone */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Alternate Contact Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a227] focus:border-transparent text-sm"
                  placeholder="e.g. 0000 0000 00"
                />
              </div>

              {/* Country - DISABLED */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
                <input
                  type="text"
                  value={prefilledData.address.country}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                />
              </div>

              {/* Address - DISABLED */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Business Address</label>
                <input
                  type="text"
                  value={prefilledData.address.street}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                />
              </div>

              {/* City, State, Zip - DISABLED */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                  <input
                    type="text"
                    value={prefilledData.address.city}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
                  <input
                    type="text"
                    value={prefilledData.address.state}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Zip Code</label>
                  <input
                    type="text"
                    value={prefilledData.address.zipCode}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-[#c9a227]" />
              <h2 className="text-lg font-semibold text-gray-900">Social Media Links</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Website</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a227] focus:border-transparent text-sm"
                  placeholder="www.yourbusiness.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <Facebook className="w-3.5 h-3.5 text-blue-600" />
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a227] focus:border-transparent text-sm"
                    placeholder="facebook.com/yourbusiness"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a227] focus:border-transparent text-sm"
                    placeholder="instagram.com/yourbusiness"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <Twitter className="w-3.5 h-3.5 text-blue-400" />
                    Twitter/X
                  </label>
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a227] focus:border-transparent text-sm"
                    placeholder="twitter.com/yourbusiness"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <Linkedin className="w-3.5 h-3.5 text-blue-700" />
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a227] focus:border-transparent text-sm"
                    placeholder="linkedin.com/company/yourbusiness"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    TikTok
                  </label>
                  <input
                    type="text"
                    value={formData.tiktok}
                    onChange={(e) => handleInputChange('tiktok', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a227] focus:border-transparent text-sm"
                    placeholder="tiktok.com/@yourbusiness"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white ">
   <div className="bg-white border  p-4 space-y-4">

  {/* Icon + Question */}
  <div className="flex items-start gap-3">
    <div className="text-white-600 text-xl"></div>

    <div>
      <p className="text-amber-800 font-medium text-sm">
        Do you have your own Refund Policy & Terms?
      </p>

      {/* Yes / No */}
      <div className="flex gap-4 mt-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={hasOwnPolicy === true}
            onChange={() => setHasOwnPolicy(true)}
          />
          Yes
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={hasOwnPolicy === false}
            onChange={() => setHasOwnPolicy(false)}
          />
          No
        </label>
      </div>
    </div>
  </div>

  {/* If NO → show mosaic acceptance */}
{!hasOwnPolicy && (
  <div
    className={`border rounded-lg p-3 space-y-3 ${
      errors.acceptMosaicPolicy ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
    }`}
  >
    <label className="flex items-start gap-2 text-sm">
      <input
        type="checkbox"
        checked={acceptMosaicPolicy}
        onChange={(e) => setAcceptMosaicPolicy(e.target.checked)}
      />

      <span className="text-gray-700">
        I agree to follow{" "}
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={() => openModal("terms")}
        >
          MosaicBizHub Terms & Conditions
        </button>{" "}
        and{" "}
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={() => openModal("refund")}
        >
          Refund Policy
        </button>
      </span>
    </label>

    {/* ✅ Error message like textarea */}
    {errors.acceptMosaicPolicy ? (
      <p className="text-xs text-red-600">
        {errors.acceptMosaicPolicy}
      </p>
    ) : (
      <p className="text-xs text-gray-500">
        You must accept Mosaic policies if you don’t provide your own.
      </p>
    )}
  </div>
)}

<TermsModal 
  isOpen={modalOpen} 
  onClose={closeModal} 
  type={modalType || "terms"} // ✅ FIX
/>
</div>
            <div className="flex items-center gap-2 mb-4 mt-4">
              <FileText className="w-5 h-5 text-[#c9a227]" />
              <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Optional</span>
            </div>
            <div className="space-y-4">

  {/* ✅ SHOW ONLY IF USER HAS OWN POLICY */}
  {hasOwnPolicy && (
    <>
      {/* Refund & Return Policy */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Refund & Return Policy Document
        </label>

        <div className="flex items-center gap-4">
          <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
            {selectedFiles['refund']
              ? selectedFiles['refund']?.name
              : formData.refundPolicyDocument?.url
              ? 'Document uploaded'
              : 'No file chosen'}
          </div>

          <input
            type="file"
            id="refund-upload"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileSelect('refund', e)}
            disabled={uploading['refund']}
          />

          <label
            htmlFor="refund-upload"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 cursor-pointer flex items-center gap-2 text-sm"
          >
            {uploading['refund'] ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading['refund'] ? 'Uploading...' : 'Upload File'}
          </label>

          {formData.refundPolicyDocument?.url && (
            <button
              type="button"
              onClick={() => removeDocument('refund')}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {formData.refundPolicyDocument?.url && (
          <a
            href={formData.refundPolicyDocument.url}
            target="_blank"
            className="text-xs text-blue-600 mt-2 inline-flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            View uploaded document
          </a>
        )}
      </div>

      {/* Terms */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Terms & Conditions / Service Agreement Document
        </label>

        <div className="flex items-center gap-4">
          <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
            {selectedFiles['terms']
              ? selectedFiles['terms']?.name
              : formData.termsDocument?.url
              ? 'Document uploaded'
              : 'No file chosen'}
          </div>

          <input
            type="file"
            id="terms-upload"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileSelect('terms', e)}
            disabled={uploading['terms']}
          />

          <label
            htmlFor="terms-upload"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 cursor-pointer flex items-center gap-2 text-sm"
          >
            {uploading['terms'] ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading['terms'] ? 'Uploading...' : 'Upload File'}
          </label>

          {formData.termsDocument?.url && (
            <button
              onClick={() => removeDocument('terms')}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {formData.termsDocument?.url && (
          <a
            href={formData.termsDocument.url}
            target="_blank"
            className="text-xs text-blue-600 mt-2 inline-flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            View uploaded document
          </a>
        )}
      </div>
    </>
  )}

  {/* ✅ ALWAYS SHOW */}
  {/* Google Review */}
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">
      Google Review Link
    </label>
    <input
      type="url"
      value={formData.googleReviewLink}
      onChange={(e) => handleInputChange('googleReviewLink', e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
      placeholder="https://g.page/r/your-business-review"
    />
  </div>

  {/* Community */}
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">
      Link To A Community Service/Drive
    </label>
    <input
      type="url"
      value={formData.communityServiceLink}
      onChange={(e) => handleInputChange('communityServiceLink', e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
      placeholder="https://example.com/community-service"
    />
  </div>

</div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3">
            {/* <button
              type="button"
              onClick={() => router.push('/partners')}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Continue The Onboarding process
            </button> */}
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#c9a227] text-white rounded-lg hover:bg-[#b8921f] transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
