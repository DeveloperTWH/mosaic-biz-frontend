import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getPublicProductListTotal,
  getVendorInventoryProductCount,
} from "../marketplace/productCounts";
import { SERVICE_DETAIL_RESPONSIVE_CLASSES } from "../marketplace/serviceDetailLayout";

describe("marketplace product counts", () => {
  it("uses the public product list response total when present", () => {
    assert.equal(getPublicProductListTotal({ total: 42 }, 10), 42);
  });

  it("keeps vendor inventory counts scoped to the vendor-owned list", () => {
    assert.equal(getVendorInventoryProductCount([{ id: "a" }, { id: "b" }]), 2);
  });
});

describe("service detail responsive class contract", () => {
  it("prevents horizontal overflow on the page shell", () => {
    assert.match(SERVICE_DETAIL_RESPONSIVE_CLASSES.pageShell, /overflow-x-hidden/);
    assert.match(SERVICE_DETAIL_RESPONSIVE_CLASSES.pageShell, /pb-24/);
  });

  it("keeps the right panel below content until wide desktop", () => {
    assert.match(SERVICE_DETAIL_RESPONSIVE_CLASSES.contentGrid, /grid-cols-1/);
    assert.match(SERVICE_DETAIL_RESPONSIVE_CLASSES.contentGrid, /xl:grid-cols/);
    assert.doesNotMatch(SERVICE_DETAIL_RESPONSIVE_CLASSES.contentGrid, /lg:grid-cols/);
  });

  it("keeps grid children shrinkable inside narrow columns", () => {
    assert.match(SERVICE_DETAIL_RESPONSIVE_CLASSES.contentGrid, /min-w-0/);
    assert.match(SERVICE_DETAIL_RESPONSIVE_CLASSES.sidebar, /min-w-0/);
    assert.match(SERVICE_DETAIL_RESPONSIVE_CLASSES.detailRow, /min-w-0/);
  });
});
