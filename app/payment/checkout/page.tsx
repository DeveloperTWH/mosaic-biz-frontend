// app/payment/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '@/app/components/ChekoutForm';

// Load Stripe with your publishable key
// Use a fallback to avoid undefined errors
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy'
);

export default function PaymentCheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('usd');
  const [isLoading, setIsLoading] = useState(true);

   // In app/payment/checkout/page.tsx - update the useEffect
 useEffect(() => {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const clientSecretParam = urlParams.get('clientSecret');
  const amountParam = urlParams.get('amount');
  const currencyParam = urlParams.get('currency');

  if (clientSecretParam) {
    setClientSecret(clientSecretParam);
    setAmount(Number(amountParam) || 0);
    setCurrency(currencyParam || 'usd');
    setIsLoading(false);
  } else {
    // Try sessionStorage
    const paymentData = sessionStorage.getItem('paymentData');
    if (paymentData) {
      const { clientSecret, amount, currency } = JSON.parse(paymentData);
      setClientSecret(clientSecret);
      setAmount(amount);
      setCurrency(currency);
      setIsLoading(false);
      // Clear the data
      sessionStorage.removeItem('paymentData');
    } else {
      console.error('No payment data found');
      setIsLoading(false);
    }
  }
}, []);



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-4">No payment information found.</p>
          <button
            onClick={() => window.location.href = '/vendor/onboarding'}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Return to Onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h1>
        
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Verification Fee</p>
              <p className="text-sm text-gray-500">One-time business verification</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-gray-900">
                ${(amount / 100).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">{currency.toUpperCase()}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <Elements 
            stripe={stripePromise} 
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#ea580c', // orange-600
                  borderRadius: '0.5rem',
                },
              },
            }}
          >
            <CheckoutForm />
          </Elements>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Secure payment powered by Stripe</p>
        </div>
      </div>
    </div>
  );
}