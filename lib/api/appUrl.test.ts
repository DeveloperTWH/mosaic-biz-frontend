import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_APP_ORIGIN,
  buildAppUrl,
  getConfiguredAppOrigin,
  normalizeAppOrigin,
} from "../url/appUrl";

describe("app URL helpers", () => {
  it("normalizes the legacy app subdomain to the canonical root domain", () => {
    assert.equal(normalizeAppOrigin("https://app.mosaicbizhub.com"), DEFAULT_APP_ORIGIN);
    assert.equal(
      buildAppUrl("https://app.mosaicbizhub.com/partners/connect/return?businessId=abc"),
      "https://mosaicbizhub.com/partners/connect/return?businessId=abc"
    );
  });

  it("keeps preview origins for preview checkout flows", () => {
    assert.equal(
      buildAppUrl("/payment-success", "https://mosaic-biz-frontend-launch.vercel.app"),
      "https://mosaic-biz-frontend-launch.vercel.app/payment-success"
    );
  });

  it("skips stale app-domain env and uses the next configured origin", () => {
    const previousAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    const previousClientBaseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://app.mosaicbizhub.com";
    process.env.NEXT_PUBLIC_CLIENT_BASE_URL = "https://mosaic-biz-frontend-launch.vercel.app";

    try {
      assert.equal(
        getConfiguredAppOrigin(),
        "https://mosaic-biz-frontend-launch.vercel.app"
      );
    } finally {
      if (previousAppUrl === undefined) {
        delete process.env.NEXT_PUBLIC_APP_URL;
      } else {
        process.env.NEXT_PUBLIC_APP_URL = previousAppUrl;
      }

      if (previousClientBaseUrl === undefined) {
        delete process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
      } else {
        process.env.NEXT_PUBLIC_CLIENT_BASE_URL = previousClientBaseUrl;
      }
    }
  });

  it("falls back to the canonical root domain when env is missing or invalid", () => {
    const previousAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    const previousClientBaseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
    process.env.NEXT_PUBLIC_APP_URL = "not a url";
    delete process.env.NEXT_PUBLIC_CLIENT_BASE_URL;

    try {
      assert.equal(getConfiguredAppOrigin(), DEFAULT_APP_ORIGIN);
    } finally {
      if (previousAppUrl === undefined) {
        delete process.env.NEXT_PUBLIC_APP_URL;
      } else {
        process.env.NEXT_PUBLIC_APP_URL = previousAppUrl;
      }

      if (previousClientBaseUrl === undefined) {
        delete process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
      } else {
        process.env.NEXT_PUBLIC_CLIENT_BASE_URL = previousClientBaseUrl;
      }
    }
  });
});
