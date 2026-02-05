export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  img?: string;
  __v: number;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug?: string;
}

export interface CategoryResponse {
  success: boolean;
  data: {
    productCategories: Category[];
  };
}

export interface ServiceCategoryResponse {
  success: boolean;
  data: {
    serviceCategories: Category[];
  };
}

export interface FoodCategoryResponse {
  success: boolean;
  data: {
    foodCategories: Category[];
  };
}

export interface SubCategoryResponse {
  success: boolean;
  data: SubCategory[];
}