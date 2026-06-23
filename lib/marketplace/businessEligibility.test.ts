import test from "node:test";
import assert from "node:assert/strict";
import {
  countPublicMarketplaceVendors,
  extractBusinessFromProduct,
  getAdminBusinessStatusLabels,
  getCheckoutVendorEligibilityMessage,
  getMarketplaceEligibility,
  isPublicMarketplaceVendor,
  isVendorEligibilityCheckoutError,
} from "./businessEligibility";

test("requires both approved and active for public marketplace vendor", () => {
  assert.equal(
    isPublicMarketplaceVendor({ isApproved: true, isActive: true }),
    true
  );
  assert.equal(
    isPublicMarketplaceVendor({ isApproved: true, isActive: false }),
    false
  );
  assert.equal(
    isPublicMarketplaceVendor({ isApproved: false, isActive: true }),
    false
  );
});

test("admin status labels no longer treat active OR approved as public", () => {
  const labels = getAdminBusinessStatusLabels({
    isApproved: false,
    isActive: true,
  });

  assert.equal(labels.active, true);
  assert.equal(labels.approved, false);
  assert.equal(labels.publicListing, false);
  assert.equal(labels.publicListingLabel, "Hidden");
});

test("counts only publicly listable vendors", () => {
  const count = countPublicMarketplaceVendors([
    { isApproved: true, isActive: true },
    { isApproved: true, isActive: false },
    { isApproved: false, isActive: true },
  ]);

  assert.equal(count, 1);
});

test("extracts nested business flags from product payload", () => {
  const business = extractBusinessFromProduct({
    businessId: {
      _id: "biz-1",
      businessName: "Zombie studio",
      isApproved: false,
      isActive: true,
    },
  });

  assert.deepEqual(business, {
    _id: "biz-1",
    businessName: "Zombie studio",
    isApproved: false,
    isActive: true,
  });
});

test("maps vendor checkout errors to shopper-safe guidance", () => {
  const raw = "Vendor is not an approved vendor";
  assert.equal(isVendorEligibilityCheckoutError(raw), true);
  assert.match(
    getCheckoutVendorEligibilityMessage(raw, "Zombie studio"),
    /Zombie studio is not approved/
  );
});

test("returns not publicly listed when vendor profile is unavailable", () => {
  const eligibility = getMarketplaceEligibility(
    { businessName: "Zombie studio" },
    { profileAvailable: false }
  );

  assert.equal(eligibility.eligible, false);
  assert.equal(eligibility.code, "not_publicly_listed");
  assert.match(eligibility.message, /not listed in the public vendor directory/i);
});
