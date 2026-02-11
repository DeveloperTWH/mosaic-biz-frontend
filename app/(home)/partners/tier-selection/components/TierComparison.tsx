'use client';

import React from 'react';
import { SubscriptionPlanResponse } from '@/types/subscription-response';

interface TierComparisonProps {
  plans: SubscriptionPlanResponse[];
}

const TierComparison: React.FC<TierComparisonProps> = ({ plans }) => {
  // Get all unique feature keys
  const allFeatures = [
    'analyticsDashboard',
    'marketingTools',
    'featuredPlacement',
    'searchPriority',
    'listingPriority',
    'pushNotifications',
    'aiRecommendation',
    'communityEventsAccess',
  ];

  const featureLabels: Record<string, string> = {
    analyticsDashboard: 'Analytics Dashboard',
    marketingTools: 'Marketing Tools',
    featuredPlacement: 'Featured Placement',
    searchPriority: 'Search Priority',
    listingPriority: 'Listing Priority',
    pushNotifications: 'Push Notifications',
    aiRecommendation: 'AI Recommendations',
    communityEventsAccess: 'Community Events Access',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-4 px-4 font-semibold text-gray-900">Features</th>
            {plans.map((plan) => (
              <th key={plan._id} className="text-center py-4 px-4 font-semibold text-gray-900">
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allFeatures.map((feature) => (
            <tr key={feature} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-4 font-medium text-gray-700">
                {featureLabels[feature] || feature}
              </td>
              {plans.map((plan) => (
                <td key={`${plan._id}-${feature}`} className="text-center py-4 px-4">
                  {plan.features[feature as keyof typeof plan.features] ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                      <span className="text-green-600 font-bold">✓</span>
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TierComparison;
