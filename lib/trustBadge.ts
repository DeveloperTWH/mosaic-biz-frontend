/** Trust badge tier utilities — shared across marketplace surfaces */

export const TRUST_BADGE_TIERS = ["Silver", "Gold", "Platinum", "Diamond", "Pending"] as const;
export type TrustBadgeTier = (typeof TRUST_BADGE_TIERS)[number];

const TIER_ALIASES: Record<string, TrustBadgeTier> = {
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
  diamond: "Diamond",
  pending: "Pending",
};

/** Normalize raw badge string from API to a known tier */
export function normalizeBadgeTier(raw?: string | null): TrustBadgeTier | null {
  if (!raw?.trim()) return null;
  const lower = raw.trim().toLowerCase();
  if (TIER_ALIASES[lower]) return TIER_ALIASES[lower];
  const match = TRUST_BADGE_TIERS.find((t) => t.toLowerCase() === lower);
  return match ?? null;
}

/** Pick badge from nested business objects (cards use varying shapes) */
export function pickBadgeValue(item: Record<string, unknown>): string | null {
  const candidates = [
    item.badge,
    (item.businessDetails as Record<string, unknown> | undefined)?.badge,
    (item.businessId as Record<string, unknown> | undefined)?.badge,
    (item.business as Record<string, unknown> | undefined)?.badge,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return null;
}

/** Map tier to public asset path */
export function getBadgeImagePath(tier: TrustBadgeTier | string): string {
  const normalized = normalizeBadgeTier(tier);
  if (!normalized || normalized === "Pending") return "/badge.png";
  return `/badge/${normalized.toLowerCase()}.png`;
}

export function getBadgeAltText(tier: TrustBadgeTier | string): string {
  const normalized = normalizeBadgeTier(tier);
  if (!normalized) return "Trust badge";
  if (normalized === "Pending") return "Trust badge pending verification";
  return `${normalized} Trust Badge — verified minority-owned business`;
}
