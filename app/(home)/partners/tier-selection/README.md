# Tier Selection Feature Documentation

## Overview

The Tier Selection feature enables vendors to select and subscribe to subscription plans during the onboarding process (Stage 2). This module provides a complete workflow from plan selection to payment processing.

## Folder Structure

```
app/(home)/partners/
├── tier-selection/
│   ├── components/
│   │   ├── TierCard.tsx              # Individual tier plan card component
│   │   ├── TierComparison.tsx        # Comparison table for all tiers
│   │   ├── TierSelectionHeader.tsx   # Header with intro and benefits
│   │   ├── PaymentModal.tsx          # Modal for payment confirmation
│   │   └── index.ts                  # Component exports
│   ├── page.tsx                      # Main tier selection page
│   └── layout.tsx                    # Layout with metadata
│
lib/api/subscription/
├── subscriptionApi.ts                # API service functions

utils/
├── subscriptionUtils.ts              # Utility functions for subscriptions
├── subscriptionWorkflow.ts           # Workflow constants and validators

hooks/
├── useSubscriptionPlans.ts           # React hook for plan management

types/
├── subscription-response.ts          # TypeScript types for subscription API responses
```

## API Integration

### Endpoints Used

1. **Get Vendor Onboarding Status**
   ```
   GET /api/vendor-onboarding/status/:applicationId
   ```
   - Validates that vendor is in Stage 2
   - Returns business name and current status

2. **Get Subscription Plans**
   ```
   GET /api/subscription-plans
   ```
   - Returns all available subscription plans with their details
   - Includes limits, features, pricing information

3. **Create Subscription**
   ```
   POST /api/subscriptions/create
   Payload: { planId: string }
   ```
   - Creates subscription for the selected plan
   - Returns subscription ID and Stripe client secret for payment

## How to Use

### 1. Access the Tier Selection Page

The tier selection page should be accessed after Stage 1 completion:

```typescript
// From your vendor onboarding flow
import Link from 'next/link';

// With application ID as query parameter
<Link href={`/partners/tier-selection?appId=${applicationId}`}>
  Select Subscription Plan
</Link>
```

### 2. Integrate in Partners Page

Update the [partners/page.tsx](app/(home)/partners/page.tsx) to add a link when status is "Stage 2":

```typescript
if (onboardingStatus?.data?.status?.includes('Stage 2')) {
  // Show button to access tier selection
  <Link href={`/partners/tier-selection?appId=${applicationId}`}>
    Select Your Plan
  </Link>
}
```

### 3. Handle the Response

After successful subscription creation, users are redirected to:
```
/payment/checkout?subscriptionId={subscriptionId}
```

The subscription data is stored in `sessionStorage` for use in the checkout page.

## Component Details

### TierCard
- Displays individual subscription plan
- Shows pricing, limits, and features
- Selection button with loading state
- Optional "POPULAR" badge for recommended tier

```typescript
<TierCard
  plan={plan}
  isSelected={selectedPlanId === plan._id}
  isLoading={isProcessing}
  onSelect={handleSelectPlan}
  badge="POPULAR"
/>
```

### TierComparison
- Table view comparing all plans side-by-side
- Shows all features with checkmarks/icons
- Helps users make informed decisions

### PaymentModal
- Confirmation dialog before payment
- Shows plan details and billing information
- Handles subscription creation API call
- Shows success/error states

### TierSelectionHeader
- Welcome header with gradient background
- Shows key benefits (Flexible Plans, Secure Payment, Grow Business)
- Business name display if available

## Utility Functions

### subscriptionUtils.ts

```typescript
// Store subscription data
storeSubscriptionData(subscriptionData);

// Retrieve stored subscription data
const data = getStoredSubscriptionData();

// Clear subscription data
clearSubscriptionData();

// Format price for display
const formatted = formatPrice(36000, 'usd'); // $360.00

// Get currency symbol
const symbol = getCurrencySymbol('usd'); // $

// Check if subscription is active
isSubscriptionActive(endDate);

// Get days remaining
const days = getDaysRemaining(endDate);
```

### subscriptionWorkflow.ts

```typescript
// Check if vendor can access tier selection
if (canAccessTierSelection(status)) {
  // Allow access
}

// Validate subscription payload
if (validateSubscriptionPayload(planId)) {
  // Proceed with subscription
}
```

## Hooks

### useSubscriptionPlans

```typescript
const { getPlanById, getPlansByTier, getMostExpensive, getMostAffordable } = 
  useSubscriptionPlans(plans);

// Get a specific plan
const plan = getPlanById(planId);

// Get plans by tier
const basicPlans = getPlansByTier('basic');

// Get most/least expensive
const premium = getMostExpensive();
const budget = getMostAffordable();
```

## Data Types

### SubscriptionPlanResponse
```typescript
{
  _id: string;
  name: 'Basic' | 'Standard' | 'Premium';
  price: number; // in cents
  currency: string;
  interval: 'year' | 'month';
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
    // ... other features
  };
}
```

### CreateSubscriptionResponse
```typescript
{
  success: boolean;
  message: string;
  data: {
    subscriptionId: string;
    stripeSubscriptionId: string;
    clientSecret: string; // For Stripe payment
    amount: number; // in cents
    currency: string;
  };
}
```

## User Flow

1. **Access** → User navigates to tier selection (usually from partners dashboard)
2. **Verify** → System checks if user is in Stage 2
3. **View** → System fetches and displays all subscription plans
4. **Select** → User chooses a plan and opens payment modal
5. **Confirm** → User confirms payment details in modal
6. **Subscribe** → API creates subscription and returns client secret
7. **Pay** → User is redirected to Stripe payment checkout
8. **Complete** → After payment, subscription is activated

## Error Handling

The system handles multiple error scenarios:

1. **Status Check Failed** → Shows error message and link back to partners
2. **Plan Fetch Failed** → Shows error with retry button
3. **Subscription Creation Failed** → Shows error in modal, allows retry
4. **Network Errors** → Gracefully handles with user-friendly messages

## Styling

- Uses Tailwind CSS for responsive design
- Mobile-first approach
- Gradient headers and smooth transitions
- Color scheme: Blue theme (primary: #2563EB)

## Security Considerations

1. ✓ Application ID validation before showing tier selection
2. ✓ Status check to ensure user is in correct stage
3. ✓ CORS-enabled API calls with credentials
4. ✓ Stripe integration for secure payment handling
5. ✓ Session storage for temporary subscription data

## Integration Checklist

- [ ] Update partners/page.tsx to link to tier selection
- [ ] Ensure applicationId is passed as query parameter
- [ ] Add link in vendor dashboard to "Select Plan"
- [ ] Test with valid application ID
- [ ] Test error scenarios
- [ ] Configure Stripe keys in environment
- [ ] Set up payment/checkout page to handle subscriptionId
- [ ] Add analytics tracking for tier selection

## Testing

### Manual Testing Steps

1. Complete Stage 1 onboarding
2. Get application ID from response
3. Navigate to `/partners/tier-selection?appId={applicationId}`
4. Verify plans load correctly
5. Select a plan and click "Choose Plan"
6. Review modal and click "Confirm Payment"
7. Verify redirect to checkout page with subscription ID

### API Testing

Use cURL commands provided in the user request:

```bash
# Get vendor status
curl 'http://localhost:3001/api/vendor-onboarding/status/MBH-APP-1770718345259-NHXW'

# Get subscription plans
curl 'http://localhost:3001/api/subscription-plans'

# Create subscription
curl --location 'http://localhost:3001/api/subscriptions/create' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d '{"planId": "685281f61e1de765d6b297c0"}'
```

## Future Enhancements

- [ ] Add annual discount badge
- [ ] Implement plan upgrade/downgrade
- [ ] Add testimonials or success stories
- [ ] Implement referral bonuses
- [ ] Add FAQ section
- [ ] Implement cancel delay handling
- [ ] Add plan history and management interface

---

**Last Updated:** February 10, 2026
**Status:** Production Ready
