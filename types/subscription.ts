export type SubscriptionPlantype = {
  _id: string;
  name: string;
  price: number;
  durationInDays: number;
  limits: {
    productListings: number;
    serviceListings: number;
    foodListings: number;
    imageLimit: number;
    videoLimit: number;
  };
  features: {
    analyticsDashboard: boolean;
    marketingTools: boolean;
    featuredPlacement: boolean;
    supportLevel: 'none' | 'community' | 'email' | 'priority';
    communityEventsAccess: boolean;
    searchPriority: boolean;
    listingPriority: boolean;
    pushNotifications: boolean;
    aiRecommendation: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
};


export type Subscription = {
  _id: string;
  userId: string; // ObjectId as string
  businessId: string | null; // null before business is created
  subscriptionPlanId: SubscriptionPlantype; // ✅ populated object
  stripeSubscriptionId: string;
  stripeCustomerId?: string;
  paymentStatus: 'COMPLETED' | 'FAILED' | 'PENDING' | 'REFUNDED';
  payerEmail?: string;
  startDate: string; // ISO Date
  endDate: string;   // ISO Date
  status: 'active' | 'expired' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
};
