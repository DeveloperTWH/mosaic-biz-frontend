import { api } from '../../../lib/api';
import {
  GetSubscriptionPlansResponse,
  CreateSubscriptionResponse,
  CreateSubscriptionPayload,
} from '../../../types/subscription-response';

/**
 * Fetch all available subscription plans
 * GET /api/subscription-plans
 */
export const fetchSubscriptionPlans = async (): Promise<GetSubscriptionPlansResponse> => {
  try {
    const response = await api.get<GetSubscriptionPlansResponse>('/api/subscription-plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }
};

/**
 * Create a subscription for a specific plan
 * POST /api/subscriptions/create
 */
export const createSubscription = async (
  payload: CreateSubscriptionPayload
): Promise<CreateSubscriptionResponse> => {
  try {
    const response = await api.post<CreateSubscriptionResponse>(
      '/api/subscriptions/create',
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

/**
 * Get subscription by subscriptionId
 * GET /api/subscriptions/:subscriptionId
 */
export const getSubscriptionById = async (
  subscriptionId: string
): Promise<{
  success: boolean;
  data: {
    subscriptionId: string;
    amount: number;
    currency: string;
    planId?: string;
    [key: string]: any;
  } | null;
}> => {
  try {
    const response = await api.get(`/api/subscriptions/${subscriptionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription by id:', error);
    throw error;
  }
};

/**
 * Get vendor onboarding status
 * GET /api/vendor-onboarding/status/:applicationId
 */
export const getVendorOnboardingStatus = async (
  applicationId: string
): Promise<{
  success: boolean;
  data: {
    status: string;
    currentStage: number;
    [key: string]: any;
  };
}> => {
  try {
    const response = await api.get(
      `/api/vendor-onboarding/status/${applicationId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    throw error;
  }
};
