'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/lib/api';
import type { SubscriptionPlan } from '@/types/subscription';

type Props = {
  mode: 'create' | 'edit';
  initial?: Partial<SubscriptionPlan>;
  submitPath: string;   // POST or PUT endpoint
  method: 'POST' | 'PUT';
};

const defaultLimits = {
  productListings: 0,
  serviceListings: 0,
  foodListings: 0,
  imageLimit: 0,
  videoLimit: 0,
};

const defaultFeatures = {
  analyticsDashboard: false,
  marketingTools: false,
  featuredPlacement: false,
  supportLevel: 'none' as const,
  communityEventsAccess: false,
  searchPriority: false,
  listingPriority: false,
  pushNotifications: false,
  aiRecommendation: false,
};

type Errors = Record<string, string | null>;

export default function SubscriptionPlanForm({ mode, initial, submitPath, method }: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    price: initial?.price ?? 0,
    currency: (initial?.currency as string) ?? 'usd',
    interval: (initial?.interval as 'day' | 'week' | 'month' | 'year') ?? 'year',
    intervalCount: initial?.intervalCount ?? 1,
    trialPeriodDays: initial?.trialPeriodDays ?? 0,
    durationInDays: initial?.durationInDays ?? 365,
    limits: { ...defaultLimits, ...(initial?.limits ?? {}) },
    features: { ...defaultFeatures, ...(initial?.features ?? {}) },
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const setError = (key: string, msg: string | null) =>
    setErrors((e) => ({ ...e, [key]: msg }));

  const validateDecimal = (raw: string, min = 0) => {
    if (raw.trim() === '') return { ok: false, value: 0, error: 'Required' };
    if (!/^\d+(\.\d+)?$/.test(raw)) return { ok: false, value: 0, error: 'Enter a valid number' };
    const n = parseFloat(raw);
    if (!Number.isFinite(n)) return { ok: false, value: 0, error: 'Enter a valid number' };
    if (n < min) return { ok: false, value: min, error: `Must be ≥ ${min}` };
    return { ok: true, value: n, error: null };
  };

  const validateInt = (raw: string, min = 0) => {
    if (raw.trim() === '') return { ok: false, value: 0, error: 'Required' };
    if (!/^\d+$/.test(raw)) return { ok: false, value: 0, error: 'Enter a whole number' };
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n)) return { ok: false, value: 0, error: 'Enter a whole number' };
    if (n < min) return { ok: false, value: min, error: `Must be ≥ ${min}` };
    return { ok: true, value: n, error: null };
  };

  // draft strings for text inputs (so existing values show as text)
  const [draft, setDraft] = useState({
    price: String(form.price ?? 0),
    intervalCount: String(form.intervalCount ?? 1),
    trialPeriodDays: String(form.trialPeriodDays ?? 0),
    durationInDays: String(form.durationInDays ?? 365),
    limits: {
      productListings: String(form.limits.productListings ?? 0),
      serviceListings: String(form.limits.serviceListings ?? 0),
      foodListings: String(form.limits.foodListings ?? 0),
      imageLimit: String(form.limits.imageLimit ?? 0),
      videoLimit: String(form.limits.videoLimit ?? 0),
    },
  });

  // ⬇️ hydrate when `initial` changes (or arrives after fetch)
  const hydrateFromInitial = (src?: Partial<SubscriptionPlan>) => {
    console.log(src);
    
    const next = {
      name: src?.name ?? '',
      price: src?.price ?? 0,
      currency: (src?.currency as string) ?? 'usd',
      interval: (src?.interval as 'day' | 'week' | 'month' | 'year') ?? 'year',
      intervalCount: src?.intervalCount ?? 1,
      trialPeriodDays: src?.trialPeriodDays ?? 0,
      durationInDays: src?.durationInDays ?? 365,
      limits: { ...defaultLimits, ...(src?.limits ?? {}) },
      features: { ...defaultFeatures, ...(src?.features ?? {}) },
    };
    setForm(next);
    setDraft({
      price: String(next.price),
      intervalCount: String(next.intervalCount),
      trialPeriodDays: String(next.trialPeriodDays),
      durationInDays: String(next.durationInDays),
      limits: {
        productListings: String(next.limits.productListings),
        serviceListings: String(next.limits.serviceListings),
        foodListings: String(next.limits.foodListings),
        imageLimit: String(next.limits.imageLimit),
        videoLimit: String(next.limits.videoLimit),
      },
    });
    setErrors({});
  };

  useEffect(() => {
    console.log("initial" , initial);
    
    hydrateFromInitial(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?._id]); // key off id so switching between plans re-hydrates

  const handlePriceChange = (v: string) => {
    setDraft((d) => ({ ...d, price: v }));
    const res = validateDecimal(v, 0);
    setError('price', res.error);
    if (res.ok) setForm((f) => ({ ...f, price: res.value }));
  };

  const handleIntChange = (key: 'intervalCount' | 'trialPeriodDays' | 'durationInDays', v: string, min: number) => {
    setDraft((d) => ({ ...d, [key]: v }));
    const res = validateInt(v, min);
    setError(key, res.error);
    if (res.ok) setForm((f) => ({ ...f, [key]: res.value }));
  };

  const handleLimitChange = (key: keyof typeof defaultLimits, v: string) => {
    setDraft((d) => ({ ...d, limits: { ...d.limits, [key]: v } }));
    const res = validateInt(v, 0);
    setError(`limits.${key}`, res.error);
    if (res.ok) {
      setForm((f) => ({ ...f, limits: { ...f.limits, [key]: res.value } }));
    }
  };

  const canSubmit = useMemo(() => {
    if (!form.name.trim()) return false;
    if (Object.values(errors).some(Boolean)) return false;
    if (form.price < 0) return false;
    if (form.intervalCount < 1) return false;
    if (form.trialPeriodDays < 0) return false;
    if (form.durationInDays < 1) return false;
    return true;
  }, [form, errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error('Please fix validation errors.');
      return;
    }
    setSubmitting(true);
    try {
      if (method === 'POST') {
        await api.post(submitPath, form);
        toast.success('Plan created');
      } else {
        await api.put(submitPath, form);
        toast.success('Plan updated');
      }
      window.location.href = '/admin/subscription';
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Request failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* Basics */}
      <section className="p-4 bg-white border rounded-lg">
        <h3 className="mb-4 font-semibold">Basic Info</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block mb-1 text-sm font-medium">Name *</label>
            <input
              className="w-full px-3 py-2 border rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Pro, Business, etc."
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Price (major units) *</label>
            <input
              type="text"
              inputMode="decimal"
              className={`w-full rounded border px-3 py-2 ${errors.price ? 'border-red-500' : ''}`}
              value={draft.price}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="e.g. 99.99"
            />
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Currency</label>
            <select
              className="w-full px-3 py-2 border rounded"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              <option value="usd">USD</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Interval</label>
            <select
              className="w-full px-3 py-2 border rounded"
              value={form.interval}
              onChange={(e) => setForm({ ...form, interval: e.target.value as any })}
            >
              <option value="day">day</option>
              <option value="week">week</option>
              <option value="month">month</option>
              <option value="year">year</option>
            </select>
          </div>

          {/* <div>
            <label className="block mb-1 text-sm font-medium">Interval Count</label>
            <input
              type="text"
              inputMode="numeric"
              className={`w-full rounded border px-3 py-2 ${errors.intervalCount ? 'border-red-500' : ''}`}
              value={draft.intervalCount}
              onChange={(e) => handleIntChange('intervalCount', e.target.value, 1)}
              placeholder="≥ 1"
            />
            {errors.intervalCount && <p className="mt-1 text-xs text-red-600">{errors.intervalCount}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Trial Period (days)</label>
            <input
              type="text"
              inputMode="numeric"
              className={`w-full rounded border px-3 py-2 ${errors.trialPeriodDays ? 'border-red-500' : ''}`}
              value={draft.trialPeriodDays}
              onChange={(e) => handleIntChange('trialPeriodDays', e.target.value, 0)}
              placeholder="≥ 0"
            />
            {errors.trialPeriodDays && <p className="mt-1 text-xs text-red-600">{errors.trialPeriodDays}</p>}
          </div> */}

          <div>
            <label className="block mb-1 text-sm font-medium">Duration (days)</label>
            <input
              type="text"
              inputMode="numeric"
              className={`w-full rounded border px-3 py-2 ${errors.durationInDays ? 'border-red-500' : ''}`}
              value={draft.durationInDays}
              onChange={(e) => handleIntChange('durationInDays', e.target.value, 1)}
              placeholder="≥ 1"
            />
            {errors.durationInDays && <p className="mt-1 text-xs text-red-600">{errors.durationInDays}</p>}
          </div>
        </div>

        {mode === 'edit' && (
          <p className="mt-3 text-xs text-gray-500">
            Changing price/currency/interval/trial creates a <b>NEW Stripe Price</b>; existing subscribers stay on the old price.
          </p>
        )}
      </section>

      {/* Limits */}
      <section className="p-4 bg-white border rounded-lg">
        <h3 className="mb-4 font-semibold">Limits</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {(
            [
              ['productListings', 'Product Listings'],
              ['serviceListings', 'Service Listings'],
              ['foodListings', 'Food Listings'],
              ['imageLimit', 'Image Limit'],
              ['videoLimit', 'Video Limit'],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="block mb-1 text-sm font-medium">{label}</label>
              <input
                type="text"
                inputMode="numeric"
                className={`w-full rounded border px-3 py-2 ${errors[`limits.${key}`] ? 'border-red-500' : ''}`}
                value={(draft.limits as any)[key]}
                onChange={(e) => handleLimitChange(key as any, e.target.value)}
                placeholder="≥ 0"
              />
              {errors[`limits.${key}`] && (
                <p className="mt-1 text-xs text-red-600">{errors[`limits.${key}`]}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="p-4 bg-white border rounded-lg">
        <h3 className="mb-4 font-semibold">Features</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(
            [
              ['analyticsDashboard', 'Analytics Dashboard'],
              ['marketingTools', 'Marketing Tools'],
              ['featuredPlacement', 'Featured Placement'],
              ['communityEventsAccess', 'Community Events Access'],
              ['searchPriority', 'Search Priority'],
              ['listingPriority', 'Listing Priority'],
              ['pushNotifications', 'Push Notifications'],
              ['aiRecommendation', 'AI Recommendation'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={(form.features as any)[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    features: { ...form.features, [key]: e.target.checked },
                  })
                }
              />
              {label}
            </label>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-5">
          <label className="text-sm font-medium">Support Level : </label>
          <select
            className="px-3 py-2 w-[200px] border rounded"
            value={form.features.supportLevel}
            onChange={(e) =>
              setForm({
                ...form,
                features: { ...form.features, supportLevel: e.target.value as any },
              })
            }
          >
            <option value="none">none</option>
            <option value="community">community</option>
            <option value="email">email</option>
            <option value="priority">priority</option>
          </select>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting || !canSubmit}
          className="px-5 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Saving…' : mode === 'create' ? 'Create Plan' : 'Update Plan'}
        </button>
        
      </div>
    </form>
  );
}
