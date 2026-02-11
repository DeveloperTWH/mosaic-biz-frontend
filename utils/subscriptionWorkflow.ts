/**
 * Subscription workflow constants and helpers
 */

export const SUBSCRIPTION_WORKFLOW = {
  STAGES: {
    STAGE_1: 'Stage 1 - Business Information',
    STAGE_2: 'Stage 2 - Select Subscription Plan',
    STAGE_3: 'Stage 3 - Verification',
  },
  TIER_SELECTION_ENTRY_POINT: '/partners/tier-selection',
} as const;

/**
 * Check if vendor can access tier selection
 */
export const canAccessTierSelection = (status: string): boolean => {
  return status.includes('Stage 2') && status.includes('Select Subscription Plan');
};

/**
 * Get next step after tier selection
 */
export const getNextStepAfterTierSelection = (): string => {
  return '/payment/checkout';
};

/**
 * Validation for subscription payload
 */
export const validateSubscriptionPayload = (planId: string): boolean => {
  return !!(planId && planId.length > 0);
};
