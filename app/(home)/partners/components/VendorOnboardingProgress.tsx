"use client";

import Link from "next/link";
import { STAGES } from "./OnboardingStepper";
import { cn } from "@/lib/utils";

const STAGE_HINTS: Record<number, string> = {
  1: "Complete verification, then pay the one-time business verification fee.",
  2: "Choose a subscription tier that fits your business size.",
  3: "Add your logo, bio, and policies so customers trust your storefront.",
  4: "List at least one product, service, or food item to go live.",
  5: "Connect Stripe so you can receive payouts from sales.",
  6: "Review everything, certify accuracy, and publish your storefront.",
};

type VendorOnboardingProgressProps = {
  currentStage: number;
  variant?: "dashboard" | "market";
  saveNote?: string;
  className?: string;
};

export default function VendorOnboardingProgress({
  currentStage,
  variant = "dashboard",
  saveNote,
  className,
}: VendorOnboardingProgressProps) {
  const stage = STAGES.find((s) => s.num === currentStage) ?? STAGES[0];
  const progress = Math.min(100, Math.max(0, ((currentStage - 1) / (STAGES.length - 1)) * 100));
  const hint = STAGE_HINTS[currentStage] ?? "";

  return (
    <div
      className={cn(
        variant === "market" ? "vendor-onboarding-progress vendor-onboarding-progress--market" : "vendor-onboarding-progress",
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="vendor-onboarding-progress-eyebrow">
            Step {currentStage} of {STAGES.length}
          </p>
          <h2 className="vendor-onboarding-progress-title">{stage.label}</h2>
          {hint ? <p className="vendor-onboarding-progress-hint">{hint}</p> : null}
        </div>
        <Link href="/partners" className="vendor-onboarding-progress-hub-link shrink-0">
          View all steps
        </Link>
      </div>

      <div className="vendor-onboarding-progress-bar" role="progressbar" aria-valuenow={currentStage} aria-valuemin={1} aria-valuemax={STAGES.length}>
        <div className="vendor-onboarding-progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <ol className="vendor-onboarding-progress-steps" aria-label="Onboarding steps">
        {STAGES.map((s) => {
          const done = s.num < currentStage;
          const current = s.num === currentStage;
          return (
            <li key={s.num}>
              <Link
                href={s.href}
                className={cn(
                  "vendor-onboarding-progress-step",
                  done && "vendor-onboarding-progress-step--done",
                  current && "vendor-onboarding-progress-step--current"
                )}
                aria-current={current ? "step" : undefined}
              >
                <span className="vendor-onboarding-progress-step-num">{done ? "✓" : s.num}</span>
                <span className="vendor-onboarding-progress-step-label">{s.label}</span>
              </Link>
            </li>
          );
        })}
      </ol>

      {saveNote ? <p className="vendor-onboarding-progress-save-note">{saveNote}</p> : null}
    </div>
  );
}
