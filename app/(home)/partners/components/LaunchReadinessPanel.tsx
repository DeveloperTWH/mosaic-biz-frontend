"use client";

import Link from "next/link";
import { STAGES } from "@/app/(home)/partners/components/OnboardingStepper";

type LaunchReadinessPanelProps = {
  currentStage?: number;
  stageStatuses?: Record<number, "complete" | "in_progress" | "pending">;
};

const CHECKLIST = [
  { key: "verification", label: "Business verification submitted", stage: 1 },
  { key: "tier", label: "Subscription tier selected", stage: 2 },
  { key: "profile", label: "Business profile complete", stage: 3 },
  { key: "listings", label: "At least one product or service listed", stage: 4 },
  { key: "payout", label: "Stripe payout connected", stage: 5 },
  { key: "review", label: "Final review submitted", stage: 6 },
];

export default function LaunchReadinessPanel({
  currentStage = 1,
  stageStatuses = {},
}: LaunchReadinessPanelProps) {
  const resolved = CHECKLIST.map((item) => {
    const status = stageStatuses[item.stage];
    const done = status === "complete" || item.stage < currentStage;
    const inProgress = status === "in_progress" || item.stage === currentStage;
    return { ...item, done, inProgress };
  });
  const completedCount = resolved.filter((r) => r.done).length;
  const pct = Math.round((completedCount / CHECKLIST.length) * 100);

  return (
    <div className="rounded-xl border border-white/10 bg-market-elevated p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-poppins text-lg font-semibold text-market-text">Launch readiness</h2>
          <p className="mt-1 text-sm text-market-muted">
            {completedCount} of {CHECKLIST.length} steps complete ({pct}%)
          </p>
        </div>
        <Link href="/partners" className="text-sm font-semibold text-market-gold hover:underline">
          View hub
        </Link>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-market-gold transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-6 space-y-3">
        {resolved.map((item) => (
          <li key={item.key} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                item.done
                  ? "bg-market-gold text-market-header"
                  : item.inProgress
                    ? "border-2 border-market-gold text-market-gold"
                    : "bg-white/10 text-market-muted"
              }`}
              aria-hidden
            >
              {item.done ? "✓" : item.stage}
            </span>
            <span className={item.done ? "text-market-muted line-through" : "text-market-text"}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-market-muted">
        Stage labels: {STAGES.map((s) => s.label).join(" → ")}
      </p>
    </div>
  );
}
