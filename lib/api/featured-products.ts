import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface FeaturedProduct {
    _id: string;
    title: string;
    description: string;
    categoryId: {
        _id: string;
        name: string;
    };
    subcategoryId: {
        _id: string;
        name: string;
    } | null;
    coverImage: string;
    slug: string;
    createdAt: string;
    price: number;
    category: {
        _id: string;
        name: string;
    };
    subcategory: {
        _id: string;
        name: string;
    } | null;
}

export interface FeaturedProductsResponse {
    products: FeaturedProduct[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalProducts: number;
    };
}

// Get featured products
export const getFeaturedProducts = async (page: number = 1, limit: number = 12): Promise<FeaturedProductsResponse> => {
    const response = await axios.get(`${API_BASE_URL}/api/featured-products?page=${page}&limit=${limit}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
    return response.data;
};