'use client';

import { useEffect } from 'react';

export default function PaymentPage() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const clientSecret = urlParams.get('clientSecret');
    const amount = urlParams.get('amount');
    const currency = urlParams.get('currency');

    if (clientSecret) {
      window.location.href = `/payment/checkout?clientSecret=${clientSecret}&amount=${amount}&currency=${currency}`;
    } else {
      window.location.href = '/partners/business/new?error=payment_failed';
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to payment...</p>
      </div>
    </div>
  );
}
