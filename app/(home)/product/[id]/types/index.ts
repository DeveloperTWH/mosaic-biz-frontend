// types/product.ts

// ============================================
// Business Types
// ============================================

export interface BusinessInfo {
  _id: string;
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  businessLogo?: string;
  businessType?: string;
}

// ============================================
// Variant Types
// ============================================

export interface VariantAttributes {
  size: string;
  Color: string;
  [key: string]: string; // Allow for additional attributes
}

export interface Variant {
  variantId: string;
  productId: string;
  businessId: string;
  ownerId: string;
  attributes: VariantAttributes;
  sku: string;
  price: number;
  salePrice: number | null;
  stock: number;
  shipping: any | null;
  images: string[];
  videos?: string[];
  isPublished: boolean;
  isDeleted: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
  discountEndDate?: string;
  averageRating?: number;
  totalReviews?: number;
  allowBackorder?: boolean;
}

// ============================================
// Product Attribute Types
// ============================================

export interface Attribute {
  name: string;
  values: string[];
  _id: string;
}

export interface Shipping {
  standard: number;
  overnight: number;
  local: number;
}

export interface MetaField {
  key: string;
  value: string;
}

export interface Discount {
  type: 'percentage' | 'fixed';
  amount: number;
  minCartValue?: number;
}

// ============================================
// Main Product Types
// ============================================

export interface ProductDetailItem {
  _id: string;
  title: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  ownerId: string;
  businessId: BusinessInfo | string;
  price: number;
  attributes: Attribute[];
  shipping: Shipping;
  coverImage: string;
  galleryImages: string[];
  metaFields: MetaField[] | any[];
  discount: Discount | null;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  business?: BusinessInfo;
  variants: Variant[];
  brand?: string;
  specifications?: Array<{ key: string; value: string }>;
  weight?: string;
  netQuantity?: string;
  genericName?: string;
}

// ============================================
// Product List Types
// ============================================

export interface ProductListItem {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  businessId: string | BusinessInfo;
  categoryId: string;
  subcategoryId: string;
  slug: string;
  averageRating?: number;
  totalReviews?: number;
  isPublished: boolean;
  createdAt: string;
}

export interface ProductListResponse {
  success: boolean;
  data: {
    products: ProductListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

// ============================================
// Product Form Types (for creating/editing)
// ============================================

export interface ProductFormAttribute {
  attributeName: string;
  attributeValues: string[];
}

export interface ProductFormVariant {
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

export interface ProductFormMetaField {
  metaFieldName: string;
  metaFieldValue: string;
}

export interface ProductFormDiscount {
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
  attributes: ProductFormAttribute[];
  variants: ProductFormVariant[];
  metaFields: ProductFormMetaField[];
  discount: ProductFormDiscount;
}

// ============================================
// API Request/Response Types
// ============================================

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  isActive: boolean;
  totalProducts?: number;
}

export interface Subcategory {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  categoryId: string;
  isActive: boolean;
  totalProducts?: number;
}

export interface Business {
  _id: string;
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  businessLogo?: string;
  businessType?: string;
  isActive?: boolean;
}

export interface CategoryResponse {
  success: boolean;
  data: {
    productCategories: Category[];
  };
  message?: string;
}

export interface SubCategoryResponse {
  success: boolean;
  data: Subcategory[];
  message?: string;
}

// ============================================
// File Upload Types
// ============================================

export interface SelectedFile {
  file: File;
  preview: string;
  type: 'feature' | 'gallery' | 'variant';
}

export interface UploadProgress {
  [key: string]: number;
}

export interface UploadResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

// ============================================
// API Payload Types
// ============================================

export interface ApiVariantAttribute {
  [key: string]: string;
}

export interface ApiVariant {
  attributes: ApiVariantAttribute;
  price: number;
  stock: number;
  images: string[];
  sku: string;
}

export interface ApiAttribute {
  name: string;
  values: string[];
}

export interface ApiShipping {
  standard: number;
  overnight: number;
  local: number;
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
// Form Error Types
// ============================================

export interface FormErrors {
  [key: string]: string | undefined;
  productTitle?: string;
  productDescription?: string;
  businessId?: string;
  categoryId?: string;
  subCategoryId?: string;
  variants?: string;
  [key: `variant_${number}_price`]: string | undefined;
}

// ============================================
// Cart and Wishlist Types
// ============================================

export interface CartItem {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
  price: number;
  title?: string;
  image?: string;
  businessId?: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}