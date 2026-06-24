import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildListingPageUrl,
  listingFiltersToApiParams,
  parseListingFiltersFromSearchParams,
} from "../../app/(home)/Components/publicSearch";

describe("public listing search params", () => {
  it("builds badge API params with backend-facing lower-case values", () => {
    assert.deepEqual(listingFiltersToApiParams({ badge: "bronze" }), {
      badge: "bronze",
    });
  });

  it("persists selected state as the canonical state query param", () => {
    assert.equal(
      buildListingPageUrl("/services", {
        location: "Virginia",
        badge: "bronze",
        page: "3",
      }),
      "/services?state=Virginia&badge=bronze&page=3"
    );
  });

  it("converts state filters to API state params, not city params", () => {
    assert.deepEqual(listingFiltersToApiParams({ location: "Virginia" }), {
      state: "Virginia",
    });
  });

  it("keeps pagination with active filters", () => {
    assert.equal(
      buildListingPageUrl("/services", {
        keyword: "tax",
        location: "Maryland",
        sort: "price_asc",
        page: "2",
      }),
      "/services?q=tax&state=Maryland&sort=price_asc&page=2"
    );
  });

  it("builds a clean URL for filter reset", () => {
    assert.equal(buildListingPageUrl("/services", {}), "/services");
  });

  it("parses legacy city links into the shared location field", () => {
    const parsed = parseListingFiltersFromSearchParams(
      new URLSearchParams("city=Richmond&badge=gold")
    );

    assert.equal(parsed.location, "Richmond");
    assert.equal(parsed.badge, "gold");
  });
});
