"use client";

import Link from "next/link";

const STAGES = [
  { num: 1, label: "Business Verification", href: "/partners/business/new" },
  { num: 2, label: "Tier Selection", href: "/partners/tier-selection" },
  { num: 3, label: "Business Profile", href: "/partners/business-profile" },
  { num: 4, label: "List Products/Services", href: "/partners/products" },
  { num: 5, label: "Payout Setup", href: "/partners/payout-setup" },
  { num: 6, label: "Final Review", href: "/partners/final-review" },
] as const;

type OnboardingStepperProps = {
  currentStage?: number;
  compact?: boolean;
};

export default function OnboardingStepper({ currentStage = 1, compact = false }: OnboardingStepperProps) {
  const progress = Math.min(100, Math.max(0, ((currentStage - 1) / (STAGES.length - 1)) * 100));

  return (
    <nav aria-label="Vendor onboarding progress" className="w-full">
      {!compact ? (
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-market-gold transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={currentStage}
            aria-valuemin={1}
            aria-valuemax={STAGES.length}
          />
        </div>
      ) : null}
      <ol className={`flex ${compact ? "gap-2 overflow-x-auto pb-2" : "flex-wrap justify-between gap-3"}`}>
        {STAGES.map((stage) => {
          const isComplete = stage.num < currentStage;
          const isCurrent = stage.num === currentStage;
          return (
            <li key={stage.num} className="min-w-0 flex-1">
              <Link
                href={stage.href}
                className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-center transition-colors ${
                  isCurrent
                    ? "bg-market-gold/15 text-market-gold"
                    : isComplete
                      ? "text-market-text hover:bg-white/5"
                      : "text-market-muted hover:bg-white/5"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    isCurrent
                      ? "bg-market-gold text-market-header"
                      : isComplete
                        ? "bg-market-gold/30 text-market-gold"
                        : "bg-white/10 text-market-muted"
                  }`}
                >
                  {stage.num}
                </span>
                {!compact ? (
                  <span className="font-montserrat text-[10px] font-medium uppercase leading-tight tracking-wide sm:text-xs">
                    {stage.label}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { STAGES };
