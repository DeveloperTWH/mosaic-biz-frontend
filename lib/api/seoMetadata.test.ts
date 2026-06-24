import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPageMetadata,
  DEFAULT_SITE_URL,
  getMetadataBase,
  normalizeCanonicalPath,
} from "../seo/metadata";

describe("SEO metadata helpers", () => {
  it("normalizes canonical paths", () => {
    assert.equal(normalizeCanonicalPath("products/"), "/products");
    assert.equal(normalizeCanonicalPath("/"), "/");
    assert.equal(normalizeCanonicalPath(""), "/");
  });

  it("builds share metadata with safe route-level fields", () => {
    const metadata = createPageMetadata({
      title: "Shop Products",
      description: "Browse products from verified Mosaic Biz Hub vendors.",
      path: "/products",
    });

    assert.equal(metadata.title, "Shop Products");
    assert.equal(metadata.description, "Browse products from verified Mosaic Biz Hub vendors.");
    assert.deepEqual(metadata.alternates, { canonical: "/products" });
    assert.equal(metadata.openGraph?.siteName, "Mosaic Biz Hub");
    assert.equal(metadata.openGraph?.url, "/products");
    assert.equal(metadata.twitter?.card, "summary_large_image");
  });

  it("falls back to the production origin when NEXT_PUBLIC_APP_URL is invalid", () => {
    const previousUrl = process.env.NEXT_PUBLIC_APP_URL;
    const previousClientBaseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
    process.env.NEXT_PUBLIC_APP_URL = "not a url";
    delete process.env.NEXT_PUBLIC_CLIENT_BASE_URL;

    try {
      assert.equal(getMetadataBase().toString(), `${DEFAULT_SITE_URL}/`);
    } finally {
      if (previousUrl === undefined) {
        delete process.env.NEXT_PUBLIC_APP_URL;
      } else {
        process.env.NEXT_PUBLIC_APP_URL = previousUrl;
      }

      if (previousClientBaseUrl === undefined) {
        delete process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
      } else {
        process.env.NEXT_PUBLIC_CLIENT_BASE_URL = previousClientBaseUrl;
      }
    }
  });
});
