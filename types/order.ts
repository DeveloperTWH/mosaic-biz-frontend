// types/order.ts

// Variant Size Interface
export interface VariantSize {
  size: string;
  stock: number;
  price: number;
  salePrice?: number;
  discountEndDate?: string | null;
  sku: string;
  _id: string;
}

// Variant Interface
export interface Variant {
  _id: string;
  color: string;
  sizes: VariantSize[];
  images: string[];
  weightInKg: number;
}

// Product Interface
export interface Product {
  _id: string;
  title: string;
  coverImage: string;
}

// Item Interface
export interface Item {
  productId: Product;
  variantId: Variant;
  color: string;
  size: string;
  sku: string;
  quantity: number;
  price: number;
}

// Shipping Address Interface
export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

// Order History Interface
export interface StatusHistory {
  status: string;
  _id: string;
  updatedAt: string;
}

// Order Interface
export interface Order {
  _id: string;
  groupOrderId: string;
  userId: string;
  vendorId: { _id: string; name: string };
  businessId: string;
  items: Item[];
  totalAmount: number;
  currency: string;
  status: string;
  statusHistory: StatusHistory[];
  userNote: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: ShippingAddress;
  paymentId: string;
}
