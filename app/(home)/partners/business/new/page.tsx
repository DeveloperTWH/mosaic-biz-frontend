'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'; // Add this
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TermsModal from "../../final-review/components/TermsModal";

import {
  saveStage1Draft,
  getStage1Draft,
  createStage1Payment,
  submitStage1
} from '@/lib/api/vendorOnboarding';
import { loadStripe } from '@stripe/stripe-js';

/* ======================================================
   TYPES - Updated to match API
====================================================== */

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface Document {
  type: string;
  url: string;
  verified: boolean;
}

interface VerificationPayment {
  status: 'pending' | 'completed' | 'failed';
}

type BusinessType = 'product' | 'service' | 'food' | '';
type OwnershipType = 'Limited Liability Company' | 'Sole Proprietor' | 'S-Corporation' | 'C-Corporation' | 'Nonprofit' | '';

interface Stage1Form {
  // Section 1: Basic Business Info
  businessName: string;
  
  // Section 2: Minority Status
  isMinorityOwned: boolean;
  minorityCategories: string[];
  otherMinorityCategory: string;
  
  // Section 3: Legal & Tax
  hasEIN: boolean;
  einNumber: string;
  ssnLast9: string;
  hasBusinessLicense: boolean;
  
  // Section 4: Business Details
  businessOwnershipType: OwnershipType;
  yearsInBusiness: string;
  isFranchise: boolean;
  franchiseName: string;
  businessType: BusinessType;
  hasThirdPartyBooking: boolean;
  hasPhysicalLocation: boolean;
  numberOfEmployees: string;
  
  // Section 5: Online Presence
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  tiktokUrl: string;
  
  // Section 6: Contact Info
  primaryContactName: string;
  primaryContactDesignation: string;
  contactEmail: string;
  businessEmail: string;
  contactPhone: string;
  
  // Section 7: Address
  address: Address;
  
  // Section 8: Documents
  minorityProofDocuments: Document[];
  taxDocuments: Document[];
  businessLicenseDocuments: Document[];
  
  // Section 9: Payment & Terms
  verificationPayment: VerificationPayment;
  acceptedTerms: boolean;
  declarationAccepted: boolean;
}

/* ======================================================
   INITIAL STATE - Updated to match API
====================================================== */

const initialState: Stage1Form = {
  businessName: '',
  
  isMinorityOwned: true,
  minorityCategories: [],
  otherMinorityCategory: '',
  
  hasEIN: true,
  einNumber: '',
  ssnLast9: '',
  
  hasBusinessLicense: true,
  
  businessOwnershipType: '',
  yearsInBusiness: '',
  isFranchise: false,
  franchiseName: '',
  businessType: '',
  hasThirdPartyBooking: false,
  hasPhysicalLocation: true,
  numberOfEmployees: '',
  
  websiteUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  linkedinUrl: '',
  tiktokUrl: '',
  
  primaryContactName: '',
  primaryContactDesignation: '',
  contactEmail: '',
  businessEmail: '',
  contactPhone: '',
  
  address: {
    street: '',
    city: '',
    state: '',
    country: 'United States',
    zipCode: '',
  },
  
  minorityProofDocuments: [],
  taxDocuments: [],
  businessLicenseDocuments: [],
  
  verificationPayment: {
    status: 'pending'
  },
  acceptedTerms: false,
  declarationAccepted: false,
};

const minorityOnlyMessage =
  'At this time, we are prioritizing the onboarding of Minority-Owned Businesses. We appreciate your interest and will certainly get in touch if our requirements change and we open applications to a broader range of partners.';

const mapDraftToStage1Form = (draft: any): Stage1Form => {
  const mapDocs = (docs: any[] = [], fallbackType: string): Document[] =>
    docs
      .map((doc) => ({
        type: doc?.type || fallbackType,
        url: doc?.url || '',
        verified: Boolean(doc?.verified),
      }))
      .filter((doc) => Boolean(doc.url));

  const paymentStatusRaw = draft?.verificationPayment?.status;
  const paymentStatus: VerificationPayment['status'] =
    paymentStatusRaw === 'paid' || paymentStatusRaw === 'completed'
      ? 'completed'
      : paymentStatusRaw === 'failed'
      ? 'failed'
      : 'pending';

  return {
    businessName: draft?.businessName || '',
    isMinorityOwned:
      typeof draft?.isMinorityOwned === 'boolean'
        ? draft.isMinorityOwned
        : initialState.isMinorityOwned,
    minorityCategories: Array.isArray(draft?.minorityCategories) ? draft.minorityCategories : [],
    otherMinorityCategory: draft?.otherMinorityCategory || '',
    hasEIN: typeof draft?.hasEIN === 'boolean' ? draft.hasEIN : initialState.hasEIN,
    einNumber: draft?.einNumber || '',
    ssnLast9: draft?.ssnLast9 || '',
    hasBusinessLicense:
      typeof draft?.hasBusinessLicense === 'boolean'
        ? draft.hasBusinessLicense
        : initialState.hasBusinessLicense,
    businessOwnershipType: (draft?.ownershipType || '') as OwnershipType,
    yearsInBusiness: draft?.yearsInBusiness || '',
    isFranchise: typeof draft?.isFranchise === 'boolean' ? draft.isFranchise : initialState.isFranchise,
    franchiseName: draft?.franchiseName || '',
    businessType: (draft?.businessType || '') as BusinessType,
    hasThirdPartyBooking:
      typeof draft?.usesThirdPartyBooking === 'boolean'
        ? draft.usesThirdPartyBooking
        : initialState.hasThirdPartyBooking,
    hasPhysicalLocation:
      typeof draft?.hasPhysicalLocation === 'boolean'
        ? draft.hasPhysicalLocation
        : initialState.hasPhysicalLocation,
    numberOfEmployees: draft?.employeesCount || '',
    websiteUrl: draft?.website || '',
    facebookUrl: draft?.facebook || '',
    instagramUrl: draft?.instagram || '',
    linkedinUrl: draft?.linkedin || '',
    tiktokUrl: draft?.tiktok || '',
    primaryContactName: draft?.primaryContactName || '',
    primaryContactDesignation: draft?.primaryContactDesignation || '',
    contactEmail:
      draft?.primaryEmail || draft?.secondaryBusinessEmail || draft?.businessEmail || '',
    businessEmail: draft?.businessEmail || draft?.secondaryBusinessEmail || '',
    contactPhone:
      draft?.primaryPhone || draft?.businessPhone || draft?.alternatePhone || '',
    address: {
      street: draft?.address?.street || '',
      city: draft?.address?.city || '',
      state: draft?.address?.state || '',
      country: draft?.address?.country || 'United States',
      zipCode: draft?.address?.zipCode || '',
    },
    minorityProofDocuments: mapDocs(draft?.minorityProofDocuments, 'minority-proof'),
    taxDocuments: mapDocs(draft?.taxDocuments, 'tax-doc'),
    businessLicenseDocuments: mapDocs(draft?.businessLicenseDocuments, 'business-license'),
    verificationPayment: {
      status: paymentStatus,
    },
    acceptedTerms:
      typeof draft?.acceptedTerms === 'boolean'
        ? draft.acceptedTerms
        : initialState.acceptedTerms,
    declarationAccepted:
      typeof draft?.declarationAccepted === 'boolean'
        ? draft.declarationAccepted
        : initialState.declarationAccepted,
  };
};

/* ======================================================
   HELPER FUNCTIONS FOR FILE UPLOAD
====================================================== */

// Function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Function to get upload URL from backend
const getUploadUrl = async (fileName: string, fileType: string, documentType: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/stage1/upload-url?fileName=${encodeURIComponent(fileName)}&fileType=${encodeURIComponent(fileType)}&documentType=${documentType}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This sends cookies automatically
    }
  );
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get upload URL' }));
    throw new Error(error.message || 'Failed to get upload URL');
  }
  return response.json();
};

// Function to upload file to S3
const uploadToS3 = async (uploadUrl: string, file: File, fileType: string) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': fileType },
    body: file,
  });
  
  if (!response.ok) throw new Error('Failed to upload file');
};

// Validate file
const validateFile = (file: File): { isValid: boolean; error?: string } => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  
  if (file.size > MAX_SIZE) return { isValid: false, error: 'File must be under 5MB' };
  if (!ALLOWED_TYPES.includes(file.type)) return { isValid: false, error: 'Only PDF, JPG, PNG files allowed' };
  return { isValid: true };
};

/* ======================================================
   FORM COMPONENTS
====================================================== */

interface InputFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  required = false, 
  children, 
  error, 
  className = '' 
}) => (
  <div className={`mb-6 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

/* ======================================================
   MAIN COMPONENT
====================================================== */

export default function VendorOnboardingStage1Page() {
  const [form, setForm] = useState<Stage1Form>(initialState);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"terms" | "privacy" | "directory">("terms");

  const openModal = (type: "terms" | "privacy" | "directory") => {
    setModalType(type);
    setModalOpen(true);
  };

    const closeModal = () => {
    setModalOpen(false);
  };

  const router = useRouter(); // Initialize router

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await getStage1Draft();
        if (draft) {
          setForm(mapDraftToStage1Form(draft));
        }
      } catch (error: any) {
        if (error?.message && !/failed to load draft/i.test(error.message)) {
          console.error('Error loading draft:', error);
        }
      }
    };

    loadDraft();
  }, []);

  /* ======================================================
     FILE UPLOAD FUNCTIONS
  ====================================================== */

  const handleFileSelect = async (
    documentType: 'business-license' | 'minority-proof' | 'tax-doc',
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setSelectedFiles(prev => ({ ...prev, [documentType]: file }));
    
    try {
      setUploading(prev => ({ ...prev, [documentType]: true }));
      
      // Get upload URL
      const { uploadUrl, fileUrl } = await getUploadUrl(
        `${Date.now()}-${file.name}`,
        file.type,
        documentType
      );
      
      // Upload to S3
      await uploadToS3(uploadUrl, file, file.type);
      
      // Add to form state
      const newDoc = { type: documentType, url: fileUrl, verified: false };
      
      switch (documentType) {
        case 'business-license':
          setForm(prev => ({
            ...prev,
            businessLicenseDocuments: [...prev.businessLicenseDocuments, newDoc]
          }));
          break;
        case 'minority-proof':
          setForm(prev => ({
            ...prev,
            minorityProofDocuments: [...prev.minorityProofDocuments, newDoc]
          }));
          break;
        case 'tax-doc':
          setForm(prev => ({
            ...prev,
            taxDocuments: [...prev.taxDocuments, newDoc]
          }));
          break;
      }
      
      toast.success('File uploaded successfully!');
      
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }));
      setSelectedFiles(prev => ({ ...prev, [documentType]: null }));
    }
  };

  const removeDocument = (
    documentType: 'business-license' | 'minority-proof' | 'tax-doc',
    index: number
  ) => {
    switch (documentType) {
      case 'business-license':
        setForm(prev => ({
          ...prev,
          businessLicenseDocuments: prev.businessLicenseDocuments.filter((_, i) => i !== index)
        }));
        break;
      case 'minority-proof':
        setForm(prev => ({
          ...prev,
          minorityProofDocuments: prev.minorityProofDocuments.filter((_, i) => i !== index)
        }));
        break;
      case 'tax-doc':
        setForm(prev => ({
          ...prev,
          taxDocuments: prev.taxDocuments.filter((_, i) => i !== index)
        }));
        break;
    }
    toast.success('Document removed');
  };

  /* ======================================================
     FORM STATE MANAGEMENT
  ====================================================== */

  const update = <K extends keyof Stage1Form>(key: K, value: Stage1Form[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const updateAddress = (key: keyof Address, value: string) => {
    setForm(prev => ({
      ...prev,
      address: { ...prev.address, [key]: value }
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.isMinorityOwned) {
      errors.isMinorityOwned = minorityOnlyMessage;
      setFormErrors(errors);
      return false;
    }

    // Basic Business Info
    if (!form.businessName.trim()) errors.businessName = 'Business name is required';

    // Minority Status
    if (form.isMinorityOwned && form.minorityCategories.length === 0) {
      errors.minorityCategories = 'Please select at least one minority category';
    }

    // Legal & Tax
    if (form.hasEIN && !form.einNumber.match(/^\d{9}$/)) {
      errors.einNumber = 'EIN must be 9 digits';
    }
    if (!form.hasEIN && !form.ssnLast9.match(/^\d{9}$/)) {
      errors.ssnLast9 = 'SSN must be 9 digits';
    }

    // Business Details
    if (!form.businessOwnershipType) errors.businessOwnershipType = 'Ownership type is required';
    if (!form.yearsInBusiness) errors.yearsInBusiness = 'Years in business is required';
    if (!form.businessType) errors.businessType = 'Business type is required';

    // Contact Info
    if (!form.primaryContactName.trim()) errors.primaryContactName = 'Primary contact name is required';
    if (!form.primaryContactDesignation.trim()) errors.primaryContactDesignation = 'Designation is required';
    if (!form.contactEmail.trim()) errors.contactEmail = 'Contact email is required';
    if (!form.businessEmail.trim()) errors.businessEmail = 'Business email is required';
    if (!form.contactPhone.trim()) errors.contactPhone = 'Contact phone is required';

    // Address
    if (!form.address.street.trim()) errors.address_street = 'Street address is required';
    if (!form.address.city.trim()) errors.address_city = 'City is required';
    if (!form.address.state.trim()) errors.address_state = 'State is required';
    if (!form.address.zipCode.trim()) errors.address_zipCode = 'ZIP code is required';

    // Documents
    if (!form.hasBusinessLicense && form.businessLicenseDocuments.length === 0) {
      errors.businessLicenseDocuments = 'Business license is required';
    }

    // Terms
    if (!form.acceptedTerms) errors.acceptedTerms = 'You must accept the Terms & Conditions';
    if (!form.declarationAccepted) errors.declarationAccepted = 'You must declare the information is correct';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

const saveDraft = async () => {
  if (!form.isMinorityOwned) {
    toast.error(minorityOnlyMessage);
    return;
  }

  // Add the same validation as handlePayAndSubmit
  if (!validateForm()) {
    toast.error('Please fix all errors before saving draft');
    return;
  }

  try {
    setLoading(true);
    await saveStage1Draft(form);
    toast.success('Draft saved successfully');
  } catch (error: any) {
    toast.error(error.message || 'Failed to save draft');
  } finally {
    setLoading(false);
  }
};

const handlePayAndSubmit = async () => {
  if (!form.isMinorityOwned) {
    toast.error(minorityOnlyMessage);
    return;
  }

  if (!validateForm()) {
    toast.error('Please fix all errors before proceeding to payment');
    return;
  }

  try {
    setLoading(true);
    
    // Save the draft first
    await saveStage1Draft(form);
    
    // Create payment intent
    const paymentResponse = await createStage1Payment();
    
    if (paymentResponse?.success && paymentResponse.data?.clientSecret) {
      // Store payment data for the new vendor payment page
      sessionStorage.setItem('vendorRegistrationPayment', JSON.stringify({
        clientSecret: paymentResponse.data.clientSecret,
        amount: paymentResponse.data.amount || 99,
        currency: paymentResponse.data.currency || 'usd',
        applicationId: paymentResponse.data.applicationId
      }));
      
      toast.success('Redirecting to payment...');
      
      // Redirect to the new vendor payment page (NOT /payment/checkout)
      router.push('/partners/business/payment'); // Use router.push instead of location.assign
    } else {
      toast.error('Failed to create payment');
    }
  } catch (error: any) {
    console.error('Payment setup error:', error);
    toast.error(error.message || 'Payment setup failed');
  } finally {
    setLoading(false);
  }
};



  /* ======================================================
     MAIN RENDER
  ====================================================== */

  return (
    <div 
      className="min-h-screen py-8"
      style={{
        backgroundImage: 'url(/become-a-vendor/vendor-registion-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="pt-4">
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-sm font-medium text-[#1e3a5f] shadow-sm transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Partners
          </Link>
        </div>
        {/* Header */}
        <div className="mb-8 text-center pt-8">
          <span className="inline-block px-6 py-2 bg-[#c9a227] text-white text-sm font-medium rounded-full mb-4">
            Business Owner
          </span>
          <h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-wide">
            Vendor Registration Request
          </h1>
          <p>A non-refundable $24.99 Business Verification Fee is charged at vendor sign-up to conduct a standard background validation of your business (via our contracted screening provider) and activate your Trust Badge upon approval.</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Business Information Section */}
          <div className="mb-8">
            <InputField label="Business Name" required error={formErrors.businessName}>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={form.businessName}
                onChange={e => update('businessName', e.target.value)}
                placeholder="Enter Your Business Name"
              />
            </InputField>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Minority Owned Business</label>
              <div className="flex gap-8">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    className="sr-only" 
                    checked={form.isMinorityOwned} 
                    onChange={() => update('isMinorityOwned', true)} 
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.isMinorityOwned ? 'border-[#1e3a5f] bg-[#1e3a5f]' : 'border-gray-300'}`}>
                    {form.isMinorityOwned && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    className="sr-only" 
                    checked={!form.isMinorityOwned} 
                    onChange={() => update('isMinorityOwned', false)} 
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!form.isMinorityOwned ? 'border-[#1e3a5f] bg-[#1e3a5f]' : 'border-gray-300'}`}>
                    {!form.isMinorityOwned && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
              {!form.isMinorityOwned && (
    <div className="flex flex-col items-center mt-6 p-6 rounded-lg border border-blue-300 bg-blue-50 text-center">
      <p className="text-sm text-red-800">{minorityOnlyMessage}</p>
      <button
        onClick={() => router.push("/")}
        className="mt-4 px-6 py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      >
       Okay I understand
      </button>
    </div>
              )}
              {formErrors.isMinorityOwned && (
                <p className="mt-2 text-sm text-red-600">{formErrors.isMinorityOwned}</p>
              )}
            </div>

            {form.isMinorityOwned && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Minority Owner Category (Tick Boxes For Multiple Selection) {formErrors.minorityCategories && <span className="text-red-500">*</span>}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['African-American', 'Asian', 'LatinX', 'Woman', 'Disabled Veteran'].map(cat => (
                      <label key={cat} className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={form.minorityCategories.includes(cat)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              update('minorityCategories', [...form.minorityCategories, cat]);
                            } else {
                              update('minorityCategories', form.minorityCategories.filter(c => c !== cat));
                            }
                          }}
                        />
                        <div className={`w-4 h-4 border-2 rounded flex items-center justify-center mr-2 ${form.minorityCategories.includes(cat) ? 'bg-[#1e3a5f] border-[#1e3a5f]' : 'border-gray-300'}`}>
                          {form.minorityCategories.includes(cat) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-700 text-sm">{cat}</span>
                      </label>
                    ))}
                    
                    <label className="flex items-center cursor-pointer col-span-2 md:col-span-1">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={form.minorityCategories.includes('Other')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            update('minorityCategories', [...form.minorityCategories, 'Other']);
                          } else {
                            update('minorityCategories', form.minorityCategories.filter(c => c !== 'Other'));
                            update('otherMinorityCategory', '');
                          }
                        }}
                      />
                      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center mr-2 ${form.minorityCategories.includes('Other') ? 'bg-[#1e3a5f] border-[#1e3a5f]' : 'border-gray-300'}`}>
                        {form.minorityCategories.includes('Other') && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-700 text-sm">Other (Please Specify)</span>
                    </label>
                  </div>
                  
                  {form.minorityCategories.includes('Other') && (
                    <div className="mt-3">
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        value={form.otherMinorityCategory}
                        onChange={e => update('otherMinorityCategory', e.target.value)}
                        placeholder="Mention Your Minority Category"
                      />
                    </div>
                  )}
                  {formErrors.minorityCategories && <p className="mt-1 text-sm text-red-600">{formErrors.minorityCategories}</p>}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Upload Supporting Documents Proving Majority Stakes In The Name Of The Minority Founder (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
                      {selectedFiles['minority-proof'] ? selectedFiles['minority-proof'].name : 'No File Chosen'}
                    </div>
                    <input
                      type="file"
                      id="minority-proof-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect('minority-proof', e)}
                      disabled={uploading['minority-proof']}
                    />
                    <label 
                      htmlFor="minority-proof-upload" 
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer font-medium flex items-center gap-2"
                    >
                      <span>+</span> Upload File
                    </label>
                  </div>
                  
                  {form.minorityProofDocuments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {form.minorityProofDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-700 truncate">{doc.url.split('/').pop()}</span>
                          </div>
                          <div className="flex space-x-2">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">View</a>
                            <button onClick={() => removeDocument('minority-proof', index)} className="text-red-600 hover:text-red-700">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {form.isMinorityOwned && (
            <>
          <hr className="border-gray-200 my-8" />

          {/* Legal & Tax Section */}
          <div className="mb-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Do You Have An Employee Identification Number (EIN)</label>
              <div className="flex gap-8">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    className="sr-only" 
                    checked={form.hasEIN} 
                    onChange={() => update('hasEIN', true)} 
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.hasEIN ? 'border-[#1e3a5f] bg-[#1e3a5f]' : 'border-gray-300'}`}>
                    {form.hasEIN && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    className="sr-only" 
                    checked={!form.hasEIN} 
                    onChange={() => update('hasEIN', false)} 
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!form.hasEIN ? 'border-[#1e3a5f] bg-[#1e3a5f]' : 'border-gray-300'}`}>
                    {!form.hasEIN && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {form.hasEIN ? (
              <div className="space-y-6">
                <InputField label="Employee Identification Number (EIN)" required error={formErrors.einNumber}>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={form.einNumber}
                    onChange={e => update('einNumber', e.target.value)}
                    placeholder="9 Digit Number"
                  />
                </InputField>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Upload Supporting Documents (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
                      {selectedFiles['tax-doc'] ? selectedFiles['tax-doc'].name : 'No File Chosen'}
                    </div>
                    <input
                      type="file"
                      id="tax-doc-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect('tax-doc', e)}
                      disabled={uploading['tax-doc']}
                    />
                    <label 
                      htmlFor="tax-doc-upload" 
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer font-medium flex items-center gap-2"
                    >
                      <span>+</span> Upload File
                    </label>
                  </div>
                  
                  {form.taxDocuments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {form.taxDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-700 truncate">{doc.url.split('/').pop()}</span>
                          </div>
                          <div className="flex space-x-2">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">View</a>
                            <button onClick={() => removeDocument('tax-doc', index)} className="text-red-600 hover:text-red-700">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <InputField label="Social Security Number (Last 9 Digits)" required error={formErrors.ssnLast9}>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={form.ssnLast9}
                  onChange={e => update('ssnLast9', e.target.value)}
                  placeholder="Enter last 9 digits of SSN"
                />
              </InputField>
            )}
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Contact Information Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Primary Contact Name" required error={formErrors.primaryContactName}>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={form.primaryContactName}
                  onChange={e => update('primaryContactName', e.target.value)}
                  placeholder="Primary Contact Name"
                />
              </InputField>

              <InputField label="Primary Contact Designation" required error={formErrors.primaryContactDesignation}>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                  value={form.primaryContactDesignation}
                  onChange={e => update('primaryContactDesignation', e.target.value)}
                >
                  <option value="">-- Select--</option>
                  <option value="Owner">Owner</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="Executive">Executive</option>
                </select>
              </InputField>

              <InputField label="Contact Email Address" required error={formErrors.contactEmail}>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={form.contactEmail}
                  onChange={e => update('contactEmail', e.target.value)}
                  placeholder="Contact Email Address"
                />
              </InputField>

              <InputField label="Business Email Address" required error={formErrors.businessEmail}>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={form.businessEmail}
                  onChange={e => update('businessEmail', e.target.value)}
                  placeholder="Business Email Address"
                />
              </InputField>

              <InputField label="Primary Contact Phone Number" required error={formErrors.contactPhone} className="md:col-span-2">
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={form.contactPhone}
                  onChange={e => update('contactPhone', e.target.value)}
                  placeholder="Primary Contact Phone Number"
                />
              </InputField>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Address Section */}
          <div className="mb-8">
            <InputField label="Full Address" required error={formErrors.address_street}>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={form.address.street}
                onChange={e => updateAddress('street', e.target.value)}
                placeholder="Enter Your Full Address"
              />
            </InputField>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InputField label="City" required error={formErrors.address_city}>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={form.address.city}
                  onChange={e => updateAddress('city', e.target.value)}
                  placeholder="City"
                />
              </InputField>

<InputField label="State">
  <select
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
    value={form.address.state}
    onChange={e => updateAddress('state', e.target.value)}
  >
    <option value="">Select State</option>
    <option value="Alabama">Alabama</option>
    <option value="Alaska">Alaska</option>
    <option value="Arizona">Arizona</option>
    <option value="Arkansas">Arkansas</option>
    <option value="California">California</option>
    <option value="Colorado">Colorado</option>
    <option value="Connecticut">Connecticut</option>
    <option value="Delaware">Delaware</option>
    <option value="Florida">Florida</option>
    <option value="Georgia">Georgia</option>
    <option value="Hawaii">Hawaii</option>
    <option value="Idaho">Idaho</option>
    <option value="Illinois">Illinois</option>
    <option value="Indiana">Indiana</option>
    <option value="Iowa">Iowa</option>
    <option value="Kansas">Kansas</option>
    <option value="Kentucky">Kentucky</option>
    <option value="Louisiana">Louisiana</option>
    <option value="Maine">Maine</option>
    <option value="Maryland">Maryland</option>
    <option value="Massachusetts">Massachusetts</option>
    <option value="Michigan">Michigan</option>
    <option value="Minnesota">Minnesota</option>
    <option value="Mississippi">Mississippi</option>
    <option value="Missouri">Missouri</option>
    <option value="Montana">Montana</option>
    <option value="Nebraska">Nebraska</option>
    <option value="Nevada">Nevada</option>
    <option value="New Hampshire">New Hampshire</option>
    <option value="New Jersey">New Jersey</option>
    <option value="New Mexico">New Mexico</option>
    <option value="New York">New York</option>
    <option value="North Carolina">North Carolina</option>
    <option value="North Dakota">North Dakota</option>
    <option value="Ohio">Ohio</option>
    <option value="Oklahoma">Oklahoma</option>
    <option value="Oregon">Oregon</option>
    <option value="Pennsylvania">Pennsylvania</option>
    <option value="Rhode Island">Rhode Island</option>
    <option value="South Carolina">South Carolina</option>
    <option value="South Dakota">South Dakota</option>
    <option value="Tennessee">Tennessee</option>
    <option value="Texas">Texas</option>
    <option value="Utah">Utah</option>
    <option value="Vermont">Vermont</option>
    <option value="Virginia">Virginia</option>
    <option value="Washington">Washington</option>
    <option value="West Virginia">West Virginia</option>
    <option value="Wisconsin">Wisconsin</option>
    <option value="Wyoming">Wyoming</option>
  </select>
</InputField>

              <InputField label="Country">
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                  value={form.address.country}
                  onChange={e => updateAddress('country', e.target.value)}
                >
                  <option value="USA">United States</option>
                  {/* <option value="USA">United States</option> */}
                  {/* <option value="Canada">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Australia">Australia</option> */}
                </select>
              </InputField>

              <InputField label="Zip Code" required error={formErrors.address_zipCode}>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={form.address.zipCode}
                  onChange={e => updateAddress('zipCode', e.target.value)}
                  placeholder="Zip Code"
                />
              </InputField>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Business Details Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Ownership Type" required error={formErrors.businessOwnershipType}>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                  value={form.businessOwnershipType}
                  onChange={e => update('businessOwnershipType', e.target.value as OwnershipType)}
                >
                  <option value="">-- Select--</option>
                  <option value="Limited Liability Company">Limited Liability Company (LLC)</option>
                  <option value="Sole Proprietor">Sole Proprietor</option>
                  <option value="S-Corporation">S-Corporation</option>
                  <option value="C-Corporation">C-Corporation</option>
                  <option value="Nonprofit">Nonprofit</option>
                </select>
              </InputField>

              <InputField label="Years in Business" required error={formErrors.yearsInBusiness}>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                  value={form.yearsInBusiness}
                  onChange={e => update('yearsInBusiness', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="6mo-1yr">6 months – 1 year</option>
                  <option value="1yr-2yr">1 year – 2 years</option>
                  <option value="2yr+">More than 2 years</option>
                </select>
              </InputField>

              <InputField label="Business Type" required error={formErrors.businessType}>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                  value={form.businessType}
                  onChange={e => update('businessType', e.target.value as BusinessType)}
                >
                  <option value="">Select</option>
                  <option value="product">Product-based</option>
                  <option value="service">Service-based</option>
                  <option value="food">Food & Beverage</option>
                </select>
              </InputField>

              <InputField label="Number Of Employees">
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                  value={form.numberOfEmployees}
                  onChange={e => update('numberOfEmployees', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="0-1">0-1</option>
                  <option value="2-5">2-5</option>
                  <option value="6-10">6-10</option>
                  <option value="10+">10+</option>
                </select>
              </InputField>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Terms & Conditions Section */}
<div className="mb-8">
  <div className="space-y-4">
    <label className="flex items-start cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={form.acceptedTerms}
        onChange={e => update('acceptedTerms', e.target.checked)}
      />
      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center mr-3 mt-0.5 ${form.acceptedTerms ? 'bg-[#1e3a5f] border-[#1e3a5f]' : 'border-gray-300'}`}>
        {form.acceptedTerms && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-gray-700 text-sm">
        I Agree To The{" "}
        <button
          type="button"
          onClick={() => openModal("terms")}
          className="text-[#1e3a5f] hover:underline font-medium"
        >
          Terms & Conditions
        </button>{" "}
        (Pop Up, Check-Off, Provide Initials)
      </span>
    </label>

    <label className="flex items-start cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={form.declarationAccepted}
        onChange={e => update('declarationAccepted', e.target.checked)}
      />
      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center mr-3 mt-0.5 ${form.declarationAccepted ? 'bg-[#1e3a5f] border-[#1e3a5f]' : 'border-gray-300'}`}>
        {form.declarationAccepted && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-gray-700 text-sm">
        The Information Provided Above Is Accurate To My Knowledge.
      </span>
    </label>
  </div>
</div>

            </>
          )}
<TermsModal 
  isOpen={modalOpen} 
  onClose={closeModal} 
  type={modalType} 
/>

{/* actions button updated */}
 {form.isMinorityOwned && (
  <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-12">
    {/* <button
      onClick={() => setForm(initialState)}
      className="w-full md:w-auto px-8 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium min-w-[160px]"
      disabled={loading}
    >
      Clear Response
    </button> */}

    <button
      onClick={saveDraft}
      className="w-full md:w-auto px-8 py-3 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#162b46] transition-colors font-medium min-w-[160px]"
      disabled={loading}
    >
      {loading ? 'Saving...' : 'Save Draft'}
    </button>

    <button
      onClick={handlePayAndSubmit}
      className="w-full md:w-auto px-8 py-3 bg-[#c9a227] text-white rounded-lg hover:bg-[#b8921f] transition-colors font-medium min-w-[160px]"
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Proceed To Payment'}
    </button>

    {/* New Submit Button */}
    <button
      onClick={async () => {
        try {
          setLoading(true);
          const response = await submitStage1();
          alert('Submission successful!');
          console.log(response);
        } catch (error: any) {
          console.error(error);
          alert(error.message || 'Submission failed');
        } finally {
          setLoading(false);
        }
      }}
      className="w-full md:w-auto px-8 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium min-w-[160px]"
      disabled={loading}
    >
      {loading ? 'Submitting...' : 'Submit'}
    </button>
  </div>
)}
      
          {/* Action Buttons */}

          {/* <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setForm(initialState)}
              className="w-full md:w-auto px-8 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium min-w-[160px]"
              disabled={loading}
            >
              Clear Response
            </button>

            <button
              onClick={saveDraft}
              className="w-full md:w-auto px-8 py-3 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#162b46] transition-colors font-medium min-w-[160px]"
              disabled={loading || !form.isMinorityOwned}
            >
              {loading ? 'Saving...' : form.isMinorityOwned ? 'Save Draft' : 'Save Disabled'}
            </button>
             
            <button
              onClick={handlePayAndSubmit}
              className="w-full md:w-auto px-8 py-3 bg-[#c9a227] text-white rounded-lg hover:bg-[#b8921f] transition-colors font-medium min-w-[160px]"
              disabled={loading || !form.isMinorityOwned}
            >
              {loading ? 'Processing...' : form.isMinorityOwned ? 'Proceed To Payment' : 'Proceeding Stopped'}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
