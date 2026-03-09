// Add to your existing types file

export interface Food {
  _id: string;
  title: string;
  description: string;
  categoryId: { _id: string; name: string } | null;
  subcategoryId: { _id: string; name: string } | null;
  price: number;
  preparationTime: string;
  coverImage: string;
  images: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  
  // Computed fields
  parentFoodId?: string;
}

export interface FoodsResponse {
  success: boolean;
  foods: Food[];
  total?: number;
  page?: number;
  totalPages?: number;
}

export interface FoodFormData {
  title: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  price: number;
  preparationTime: string;
  businessId: string;
  coverImage: string;
  images: string[];
  isPublished: boolean;
}