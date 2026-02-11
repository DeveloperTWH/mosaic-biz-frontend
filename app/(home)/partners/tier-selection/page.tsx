'use client';
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Loader } from 'lucide-react';
import Link from 'next/link';
import TierCard from '../tier-selection/components/TierCard'; // Import the TierCard component
import { PaymentModal } from './components';
import {
  fetchSubscriptionPlans,
  getVendorOnboardingStatus,
} from '@/lib/api/subscription/subscriptionApi';
import { SubscriptionPlanResponse, CreateSubscriptionResponse } from '@/types/subscription-response';

const TierSelectionPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('appId');

  // State management
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);
        setStatusError(null);

        // Check onboarding status if applicationId is provided
        if (applicationId) {
          try {
            const statusResponse = await getVendorOnboardingStatus(applicationId);
            if (!statusResponse.success || !statusResponse.data.status?.includes('Stage 2')) {
              setStatusError(
                `You cannot access tier selection at this stage. Current status: ${statusResponse.data?.status}`
              );
              return;
            }
          } catch (err) {
            console.error('Error fetching status:', err);
            setStatusError('Unable to verify your application status. Please try again.');
          }
        }

        // Fetch subscription plans
        const plansResponse = await fetchSubscriptionPlans();
        if (plansResponse.success && plansResponse.data) {
          setPlans(plansResponse.data);
        } else {
          throw new Error('Failed to fetch subscription plans');
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load subscription plans. Please refresh the page.';
        setError(errorMessage);
        console.error('Error initializing data:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [applicationId]);

  // Handle plan selection
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setPaymentModalOpen(true);
  };

  // Handle successful subscription
  const handleSubscriptionSuccess = (data: CreateSubscriptionResponse) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('subscriptionData', JSON.stringify(data.data));
      sessionStorage.setItem('selectedPlanId', selectedPlanId || '');
    }

    setTimeout(() => {
      router.push(`/payment/checkout?subscriptionId=${data.data.subscriptionId}`);
    }, 2000);
  };

  // Get selected plan object
  const selectedPlan = plans.find((p) => p._id === selectedPlanId) || null;

  // Determine badge based on plan name
  const getBadge = (planName: string) => {
    if (planName.toLowerCase() === 'gold' || planName.toLowerCase() === 'standard') {
      return 'Recommended';
    }
    return undefined;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-900 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  // Status error state
  if (statusError) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-red-900 mb-2">Cannot Access</h2>
                <p className="text-red-700 mb-4">{statusError}</p>
                <Link
                  href="/partners"
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Back to Partners
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && plans.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-amber-900 mb-2">Error</h2>
                <p className="text-amber-700 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Simple Title */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="text-gray-600 mt-2">Select a subscription plan to get started</p>
        </div>

        {/* Plans Grid - Using TierCard Component */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-start">
          {plans.map((plan) => (
            <TierCard
              key={plan._id}
              plan={plan}
              isSelected={selectedPlanId === plan._id}
              isLoading={false}
              onSelect={handleSelectPlan}
              badge={getBadge(plan.name)}
            />
          ))}
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/partners" className="text-gray-600 hover:text-gray-900 font-medium">
            ← Back to Partners
          </Link>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        plan={selectedPlan}
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={handleSubscriptionSuccess}
        onError={(error) => console.error('Subscription error:', error)}
      />
    </div>
  );
};

export default TierSelectionPage;