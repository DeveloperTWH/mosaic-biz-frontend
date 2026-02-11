/**
 * Subscription utilities for managing subscription-related operations
 */

import { CreateSubscriptionResponse } from '@/types/subscription-response';

/**
 * Store subscription data in session storage
 */
export const storeSubscriptionData = (data: CreateSubscriptionResponse['data']) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('subscriptionData', JSON.stringify(data));
  }
};

/**
 * Retrieve subscription data from session storage
 */
export const getStoredSubscriptionData = () => {
  if (typeof window !== 'undefined') {
    const data = sessionStorage.getItem('subscriptionData');
    return data ? JSON.parse(data) : null;
  }
  return null;
};

/**
 * Clear subscription data from session storage
 */
export const clearSubscriptionData = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('subscriptionData');
    sessionStorage.removeItem('selectedPlanId');
  }
};

/**
 * Format price for display
 */
export const formatPrice = (priceInCents: number, currency: string = 'usd'): string => {
  const priceInDollars = priceInCents / 100;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  });
  return formatter.format(priceInDollars);
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    usd: '$',
    eur: '€',
    gbp: '£',
    inr: '₹',
    jpy: '¥',
    cad: 'C$',
    aud: 'A$',
  };
  return symbols[currency.toLowerCase()] || currency.toUpperCase();
};

/**
 * Check if subscription is active
 */
export const isSubscriptionActive = (endDate: string): boolean => {
  return new Date(endDate) > new Date();
};

/**
 * Get days remaining in subscription
 */
export const getDaysRemaining = (endDate: string): number => {
  const today = new Date();
  const end = new Date(endDate);
  const difference = end.getTime() - today.getTime();
  return Math.ceil(difference / (1000 * 3600 * 24));
};
