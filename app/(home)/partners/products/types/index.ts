// ============================================
// Product Types
// ============================================

export interface CategoryInfo {
  _id: string;
  name: string;
}

export interface ProductAttribute {
  name: string;
  values: string[];
  _id?: string;
}

export interface ProductVariant {
  _id: string;
  attributes: Record<string, string>;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  isPublished: boolean;
  isDeleted?: boolean;
  shipping?: {
    standard?: number;
    overnight?: number;
    local?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductShipping {
  standard: number;
  overnight: number;
  local: number;
}

export interface ProductDiscount {
  type: string;
  amount: number;
  minCartValue: number;
}

export interface ProductMetaField {
  key: string;
  value: string;
  _id?: string;
}

export interface TaxCategoryRef {
  code: string;
  label: string;
}

export interface TaxCategoryRate extends TaxCategoryRef {
  rate: number;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  categoryId: CategoryInfo | null;
  subcategoryId: CategoryInfo | null;
  ownerId: string;
  businessId: string;
  attributes: ProductAttribute[];
  shipping: ProductShipping;
  coverImage: string;
  galleryImages: string[];
  metaFields: ProductMetaField[];
  discount: ProductDiscount | null;
  taxCategory?: TaxCategoryRef | null;
  variants?: ProductVariant[];
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  
  // Computed fields (from API)
  variantCount?: number;
  totalStock?: number;
    price?: {
    $numberDecimal: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
}

export interface ProductResponse {
  success: boolean;
  product: Product;
}

// ============================================
// Filter Types
// ============================================

export interface FilterOptions {
  status: 'all' | 'available' | 'low-stock' | 'out-of-stock';
  search: string;
  sortBy: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc';
  priceRange: {
    min: number;
    max: number;
  };
  category?: string;
}

export interface TableHeader {
  key: string;
  label: string;
  sortable?: boolean;
}

// ============================================
// Stock Status Types
// ============================================

export interface StockStatus {
  label: string;
  className: string;
  color: 'green' | 'yellow' | 'red' | 'gray';
}

export type StockStatusType = 'available' | 'low-stock' | 'out-of-stock' | 'unknown';

// ============================================
// Form Data Types (Frontend Structure)
// ============================================

export interface FormAttribute {
  attributeName: string;
  attributeValues: string[];
}

export interface FormVariant {
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
  images?: string[];
}

export interface FormMetaField {
  metaFieldName: string;
  metaFieldValue: string;
}

export interface FormDiscount {
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
  attributes: FormAttribute[];
  variants: FormVariant[];
  metaFields: FormMetaField[];
  discount: FormDiscount;
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
  [key: string]: string;
}

export interface ApiVariant {
  _id?: string;
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
  taxCategory?: TaxCategoryRef;
  variants: ApiVariant[];
  isPublished: boolean;
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

// ============================================
// Modal Types
// ============================================

export type ModalType = 'view' | 'edit' | 'delete' | null;

export interface ModalState {
  isOpen: boolean;
  type: ModalType;
  productId?: string;
  product?: Product;
}
