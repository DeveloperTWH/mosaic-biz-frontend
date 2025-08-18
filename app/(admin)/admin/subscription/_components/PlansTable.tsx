'use client';

import Link from 'next/link';
import { formatMoneyInterval, createdOn } from '@/lib/planFormat';
import type { SubscriptionPlan } from '@/types/subscription';

type Props = { plans: SubscriptionPlan[] };

export default function PlansTable({ plans }: Props) {
  return (
    <div className="overflow-x-auto bg-white border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="text-left bg-gray-50">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Interval</th>
            <th className="px-4 py-3">Limits</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((p) => {
            const price = formatMoneyInterval(p.price, p.currency, p.interval, p.intervalCount);
            const limits = [
              `P:${p.limits?.productListings ?? 0}`,
              `S:${p.limits?.serviceListings ?? 0}`,
              `F:${p.limits?.foodListings ?? 0}`,
              `IMG:${p.limits?.imageLimit ?? 0}`,
              `VID:${p.limits?.videoLimit ?? 0}`,
            ].join(' · ');
            return (
              <tr key={p._id} className="border-t">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{price.split(' per ')[0]}</td>
                <td className="px-4 py-3">{p.intervalCount > 1 ? `${p.intervalCount} ${p.interval}s` : p.interval}</td>
                <td className="px-4 py-3">{limits}</td>
                <td className="px-4 py-3">{createdOn(p.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/subscription/${p._id}/edit`}
                    className="text-indigo-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            );
          })}

          {plans.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-center text-gray-500" colSpan={7}>
                No plans yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
