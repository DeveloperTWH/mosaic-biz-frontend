import {
  countPublicMarketplaceVendors,
  getAdminBusinessStatusLabels,
  isPublicMarketplaceVendor,
  type MarketplaceBusinessLike,
} from "@/lib/marketplace/businessEligibility";

export function getAdminBusinessCounts(businesses: MarketplaceBusinessLike[]) {
  const publicCount = countPublicMarketplaceVendors(businesses);
  const activeCount = businesses.filter((business) => Boolean(business.isActive)).length;
  const approvedCount = businesses.filter((business) => Boolean(business.isApproved)).length;
  const hiddenCount = businesses.length - publicCount;

  return {
    publicCount,
    activeCount,
    approvedCount,
    hiddenCount,
    inactiveCount: businesses.length - activeCount,
  };
}

export function resolveAdminBusinessCounts(
  businesses: MarketplaceBusinessLike[],
  responseCounts?: {
    activeBusinessCount?: number;
    activeBusinesses?: number;
    activeCount?: number;
    inactiveBusinessCount?: number;
    inactiveBusinesses?: number;
    inactiveCount?: number;
    publicBusinessCount?: number;
  }
) {
  const derived = getAdminBusinessCounts(businesses);

  return {
    total: businesses.length,
    active:
      responseCounts?.activeBusinessCount ??
      responseCounts?.activeBusinesses ??
      responseCounts?.activeCount ??
      derived.activeCount,
    inactive:
      responseCounts?.inactiveBusinessCount ??
      responseCounts?.inactiveBusinesses ??
      responseCounts?.inactiveCount ??
      derived.inactiveCount,
    publicListing:
      responseCounts?.publicBusinessCount ?? derived.publicCount,
    hidden: derived.hiddenCount,
    approved: derived.approvedCount,
  };
}

export function isAdminBusinessActivated(business: MarketplaceBusinessLike): boolean {
  return Boolean(business.isActive);
}

export function getAdminBusinessRowState(business: MarketplaceBusinessLike) {
  const labels = getAdminBusinessStatusLabels(business);
  const publiclyListed = isPublicMarketplaceVendor(business);

  return {
    ...labels,
    showApprovalWarning: Boolean(business.isActive) && !Boolean(business.isApproved),
    showListingWarning: !publiclyListed,
  };
}
