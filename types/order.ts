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
// export interface Order {
//   _id: string;
//   groupOrderId: string;
//   userId: string;
//   vendorId: { _id: string; name: string };
//   businessId: string;
//   items: Item[];
//   totalAmount: number;
//   currency: string;
//   status: string;
//   statusHistory: StatusHistory[];
//   userNote: string;
//   paymentStatus: string;
//   paymentMethod: string;
//   createdAt: string;
//   updatedAt: string;
//   shippingAddress: ShippingAddress;
//   paymentId: string;
// }



type SizeMini = {
  _id?: string;
  size: string;
  stock?: number;
  price?: number;
  salePrice?: number | null;
  discountEndDate?: string | null;
  sku?: string;
};

type VariantMiniInOrder = {
  _id: string;
  color?: string;
  sizes?: SizeMini[];
  images?: string[];
  weightInKg?: number;
};

type ProductMiniInOrder = {
  _id: string;
  title: string;
  coverImage?: string;
};

type OrderItem = {
  // NOTE: the response nests full docs here
  productId: ProductMiniInOrder;
  variantId: VariantMiniInOrder;

  color?: string;
  size?: string;
  sku?: string;
  quantity: number;
  price: number;
  chargeId?: string;

  // Some APIs add an item id; make optional so keying is easy if present
  _id?: string;
};

type TrackingInfo = {
  trackingId?: string;
  trackingUrl?: string;
};

type OrderStatus =
  | "created"
  | "ordered"
  | "accepted"
  | "shipped"
  | "delivered"
  | "refunded"
  | "rejected"
  | "cancelled"
  | "returned";

export type Order = {
  _id: string;
  groupOrderId?: string;
  userId?: string;
  vendorId?: { _id: string; name?: string } | string;
  businessId?: string;

  items: OrderItem[];

  totalAmount: number;
  currency: string;

  status: OrderStatus;
  statusHistory?: { status: OrderStatus | string; updatedAt: string }[];

  shippingAddress?: {
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
  };

  userNote?: string;
  vendorNote?: string;

  paymentStatus?: "pending" | "paid" | "failed" | "canceled";
  paymentMethod?: "stripe" | string;
  paymentId?: string;

  trackingInfo?: TrackingInfo; // <-- add this

  createdAt: string;
  updatedAt: string;
};