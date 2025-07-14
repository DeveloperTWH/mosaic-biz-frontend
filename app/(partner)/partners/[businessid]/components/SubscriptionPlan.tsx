// components/partners/SubscriptionPlan.tsx
'use client';

import React from 'react';
import { BadgeCheck } from 'lucide-react';

const SubscriptionPlan = () => {
  return (
    <div className="p-6 bg-white rounded shadow h-fit">
      <h3 className="mb-4 text-lg font-semibold">Subscription Plan</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Current Plan</p>
          <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
            Pro Plan
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <BadgeCheck className="w-4 h-4 text-green-500" />
          <p className="text-sm text-gray-600">20 Product Listings</p>
        </div>
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-4 h-4 text-green-500" />
          <p className="text-sm text-gray-600">Advanced Analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-4 h-4 text-green-500" />
          <p className="text-sm text-gray-600">Priority Support</p>
        </div>
        <button className="w-full py-2 mt-4 text-sm text-white bg-black rounded hover:opacity-90">
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
