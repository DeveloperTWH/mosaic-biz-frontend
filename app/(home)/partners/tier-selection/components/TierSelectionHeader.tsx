'use client';

import React from 'react';
import { Zap, Shield, TrendingUp } from 'lucide-react';

interface TierSelectionHeaderProps {
  businessName?: string;
}

const TierSelectionHeader: React.FC<TierSelectionHeaderProps> = ({ businessName }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-6 rounded-lg mb-8">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-blue-100 text-lg mb-6">
          {businessName ? `Upgrade ${businessName} with the perfect subscription plan` : 'Select a subscription plan to unlock your potential'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Flexible Plans</h3>
              <p className="text-sm text-blue-100">Choose what works best for your business</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Secure Payment</h3>
              <p className="text-sm text-blue-100">Powered by Stripe for your security</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Grow Your Business</h3>
              <p className="text-sm text-blue-100">All features to scale your listings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierSelectionHeader;
