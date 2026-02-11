'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface UserFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface SubscriptionData {
  subscriptionId?: string;
  planId?: string;
  amount?: number;
  currency?: string;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserFormData | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read from sessionStorage
    const storedUserData = sessionStorage.getItem('userFormData');
    const storedSubscriptionData = sessionStorage.getItem('subscriptionData');

    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (e) {
        console.warn('Failed to parse userFormData', e);
      }
    }

    if (storedSubscriptionData) {
      try {
        setSubscriptionData(JSON.parse(storedSubscriptionData));
      } catch (e) {
        console.warn('Failed to parse subscriptionData', e);
      }
    }

    // Clear sessionStorage after reading
    sessionStorage.removeItem('userFormData');
    sessionStorage.removeItem('subscriptionData');
    sessionStorage.removeItem('selectedPlanId');

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-2">
            Your subscription has been activated successfully.
          </p>
          <p className="text-gray-500">Thank you for choosing our service.</p>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-green-500 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Subscription Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* User Information */}
            {userData && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                  Account Holder
                </h3>
                <div className="space-y-2 text-sm">
                  {userData.firstName && userData.lastName && (
                    <p className="text-gray-900 font-medium">{userData.firstName} {userData.lastName}</p>
                  )}
                  {userData.email && (
                    <p className="text-gray-600">
                      <strong>Email:</strong> {userData.email}
                    </p>
                  )}
                  {userData.phone && (
                    <p className="text-gray-600">
                      <strong>Phone:</strong> {userData.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Subscription Information */}
            {subscriptionData && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                  Subscription
                </h3>
                <div className="space-y-2 text-sm">
                  {subscriptionData.subscriptionId && (
                    <p className="text-gray-600">
                      <strong>ID:</strong> <span className="font-mono text-xs">{subscriptionData.subscriptionId}</span>
                    </p>
                  )}
                  {subscriptionData.amount && (
                    <p className="text-gray-900 font-medium">
                      ${(subscriptionData.amount / 100).toFixed(2)} {subscriptionData.currency || 'USD'}
                    </p>
                  )}
                  <p className="text-gray-600">Billed annually</p>
                </div>
              </div>
            )}
          </div>

          {/* Confirmation Message */}
          {/* <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✓ A confirmation email has been sent to your email address. Your subscription is now active and you can start using all premium features.
            </p>
          </div> */}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/partners"
            className="flex-1 bg-gray-200 text-gray-900 py-4 px-6 rounded-lg hover:bg-gray-300 transition font-semibold text-center"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Questions? Check our{' '}
            <Link href="/faq" className="text-blue-600 hover:text-blue-700 font-semibold">
              FAQ
            </Link>
            {' '}or{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-semibold">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
