export interface Testimonial {
    _id: string;
    name: string;
    role: string;
    content: string;
    image: string;
    rating: number;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface CreateTestimonialData {
    name: string;
    role: string;
    content: string;
    image: string;
    rating: number;
    isFeatured: boolean;
}

export interface UpdateTestimonialData extends CreateTestimonialData {}

export interface TestimonialsResponse {
    success: boolean;
    data: Testimonial[];
}