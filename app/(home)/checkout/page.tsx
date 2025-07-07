'use client';

import { useState, useEffect } from 'react';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { stripePromise } from '../../../utils/stripe';
import type { StripeError, PaymentIntent } from '@stripe/stripe-js';

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
          return_url: 'https://yourdomain.com/payment-success', // Required for redirect-based flows
        },
      });

    if (error) {
      setStatus(`❌ Payment failed: ${error.message}`);
      return;
    }

    // Only check paymentIntent if it's present (for non-redirect payment methods)
    if (paymentIntent?.status === 'succeeded') {
      setStatus('✅ Payment successful!');
    } else {
      setStatus('➡️ Redirecting to complete payment...'); // For UPI, wallets, etc.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <PaymentElement />
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        disabled={!stripe}
      >
        Pay
      </button>
      <p className="text-sm text-gray-600">{status}</p>
    </form>
  );
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string>('');

  // Create PaymentIntent on mount
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        console.log("inside");
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/create-payment-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 100,
            currency: 'usd',
            orderId: '64f3b2c7e91a4d86e93d82a1',
          }),
        });
        const data = await response.json();
        console.log(data);
        
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error creating PaymentIntent:', err);
      }
    };

    createPaymentIntent();
  }, []);

  if (!clientSecret) return <p className="text-center">Initializing payment...</p>;

  return (
    <div className="p-8">
      <h1 className="mb-4 text-xl font-bold">Checkout</h1>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
