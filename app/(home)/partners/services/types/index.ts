export interface ChildService {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

export interface BusinessHour {
  day: string;
  hours: string;
  closed?: boolean;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  categoryId: { _id: string; name: string } | null;
  subcategoryId: { _id: string; name: string } | null;
  price: number;
  duration: string;
  coverImage: string;
  images: string[];
  services: ChildService[];
  businessHours: BusinessHour[];
  bookingToolLink?: string;
  location?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface ServicesResponse {
  services: Service[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ServiceFormData {
  categoryId: string;
  subcategoryId: string;
  businessId: string;
  bookingToolLink?: string;
  services: ChildService[];
  coverImage: string;
  images: string[];
  businessHours: BusinessHour[];
  location?: string;
  isPublished: boolean;
}