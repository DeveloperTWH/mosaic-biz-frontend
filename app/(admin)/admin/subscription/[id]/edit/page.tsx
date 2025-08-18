'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { api } from '@/lib/api';
import SubscriptionPlanForm from '../../_components/SubscriptionPlanForm';
import LoadingSpinner from '../../_components/LoadingSpinner';
import type { SubscriptionPlan } from '@/types/subscription';
import Sidebar from '../../../components/Sidebar';
import Topbar from '../../../components/Topbar';

type PlanEnvelope = { success: boolean; plan: SubscriptionPlan };

export default function EditPlanPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const planId = params?.id;

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);

    const loadPlan = useCallback(async () => {
        if (!planId) return;
        setLoading(true);
        try {
            // ✅ fixed to admin endpoint
            const { data } = await api.get<SubscriptionPlan>(`/api/subscription-plans/${planId}`);
            const normalized = (data as any)?.plan ?? (data as any); // unwrap if needed
            setPlan(normalized as SubscriptionPlan);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to load plan');
            setPlan(null);
        } finally {
            setLoading(false);
        }
    }, [planId]);

    useEffect(() => {
        loadPlan();
    }, [loadPlan]);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar setIsSidebarOpen={setSidebarOpen} />
                <main className="flex-1 px-8 py-6 overflow-y-auto">
                    {/* Breadcrumb / Header */}
                    <div className="mb-4 text-sm text-gray-500">
                        <Link href="/admin/subscription" className="hover:underline">Subscription Plans</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-700">Edit</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Edit Subscription Plan</h1>
                    </div>

                    {/* Meta card */}
                    {!loading && plan && (
                        <>
                            <div className="p-4 pb-0 bg-white border rounded-lg">
                                <h3 className="mb-2 text-sm font-medium text-gray-700">Note</h3>
                                <p className="text-sm text-gray-600">
                                    Changing price/currency/interval/trial creates a <b>new Stripe Price</b>. Existing subscribers stay on the old price.
                                </p>
                            </div>
                            <section className="grid gap-4 mt-4 md:grid-cols-2">
                                <div className="p-4 bg-white border rounded-lg">
                                    <h3 className="mb-2 text-sm font-medium text-gray-700">Identifiers</h3>
                                    <dl className="space-y-1 text-sm text-gray-600">
                                        <div><dt className="inline text-gray-500">Plan ID:</dt> <dd className="inline">{plan._id}</dd></div>
                                        <div><dt className="inline text-gray-500">Stripe Product:</dt> <dd className="inline">{plan.stripeProductId || '—'}</dd></div>
                                        <div><dt className="inline text-gray-500">Stripe Price:</dt> <dd className="inline">{plan.stripePriceId || '—'}</dd></div>
                                    </dl>
                                </div>
                                <div className="p-4 bg-white border rounded-lg">
                                    <h3 className="mb-2 text-sm font-medium text-gray-700">Timestamps</h3>
                                    <dl className="space-y-1 text-sm text-gray-600">
                                        <div><dt className="inline text-gray-500">Created:</dt> <dd className="inline">{new Date(plan.createdAt).toLocaleString()}</dd></div>
                                        <div><dt className="inline text-gray-500">Updated:</dt> <dd className="inline">{new Date(plan.updatedAt).toLocaleString()}</dd></div>
                                    </dl>
                                </div>
                            </section>
                        </>
                    )}

                    <div className="mt-6">
                        {loading && <LoadingSpinner label="Loading plan..." />}

                        {!loading && !plan && (
                            <div className="p-8 text-center text-gray-500 bg-white border rounded">
                                Plan not found.
                            </div>
                        )}

                        {!loading && plan && (
                            <SubscriptionPlanForm
                                mode="edit"
                                initial={plan}
                                submitPath={`/api/subscription-plans/${plan._id}`}
                                method="PUT"
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
