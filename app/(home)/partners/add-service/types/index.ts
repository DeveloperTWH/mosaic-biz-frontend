// ============================================
// Service Types - Matching your form structure
// ============================================

export interface ChildService {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

export interface BusinessHour {
  day: string;
  hours: string;
  closed?: boolean;
}

export interface Location {
  address?: string; // Google Maps link as string
}

export interface ServiceFormData {
  // Core fields
  categoryId: string;
  subcategoryId: string;
  businessId: string;
  bookingToolLink?: string;
  
  // Child services (this is what you need)
  services: ChildService[];
  
  // Media
  coverImage: string;
  images: string[];
  
  // Business hours
  businessHours: BusinessHour[];
  
  // Location
  location?: Location;
  
  // Status
  isPublished: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

// ============================================
// API Response Types
// ============================================

export interface Category {
  _id: string;
  name: string;
  description?: string;
  img?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  _id: string;
  name: string;
  categoryId: string;
  slug?: string;
}

export interface Business {
  _id: string;
  businessName: string;
  listingType: 'product' | 'service' | 'food';
  owner?: string;
  email?: string;
  phone?: string;
  isApproved?: boolean;
  isActive?: boolean;
  logo?: string;
}

// ============================================
// Upload Types
// ============================================

export interface UploadProgress {
  [key: string]: number;
}

export interface UploadResponse {
  success: boolean;
  uploadUrl: string;
  fileUrl: string;
  documentType: string;
  key: string;
  expiresIn: number;
}

// ============================================
// API Response Wrapper
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ============================================
// Service Response Types
// ============================================

export interface ServiceResponse {
  _id: string;
  categoryId: Category | string;
  subcategoryId: Subcategory | string;
  businessId: Business | string;
  bookingToolLink?: string;
  services: ChildService[];
  coverImage: string;
  images: string[];
  businessHours: BusinessHour[];
  location?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  slug?: string;
}

// ============================================
// Legacy Types (Keep these if used elsewhere)
// ============================================

// These are kept for backward compatibility
export interface ServiceFeature {
  name: string;
  description?: string;
}

export interface Amenity {
  label: string;
  available: boolean;
  price?: number;
}

export interface Contact {
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
}

export interface SubService {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

// Legacy form data (if you still need it)
export interface LegacyServiceFormData {
  title: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  price: number;
  duration: string;
  businessId: string;
  bookingToolLink?: string;
  services: SubService[];
  coverImage: string;
  images: string[];
  features: string[];
  amenities: Amenity[];
  businessHours: BusinessHour[];
  location?: Location;
  contact?: Contact;
  maxBookingsPerSlot: number;
  isPublished: boolean;
}