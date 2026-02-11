'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { SubscriptionPlanResponse, CreateSubscriptionResponse } from '@/types/subscription-response';
import { createSubscription } from '@/lib/api/subscription/subscriptionApi';

interface PaymentModalProps {
  plan: SubscriptionPlanResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: CreateSubscriptionResponse) => void;
  onError: (error: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  plan,
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleConfirmPayment = async () => {
    if (!plan) return;

    setLoading(true);
    setError(null);

    try {
      const response = await createSubscription({ planId: plan._id });
      setSuccess(true);
      onSuccess(response);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to create subscription. Please try again.';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="bg-blue-900 px-6 py-4 rounded-t-lg">
          <h2 className="text-xl font-bold text-white">Confirm Subscription</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Subscription Procesesing !
              </h3>
              <p className="text-gray-600 mb-2">
                You selected the <strong>{plan.name}</strong> plan
              </p>
              <p className="text-sm text-gray-500">
                Proceeding to payment...
              </p>
            </div>
          ) : error ? (
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Subscription Failed
              </h3>
              <p className="text-gray-600 text-sm mb-4">{error}</p>
              <button
                onClick={onClose}
                className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-gray-700 font-medium">{plan.name} Plan</span>
                  <span className="text-2xl font-bold text-blue-900">
                    ${plan.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Billed annually
                </p>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>✓ {plan.limits.productListings} Product Listings</p>
                    <p>✓ {plan.limits.serviceListings} Service Listings</p>
                    <p>✓ {plan.limits.foodListings} Food Listings</p>
                    <p>✓ Priority Support</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                By confirming, you agree to be charged <strong>${plan.price}</strong> per year. You can cancel anytime.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  {loading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
