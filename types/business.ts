export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
}

export interface Subscription {
  _id: string;
  userId: string;
  businessId: string;
  subscriptionPlanId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  paymentStatus: string;
  payerEmail: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  _id: string;
  owner: string;
  businessName: string;
  description: string;
  logo: string;
  coverImage: string;
  email: string;
  minorityType: string;
  phone: string;
  address: Address;
  listingType: 'product' | 'service' | 'food';
  productCategories: string[];
  serviceCategories: string[];
  foodCategories: string[];
  isApproved: boolean;
  isActive: boolean;
  subscriptionId: Subscription;
  stripeSubscriptionId: string;
  stripeCustomerId?: string;
  stripeConnectAccountId: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  imageLimit: number;
  videoLimit: number;
}
