import { Business } from "./business";

export interface ServiceChild {
  _id?: string;
  name: string;
  description?: string;
  durationMinutes?: number;
  duration?: string;
  price?: number;
  image?: string;
  images?: string[];
}

export type ServicePublicationEligibility =
  | "eligible"
  | "business_inactive"
  | "validation_failed"
  | string;

export interface ServicePublication {
  isPublished: boolean;
  isPubliclyVisible: boolean;
  publicEligibility?: ServicePublicationEligibility;
  publicBlockers?: string[];
  nextAction?: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  businessId?: Business | null;
  description: string;
  price: number;
  duration: string;
  services: ServiceChild[];
  categories: {
    categoryId: string;
    subcategoryIds: string[];
  }[];
  ownerId: string;
  minorityType: string;
  isPublished: boolean;
  publication?: ServicePublication;
  coverImage: string;
  images: string[];
  maxBookingsPerSlot: number;
  videos: string[];
  features: string[];
  amenities: {
    label: string;
    available: boolean;
  }[];
  businessHours: {
    day: string;
    hours: string;
  }[];
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    website?: string;
  };
  faq: {
    question: string;
    answer: string;
  }[];
  totalReviews: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}
