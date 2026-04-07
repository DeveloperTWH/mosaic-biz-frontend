"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  RefreshCcw,
} from "lucide-react";
import {
  createBusinessConnectAccountLink,
  getBusinessConnectStatus,
  type StripeConnectStatus,
} from "@/lib/api/stripeConnect";

type Business = {
  _id: string;
  businessName: string;
  slug: string;
  listingType?: "product" | "service" | "food";
  stripeConnectAccountId?: string;
  isActive?: boolean;
};

const Page = () => {
  const searchParams = useSearchParams();

  const [business, setBusiness] = useState<Business | null>(null);
  const [status, setStatus] = useState<StripeConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBusiness = useCallback(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/my`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Failed to load your business");
    }

    const businesses: Business[] = Array.isArray(data?.businesses) ? data.businesses : [];
    const currentBusiness = businesses.find((item) => item.isActive) ?? businesses[0] ?? null;

    if (!currentBusiness) {
      throw new Error("No business found for this account");
    }

    setBusiness(currentBusiness);
    return currentBusiness;
  }, []);

  const loadStatus = useCallback(async (businessId: string, mode: "initial" | "refresh" = "initial") => {
    if (mode === "refresh") {
      setRefreshing(true);
    }

    try {
      const nextStatus = await getBusinessConnectStatus(businessId);
      setStatus(nextStatus);
      setError(null);
    } catch (nextError: any) {
      setStatus(null);
      setError(nextError?.message || "Failed to load Stripe Connect status");
    } finally {
      if (mode === "refresh") {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        setLoading(true);
        const currentBusiness = await loadBusiness();
        if (!mounted) return;
        await loadStatus(currentBusiness._id);
      } catch (nextError: any) {
        if (!mounted) return;
        setError(nextError?.message || "Unable to prepare Stripe Connect setup");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [loadBusiness, loadStatus]);

  useEffect(() => {
    const refreshFlag = searchParams.get("refresh");
    if (refreshFlag !== "1" || !business?._id) {
      return;
    }

    loadStatus(business._id, "refresh");
  }, [business?._id, loadStatus, searchParams]);

  const isConnected = Boolean(status?.isConnected && status?.chargesEnabled && status?.payoutsEnabled);
  const onboardingComplete = status?.onboardingStatus === "completed";
  const hasIssues = Boolean(status?.disabledReason || status?.currentlyDue.length);

  const handleStartOrContinue = async () => {
    if (!business?._id) {
      setError("Business information is not available");
      return;
    }

    try {
      setLaunching(true);
      setError(null);
      const { url } = await createBusinessConnectAccountLink(business._id);
      window.location.assign(url);
    } catch (nextError: any) {
      setError(nextError?.message || "Could not open Stripe onboarding");
      setLaunching(false);
    }
  };

  const handleRefresh = async () => {
    if (!business?._id) {
      return;
    }

    await loadStatus(business._id, "refresh");
  };

  const statusItems = [
    {
      label: "Connection",
      value: Boolean(status?.isConnected),
      detail: status?.isConnected ? "Connected" : "Not connected",
    },
    {
      label: "Onboarding",
      value: onboardingComplete || Boolean(status?.detailsSubmitted),
      detail: status?.onboardingStatus ? status.onboardingStatus : "Not started",
    },
    {
      label: "Charges enabled",
      value: Boolean(status?.chargesEnabled),
      detail: status?.chargesEnabled ? "Enabled" : "Pending",
    },
    {
      label: "Payouts enabled",
      value: Boolean(status?.payoutsEnabled),
      detail: status?.payoutsEnabled ? "Enabled" : "Pending",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-10 w-72 rounded bg-stone-200" />
          <div className="h-40 rounded-3xl bg-white/80" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-48 rounded-3xl bg-white/80" />
            <div className="h-48 rounded-3xl bg-white/80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Stripe Connect
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Payout setup
          </h1>
          <p className="text-sm text-slate-600">
            Connect your Stripe account to receive payouts.
          </p>
        </div>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-slate-700">
                <Building2 className="h-4 w-4" />
                {business?.businessName || "Business"}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {isConnected ? "Stripe account is ready" : "Finish your Stripe onboarding"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {isConnected
                    ? "Your business can now receive payouts."
                    : "Complete the setup once and Stripe will handle the rest."}
                </p>
              </div>
            </div>

            <div
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${
                isConnected
                  ? "bg-green-100 text-green-700"
                  : hasIssues
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {isConnected ? (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              ) : hasIssues ? (
                <AlertCircle className="mr-2 h-4 w-4" />
              ) : (
                <CreditCard className="mr-2 h-4 w-4" />
              )}
              {isConnected ? "Connected" : hasIssues ? "Action needed" : "In progress"}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {statusItems.map((item) => (
              <div key={item.label} className="rounded-2xl bg-[#F8F5EE] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">{item.label}</p>
                  {item.value ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  )}
                </div>
                <p className="mt-2 text-xs capitalize text-slate-500">{item.detail}</p>
              </div>
            ))}
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {status?.disabledReason ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {status.disabledReason}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleStartOrContinue}
              disabled={launching || !business?._id}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {launching ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
              {isConnected ? "Open Stripe" : "Connect Stripe"}
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing || !business?._id}
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <Link
              href="/partners"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-stone-50"
            >
              Back
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
