// page.tsx — still a Server Component
import { Suspense } from 'react';
import ClientForm from './ClientForm';
import AccountLoadingBlock from '@/components/ui/account-loading-block';

export default function Page() {
  return (
    <Suspense fallback={<AccountLoadingBlock label="Loading checkout…" minHeight="min-h-[40vh]" />}>
      <ClientForm />
    </Suspense>
  );
}
