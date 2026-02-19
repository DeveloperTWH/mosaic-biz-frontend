// ============================================
// Form Data Types (Frontend Structure)
// ============================================

export interface Attribute {
  attributeName: string;
  attributeValues: string[];
}

export interface Variant {
  sku: string;
  attribute1Name: string;
  attribute1Value: string;
  attribute2Name: string;
  attribute2Value: string;
  price: number;
  stock: number;
  availability: number;
  standardShipping: number;
  overnightShipping: number;
  localShipping: number;
  images?: string[]; // Added for variant images
}

export interface MetaField {
  metaFieldName: string;
  metaFieldValue: string;
}

export interface Discount {
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  costValue: number;
}

export interface ProductFormData {
  productTitle: string;
  categoryId: string;
  subCategoryId: string;
  productDescription: string;
  hasVariants: boolean;
  businessId: string;
  featureImage: string;
  galleryImages: string[];
  attributes: Attribute[];
  variants: Variant[];
  metaFields: MetaField[];
  discount: Discount;
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

export interface SelectedFile {
  name: string;
  type: string;
  url?: string;
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
// API Payload Types (Backend Structure)
// ============================================

export interface ApiAttribute {
  name: string;
  values: string[];
}

export interface ApiVariantAttribute {
  [key: string]: string;  // e.g., { "Size": "Small", "Color": "Red" }
}

export interface ApiVariant {
  attributes: ApiVariantAttribute;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  sku?: string;
  shipping?: {
    standard?: number;
    overnight?: number;
    local?: number;
  };
}

export interface ApiMetaField {
  key: string;
  value: string;
}

export interface ApiDiscount {
  type: 'percentage' | 'fixed';
  amount: number;
  minCartValue?: number;
}

export interface ApiShipping {
  standard: number;
  overnight: number;
  local: number;
}

export interface ApiProductPayload {
  title: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  businessId: string;
  attributes: ApiAttribute[];
  shipping: ApiShipping;
  coverImage: string;
  galleryImages: string[];
  metaFields: ApiMetaField[];
  discount?: ApiDiscount;
  variants: ApiVariant[];
  isPublished: boolean;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ProductResponse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string | Category;
  subcategoryId: string | Subcategory;
  ownerId: string;
  businessId: string | Business;
  attributes: ApiAttribute[];
  shipping: ApiShipping;
  coverImage: string;
  galleryImages: string[];
  metaFields: ApiMetaField[];
  discount?: ApiDiscount;
  variants: string[] | ApiVariant[];
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Helper Types
// ============================================

export interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

export interface BusinessOption {
  _id: string;
  businessName: string;
  listingType: string;
}

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message: string;
}

export interface FieldError {
  field: string;
  message: string;
}