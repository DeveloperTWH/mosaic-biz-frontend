export type MarketplaceBusinessLike = {
  businessName?: string | null;
  isApproved?: boolean | null;
  isActive?: boolean | null;
  onboardingStatus?: string | null;
  listingType?: string | null;
};

export type MarketplaceEligibilityCode =
  | "eligible"
  | "not_approved"
  | "inactive"
  | "not_publicly_listed"
  | "unknown";

export type MarketplaceEligibility = {
  code: MarketplaceEligibilityCode;
  eligible: boolean;
  title: string;
  message: string;
  adminHint?: string;
  blockers: string[];
};

const APPROVED_ONBOARDING_STATUSES = new Set([
  "approved",
  "verified",
]);

function hasDefinedFlag(value: boolean | null | undefined): value is boolean {
  return value !== undefined && value !== null;
}

export function extractBusinessFromProduct(product: unknown): MarketplaceBusinessLike | null {
  if (!product || typeof product !== "object") return null;

  const record = product as Record<string, unknown>;
  const nestedBusiness =
    record.business && typeof record.business === "object"
      ? (record.business as MarketplaceBusinessLike)
      : null;
  const businessId = record.businessId;

  if (businessId && typeof businessId === "object") {
    return {
      ...nestedBusiness,
      ...(businessId as MarketplaceBusinessLike),
      businessName:
        (businessId as MarketplaceBusinessLike).businessName ??
        nestedBusiness?.businessName,
    };
  }

  return nestedBusiness;
}

export function getBusinessIdFromUnknown(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "object" && value !== null && "_id" in value) {
    const id = (value as { _id?: unknown })._id;
    return typeof id === "string" && id.trim() ? id : null;
  }
  return null;
}

export function isPublicMarketplaceVendor(
  business: MarketplaceBusinessLike | null | undefined
): boolean {
  return getMarketplaceEligibility(business).eligible;
}

export function getMarketplaceEligibility(
  business: MarketplaceBusinessLike | null | undefined,
  options?: { profileAvailable?: boolean }
): MarketplaceEligibility {
  const businessName = business?.businessName?.trim() || "This vendor";
  const blockers: string[] = [];

  if (options?.profileAvailable === false) {
    return {
      code: "not_publicly_listed",
      eligible: false,
      title: "Vendor not available in the marketplace",
      message:
        `${businessName} is not listed in the public vendor directory. Items from this store cannot be purchased right now.`,
      adminHint:
        "Approve the vendor application and ensure both isApproved and isActive are true before listing publicly.",
      blockers: ["not_publicly_listed"],
    };
  }

  const hasApproval = hasDefinedFlag(business?.isApproved);
  const hasActive = hasDefinedFlag(business?.isActive);
  const onboardingStatus = business?.onboardingStatus?.trim().toLowerCase() || "";

  if (hasApproval && !business?.isApproved) {
    blockers.push("not_approved");
  } else if (
    !hasApproval &&
    onboardingStatus &&
    !APPROVED_ONBOARDING_STATUSES.has(onboardingStatus)
  ) {
    blockers.push("not_approved");
  }

  if (hasActive && !business?.isActive) {
    blockers.push("inactive");
  }

  if (blockers.includes("not_approved") && blockers.includes("inactive")) {
    return {
      code: "inactive",
      eligible: false,
      title: "Vendor cannot accept orders",
      message:
        `${businessName} is not approved and is currently inactive. Remove these items from your cart or choose another vendor.`,
      adminHint:
        "Finalize the vendor application (isApproved) and activate the business (isActive) in admin.",
      blockers,
    };
  }

  if (blockers.includes("not_approved")) {
    return {
      code: "not_approved",
      eligible: false,
      title: "Vendor not approved",
      message:
        `${businessName} has not completed vendor approval. You cannot complete checkout for these items yet.`,
      adminHint:
        "Review the vendor application in Admin → Vendor Applications and finalize approval.",
      blockers,
    };
  }

  if (blockers.includes("inactive")) {
    return {
      code: "inactive",
      eligible: false,
      title: "Vendor is inactive",
      message:
        `${businessName} is currently inactive in the marketplace. Remove these items from your cart or try again later.`,
      adminHint: "Activate the business in Admin → Businesses after approval is complete.",
      blockers,
    };
  }

  if (!hasApproval && !hasActive && options?.profileAvailable === undefined) {
    return {
      code: "unknown",
      eligible: true,
      title: "Vendor status unavailable",
      message:
        "We could not confirm this vendor's marketplace status before checkout. If payment fails, contact support or try another vendor.",
      blockers: [],
    };
  }

  return {
    code: "eligible",
    eligible: true,
    title: "Verified vendor",
    message: `${businessName} is available for checkout.`,
    blockers: [],
  };
}

export function getAdminBusinessStatusLabels(business: MarketplaceBusinessLike) {
  const approved = Boolean(business.isApproved);
  const active = Boolean(business.isActive);
  const publicListing = isPublicMarketplaceVendor(business);

  return {
    approved,
    active,
    publicListing,
    approvedLabel: approved ? "Approved" : "Not approved",
    activeLabel: active ? "Active" : "Inactive",
    publicListingLabel: publicListing ? "Public" : "Hidden",
  };
}

export function countPublicMarketplaceVendors(businesses: MarketplaceBusinessLike[]): number {
  return businesses.filter((business) => isPublicMarketplaceVendor(business)).length;
}

const VENDOR_CHECKOUT_ERROR_PATTERNS = [
  /not\s+an?\s+approved\s+vendor/i,
  /unapproved\s+vendor/i,
  /vendor\s+(?:is\s+)?not\s+approved/i,
  /business\s+(?:is\s+)?not\s+approved/i,
  /inactive\s+vendor/i,
  /vendor\s+(?:is\s+)?inactive/i,
  /not\s+eligible/i,
];

export function isVendorEligibilityCheckoutError(message: string): boolean {
  const normalized = message.trim();
  if (!normalized) return false;
  return VENDOR_CHECKOUT_ERROR_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function getCheckoutVendorEligibilityMessage(
  rawMessage: string,
  vendorName?: string
): string {
  const vendor = vendorName?.trim() || "This vendor";
  if (!isVendorEligibilityCheckoutError(rawMessage)) {
    return rawMessage;
  }

  return `${vendor} is not approved to accept orders on Mosaic Biz Hub. The item was removed from checkout eligibility. Please remove it from your cart or shop from a verified vendor in Our Vendors.`;
}

export function logCheckoutEligibilityFailure(details: {
  message: string;
  businessId?: string | null;
  businessName?: string | null;
  productIds?: string[];
  source?: string;
}) {
  const payload = {
    scope: "marketplace.checkout.vendor_eligibility",
    ...details,
    timestamp: new Date().toISOString(),
  };

  console.error("[marketplace] Checkout blocked by vendor eligibility", payload);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("marketplace:checkout-eligibility-failed", {
        detail: payload,
      })
    );
  }
}
