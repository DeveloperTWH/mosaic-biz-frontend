import Image from "next/image";
import Link from "next/link";
import {
  getBadgeAltText,
  getBadgeImagePath,
  normalizeBadgeTier,
  type TrustBadgeTier,
} from "@/lib/trustBadge";

type TrustBadgeProps = {
  tier?: string | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  linkToExplainer?: boolean;
  className?: string;
};

const SIZE_MAP = {
  sm: { px: 28, cls: "h-7 w-7" },
  md: { px: 40, cls: "h-10 w-10" },
  lg: { px: 56, cls: "h-14 w-14" },
};

/**
 * Consistent trust badge display across marketplace cards and profiles.
 */
export default function TrustBadge({
  tier,
  size = "md",
  showLabel = false,
  linkToExplainer = false,
  className = "",
}: TrustBadgeProps) {
  const normalized = normalizeBadgeTier(tier);
  if (!normalized || normalized === "Pending") return null;

  const { px, cls } = SIZE_MAP[size];
  const src = getBadgeImagePath(normalized);
  const alt = getBadgeAltText(normalized);

  const badge = (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      title={alt}
    >
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
        className={`${cls} object-contain`}
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src.endsWith("/badge.png")) return;
          img.src = "/badge.png";
        }}
      />
      {showLabel ? (
        <span className="font-montserrat text-xs font-semibold uppercase tracking-wide text-market-gold">
          {normalized}
        </span>
      ) : null}
    </span>
  );

  if (linkToExplainer) {
    return (
      <Link href="/consumer/trustbadge" className="hover:opacity-90" aria-label={`Learn about ${normalized} trust badge`}>
        {badge}
      </Link>
    );
  }

  return badge;
}

export type { TrustBadgeTier };
