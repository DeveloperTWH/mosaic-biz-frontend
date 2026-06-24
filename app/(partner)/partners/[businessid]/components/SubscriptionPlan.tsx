'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Subscription, SubscriptionPlantype } from '@/types/subscription';
import { DashboardStatusPill } from '@/components/ui/dashboard-primitives';

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

  const statusTone = subscription.status === 'active' ? 'success' : 'neutral';

  return (
    <div className="dashboard-card h-fit">
      <div className="flex flex-col gap-3 border-b border-dashboard-border-light pb-4">
        <div>
          <p className="dashboard-page-eyebrow">Plan</p>
          <h3 className="font-poppins text-xl font-semibold text-dashboard-text">Subscription Plan</h3>
        </div>
        <p className="font-montserrat text-sm leading-relaxed text-dashboard-muted">
        No hidden fees, deposit requirements, or exclusivity clauses
      </p>
        <DashboardStatusPill tone={statusTone}>
          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
        </DashboardStatusPill>
      </div>

      <div className="mt-4 space-y-3 font-montserrat text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-dashboard-muted">Plan</span>
          <span className="font-semibold text-dashboard-text">
            {subscriptionPlan.name}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-dashboard-muted">Billing Amount</span>
          <span className="font-semibold text-dashboard-text">
            ${subscriptionPlan.price} / Year
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-dashboard-muted">Valid Until</span>
          <span className="font-semibold text-dashboard-text">
            {formatDate(subscription.endDate)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-dashboard-muted">Payment Status</span>
          <span className="font-semibold text-dashboard-text">
            {subscription.paymentStatus}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-dashboard-muted">Joined</span>
          <span className="font-semibold text-dashboard-text">
            {formatDate(subscription.startDate)}
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-dashboard-border-light pt-4">
        {Object.entries(subscriptionPlan.features).map(([key, value]) =>
          typeof value === 'boolean' && value ? (
            <div key={key} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 shrink-0 text-brand-teal" />
              <p className="font-montserrat text-sm text-dashboard-text">
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
