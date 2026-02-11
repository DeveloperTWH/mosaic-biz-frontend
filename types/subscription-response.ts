// Subscription Plan Limits
export interface SubscriptionLimits {
  productListings: number;
  serviceListings: number;
  foodListings: number;
  imageLimit: number;
  videoLimit: number;
}

// Subscription Plan Features
export interface SubscriptionFeatures {
  topTierPlacement: boolean;
  topTierVisibility: boolean;
  analyticsDashboard: boolean;
  marketingTools: boolean;
  featuredPlacement: boolean;
  supportLevel: 'none' | 'community' | 'email' | 'priority';
  communityEventsAccess: boolean;
  searchPriority: boolean;
  listingPriority: boolean;
  pushNotifications: boolean;
  aiRecommendation: boolean;
}

// Subscription Plan from API
export interface SubscriptionPlanResponse {
  _id: string;
  name: string;
  price: number;
  durationInDays: number;
  currency: string;
  interval: string;
  intervalCount: number;
  limits: SubscriptionLimits;
  features: SubscriptionFeatures;
  stripePriceId: string;
  stripeProductId: string;
  trialPeriodDays: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Get Subscription Plans Response
export interface GetSubscriptionPlansResponse {
  success: boolean;
  data: SubscriptionPlanResponse[];
}

// Create Subscription Response
export interface CreateSubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    subscriptionId: string;
    stripeSubscriptionId: string;
    clientSecret: string;
    amount: number;
    currency: string;
  };
}

// Subscription Creation Payload
export interface CreateSubscriptionPayload {
  planId: string;
}
