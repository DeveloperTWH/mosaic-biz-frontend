import {
  getMarketplaceEligibility,
  type MarketplaceBusinessLike,
  type MarketplaceEligibility,
} from "./businessEligibility";

const eligibilityCache = new Map<string, Promise<MarketplaceEligibility>>();

function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
}

type VendorProfileResponse = {
  success?: boolean;
  data?: {
    business?: MarketplaceBusinessLike & { _id?: string };
  };
};

export async function fetchPublicVendorEligibility(
  businessId: string
): Promise<MarketplaceEligibility> {
  const normalizedId = businessId.trim();
  if (!normalizedId) {
    return getMarketplaceEligibility(null, { profileAvailable: false });
  }

  if (!eligibilityCache.has(normalizedId)) {
    eligibilityCache.set(
      normalizedId,
      (async () => {
        const apiBase = getApiBase();
        if (!apiBase) {
          return getMarketplaceEligibility(null);
        }

        try {
          const res = await fetch(
            `${apiBase}/api/public/product/vendor-profile/${encodeURIComponent(normalizedId)}`,
            {
              headers: { Accept: "application/json" },
              cache: "no-store",
            }
          );

          if (res.status === 404) {
            return getMarketplaceEligibility(
              { businessName: "This vendor" },
              { profileAvailable: false }
            );
          }

          if (!res.ok) {
            return getMarketplaceEligibility(null);
          }

          const json = (await res.json()) as VendorProfileResponse;
          const business = json.data?.business ?? null;

          return getMarketplaceEligibility(business, { profileAvailable: true });
        } catch {
          return getMarketplaceEligibility(null);
        }
      })()
    );
  }

  return eligibilityCache.get(normalizedId)!;
}

export function clearPublicVendorEligibilityCache() {
  eligibilityCache.clear();
}
