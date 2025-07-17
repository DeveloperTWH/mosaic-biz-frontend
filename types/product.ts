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
  size: ProductSize;
  isPublished: boolean;
  isDeleted: boolean;
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
  _id: string; // ProductVariant ID
  sizeId: string; // Size ID
  color: string;
  isPublished: boolean;
  images: string[];
  averageRating: number;
  totalReviews: number;
  productId: {
    _id: string;
    title: string;
    description: string;
    coverImage: string;
  };
  size: string;
  sku: string;
  stock: number;
  price: number;
  salePrice?: number | null; // Optional, can be null if no sale
  discountEndDate?: string | null;
};

