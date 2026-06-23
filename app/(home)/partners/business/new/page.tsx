'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'; // Add this
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TermsModal from "../../final-review/components/TermsModal";
import VendorApplicationShell from "../../components/VendorApplicationShell";
import VendorOnboardingProgress from "../../components/VendorOnboardingProgress";
import VendorFormActions from "../../components/VendorFormActions";
import { FormField } from "@/components/ui/form-field";

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

type DraftStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'verified' | '';
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
  licenseNumber:string;
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
  licenseNumber:'',
  
  
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
        // Add this line in the return object:
licenseNumber: draft?.licenseNumber || '',

// And make sure businessLicenseDocuments is mapped:
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
   BRAND TOKENS
====================================================== */

const FORM_INPUT_CLASS = "market-input";
const FORM_SELECT_CLASS = "market-select";
const CONTROL_CHECKED = "border-market-gold bg-market-gold";
const CONTROL_UNCHECKED = "border-white/20";
const LINK_CLASS = "text-market-gold hover:underline";

/* ======================================================
   FORM COMPONENTS — use shared FormField (#179)
====================================================== */

/* ======================================================
   MAIN COMPONENT
====================================================== */

export default function VendorOnboardingStage1Page() {
  const [form, setForm] = useState<Stage1Form>(initialState);
  const [draftStatus, setDraftStatus] = useState<DraftStatus>('');
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
  const shouldHideProceedButton = draftStatus === 'verified' || draftStatus === 'rejected';

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await getStage1Draft();
        if (draft) {
          setDraftStatus((draft?.status || '') as DraftStatus);
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

if (form.hasBusinessLicense && !form.licenseNumber.trim()) {
  errors.licenseNumber = 'Business License Number is required';
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
    if (form.hasBusinessLicense && form.businessLicenseDocuments.length === 0) {
      errors.businessLicenseDocuments = 'Business license document is required';
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
    const response = await saveStage1Draft(form);
    const nextStatus = response?.data?.status || response?.status;
    if (nextStatus) {
      setDraftStatus(nextStatus as DraftStatus);
    }
    toast.success('data saved successfully');
  } catch (error: any) {
    toast.error(error.message || 'Failed to save data');
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
    <VendorApplicationShell
      variant="market"
      backHref="/partners"
      backLabel="Back to dashboard"
      eyebrow="Business Owner"
      title="Vendor Registration Request"
      description="A non-refundable $24.99 Business Verification Fee is charged at vendor sign-up to conduct a standard background validation of your business (via our contracted screening provider) and activate your Trust Badge upon approval."
    >
      <TermsModal isOpen={modalOpen} onClose={closeModal} type={modalType} />

      <VendorOnboardingProgress
        currentStage={1}
        variant="market"
        saveNote="Your answers are saved when you click Save data. You can return anytime from your vendor dashboard."
      />

      <div className="rounded-2xl border border-white/10 bg-market-elevated p-4 shadow-market-card md:p-8">
          <p className="mb-6 font-montserrat text-sm leading-relaxed text-market-muted">
            Start with business identity and verification documents. Required fields are marked with an asterisk. Optional details can earn trust points later.
          </p>
          {/* Business Information Section */}
          <div className="mb-4">
            <FormField surface="market" label="Business Name" required error={formErrors.businessName}>
              <input
                type="text"
                className={FORM_INPUT_CLASS}
                value={form.businessName}
                onChange={e => update('businessName', e.target.value)}
                placeholder="Enter Your Business Name"
              />
            </FormField>

            <div className="mb-6">
              <label className="market-label">Minority Owned Business</label>
              <div className="flex gap-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    className="sr-only" 
                    checked={form.isMinorityOwned} 
                    onChange={() => update('isMinorityOwned', true)} 
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.isMinorityOwned ? 'border-market-gold bg-market-gold' : 'border-white/20'}`}>
                    {form.isMinorityOwned && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="ml-2 text-market-muted">Yes</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    className="sr-only" 
                    checked={!form.isMinorityOwned} 
                    onChange={() => update('isMinorityOwned', false)} 
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!form.isMinorityOwned ? 'border-market-gold bg-market-gold' : 'border-white/20'}`}>
                    {!form.isMinorityOwned && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="ml-2 text-market-muted">No</span>
                </label>
              </div>
              {!form.isMinorityOwned && (
    <div className="mt-6 flex flex-col items-center rounded-lg border border-market-gold/30 bg-market-gold/10 p-6 text-center">
      <p className="text-sm text-red-300">{minorityOnlyMessage}</p>
      <button
        onClick={() => router.push("/")}
        className="market-btn-primary mt-2 px-6 py-2 normal-case"
      >
       Okay I understand
      </button>
    </div>
              )}
              {formErrors.isMinorityOwned && (
                <p className="mt-2 text-sm text-red-400">{formErrors.isMinorityOwned}</p>
              )}
            </div>

            {form.isMinorityOwned && (
              <>
                <div className="mb-6">
                  <label className="market-label">
                    Minority Owner Category (Tick Boxes For Multiple Selection) {formErrors.minorityCategories && <span className="text-red-400">*</span>}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                        <div className={`w-4 h-4 border-2 rounded flex items-center justify-center mr-2 ${form.minorityCategories.includes(cat) ? 'bg-market-gold border-market-gold' : 'border-white/20'}`}>
                          {form.minorityCategories.includes(cat) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-market-muted text-sm">{cat}</span>
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
                      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center mr-2 ${form.minorityCategories.includes('Other') ? 'bg-market-gold border-market-gold' : 'border-white/20'}`}>
                        {form.minorityCategories.includes('Other') && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-market-muted text-sm">Other (Please Specify)</span>
                    </label>
                  </div>
                  
                  {form.minorityCategories.includes('Other') && (
                    <div className="mt-3">
                      <input
                        type="text"
                        className={FORM_INPUT_CLASS}
                        value={form.otherMinorityCategory}
                        onChange={e => update('otherMinorityCategory', e.target.value)}
                        placeholder="Mention Your Minority Category"
                      />
                    </div>
                  )}
                  {formErrors.minorityCategories && <p className="mt-1 text-sm text-red-400">{formErrors.minorityCategories}</p>}
                </div>

                <div className="mb-4">
                  <label className="market-label mb-1">
                    Upload Supporting Documents Proving Majority Stakes In The Name Of The Minority Founder
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-market-muted text-sm">
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
                      className="market-btn-secondary flex cursor-pointer items-center gap-2 px-6 py-3 normal-case"
                    >
                      <span>+</span> Upload File
                    </label>
                  </div>
                  
                  {form.minorityProofDocuments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {form.minorityProofDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-market-muted mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-market-muted truncate">{doc.url.split('/').pop()}</span>
                          </div>
                          <div className="flex space-x-2">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>View</a>
                            <button onClick={() => removeDocument('minority-proof', index)} className="text-red-400 hover:text-red-300">Remove</button>
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
          <hr className="border-white/10 my-4" />

          {/* Legal & Tax Section */}
          <div className="mb-4">
            <div className="mb-4">
              <label className="market-label">Do You Have An Employee Identification Number (EIN)</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    className="sr-only" 
                    checked={form.hasEIN} 
                    onChange={() => update('hasEIN', true)} 
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.hasEIN ? 'border-market-gold bg-market-gold' : 'border-white/20'}`}>
                    {form.hasEIN && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="ml-2 text-market-muted">Yes</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    className="sr-only" 
                    checked={!form.hasEIN} 
                    onChange={() => update('hasEIN', false)} 
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!form.hasEIN ? 'border-market-gold bg-market-gold' : 'border-white/20'}`}>
                    {!form.hasEIN && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="ml-2 text-market-muted">No</span>
                </label>
              </div>
            </div>

            {form.hasEIN ? (
              <div className="space-y-3">
                <FormField surface="market" label="Employee Identification Number (EIN)" required error={formErrors.einNumber}>
                  <input
                    type="text"
                    className={FORM_INPUT_CLASS}
                    value={form.einNumber}
                    onChange={e => update('einNumber', e.target.value)}
                    placeholder="9 Digit Number"
                  />
                </FormField>

                <div className="mb-4">
                  <label className="market-label">
                    Upload Supporting Documents
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-market-muted text-sm">
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
                      className="market-btn-secondary flex cursor-pointer items-center gap-2 px-6 py-2 normal-case"
                    >
                      <span>+</span> Upload File
                    </label>
                  </div>
                  
                  {form.taxDocuments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {form.taxDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-market-muted mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-market-muted truncate">{doc.url.split('/').pop()}</span>
                          </div>
                          <div className="flex space-x-2">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>View</a>
                            <button onClick={() => removeDocument('tax-doc', index)} className="text-red-400 hover:text-red-300">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <FormField surface="market" label="Social Security Number" required error={formErrors.ssnLast9}>
                <input
                  type="text"
                  className={FORM_INPUT_CLASS}
                  value={form.ssnLast9}
                  onChange={e => update('ssnLast9', e.target.value)}
                  placeholder="Enter SSN"
                />
              </FormField>
            )}
          </div>

          {/* ===== ADD THIS AFTER TAX DOCUMENTS SECTION ===== */}
<hr className="border-white/10 my-4" />

{/* Business License Section */}
<div className="mb-4">
  {/* <div className="mb-3">
    <label className="market-label mb-3">
      Do You Have A Business License?
    </label>
    <div className="flex gap-6">
      <label className="inline-flex items-center cursor-pointer">
        <input 
          type="radio" 
          className="sr-only" 
          checked={form.hasBusinessLicense} 
          onChange={() => update('hasBusinessLicense', true)} 
        />
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.hasBusinessLicense ? 'border-market-gold bg-market-gold' : 'border-white/20'}`}>
          {form.hasBusinessLicense && <div className="w-2 h-2 rounded-full bg-white"></div>}
        </div>
        <span className="ml-2 text-market-muted">Yes</span>
      </label>
      <label className="inline-flex items-center cursor-pointer">
        <input 
          type="radio" 
          className="sr-only" 
          checked={!form.hasBusinessLicense} 
          onChange={() => update('hasBusinessLicense', false)} 
        />
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!form.hasBusinessLicense ? 'border-market-gold bg-market-gold' : 'border-white/20'}`}>
          {!form.hasBusinessLicense && <div className="w-2 h-2 rounded-full bg-white"></div>}
        </div>
        <span className="ml-2 text-market-muted">No</span>
      </label>
    </div>
  </div> */}

  {form.hasBusinessLicense && (
    <div className="space-y-4">
      {/* License Number Field */}
<FormField surface="market" label="Business License Number" required error={formErrors.licenseNumber}>
  <input
    type="text"
    className={FORM_INPUT_CLASS}
    value={form.licenseNumber || ''}
    onChange={e => update('licenseNumber', e.target.value)}
    placeholder="Enter your business license number"
  />
</FormField>

      {/* Business License Documents Upload */}
      <div className="mb-4">
        <label className="market-label">
 Upload Business License Document  <span className="text-red-400 ml-1">*</span>
</label>
        <div className="flex items-center gap-4">
          <div className="flex-1 px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-market-muted text-sm">
            {selectedFiles['business-license'] ? selectedFiles['business-license'].name : 'No File Chosen'}
          </div>
          <input
            type="file"
            id="business-license-upload"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileSelect('business-license', e)}
            disabled={uploading['business-license']}
          />
          <label 
            htmlFor="business-license-upload" 
            className="market-btn-secondary flex cursor-pointer items-center gap-2 px-6 py-2 normal-case"
          >
            <span>+</span> Upload File
          </label>
        </div>
        
        {form.businessLicenseDocuments.length > 0 && (
          <div className="mt-3 space-y-2">
            {form.businessLicenseDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-market-muted mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-market-muted truncate">{doc.url.split('/').pop()}</span>
                </div>
                <div className="flex space-x-2">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>View</a>
                  <button onClick={() => removeDocument('business-license', index)} className="text-red-400 hover:text-red-300">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )}

  {/* Error message for business license when required */}
  {formErrors.businessLicenseDocuments && (
    <p className="mt-2 text-sm text-red-400">{formErrors.businessLicenseDocuments}</p>
  )}
</div>



          {/* Contact Information Section */}
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField surface="market" label="Primary Contact Name" required error={formErrors.primaryContactName}>
                <input
                  type="text"
                  className={FORM_INPUT_CLASS}
                  value={form.primaryContactName}
                  onChange={e => update('primaryContactName', e.target.value)}
                  placeholder="Primary Contact Name"
                />
              </FormField>

              <FormField surface="market" label="Primary Contact Designation" required error={formErrors.primaryContactDesignation}>
                <select 
                  className={FORM_SELECT_CLASS}
                  value={form.primaryContactDesignation}
                  onChange={e => update('primaryContactDesignation', e.target.value)}
                >
                  <option value="">-- Select--</option>
                  <option value="Owner">Owner</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="Executive">Executive</option>
                </select>
              </FormField>

              <FormField surface="market" label="Contact Email Address" required error={formErrors.contactEmail}>
                <input
                  type="email"
                  className={FORM_INPUT_CLASS}
                  value={form.contactEmail}
                  onChange={e => update('contactEmail', e.target.value)}
                  placeholder="Contact Email Address"
                />
              </FormField>

              <FormField surface="market" label="Business Email Address" required error={formErrors.businessEmail}>
                <input
                  type="email"
                  className={FORM_INPUT_CLASS}
                  value={form.businessEmail}
                  onChange={e => update('businessEmail', e.target.value)}
                  placeholder="Business Email Address"
                />
              </FormField>

              <FormField surface="market" label="Primary Contact Phone Number" required error={formErrors.contactPhone} className="md:col-span-2">
                <input
                  type="tel"
                  className={FORM_INPUT_CLASS}
                  value={form.contactPhone}
                  onChange={e => update('contactPhone', e.target.value)}
                  placeholder="Primary Contact Phone Number"
                />
              </FormField>
            </div>
          </div>

          

          <hr className="border-white/10 my-4" />

          {/* Address Section */}
          <div className="mb-8">
            <FormField surface="market" label="Full Address" required error={formErrors.address_street}>
              <input
                type="text"
                className={FORM_INPUT_CLASS}
                value={form.address.street}
                onChange={e => updateAddress('street', e.target.value)}
                placeholder="Enter Your Full Address"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FormField surface="market" label="City" required error={formErrors.address_city}>
                <input
                  type="text"
                  className={FORM_INPUT_CLASS}
                  value={form.address.city}
                  onChange={e => updateAddress('city', e.target.value)}
                  placeholder="City"
                />
              </FormField>

<FormField surface="market" label="State">
  <select
    className={FORM_SELECT_CLASS}
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
</FormField>

              <FormField surface="market" label="Country">
                <select
                  className={FORM_SELECT_CLASS}
                  value={form.address.country}
                  onChange={e => updateAddress('country', e.target.value)}
                >
                  <option value="USA">United States</option>
                  {/* <option value="USA">United States</option> */}
                  {/* <option value="Canada">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Australia">Australia</option> */}
                </select>
              </FormField>

              <FormField surface="market" label="Zip Code" required error={formErrors.address_zipCode}>
                <input
                  type="text"
                  className={FORM_INPUT_CLASS}
                  value={form.address.zipCode}
                  onChange={e => updateAddress('zipCode', e.target.value)}
                  placeholder="Zip Code"
                />
              </FormField>
            </div>
          </div>

          <hr className="border-white/10 my-4" />

          {/* Business Details Section */}
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField surface="market" label="Ownership Type" required error={formErrors.businessOwnershipType}>
                <select 
                  className={FORM_SELECT_CLASS}
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
              </FormField>

              <FormField surface="market" label="Years in Business" required error={formErrors.yearsInBusiness}>
                <select 
                  className={FORM_SELECT_CLASS}
                  value={form.yearsInBusiness}
                  onChange={e => update('yearsInBusiness', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="6mo-1yr">6 months – 1 year</option>
                  <option value="1yr-2yr">1 year – 2 years</option>
                  <option value="2yr+">More than 2 years</option>
                </select>
              </FormField>

              <FormField surface="market" label="Business Type" required error={formErrors.businessType}>
                <select 
                  className={FORM_SELECT_CLASS}
                  value={form.businessType}
                  onChange={e => update('businessType', e.target.value as BusinessType)}
                >
                  <option value="">Select</option>
                  <option value="product">Product-based</option>
                  <option value="service">Service-based</option>
                  <option value="food">Food & Beverage</option>
                </select>
              </FormField>

              <FormField surface="market" label="Number Of Employees">
                <select 
                  className={FORM_SELECT_CLASS}
                  value={form.numberOfEmployees}
                  onChange={e => update('numberOfEmployees', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="0-1">0-1</option>
                  <option value="2-5">2-5</option>
                  <option value="6-10">6-10</option>
                  <option value="10+">10+</option>
                </select>
              </FormField>
            </div>
          </div>

<hr className="border-white/10 my-4" />

{/* Online Presence Section */}
<div className="mb-4">
  <h3 className="font-poppins text-lg font-semibold text-market-text mb-3">Online Presence (optional)</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField surface="market" label="Website URL">
      <input
        type="url"
        className={FORM_INPUT_CLASS}
        value={form.websiteUrl}
        onChange={e => update('websiteUrl', e.target.value)}
        placeholder="https://www.yourbusiness.com"
      />
    </FormField>

    <FormField surface="market" label="Facebook URL">
      <input
        type="url"
        className={FORM_INPUT_CLASS}
        value={form.facebookUrl}
        onChange={e => update('facebookUrl', e.target.value)}
        placeholder="https://facebook.com/yourbusiness"
      />
    </FormField>

    <FormField surface="market" label="Instagram URL">
      <input
        type="url"
        className={FORM_INPUT_CLASS}
        value={form.instagramUrl}
        onChange={e => update('instagramUrl', e.target.value)}
        placeholder="https://instagram.com/yourbusiness"
      />
    </FormField>

    <FormField surface="market" label="LinkedIn URL">
      <input
        type="url"
        className={FORM_INPUT_CLASS}
        value={form.linkedinUrl}
        onChange={e => update('linkedinUrl', e.target.value)}
        placeholder="https://linkedin.com/company/yourbusiness"
      />
    </FormField>

    <FormField surface="market" label="TikTok URL">
      <input
        type="url"
        className={FORM_INPUT_CLASS}
        value={form.tiktokUrl}
        onChange={e => update('tiktokUrl', e.target.value)}
        placeholder="https://tiktok.com/@yourbusiness"
      />
    </FormField>
  </div>
</div>

          <hr className="border-white/10 my-4" />

          {/* Terms & Conditions Section */}
<div className="mb-6">
  <div className="space-y-4">
    <label className="flex items-start cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={form.acceptedTerms}
        onChange={e => update('acceptedTerms', e.target.checked)}
      />
      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center mr-3 mt-0.5 ${form.acceptedTerms ? 'bg-market-gold border-market-gold' : 'border-white/20'}`}>
        {form.acceptedTerms && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-market-muted text-sm">
        I Agree To The{" "}
        <button
          type="button"
          onClick={() => openModal("terms")}
          className="text-market-gold hover:underline font-medium"
        >
          Terms & Conditions
        </button>
      </span>
    </label>

    <label className="flex items-start cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={form.declarationAccepted}
        onChange={e => update('declarationAccepted', e.target.checked)}
      />
      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center mr-3 mt-0.5 ${form.declarationAccepted ? 'bg-market-gold border-market-gold' : 'border-white/20'}`}>
        {form.declarationAccepted && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-market-muted text-sm">
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
  <VendorFormActions
    variant="market"
    className="mt-8 border-white/10 bg-white/5"
    hint="Save your progress before leaving. Payment is the last step for this stage."
    nextStepLabel="After payment, you'll choose a subscription tier and build your public profile."
    secondary={{
      label: loading ? "Saving…" : "Save data",
      onClick: saveDraft,
      disabled: loading,
      loading,
      loadingLabel: "Saving…",
    }}
    {...(!shouldHideProceedButton
      ? {
          primary: {
            label: loading ? "Processing…" : "Proceed to payment",
            onClick: handlePayAndSubmit,
            disabled: loading,
            loading,
            loadingLabel: "Processing…",
          },
        }
      : {})}
  />
)}
      
          {/* Action Buttons */}

          {/* <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setForm(initialState)}
              className="w-full md:w-auto min-w-[160px] rounded-lg bg-market-pill px-8 py-3 font-medium text-market-muted transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              Clear Response
            </button>

            <button
              onClick={saveDraft}
              className="market-btn-secondary w-full min-w-[160px] normal-case md:w-auto"
              disabled={loading || !form.isMinorityOwned}
            >
              {loading ? 'Saving...' : form.isMinorityOwned ? 'Save Draft' : 'Save Disabled'}
            </button>
             
            <button
              onClick={handlePayAndSubmit}
              className="market-btn-primary w-full min-w-[160px] normal-case md:w-auto"
              disabled={loading || !form.isMinorityOwned}
            >
              {loading ? 'Processing...' : form.isMinorityOwned ? 'Proceed To Payment' : 'Proceeding Stopped'}
            </button>
          </div> */}
        </div>
    </VendorApplicationShell>
  );
}
