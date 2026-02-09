import axios from 'axios';
import { ProductsResponse, ToggleFeaturedData } from '@/types/product-admin';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Get all products with pagination
export const getProducts = async (page: number = 1, limit: number = 20): Promise<ProductsResponse> => {
    const response = await axios.get(`${API_BASE_URL}/admin/api/products?page=${page}&limit=${limit}`, {
        withCredentials: true,
    });
    return response.data;
};

// Toggle product featured status
export const toggleProductFeatured = async (productId: string, isFeatured: boolean) => {
    const response = await axios.patch(
        `${API_BASE_URL}/admin/api/products/${productId}/featured`,
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