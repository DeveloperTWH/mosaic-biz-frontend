"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import PlansTable from "./_components/PlansTable";
import LoadingSpinner from "./_components/LoadingSpinner";
import type { SubscriptionPlan } from "@/types/subscription";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const normalizePlans = (payload: any): SubscriptionPlan[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.docs)) return payload.docs;
  if (Array.isArray(payload?.data?.docs)) return payload.data.docs;
  return [];
};

const PlansListPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const router = useRouter();

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/subscription-plans");
      const list = normalizePlans(data);
      if (!Array.isArray(list)) {
        console.error("Unexpected plans payload:", data);
        toast.error("Unexpected response format from server.");
        setPlans([]);
      } else {
        setPlans(list);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || "Failed to load plans";
      toast.error(msg);
      if (status === 401) {
        // optional: redirect to login/admin
        // router.push("/login");
      }
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (mounted) await fetchPlans();
    })();
    return () => {
      mounted = false;
    };
  }, [fetchPlans]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar setIsSidebarOpen={setSidebarOpen} />

        <main className="flex-1 px-8 py-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Subscription Plans</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchPlans}
                disabled={loading}
                className="px-3 py-2 border rounded"
              >
                {loading ? "Refreshing…" : "Refresh"}
              </button>
              <Link
                href="/admin/subscription/new"
                className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
              >
                New Plan
              </Link>
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <LoadingSpinner label="Loading plans..." />
            ) : Array.isArray(plans) && plans.length > 0 ? (
              <PlansTable plans={plans} />
            ) : (
              <div className="p-8 text-center text-gray-500 bg-white border rounded">
                No plans yet. Click <b>New Plan</b> to create one.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlansListPage;
