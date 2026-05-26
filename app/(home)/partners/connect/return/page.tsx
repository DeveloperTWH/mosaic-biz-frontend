"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function StripeConnectReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const businessId = searchParams.get("businessId");
    const query = new URLSearchParams({ refresh: "1" });

    if (businessId) {
      query.set("businessId", businessId);
    }

    router.replace(`/partners/payout-setup?${query.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-4">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-stone-300 border-t-blue-900" />
        <p className="mt-4 text-sm font-medium text-slate-600">
          Returning from Stripe...
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <StripeConnectReturnPage />
    </Suspense>
  );
}
