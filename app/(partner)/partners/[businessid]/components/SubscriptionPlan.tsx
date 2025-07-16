'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Business } from '@/types/business';  // Import your Business type

interface SubscriptionPlanProps {
  business: Business;  // Define business prop type here
}

const SubscriptionPlan: React.FC<SubscriptionPlanProps> = ({ business }) => {
  return (
    <div className="p-6 bg-white rounded shadow h-fit">
      {/* Title & Subtitle */}
      <h3 className="text-xl font-bold">Subscription Plan</h3>
      <p className="text-sm text-gray-400">
        No hidden fees, deposit requirements, or exclusivity clauses
      </p>

      {/* Active Plan Badge */}
      <div className="inline-block px-3 py-1 mt-3 text-sm font-medium text-white rounded-full bg-gradient-to-r from-green-400 to-orange-400">
        Active Plan
      </div>

      {/* Plan Details */}
      <div className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Plan :</span>
          <span className="font-medium text-gray-800">Basic Plan</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Billing Amount :</span>
          <span className="font-medium text-gray-800">$120.00 / Month</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Valid Upto :</span>
          <span className="font-medium text-gray-800">12th July, 2026</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Payment Method :</span>
          <span className="font-medium text-gray-800">Credit Card</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Joined :</span>
          <span className="font-medium text-gray-800">12th July, 2025</span>
        </div>
      </div>

      {/* Features List */}
      <div className="mt-5 space-y-3">
        {[
          'Allowed Products – Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          'Customer Support – Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          'Business Plan – Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          'Product Promotion – Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        ].map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-black" />
            <p className="text-sm text-gray-700">{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
