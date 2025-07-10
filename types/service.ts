export interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: string;
  services: { name: string }[];
  categories: {
    categoryId: string;
    subcategoryIds: string[];
  }[];
  ownerId: string;
  minorityType: string;
  isPublished: boolean;
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
    coordinates: [number, number]; // [longitude, latitude]
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
