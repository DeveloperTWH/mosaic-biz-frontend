// page.tsx — still a Server Component
import { Suspense } from 'react';
import ClientForm from './ClientForm';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientForm />
    </Suspense>
  );
}
