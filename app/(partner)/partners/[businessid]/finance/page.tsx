"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useBusinessStore } from '@/app/store/businessStore';
import { fetchBusinessBySlug } from '../utils/fetchBusiness';
import { useParams } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import LoadingPage from '../components/LoadingPage';
import NotFoundPage from '../components/NotFoundPage';

import { loadConnectAndInitialize, type StripeConnectInstance } from '@stripe/connect-js';
import { ConnectComponentsProvider, ConnectPayments, ConnectPayouts } from '@stripe/react-connect-js';
import { ExternalLink } from 'lucide-react';


const page = () => {
    const { businessid } = useParams();
    const { business, setBusiness, clearBusiness } = useBusinessStore();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<{
        available?: { amount: number; currency: string };
        pending?: { amount: number; currency: string };
        lastPayout?: { amount: number; currency: string; arrival_date: number } | null;
    } | null>(null);

    const [connectInstance, setConnectInstance] = useState<StripeConnectInstance | null>(null);
    const [connectLoading, setConnectLoading] = useState(false);

    const publishableKey = useMemo(() => process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "", []);
    const apiBase = useMemo(() => process.env.NEXT_PUBLIC_API_BASE_URL || "", []);

    const currentAccountId = useMemo(() => {
        return (business as any)?.stripeConnectAccountId || null;
    }, [business]);


    const handleOpenDashboard = async () => {
        try {
            if (!currentAccountId) {
                setError('Stripe account not linked to this business.');
                return;
            }
            const res = await fetch(`${apiBase}/stripe/express-login-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ account: currentAccountId }),
            });
            const data = await res.json();
            if (!res.ok || !data?.url) {
                throw new Error(data?.error || 'Failed to get dashboard link');
            }
            window.open(data.url, '_blank', 'noopener,noreferrer');
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Could not open Stripe dashboard');
        }
    };


    // ✅ Load Business
    useEffect(() => {
        if (!businessid) return;

        const loadBusiness = async () => {
            try {
                if (business && business.slug === businessid) return;
                if (business && business.slug !== businessid) clearBusiness();

                const fetchedBusiness = await fetchBusinessBySlug(businessid as string);
                setBusiness(fetchedBusiness);
            } catch (err: any) {
                console.error('Error loading business:', err);
                setError('Failed to load business');
            } finally {
                setIsLoading(false);
            }
        };

        loadBusiness();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessid]);


    // 2) Initialize Stripe Connect AFTER business + env are ready
    useEffect(() => {
        const initStripe = async () => {
            try {
                if (!publishableKey || !apiBase || !currentAccountId) return;
                if (connectInstance || connectLoading) return;

                setConnectLoading(true);

                const instance = loadConnectAndInitialize({
                    publishableKey,
                    fetchClientSecret: async () => {
                        // Defensive: ensure we have base URL
                        if (!apiBase) {
                            setError('API base URL is not configured');
                            return undefined;
                        }

                        const res = await fetch(`${apiBase}/stripe/account-session`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ account: currentAccountId, components: ['payments', 'payouts'] })
                        });

                        // Some backends return HTML on error; parse safely
                        const ct = res.headers.get('content-type') || '';
                        if (!res.ok) {
                            let msg = `HTTP ${res.status}`;
                            if (ct.includes('application/json')) {
                                const j = await res.json().catch(() => ({}));
                                msg = j?.error || msg;
                            } else {
                                const t = await res.text().catch(() => '');
                                msg = t?.slice(0, 200) || msg;
                            }
                            setError(`Stripe session error: ${msg}`);
                            return undefined;
                        }

                        const payload = ct.includes('application/json')
                            ? await res.json()
                            : { client_secret: undefined };

                        return payload?.client_secret;
                    },
                });

                setConnectInstance(instance);
            } catch (e: any) {
                console.error('Stripe init error:', e);
                setError(e.message || 'Stripe init failed');
            } finally {
                setConnectLoading(false);
            }
        };

        initStripe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publishableKey, apiBase, currentAccountId, connectInstance, connectLoading]);



    const fmtMoney = (amt?: number, cur?: string) =>
        (amt == null || !cur)
            ? '—'
            : new Intl.NumberFormat(undefined, { style: 'currency', currency: cur.toUpperCase() }).format(amt / 100);

    useEffect(() => {
        const loadStats = async () => {
            try {
                if (!currentAccountId || !apiBase) return;

                const [balRes, payoutRes] = await Promise.all([
                    fetch(`${apiBase}/stripe/account-balance?account=${currentAccountId}`, { credentials: 'include' }),
                    fetch(`${apiBase}/stripe/last-payout?account=${currentAccountId}`, { credentials: 'include' }),
                ]);

                const parse = async (res: Response) => {
                    const ct = res.headers.get('content-type') || '';
                    if (ct.includes('application/json')) return res.json();
                    const text = await res.text();
                    throw new Error(`Non-JSON response: ${res.status} ${text.slice(0, 200)}`);
                };

                const bal = await parse(balRes);
                const last = await parse(payoutRes);

                setStats({
                    available: bal?.available ?? undefined,
                    pending: bal?.pending ?? undefined,
                    lastPayout: last?.payout ?? null,
                });
            } catch (e) {
                console.error('loadStats error:', e);
                // harmless: leave placeholders
            }
        };

        loadStats();
    }, [currentAccountId, apiBase]);





    return (
        <div className="flex h-screen bg-[#EBEAE2]">
            <Sidebar businessName={business?.businessName} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 p-2 space-y-6 overflow-y-auto lg:p-6">
                    {isLoading && (
                        <LoadingPage />
                    )}

                    {error && (
                        <NotFoundPage />
                    )}
                    {/* Finance: Payments & Payouts via Stripe Connect embedded components */}
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl font-semibold md:text-2xl text-neutral-900">Transactions &amp; Payouts</h1>
                        <p className="text-sm text-neutral-600">Review payments, monitor payouts, and manage your Stripe account for this business.</p>
                    </div>

                    {/* Quick stats (placeholders; wire later if needed) */}
                    {/* Quick stats (live) */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="p-4 bg-white border rounded-2xl border-neutral-200">
                            <p className="mb-1 text-xs tracking-wide uppercase text-neutral-500">Next Payout (ETA)</p>
                            <p className="text-lg font-semibold text-neutral-900">
                                {stats?.lastPayout?.arrival_date
                                    ? new Date(stats.lastPayout.arrival_date * 1000).toLocaleString()
                                    : '—'}
                            </p>
                            <p className="mt-1 text-xs text-neutral-500">
                                {stats?.lastPayout
                                    ? `Last payout: ${fmtMoney(stats.lastPayout.amount, stats.lastPayout.currency)}`
                                    : 'No payout yet'}
                            </p>
                        </div>

                        <div className="p-4 bg-white border rounded-2xl border-neutral-200">
                            <p className="mb-1 text-xs tracking-wide uppercase text-neutral-500">Available Balance</p>
                            <p className="text-lg font-semibold text-neutral-900">
                                {fmtMoney(stats?.available?.amount, stats?.available?.currency)}
                            </p>
                        </div>

                        <div className="p-4 bg-white border rounded-2xl border-neutral-200">
                            <p className="mb-1 text-xs tracking-wide uppercase text-neutral-500">Pending Balance</p>
                            <p className="text-lg font-semibold text-neutral-900">
                                {fmtMoney(stats?.pending?.amount, stats?.pending?.currency)}
                            </p>
                        </div>
                    </div>


                    {/* Finance: Payments & Payouts via Stripe Connect embedded components */}
                    {connectInstance ? (
                        <ConnectComponentsProvider connectInstance={connectInstance}>
                            <div className="grid grid-cols-1 gap-6">
                                <section className="p-4 bg-white border shadow-sm rounded-2xl border-neutral-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-lg font-semibold">Payments</h2>
                                        <span className="text-xs text-neutral-500">Powered by Stripe</span>
                                    </div>
                                    <div className="overflow-hidden border rounded-xl border-neutral-200">
                                        <ConnectPayments />
                                    </div>
                                </section>

                                <section className="p-4 bg-white border shadow-sm rounded-2xl border-neutral-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-lg font-semibold">Payouts</h2>
                                        <span className="text-xs text-neutral-500">Powered by Stripe</span>
                                    </div>
                                    <div className="overflow-hidden border rounded-xl border-neutral-200">
                                        <ConnectPayouts />
                                    </div>
                                </section>
                            </div>
                        </ConnectComponentsProvider>
                    ) : (
                        !isLoading && !error && (publishableKey && currentAccountId) && (
                            <div className="p-6 text-sm bg-white border border-dashed rounded-xl border-neutral-300 text-neutral-500">
                                {connectLoading ? 'Stripe is initializing…' : 'Unable to initialize Stripe (check API base URL / session).'}
                            </div>
                        )
                    )}

                    {/* Sticky footer action */}
                    <div className="sticky bottom-0 left-0 right-0 mt-6">
                        <div className="backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white border-t border-neutral-200 px-3 py-3 md:px-6 md:py-4 rounded-t-2xl shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-xs text-neutral-600">
                                    Need advanced settings? Open the Stripe dashboard for this account.
                                </div>
                                <button
                                    onClick={handleOpenDashboard}
                                    disabled={!currentAccountId}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition rounded-xl disabled:opacity-50 disabled:cursor-not-allowed bg-neutral-900 hover:bg-neutral-800"
                                    aria-label="Open Stripe Connect Dashboard"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Open Connect Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
export default page