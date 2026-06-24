// app/payment/layout.tsx
import type { Metadata } from 'next';
import { getMetadataBase } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: 'Payment Processing',
  description: 'Secure payment processing',
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
