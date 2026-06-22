'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { stripePromise } from '@/utils/stripe';
import type { StripeError, PaymentIntent } from '@stripe/stripe-js';
import { Suspense } from 'react';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent }: { error?: StripeError; paymentIntent?: PaymentIntent } =
      await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/payment-success`,
        },
      });

    if (error) {
      setStatus(`❌ Payment failed: ${error.message}`);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      setStatus('✅ Payment successful!');
    } else {
      setStatus('➡️ Redirecting to complete payment...');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <PaymentElement />
      <button
        type="submit"
        className="btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!stripe}
      >
        Pay
      </button>
      <p className="font-montserrat text-sm text-brand-muted">{status}</p>
    </form>
  );
}

function CheckoutClient() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get('clientSecret') || '';

  if (!clientSecret) return <p className="text-center">Missing client secret</p>;

  return (
    <div className="commerce-shell p-8">
      <h1 className="mb-4 font-poppins text-xl font-bold text-brand-navy">Checkout</h1>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

// app/(home)/checkout/page.tsx


export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="text-center">Loading checkout...</p>}>
      <CheckoutClient />
    </Suspense>
  );
}
