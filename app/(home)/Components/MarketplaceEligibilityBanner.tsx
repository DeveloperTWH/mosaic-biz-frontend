import type { MarketplaceEligibility } from "@/lib/marketplace/businessEligibility";

type MarketplaceEligibilityBannerProps = {
  eligibility: MarketplaceEligibility;
  className?: string;
};

export default function MarketplaceEligibilityBanner({
  eligibility,
  className = "",
}: MarketplaceEligibilityBannerProps) {
  if (eligibility.code === "eligible" || eligibility.code === "unknown") {
    if (eligibility.code === "unknown") {
      return (
        <div
          className={`rounded-xl border border-white/10 bg-market-surface/70 px-4 py-3 text-sm text-market-muted ${className}`}
          role="status"
        >
          {eligibility.message}
        </div>
      );
    }

    return null;
  }

  return (
    <div
      className={`rounded-xl border border-red-400/30 bg-red-950/30 px-4 py-4 text-market-text ${className}`}
      role="alert"
    >
      <p className="font-poppins text-sm font-semibold text-red-200">{eligibility.title}</p>
      <p className="mt-2 font-montserrat text-sm leading-relaxed text-market-text/90">
        {eligibility.message}
      </p>
    </div>
  );
}
