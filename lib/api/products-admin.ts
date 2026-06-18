import axios from 'axios';
import { ProductsResponse, ToggleFeaturedData } from '@/types/product-admin';
import { LEGACY_ADMIN_PRODUCTS } from '@/lib/api/routeContract';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Get all products with pagination
export const getProducts = async (page: number = 1, limit: number = 20): Promise<ProductsResponse> => {
    const response = await axios.get(`${API_BASE_URL}${LEGACY_ADMIN_PRODUCTS}?page=${page}&limit=${limit}`, {
        withCredentials: true,
    });
    return response.data;
};

// Toggle product featured status
export const toggleProductFeatured = async (productId: string, isFeatured: boolean) => {
    const response = await axios.patch(
        `${API_BASE_URL}${LEGACY_ADMIN_PRODUCTS}/${productId}/featured`,
        { isFeatured },
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
    );
    return response.data;
};