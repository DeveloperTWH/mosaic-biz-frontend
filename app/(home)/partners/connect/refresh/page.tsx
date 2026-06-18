"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ExternalLink, RefreshCcw } from "lucide-react";
import {
  createBusinessConnectAccountLink,
  loadActiveBusinessId,
} from "@/lib/api/stripeConnect";

function StripeConnectRefreshPage() {
  const searchParams = useSearchParams();
  const queryBusinessId = searchParams.get("businessId");

  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loadingBusiness, setLoadingBusiness] = useState(true);
  const [restarting, setRestarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payoutSetupHref = useMemo(() => {
    if (!businessId) {
      return "/partners/payout-setup";
    }

    const query = new URLSearchParams({ refresh: "1", businessId });
    return `/partners/payout-setup?${query.toString()}`;
  }, [businessId]);

  const resolveBusiness = useCallback(async () => {
    try {
      setLoadingBusiness(true);
      setError(null);
      const resolvedId = await loadActiveBusinessId(queryBusinessId);
      setBusinessId(resolvedId);
    } catch (nextError: unknown) {
      setBusinessId(null);
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Unable to load your business for Stripe setup"
      );
    } finally {
      setLoadingBusiness(false);
    }
  }, [queryBusinessId]);

  useEffect(() => {
    resolveBusiness();
  }, [resolveBusiness]);

  const handleRestartSetup = async () => {
    if (!businessId || restarting) {
      return;
    }

    try {
      setRestarting(true);
      setError(null);
      const { url } = await createBusinessConnectAccountLink(businessId);
      window.location.assign(url);
    } catch (nextError: unknown) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Could not restart Stripe onboarding"
      );
      setRestarting(false);
    }
  };

  if (loadingBusiness) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-stone-300 border-t-blue-900" />
          <p className="mt-4 text-sm font-medium text-slate-600">
            Preparing Stripe setup recovery...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 space-y-2 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <AlertCircle className="h-6 w-6 text-amber-700" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Stripe setup session expired
          </h1>
          <p className="text-sm text-slate-600">
            Your Stripe onboarding link expired or was interrupted. Restart setup to
            continue connecting payouts for your business.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleRestartSetup}
            disabled={!businessId || restarting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {restarting ? (
              <RefreshCcw className="h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            {restarting ? "Opening Stripe..." : "Restart Stripe setup"}
          </button>

          {!businessId ? (
            <button
              type="button"
              onClick={resolveBusiness}
              disabled={loadingBusiness}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw className="h-4 w-4" />
              Try again
            </button>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-dashed border-stone-200 pt-6 text-sm sm:flex-row sm:justify-center">
          <Link
            href={payoutSetupHref}
            className="text-center font-medium text-blue-900 underline-offset-2 hover:underline"
          >
            Back to payout setup
          </Link>
          <Link
            href="/partners/dashboard"
            className="text-center font-medium text-slate-600 underline-offset-2 hover:underline"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-stone-300 border-t-blue-900" />
        </div>
      }
    >
      <StripeConnectRefreshPage />
    </Suspense>
  );
}
