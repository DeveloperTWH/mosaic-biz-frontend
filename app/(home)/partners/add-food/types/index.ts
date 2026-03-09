export interface BusinessHour {
  day: string;
  hours: string;
  closed?: boolean;
}

export interface Location {
  address?: string; // Google Maps link as string
}

export interface MetaField {
  key: string;
  value: string;
}

export interface FoodFormData {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  subcategoryId: string;
  businessId: string;
  bookingToolLink?: string;
  coverImage: string;
  images: string[];
  menuImage: string;
  businessHours: BusinessHour[];
  metaFields: MetaField[];
  location?: Location;
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
