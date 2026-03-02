'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader } from 'lucide-react';
import { SubscriptionPlanResponse } from '@/types/subscription-response';

interface CheckoutFormProps {
  plan: SubscriptionPlanResponse;
}

export default function CheckoutForm({ plan }: CheckoutFormProps) {
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
          return_url: `${window.location.origin}/partners/tier-selection/success`,
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
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#fefce8', borderRadius: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>{plan.name} Plan</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a8a' }}>
            ${plan.price}/year
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <PaymentElement />

        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '0.375rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#dc2626' }}>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          style={{
            width: '100%',
            marginTop: '1.5rem',
            padding: '0.875rem',
            backgroundColor: '#C9A962',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            opacity: isProcessing ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          {isProcessing && <Loader className="animate-spin" size={16} />}
          {isProcessing ? 'Processing...' : `Pay $${plan.price}`}
        </button>
      </form>
    </div>
  );
}
