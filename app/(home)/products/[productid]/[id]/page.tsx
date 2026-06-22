'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AccountLoadingBlock from '@/components/ui/account-loading-block';

/**
 * Legacy route: /products/[productid]/[id]
 * Canonical live product detail is /product/[id].
 */
export default function LegacyProductDetailRedirect() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id) {
      router.replace(`/product/${id}`);
      return;
    }
    router.replace('/products');
  }, [id, router]);

  return (
    <div className="commerce-shell py-12">
      <AccountLoadingBlock label="Redirecting to product…" minHeight="min-h-[40vh]" />
    </div>
  );
}
