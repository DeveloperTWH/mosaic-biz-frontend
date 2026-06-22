'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { stripePromise } from '@/utils/stripe';
import type { StripeError, PaymentIntentResult, PaymentIntent } from '@stripe/stripe-js';

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>('');
  const [amount, setAmount] = useState<number | null>(null);
  const source = searchParams.get('source') || 'cart';

  useEffect(() => {
    const fetchIntent = async () => {
      if (!stripe || !clientSecret) return;
      console.log('[checkout-payment] retrieving payment intent', {
        clientSecret,
      });
      const result: PaymentIntentResult = await stripe.retrievePaymentIntent(clientSecret);
      console.log('[checkout-payment] retrievePaymentIntent result', result);
      if (result.paymentIntent) {
        setAmount(result.paymentIntent.amount || 0);
      }
    };
    fetchIntent();
  }, [stripe, clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      console.warn('[checkout-payment] stripe or elements not ready', {
        stripeReady: Boolean(stripe),
        elementsReady: Boolean(elements),
      });
      return;
    }

    console.log('[checkout-payment] confirming payment', {
      clientSecret,
      source,
      returnUrl: `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/payment-success?source=${encodeURIComponent(source)}`,
    });

    const { error, paymentIntent }: { error?: StripeError; paymentIntent?: PaymentIntent } =
      await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/payment-success?source=${encodeURIComponent(source)}`,
        },
      });

    console.log('[checkout-payment] confirmPayment result', {
      error,
      paymentIntent,
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
      {amount !== null && (
        <div className="commerce-price-primary mb-2 text-center">
          Total: ${(amount / 100).toFixed(2)}
        </div>
      )}
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

  useEffect(() => {
    console.log('[checkout-payment] page loaded', {
      clientSecret,
      groupOrderId: searchParams.get('groupOrderId'),
      source: searchParams.get('source'),
    });
  }, [clientSecret, searchParams]);

  if (!clientSecret) return <p className="text-center">Missing client secret</p>;

  return (
    <div className="commerce-shell p-8">
      <h1 className="mb-4 font-poppins text-xl font-bold text-brand-navy">Checkout</h1>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm clientSecret={clientSecret} />
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
