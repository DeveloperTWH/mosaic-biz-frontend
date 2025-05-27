// types/vendor.ts
export interface VendorDetail {
  id: string;
  name: string;
  isTopVendor: boolean;
  trusted: boolean;
  location: string;
  language: string;
  description: string;
  contactOptions: string[];
  pricingPlans: {
    title: string;
    price: string;
    selected?: boolean;
  }[];
  services: {
    title: string;
    items: string[];
  }[];
  mediaGallery: string[];
  onlineSales: number;
  bookingRate: number;
  mapDots: {
    lat: number;
    lng: number;
  }[];
  promotions: {
    image: string;
    title: string;
  }[];
  topSellingProducts: {
    title: string;
    price: number;
    image: string;
  }[];
}
