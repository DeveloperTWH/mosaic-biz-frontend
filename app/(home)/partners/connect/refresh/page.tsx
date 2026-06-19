"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { createBusinessConnectAccountLink } from "@/lib/api/stripeConnect";

type Status = "loading" | "error";

function StripeConnectRefreshPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const retry = async (businessId: string) => {
    setStatus("loading");
    setError(null);
    try {
      const { url } = await createBusinessConnectAccountLink(businessId);
      window.location.assign(url);
    } catch (err: any) {
      setError(err?.message || "Could not restart Stripe onboarding");
      setStatus("error");
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/my`,
          { method: "GET", credentials: "include" }
        );
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.message || data?.error || "Failed to load business");
        }

        const businesses = Array.isArray(data?.businesses) ? data.businesses : [];
        const business = businesses.find((b: any) => b.isActive) ?? businesses[0] ?? null;

        if (!business?._id) {
          throw new Error("No business found for this account");
        }

        await retry(business._id);
      } catch (err: any) {
        setError(err?.message || "Unable to resume Stripe onboarding");
        setStatus("error");
      }
    };

    run();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-stone-300 border-t-blue-900" />
          <p className="mt-4 text-sm font-medium text-slate-600">
            Resuming Stripe onboarding...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-stone-200 bg-white p-8 shadow-sm text-center space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mx-auto">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h1 className="text-lg font-semibold text-slate-900">Onboarding interrupted</h1>
        <p className="text-sm text-slate-600">{error}</p>
        <div className="flex flex-col gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setStatus("loading");
              setError(null);
              // re-run full effect logic by reloading
              window.location.reload();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-800"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </button>
          <button
            type="button"
            onClick={() => router.push("/partners/payout-setup")}
            className="text-sm text-slate-500 hover:text-slate-700 transition"
          >
            Back to payout setup
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <StripeConnectRefreshPage />
    </Suspense>
  );
}
