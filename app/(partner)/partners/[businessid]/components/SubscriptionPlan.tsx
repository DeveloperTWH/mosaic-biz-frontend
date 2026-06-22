'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Subscription, SubscriptionPlantype } from '@/types/subscription';

interface SubscriptionPlanProps {
  subscriptionPlan: SubscriptionPlantype | null;
  subscription: Subscription | null;
}

const SubscriptionPlan: React.FC<SubscriptionPlanProps> = ({
  subscriptionPlan,
  subscription,
}) => {
  if (!subscriptionPlan || !subscription) {
    return (
      <div className="dashboard-card h-fit">
        <h3 className="font-poppins text-xl font-bold text-dashboard-text">Subscription Plan</h3>
        <p className="mt-2 font-montserrat text-sm text-dashboard-muted">
          No active subscription found.
        </p>
      </div>
    );
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="p-6 bg-white rounded shadow h-fit">
      {/* Title & Subtitle */}
      <h3 className="text-xl font-bold">Subscription Plan</h3>
      <p className="text-sm text-gray-400">
        No hidden fees, deposit requirements, or exclusivity clauses
      </p>

      {/* Active Plan Badge */}
      <div
        className={`inline-block px-3 py-1 mt-3 text-sm font-medium text-white rounded-full ${
          subscription.status === 'active'
            ? 'bg-gradient-to-r from-green-400 to-orange-400'
            : 'bg-gray-400'
        }`}
      >
        {subscription.status.charAt(0).toUpperCase() +
          subscription.status.slice(1)}
      </div>

      {/* Plan Details */}
      <div className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Plan :</span>
          <span className="font-medium text-gray-800">
            {subscriptionPlan.name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Billing Amount :</span>
          <span className="font-medium text-gray-800">
            ${subscriptionPlan.price} / Year
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Valid Upto :</span>
          <span className="font-medium text-gray-800">
            {formatDate(subscription.endDate)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Payment Status :</span>
          <span className="font-medium text-gray-800">
            {subscription.paymentStatus}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Joined :</span>
          <span className="font-medium text-gray-800">
            {formatDate(subscription.startDate)}
          </span>
        </div>
      </div>

      {/* Features List */}
      <div className="mt-5 space-y-3">
        {Object.entries(subscriptionPlan.features).map(([key, value]) =>
          typeof value === 'boolean' && value ? (
            <div key={key} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-black" />
              <p className="text-sm text-gray-700">
                {key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())}
              </p>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
