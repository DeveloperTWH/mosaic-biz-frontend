import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PUBLIC_BADGE_FILTER_OPTIONS,
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

  it("keeps every public badge tier aligned with backend-facing lower-case values", () => {
    assert.deepEqual(
      PUBLIC_BADGE_FILTER_OPTIONS.map((option) => option.value),
      ["bronze", "silver", "gold", "platinum", "diamond"]
    );

    for (const option of PUBLIC_BADGE_FILTER_OPTIONS) {
      assert.deepEqual(listingFiltersToApiParams({ badge: option.value }), {
        badge: option.value,
      });
    }
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
        country: "United States",
        page: "2",
      }),
      "/services?q=tax&state=Maryland&sort=price_asc&page=2&country=United+States"
    );
  });

  it("converts country filters to API country params", () => {
    assert.deepEqual(listingFiltersToApiParams({ country: "United States" }), {
      country: "United States",
    });
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

  it("parses canonical state and country filters for browser navigation restore", () => {
    const parsed = parseListingFiltersFromSearchParams(
      new URLSearchParams("q=catering&state=Georgia&country=United+States&page=4")
    );

    assert.equal(parsed.keyword, "catering");
    assert.equal(parsed.location, "Georgia");
    assert.equal(parsed.country, "United States");
    assert.equal(parsed.page, "4");
  });
});
