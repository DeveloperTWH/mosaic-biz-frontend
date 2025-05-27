// dummyData/vendorDetail.ts
import { VendorDetail } from "../types/vendor";

export const dummyVendor: VendorDetail = {
  id: "vendor-001",
  name: "Ray Ban",
  isTopVendor: true,
  trusted: true,
  location: "USA",
  language: "English",
  description:
    "In hac habitasse platea dictumst. Cras at velit pulvinar, semper mi scelerisque.",
  contactOptions: ["Email", "Chat", "Share"],
  pricingPlans: [
    { title: "Premium Plan", price: "$50.00", selected: true },
    { title: "Bronze Plan", price: "$120.00" },
    { title: "Gold Plan", price: "$120.00" },
  ],
  services: [
    {
      title: "Services 01",
      items: [
        "Delivery to 19000+ pin codes across India",
        "Customer returns support",
        "Logistics support from community warehouse available",
      ],
    },
    { title: "Services 02", items: ["Custom Service B", "Bulk Orders"] },
    { title: "Services 03", items: ["Exclusive Membership Support"] },
  ],
  mediaGallery: [
    "/images/model.jpg",
    "/images/shoe.jpg",
    "/images/watch.jpg",
    "/images/people.jpg",
  ],
  onlineSales: 9589.88,
  bookingRate: 90,
  mapDots: [
    { lat: 37.7749, lng: -122.4194 },
    { lat: 40.7128, lng: -74.006 },
    { lat: 51.5074, lng: -0.1278 },
  ],
  promotions: [
    { image: "/images/black-friday.jpg", title: "Black Friday" },
    { image: "/images/summer-sale.jpg", title: "Summer Sale" },
  ],
  topSellingProducts: [
    {
      title: "Red Hoodie",
      price: 499,
      image: "/images/hoodie.jpg",
    },
    {
      title: "Leather Sofa",
      price: 499,
      image: "/images/sofa.jpg",
    },
    {
      title: "Cosmetic Powder",
      price: 499,
      image: "/images/makeup.jpg",
    },
    {
      title: "Headphones",
      price: 499,
      image: "/images/headphones.jpg",
    },
  ],
};
