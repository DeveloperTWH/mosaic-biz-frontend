'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import {
  saveStage1Draft,
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
    country: '',
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

/* ======================================================
   PROGRESS STEPS
====================================================== */

const progressSteps = [
  { id: 1, title: 'Business Info', description: 'Basic business details' },
  { id: 2, title: 'Legal Status', description: 'Minority & legal verification' },
  { id: 3, title: 'Business Details', description: 'Ownership & operations' },
  { id: 4, title: 'Online Presence', description: 'Website & social media' },
  { id: 5, title: 'Contact Info', description: 'Primary contacts' },
  { id: 6, title: 'Address', description: 'Business location' },
  { id: 7, title: 'Documents', description: 'Upload required files' },
  { id: 8, title: 'Review & Submit', description: 'Final verification' },
];

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
   INDUSTRY STYLE FORM SECTIONS
====================================================== */

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<SectionProps> = ({ title, description, children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 ${className}`}>
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
    </div>
    {children}
  </div>
);

const InputField: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}> = ({ label, required = false, children, error }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
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
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showAllSections, setShowAllSections] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});

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
     EXISTING FUNCTIONS (minimal changes)
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

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!form.businessName.trim()) errors.businessName = 'Business name is required';
        break;
      case 2:
        if (form.isMinorityOwned && form.minorityCategories.length === 0) {
          errors.minorityCategories = 'Please select at least one minority category';
        }
        if (form.hasEIN && !form.einNumber.match(/^\d{9}$/)) {
          errors.einNumber = 'EIN must be 9 digits';
        }
        if (!form.hasEIN && !form.ssnLast9.match(/^\d{9}$/)) {
          errors.ssnLast9 = 'SSN must be 9 digits';
        }
        break;
      case 3:
        if (!form.businessOwnershipType) errors.businessOwnershipType = 'Ownership type is required';
        if (!form.yearsInBusiness) errors.yearsInBusiness = 'Years in business is required';
        if (!form.businessType) errors.businessType = 'Business type is required';
        break;
      case 6:
        if (!form.address.street.trim()) errors.address_street = 'Street address is required';
        if (!form.address.city.trim()) errors.address_city = 'City is required';
        if (!form.address.state.trim()) errors.address_state = 'State is required';
        if (!form.address.zipCode.trim()) errors.address_zipCode = 'ZIP code is required';
        break;
      case 7:
        if (!form.hasBusinessLicense && form.businessLicenseDocuments.length === 0) {
          errors.businessLicenseDocuments = 'Business license is required';
        }
        break;
      case 8:
        if (!form.acceptedTerms) errors.acceptedTerms = 'You must accept the Terms & Conditions';
        if (!form.declarationAccepted) errors.declarationAccepted = 'You must declare the information is correct';
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < progressSteps.length) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    } else {
      toast.error('Please fix the errors before proceeding');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const saveDraft = async () => {
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
    if (!validateStep(8)) {
      toast.error('Please fix all errors before proceeding to payment');
      return;
    }

    try {
      setLoading(true);
      await saveStage1Draft(form);
      const paymentResponse = await createStage1Payment();
      
      if (paymentResponse?.success && paymentResponse.data?.clientSecret) {
        sessionStorage.setItem('paymentData', JSON.stringify({
          clientSecret: paymentResponse.data.clientSecret,
          amount: paymentResponse.data.amount,
          currency: paymentResponse.data.currency
        }));
        location.assign('/payment/checkout');
      } else {
        toast.error('Failed to create payment');
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment setup failed');
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     PROGRESS BAR
  ====================================================== */

  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {progressSteps.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center ${step.id <= currentStep ? 'text-orange-600' : 'text-gray-400'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 
              ${step.id === currentStep ? 'border-orange-600 bg-orange-50' : 
                step.id < currentStep ? 'border-orange-600 bg-orange-600 text-white' : 
                'border-gray-300 bg-white'}`}
            >
              {step.id < currentStep ? '✓' : step.id}
            </div>
            <span className="text-xs font-medium">{step.title}</span>
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-orange-600 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (progressSteps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );

  /* ======================================================
     RENDER SECTION BASED ON CURRENT STEP
  ====================================================== */

  const renderStepContent = () => {
    if (showAllSections) {
      return null; // Simplified for this example
    }

    switch (currentStep) {
      case 1:
        return (
          <FormSection title="Business Information" description="Tell us about your business">
            <InputField label="Business Name" required error={formErrors.businessName}>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={form.businessName}
                onChange={e => update('businessName', e.target.value)}
                placeholder="Enter your legal business name"
              />
            </InputField>
          </FormSection>
        );

      case 2:
        return (
          <FormSection title="Legal Status & Verification" description="Minority status and tax identification">
            <InputField label="Is this a minority-owned business?" required>
              <div className="flex gap-6">
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-orange-600 h-5 w-5" checked={form.isMinorityOwned} onChange={() => update('isMinorityOwned', true)} />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-orange-600 h-5 w-5" checked={!form.isMinorityOwned} onChange={() => update('isMinorityOwned', false)} />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </InputField>

            {form.isMinorityOwned && (
              <InputField label="Select all applicable minority categories" required error={formErrors.minorityCategories}>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['African-American', 'Asian', 'LatinX', 'Woman', 'Disabled Veteran', 'Other'].map(cat => (
                    <label key={cat} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" className="form-checkbox text-orange-600 h-5 w-5" checked={form.minorityCategories.includes(cat)} onChange={(e) => {
                        if (e.target.checked) {
                          update('minorityCategories', [...form.minorityCategories, cat]);
                        } else {
                          update('minorityCategories', form.minorityCategories.filter(c => c !== cat));
                        }
                      }} />
                      <span className="ml-3">{cat}</span>
                    </label>
                  ))}
                </div>
              </InputField>
            )}

            <InputField label="Do you have an Employer Identification Number (EIN)?" required>
              <div className="flex gap-6 mb-4">
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-orange-600 h-5 w-5" checked={form.hasEIN} onChange={() => update('hasEIN', true)} />
                  <span className="ml-2 text-gray-700">Yes, I have an EIN</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-orange-600 h-5 w-5" checked={!form.hasEIN} onChange={() => update('hasEIN', false)} />
                  <span className="ml-2 text-gray-700">No, I'll use SSN</span>
                </label>
              </div>
              
              {form.hasEIN ? (
                <div>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter 9-digit EIN (e.g., 12-3456789)" value={form.einNumber} onChange={e => update('einNumber', e.target.value)} />
                  <p className="mt-1 text-sm text-gray-500">Enter your 9-digit Employer Identification Number</p>
                </div>
              ) : (
                <div>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter last 9 digits of SSN" value={form.ssnLast9} onChange={e => update('ssnLast9', e.target.value)} />
                  <p className="mt-1 text-sm text-gray-500">We only need the last 9 digits for verification</p>
                </div>
              )}
              {(formErrors.einNumber || formErrors.ssnLast9) && (
                <p className="mt-1 text-sm text-red-600">{formErrors.einNumber || formErrors.ssnLast9}</p>
              )}
            </InputField>
          </FormSection>
        );

      case 3:
        return (
          <FormSection title="Business Details" description="Ownership structure and operations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Ownership Type" required error={formErrors.businessOwnershipType}>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.businessOwnershipType} onChange={e => update('businessOwnershipType', e.target.value as OwnershipType)}>
                  <option value="">Select ownership type</option>
                  <option value="Limited Liability Company">Limited Liability Company (LLC)</option>
                  <option value="Sole Proprietor">Sole Proprietor</option>
                  <option value="S-Corporation">S-Corporation</option>
                  <option value="C-Corporation">C-Corporation</option>
                  <option value="Nonprofit">Nonprofit</option>
                </select>
              </InputField>

              <InputField label="Years in Business" required error={formErrors.yearsInBusiness}>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.yearsInBusiness} onChange={e => update('yearsInBusiness', e.target.value)}>
                  <option value="">Select</option>
                  <option value="6mo-1yr">6 months – 1 year</option>
                  <option value="1yr-2yr">1 year – 2 years</option>
                  <option value="2yr+">More than 2 years</option>
                </select>
              </InputField>

              <InputField label="Business Type" required error={formErrors.businessType}>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.businessType} onChange={e => update('businessType', e.target.value as BusinessType)}>
                  <option value="">Select business type</option>
                  <option value="product">Product-based</option>
                  <option value="service">Service-based</option>
                  <option value="food">Food & Beverage</option>
                </select>
              </InputField>

              <InputField label="Number of Employees">
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.numberOfEmployees} onChange={e => update('numberOfEmployees', e.target.value)}>
                  <option value="">Select</option>
                  <option value="1">1 (Solo)</option>
                  <option value="2-5">2-5</option>
                  <option value="6-10">6-10</option>
                  <option value="11-25">11-25</option>
                  <option value="26-50">26-50</option>
                  <option value="50+">50+</option>
                </select>
              </InputField>
            </div>

            <div className="mt-6 space-y-4">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox text-orange-600 h-5 w-5" checked={form.isFranchise} onChange={e => update('isFranchise', e.target.checked)} />
                <span className="ml-2 text-gray-700">This business is a franchise</span>
              </label>
              
              {form.isFranchise && (
                <InputField label="Franchise Name">
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.franchiseName} onChange={e => update('franchiseName', e.target.value)} placeholder="Enter franchise name" />
                </InputField>
              )}

              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox text-orange-600 h-5 w-5" checked={form.hasThirdPartyBooking} onChange={e => update('hasThirdPartyBooking', e.target.checked)} />
                <span className="ml-2 text-gray-700">Uses third-party booking systems</span>
              </label>

              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox text-orange-600 h-5 w-5" checked={form.hasPhysicalLocation} onChange={e => update('hasPhysicalLocation', e.target.checked)} />
                <span className="ml-2 text-gray-700">Has physical business location</span>
              </label>
            </div>
          </FormSection>
        );

      case 4:
        return (
          <FormSection title="Online Presence" description="Website and social media profiles">
            <div className="space-y-4">
              <InputField label="Website URL (optional)">
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">https://</span>
                  <input type="text" className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.websiteUrl.replace('https://', '')} onChange={e => update('websiteUrl', `https://${e.target.value}`)} placeholder="yourbusiness.com" />
                </div>
              </InputField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Instagram">
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">@</span>
                    <input type="text" className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.instagramUrl} onChange={e => update('instagramUrl', e.target.value)} placeholder="username" />
                  </div>
                </InputField>

                <InputField label="Facebook">
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.facebookUrl} onChange={e => update('facebookUrl', e.target.value)} placeholder="https://facebook.com/yourpage" />
                </InputField>

                <InputField label="LinkedIn">
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.linkedinUrl} onChange={e => update('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/company/yourcompany" />
                </InputField>

                <InputField label="TikTok">
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">@</span>
                    <input type="text" className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.tiktokUrl} onChange={e => update('tiktokUrl', e.target.value)} placeholder="username" />
                  </div>
                </InputField>
              </div>
            </div>
          </FormSection>
        );

      case 5:
        return (
          <FormSection title="Contact Information" description="Primary business contacts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Primary Contact Name" required>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.primaryContactName} onChange={e => update('primaryContactName', e.target.value)} placeholder="Full name" />
              </InputField>

              <InputField label="Designation/Title" required>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.primaryContactDesignation} onChange={e => update('primaryContactDesignation', e.target.value)} placeholder="e.g., Owner, Manager" />
              </InputField>

              <InputField label="Contact Email" required>
                <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.contactEmail} onChange={e => update('contactEmail', e.target.value)} placeholder="email@example.com" />
              </InputField>

              <InputField label="Business Email" required>
                <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.businessEmail} onChange={e => update('businessEmail', e.target.value)} placeholder="info@yourbusiness.com" />
              </InputField>

              <InputField label="Contact Phone" required>
                <input type="tel" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} placeholder="(123) 456-7890" />
              </InputField>
            </div>
          </FormSection>
        );

      case 6:
        return (
          <FormSection title="Business Address" description="Physical location of your business">
            <div className="space-y-4">
              <InputField label="Street Address" required error={formErrors.address_street}>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.address.street} onChange={e => updateAddress('street', e.target.value)} placeholder="123 Main Street" />
              </InputField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="City" required error={formErrors.address_city}>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.address.city} onChange={e => updateAddress('city', e.target.value)} placeholder="City" />
                </InputField>

                <InputField label="State" required error={formErrors.address_state}>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.address.state} onChange={e => updateAddress('state', e.target.value)} placeholder="State" />
                </InputField>

                <InputField label="ZIP Code" required error={formErrors.address_zipCode}>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.address.zipCode} onChange={e => updateAddress('zipCode', e.target.value)} placeholder="12345" />
                </InputField>
              </div>

              <InputField label="Country">
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" value={form.address.country} onChange={e => updateAddress('country', e.target.value)}>
                  <option value="">Select Country</option>
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </InputField>
            </div>
          </FormSection>
        );

      case 7:
        return (
          <FormSection title="Required Documents" description="Upload necessary verification documents">
            <div className="space-y-6">
              {/* Business License Upload */}
              <InputField label="Business License" required error={formErrors.businessLicenseDocuments}>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors">
                    <div className="mb-4">
                      <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {selectedFiles['business-license'] ? `Selected: ${selectedFiles['business-license'].name}` : 'Upload your business license'}
                    </p>
                    <input
                      type="file"
                      id="business-license-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect('business-license', e)}
                      disabled={uploading['business-license']}
                    />
                    <label htmlFor="business-license-upload" className="cursor-pointer">
                      <div className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors inline-block">
                        {uploading['business-license'] ? 'Uploading...' : 'Browse Files'}
                      </div>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">PDF, JPG, PNG up to 5MB</p>
                  </div>
                  
                  {/* Uploaded Documents List */}
                  {form.businessLicenseDocuments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents:</h4>
                      <div className="space-y-2">
                        {form.businessLicenseDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm text-gray-700 truncate">{doc.url.split('/').pop()}</span>
                            </div>
                            <div className="flex space-x-2">
                              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">View</a>
                              <button onClick={() => removeDocument('business-license', index)} className="text-red-600 hover:text-red-700">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </InputField>

              {/* Minority Verification Proof Upload */}
              <InputField label="Minority Verification Proof">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                    <p className="text-gray-600 mb-2">
                      {selectedFiles['minority-proof'] ? `Selected: ${selectedFiles['minority-proof'].name}` : 'Upload documents proving minority ownership'}
                    </p>
                    <input
                      type="file"
                      id="minority-proof-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect('minority-proof', e)}
                      disabled={uploading['minority-proof']}
                    />
                    <label htmlFor="minority-proof-upload" className="cursor-pointer">
                      <div className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-block">
                        {uploading['minority-proof'] ? 'Uploading...' : 'Add Document'}
                      </div>
                    </label>
                  </div>
                  
                  {form.minorityProofDocuments.length > 0 && (
                    <div className="space-y-2">
                      {form.minorityProofDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-700 truncate">{doc.url.split('/').pop()}</span>
                          </div>
                          <div className="flex space-x-2">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">View</a>
                            <button onClick={() => removeDocument('minority-proof', index)} className="text-red-600 hover:text-red-700">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </InputField>

              {/* Tax Documents Upload */}
              <InputField label="Tax Documents">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                    <p className="text-gray-600 mb-2">
                      {selectedFiles['tax-doc'] ? `Selected: ${selectedFiles['tax-doc'].name}` : 'Upload tax identification documents'}
                    </p>
                    <input
                      type="file"
                      id="tax-doc-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect('tax-doc', e)}
                      disabled={uploading['tax-doc']}
                    />
                    <label htmlFor="tax-doc-upload" className="cursor-pointer">
                      <div className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-block">
                        {uploading['tax-doc'] ? 'Uploading...' : 'Add Document'}
                      </div>
                    </label>
                  </div>
                  
                  {form.taxDocuments.length > 0 && (
                    <div className="space-y-2">
                      {form.taxDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-700 truncate">{doc.url.split('/').pop()}</span>
                          </div>
                          <div className="flex space-x-2">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">View</a>
                            <button onClick={() => removeDocument('tax-doc', index)} className="text-red-600 hover:text-red-700">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </InputField>
            </div>
          </FormSection>
        );

      case 8:
        return (
          <FormSection title="Review & Submit" description="Final verification and terms agreement">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Application Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-600">Business Name</p><p className="font-medium">{form.businessName || "Not provided"}</p></div>
                  <div><p className="text-gray-600">Business Type</p><p className="font-medium">{form.businessType || "Not provided"}</p></div>
                  <div><p className="text-gray-600">Contact Email</p><p className="font-medium">{form.contactEmail || "Not provided"}</p></div>
                  <div><p className="text-gray-600">Address</p><p className="font-medium">{form.address.street ? `${form.address.street}, ${form.address.city}` : "Not provided"}</p></div>
                </div>
              </div>

              <div className="space-y-4">
                <label className={`flex items-start p-4 border rounded-lg ${formErrors.acceptedTerms ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                  <input type="checkbox" className="form-checkbox text-orange-600 h-5 w-5 mt-0.5" checked={form.acceptedTerms} onChange={e => update('acceptedTerms', e.target.checked)} />
                  <span className="ml-3 text-gray-700">
                    I accept the <a href="/terms" className="text-orange-600 hover:underline">Terms & Conditions</a> and agree to the processing of my personal data as described in the <a href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</a>.
                    {formErrors.acceptedTerms && <p className="text-red-600 text-sm mt-1">{formErrors.acceptedTerms}</p>}
                  </span>
                </label>

                <label className={`flex items-start p-4 border rounded-lg ${formErrors.declarationAccepted ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                  <input type="checkbox" className="form-checkbox text-orange-600 h-5 w-5 mt-0.5" checked={form.declarationAccepted} onChange={e => update('declarationAccepted', e.target.checked)} />
                  <span className="ml-3 text-gray-700">
                    I declare that all information provided is true, accurate, and complete to the best of my knowledge.
                    {formErrors.declarationAccepted && <p className="text-red-600 text-sm mt-1">{formErrors.declarationAccepted}</p>}
                  </span>
                </label>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Verification Fee:</strong> A one-time verification fee of $49 is required to process your application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FormSection>
        );

      default:
        return null;
    }
  };

  /* ======================================================
     MAIN RENDER
  ====================================================== */

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Onboarding: Stage 1</h1>
          <p className="text-gray-600">Complete all required information to verify your business identity</p>
        </div>

        {/* Progress Bar */}
        <ProgressBar />

        {/* Current Step Title */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{progressSteps[currentStep - 1]?.title}</h2>
          <p className="text-gray-600">{progressSteps[currentStep - 1]?.description}</p>
        </div>

        {/* Form Content */}
        <div className="mb-8">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div>
            {currentStep > 1 && (
              <button onClick={handlePrevStep} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" disabled={loading}>
                Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={saveDraft} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" disabled={loading}>
              Save Draft
            </button>

            {currentStep < progressSteps.length ? (
              <button onClick={handleNextStep} className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50" disabled={loading}>
                Next Step
              </button>
            ) : (
              <button onClick={handlePayAndSubmit} className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50" disabled={loading || !form.acceptedTerms || !form.declarationAccepted}>
                {loading ? 'Processing...' : 'Pay & Submit Application'}
              </button>
            )}
          </div>
        </div>

        {/* View All Sections Button */}
        {!showAllSections && (
          <div className="mt-8 text-center">
            <button onClick={() => setShowAllSections(true)} className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              View all sections at once
            </button>
          </div>
        )}

        {/* Step Indicator */}
        <div className="mt-8 text-center text-sm text-gray-500">Step {currentStep} of {progressSteps.length}</div>
      </div>
    </div>
  );
}