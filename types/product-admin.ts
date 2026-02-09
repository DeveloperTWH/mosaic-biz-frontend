export interface Category {
    _id: string;
    name: string;
}

export interface Subcategory {
    _id: string;
    name: string;
}

export interface Business {
    _id: string;
    businessName: string;
}

export interface Product {
    _id: string;
    title: string;
    categoryId: Category | null;
    subcategoryId: Subcategory | null;
    businessId?: Business;
    coverImage: string;
    isPublished: boolean;
    isFeatured: boolean;
    createdAt: string;
}

export interface ProductsResponse {
    products: Product[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalProducts: number;
    };
}

export interface ToggleFeaturedData {
    isFeatured: boolean;
}