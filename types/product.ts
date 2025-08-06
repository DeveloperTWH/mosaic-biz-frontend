export type ProductSize = {
  size: string;
  stock: number;
  price: number;
  salePrice?: number; // ✅ optional
  discountEndDate: string;
  sku: string;
  _id: string;
};


export type ProductInfo = {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
};

export type ProductVariant = {
  _id?: string;
  productId: ProductInfo; // ✅ Updated: now an object, not a string
  businessId: string;
  color: string;
  label: string;
  size: ProductSize;
  isPublished: boolean;
  images: string[];
  allowBackorder: boolean;
  videos: string[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
};

export type ProductListingItem = {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  variants: {
    variantId: string;
    color: string;
    label: string;
    isPublished: boolean;
    images: string[];
    averageRating: number;
    totalReviews: number;
    sizes: {
      sizeId: string;
      size: string;
      sku: string;
      stock: number;
      price: number;
      salePrice?: number | null;
      discountEndDate?: string | null;
    }[];
  }[];
};

// ---------- Product ----------
export interface ProductPayload {
  title: string;
  description: string;
  brand?: string;
  categoryId: string;                         // ObjectId as string
  subcategoryId: string;                      // ObjectId as string
  businessId: string;                         // ObjectId as string
  coverImage: string;                         // URL after upload
  variantOptions: Record<string, string[]>;   // { red: ["S","M"], blue: ["L"] }
  specifications?: { key: string; value: string }[];
  isPublished?: boolean;
}

// ---------- Product Variant Size ----------
export interface ProductVariantSize {
  size: string;
  stock?: number;
  price?: number;
  salePrice?: number;
  sku: string;
  discountEndDate?: string;                   // ISO string (YYYY-MM-DD)
}

// ---------- Product Variant ----------
export interface ProductVariantPayload {
  color: string;
  label: string;
  images: string[];                           // URLs after upload
  videos?: string[];                          // Optional videos
  allowBackorder?: boolean;
  isPublished?: boolean;
  weightInKg?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  sizes: ProductVariantSize[];
}

// ---------- Final Create Product Payload ----------
export interface CreateProductWithVariantsPayload extends ProductPayload {
  variants: ProductVariantPayload[];
}



export interface ProductDetailItem {
  _id: string;
  title: string;
  description: string;
  brand?: string;
  categoryId: string;
  subcategoryId: string;
  businessId: string;
  coverImage: string;
  specifications?: { key: string; value: string }[];
  isPublished?: boolean;
  variants: {
    variantId: string;
    color: string;
    label: string;
    images: string[];
    averageRating: number;
    totalReviews: number;
    sizes: {
      sizeId: string;
      size: string;
      sku: string;
      stock: number;
      price: number;
      salePrice?: number | null;
      discountEndDate?: string | null;
    }[];
  }[];
}
