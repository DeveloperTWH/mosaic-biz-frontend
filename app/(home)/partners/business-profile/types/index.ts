export interface BusinessProfileData {
  // Pre-filled non-editable fields (from Stage 1)
  prefilled: {
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
  };
  
  // Editable profile fields
  personalInfo: {
    firstName: string;
    lastName: string;
    primaryEmail: string;
    primaryPhone: string;
    language: string;
    customLanguage:string;
  };
  
  businessInfo: {
    licenseNumber: string;
    businessBio: string;
    characterLimit: number;
    businessProfileImage: {
      url: string;
      verified: boolean;
    };
  };
  
  contactInfo: {
    businessEmail: string;      // Editable business email for profile
    businessPhone: string;      // Editable business phone for profile
    alternatePhone: string;
  };
  
  socialLinks: {
    website: string;
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    tiktok: string;
  };
  
  additionalInfo: {
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
  };
}

// Type for API update payload
export interface BusinessProfileUpdatePayload {
  // Personal Information
  firstName?: string;
  lastName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  language?: string;
  
  // Business Information
  licenseNumber?: string;
  businessBio?: string;
  characterLimit?: number;
  businessProfileImage?: { url: string; verified: boolean };
  
  // Contact Information
  businessEmail?: string;
  businessPhone?: string;
  alternatePhone?: string;
  
  // Social Media
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  
  // Additional Documents & Links
  refundPolicyDocument?: { url: string; verified: boolean };
  termsDocument?: { url: string; verified: boolean };
  googleReviewLink?: string;
  communityServiceLink?: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface UploadProgress {
  [key: string]: number;
}