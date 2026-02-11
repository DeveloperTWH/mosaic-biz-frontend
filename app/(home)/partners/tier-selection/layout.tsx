import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Select Subscription Plan | Mosaic Biz',
  description: 'Choose the perfect subscription plan for your business and unlock powerful features.',
  keywords: ['subscription', 'plans', 'pricing', 'business'],
};

export default function TierSelectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
