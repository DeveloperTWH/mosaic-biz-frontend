'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, Loader, CheckCircle, CreditCard, Lock } from 'lucide-react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { fetchSubscriptionPlans, getSubscriptionById } from '@/lib/api/subscription/subscriptionApi';
import { SubscriptionPlanResponse } from '@/types/subscription-response';
import { buildAppUrl } from '@/lib/url/appUrl';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface UserFormData {
  email: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
  cardHolderName: string;
}

// Spinner component with inline styles
const Spinner = () => (
  <svg 
    style={{ animation: 'spin 1s linear infinite', height: '1rem', width: '1rem' }} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Check icon component 
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="8" fill="#C9A962"/>
    <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Visa icon
const VisaIcon = () => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none" style={{ marginLeft: 'auto' }}>
    <rect width="32" height="20" rx="2" fill="white"/>
    <path d="M12.5 14H10L11.5 6H14L12.5 14Z" fill="#1A1F71"/>
    <path d="M20.5 6.2C20.1 6 19.5 5.8 18.8 5.8C17.2 5.8 16 6.7 16 8C16 9 16.8 9.5 17.4 9.8C18 10.1 18.2 10.3 18.2 10.6C18.2 11 17.8 11.2 17.4 11.2C16.8 11.2 16.2 11 15.8 10.7L15.5 10.5L15.2 12.4C15.7 12.7 16.5 12.9 17.3 12.9C19 12.9 20.2 12 20.2 10.6C20.2 9.8 19.7 9.2 18.8 8.8C18.2 8.5 17.9 8.3 17.9 8C17.9 7.7 18.2 7.4 18.8 7.4C19.3 7.4 19.7 7.5 20 7.7L20.2 7.8L20.5 6.2Z" fill="#1A1F71"/>
    <path d="M23.5 6H21.8C21.4 6 21.1 6.1 20.9 6.5L17.5 14H19.8L20.3 12.5H23.2L23.5 14H25.5L23.5 6ZM21.8 10.8L22.8 8L23.3 10.8H21.8Z" fill="#1A1F71"/>
    <path d="M9.5 6L7.3 11.8L7 10.5C6.5 9 5.2 7.4 3.8 6.5L6.1 14H8.4L12 6H9.5Z" fill="#1A1F71"/>
    <path d="M6.5 6H3L3 6.2C5.8 6.9 7.8 8.8 8.5 11L8 6.5C7.9 6.1 7.6 6 7.2 6H6.5Z" fill="#F7B600"/>
  </svg>
);

// Mastercard icon
const MastercardIcon = () => (
  <svg width="24" height="20" viewBox="0 0 24 20" fill="none" style={{ marginLeft: '8px' }}>
    <circle cx="6" cy="10" r="6" fill="#EB001B"/>
    <circle cx="14" cy="10" r="6" fill="#F79E1B"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M10 14.5C11.2 13.3 12 11.7 12 10C12 8.3 11.2 6.7 10 5.5C8.8 6.7 8 8.3 8 10C8 11.7 8.8 13.3 10 14.5Z" fill="#FF5F00"/>
  </svg>
);

// PayPal icon
const PayPalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4.5 13L5 10H3L3.5 7H5.5C6.5 7 7.5 6.5 7.8 5.5C8.1 4.5 7.5 3.5 6.5 3.5H3.5L2 12H4.5V13Z" fill="#003087"/>
    <path d="M10.5 3.5C9.5 3.5 8.5 4 8.2 5L6.5 13H9L9.5 10.5H11.5C13.5 10.5 15 9 15.5 7C16 5 14.5 3.5 12.5 3.5H10.5Z" fill="#0070E0"/>
  </svg>
);

// Main component with Suspense boundary
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader style={{ 
            width: '2rem', 
            height: '2rem', 
            color: '#1e3a8a', 
            animation: 'spin 1s linear infinite', 
            margin: '0 auto 1rem' 
          }} />
          <p style={{ color: '#6b7280' }}>Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

// Content component that uses useSearchParams
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get('subscriptionId');

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanResponse | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add spin animation
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('spin-animation');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'spin-animation';
        style.textContent = `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // Load subscription and plan data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const storedPlanId = sessionStorage.getItem('selectedPlanId');
        const storedSubscriptionData = sessionStorage.getItem('subscriptionData');

        if (storedSubscriptionData) {
          const parsed = JSON.parse(storedSubscriptionData);
          setClientSecret(parsed.clientSecret);
        }

        if (storedPlanId) {
          const plansRes = await fetchSubscriptionPlans();
          if (plansRes.success && plansRes.data) {
            const plan = plansRes.data.find((p) => p._id === storedPlanId);
            if (plan) {
              setSelectedPlan(plan);
            } else {
              setError('Selected plan not found.');
            }
          }
        }

        if (!storedSubscriptionData || !storedPlanId) {
          setError('No subscription data found. Please start from tier selection.');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load subscription details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [subscriptionId]);

  const features = [
    `${selectedPlan?.limits.productListings || 10} products`,
    `${selectedPlan?.limits.serviceListings || 5} services`,
    `${selectedPlan?.limits.foodListings || 5} foods`,
    `${selectedPlan?.limits.imageLimit || 10} images`,
    `${selectedPlan?.limits.videoLimit || 2} videos`,
    'Marketing tools',
    'Featured placement',
    'Search priority',
    'AI recommendations',
  ];

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader style={{ width: '2rem', height: '2rem', color: '#1e3a8a', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !clientSecret || !selectedPlan) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
          <AlertCircle style={{ width: '3rem', height: '3rem', color: '#ef4444', margin: '0 auto 1rem' }} />
          <p style={{ textAlign: 'center', color: '#374151' }}>{error || 'Missing payment information'}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
            Activate Your Plan
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
          {/* Left Column - Plan Details */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', marginBottom: '1.5rem' }}>Selected Plan</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.25rem' }}>
                {selectedPlan.name}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Everything You Need To Begin</p>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {features.map((feature, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Total Price Box */}
            <div style={{ backgroundColor: '#fefce8', borderRadius: '0.5rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Total Price</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Billed Annually</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1e3a8a' }}>${selectedPlan.price}</span>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>/Year</span>
              </div>
            </div>
          </div>

          {/* Right Column - Stripe Payment */}
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripePaymentForm plan={selectedPlan} />
          </Elements>
        </div>
      </div>
    </div>
  );
}

// Stripe Payment Form Component
function StripePaymentForm({ plan }: { plan: SubscriptionPlanResponse }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: buildAppUrl('/partners/tier-selection/success'),
        },
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
        setIsProcessing(false);
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', marginBottom: '1.5rem' }}>Secure Payment</h2>

      <form onSubmit={handleSubmit}>
        <PaymentElement />

        {/* Order Summary */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sub Total</span>
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>${plan.price}.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tax</span>
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>$0.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Total Amount</span>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>${plan.price}.00</span>
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '0.375rem', marginTop: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#dc2626', textAlign: 'center' }}>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '0.875rem',
            backgroundColor: '#C9A962',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            opacity: isProcessing ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          {isProcessing && <Spinner />}
          {isProcessing ? 'Processing...' : `Pay $${plan.price}`}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
          <Lock size={14} style={{ color: '#9ca3af' }} />
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Your payment is secured & encrypted</span>
        </div>
      </form>
    </div>
  );
}
