/**
 * Quick Start Guide for Tier Selection Feature
 * 
 * This file provides examples of how to use the tier selection feature
 * in your vendor onboarding flow.
 */

// ============================================
// 1. LINKING TO TIER SELECTION
// ============================================

// In your vendor onboarding page, add a link like this:
// <Link href={`/partners/tier-selection?appId=${applicationId}`}>
//   Select Your Subscription Plan
// </Link>

// ============================================
// 2. USING SUBSCRIPTION API
// ============================================

import {
  fetchSubscriptionPlans,
  createSubscription,
  getVendorOnboardingStatus,
} from '@/lib/api/subscription';

async function example_fetchPlans() {
  try {
    const response = await fetchSubscriptionPlans();
    console.log('Available plans:', response.data);
  } catch (error) {
    console.error('Error fetching plans:', error);
  }
}

async function example_checkStatus(applicationId: string) {
  try {
    const response = await getVendorOnboardingStatus(applicationId);
    if (response.data.status.includes('Stage 2')) {
      console.log('User can select tier');
    }
  } catch (error) {
    console.error('Error checking status:', error);
  }
}

async function example_subscribe(planId: string) {
  try {
    const response = await createSubscription({ planId });
    console.log('Subscription created:', response.data);
    // Redirect to payment with subscriptionId
    window.location.href = `/payment/checkout?subscriptionId=${response.data.subscriptionId}`;
  } catch (error) {
    console.error('Error creating subscription:', error);
  }
}

// ============================================
// 3. USING UTILITIES
// ============================================

import {
  storeSubscriptionData,
  getStoredSubscriptionData,
  formatPrice,
  subscriptionWorkflow,
} from '@/utils';

function example_utilities() {
  // Store subscription data after creation
  const subscriptionData = {
    subscriptionId: '123',
    stripeSubscriptionId: 'sub_123',
    clientSecret: 'pi_123_secret_abc',
    amount: 36000,
    currency: 'usd',
  };
  storeSubscriptionData(subscriptionData);

  // Retrieve it later
  const stored = getStoredSubscriptionData();
  console.log('Stored data:', stored);

  // Format price for display
  const display = formatPrice(36000, 'usd'); // "$360.00"
  console.log('Formatted:', display);

  // Check workflow stage
  const canAccess = subscriptionWorkflow.canAccessTierSelection(
    'Stage 2 - Select Subscription Plan'
  );
}

// ============================================
// 4. INTEGRATION IN PARTNERS PAGE
// ============================================

// Add this code in app/(home)/partners/page.tsx

/*
import Link from 'next/link';
import { canAccessTierSelection } from '@/utils/subscriptionWorkflow';

// In your component:
{onboardingStatus?.data?.status && 
 canAccessTierSelection(onboardingStatus.data.status) ? (
  <Link 
    href={`/partners/tier-selection?appId=${applicationId}`}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    Select Subscription Plan
  </Link>
) : null}
*/

// ============================================
// 5. HANDLING PAYMENT FLOW
// ============================================

// After tier selection, users are redirected to:
// /payment/checkout?subscriptionId={subscriptionId}
//
// In your checkout page, retrieve the subscription data:

import { getStoredSubscriptionData } from '@/utils/subscriptionUtils';

function example_checkout() {
  const subscriptionData = getStoredSubscriptionData();
  if (subscriptionData) {
    // Use subscriptionData.clientSecret to complete Stripe payment
    // Initialize Stripe payment element with clientSecret
  }
}

// ============================================
// 6. ENV VARIABLES NEEDED
// ============================================

/*
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
*/

// ============================================
// 7. API ENDPOINTS REFERENCE
// ============================================

/*
GET  /api/vendor-onboarding/status/:applicationId
  Response: {
    success: boolean,
    data: {
      status: string,
      currentStage: number,
      businessName: string,
      ... other details
    }
  }

GET  /api/subscription-plans
  Response: {
    success: boolean,
    data: [
      {
        _id: string,
        name: 'Basic' | 'Standard' | 'Premium',
        price: number (in cents),
        limits: { ... },
        features: { ... },
        ... other fields
      }
    ]
  }

POST /api/subscriptions/create
  Payload: { planId: string }
  Response: {
    success: boolean,
    message: string,
    data: {
      subscriptionId: string,
      stripeSubscriptionId: string,
      clientSecret: string,
      amount: number,
      currency: string
    }
  }
*/

// ============================================
// 8. TESTING THE FLOW
// ============================================

/*
1. Start with a valid application ID from Stage 1
2. Navigate to: /partners/tier-selection?appId={applicationId}
3. Verify plans load
4. Select a plan
5. Review modal and confirm
6. Verify redirect to checkout page
7. Complete Stripe payment

Error scenarios to test:
- Invalid/expired application ID
- Status not in Stage 2
- Plan fetch failure
- Subscription creation failure
- Network timeouts
*/

export default function QuickStartGuide() {
  return (
    <div>
      {/* This is a documentation file for reference */}
      <p>See module documentation for complete implementation guide</p>
    </div>
  );
}
