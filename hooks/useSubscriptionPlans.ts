import { useCallback } from 'react';
import { SubscriptionPlanResponse } from '@/types/subscription-response';

/**
 * Hook for managing subscription plan selection
 */
export const useSubscriptionPlans = (plans: SubscriptionPlanResponse[]) => {
  const getPlanById = useCallback(
    (planId: string) => plans.find((p) => p._id === planId),
    [plans]
  );

  const getPlansByTier = useCallback(
    (tier: 'basic' | 'standard' | 'premium') => {
      const tierNames: Record<string, string> = {
        basic: 'Basic',
        standard: 'Standard',
        premium: 'Premium',
      };
      return plans.filter((p) => p.name === tierNames[tier]);
    },
    [plans]
  );

  const getMostExpensive = useCallback(() => {
    if (plans.length === 0) return null;
    return plans.reduce((prev, current) =>
      prev.price > current.price ? prev : current
    );
  }, [plans]);

  const getMostAffordable = useCallback(() => {
    if (plans.length === 0) return null;
    return plans.reduce((prev, current) =>
      prev.price < current.price ? prev : current
    );
  }, [plans]);

  return {
    getPlanById,
    getPlansByTier,
    getMostExpensive,
    getMostAffordable,
  };
};
