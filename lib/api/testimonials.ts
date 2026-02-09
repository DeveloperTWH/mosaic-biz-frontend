import axios from 'axios';
import { CreateTestimonialData, UpdateTestimonialData, Testimonial } from '@/types/testimonial';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Get all testimonials
export const getTestimonials = async (): Promise<Testimonial[]> => {
    const response = await axios.get(`${API_BASE_URL}/api/admin/testimonials`, {
        withCredentials: true,
    });
    return response.data.data;
};

// Create new testimonial
export const createTestimonial = async (testimonialData: CreateTestimonialData) => {
    const response = await axios.post(
        `${API_BASE_URL}/api/admin/testimonials`,
        testimonialData,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
    );
    return response.data;
};

// Update testimonial
export const updateTestimonial = async (id: string, testimonialData: UpdateTestimonialData) => {
    const response = await axios.put(
        `${API_BASE_URL}/api/admin/testimonials/${id}`,
        testimonialData,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
    );
    return response.data;
};

// Delete testimonial
export const deleteTestimonial = async (id: string) => {
    const response = await axios.delete(
        `${API_BASE_URL}/api/admin/testimonials/${id}`,
        {
            withCredentials: true,
        }
    );
    return response.data;
};