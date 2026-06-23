import Link from "next/link";
import { BadgeCheck } from "lucide-react";

type MarketTrustBadgeHintProps = {
  audience?: "shopper" | "vendor";
  className?: string;
};

export default function MarketTrustBadgeHint({
  audience = "shopper",
  className = "",
}: MarketTrustBadgeHintProps) {
  const href = audience === "vendor" ? "/vendor/trustbadge" : "/consumer/trustbadge";
  const label =
    audience === "vendor"
      ? "Vendor trust badges show your verification progress to shoppers."
      : "Trust badges show verified onboarding progress — not customer star ratings.";

  return (
    <p className={`market-trust-badge-hint ${className}`.trim()}>
      <BadgeCheck className="market-trust-badge-hint-icon shrink-0" aria-hidden />
      <span>
        {label}{" "}
        <Link href={href} className="text-market-gold underline hover:text-market-gold-hover">
          How verification works
        </Link>
      </span>
    </p>
  );
}
