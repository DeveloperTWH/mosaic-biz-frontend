import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_APP_ORIGIN,
  buildAppUrl,
  getConfiguredAppOrigin,
  normalizeAppOrigin,
} from "../url/appUrl";

describe("app URL helpers", () => {
  it("uses the apex marketplace domain as the production default", () => {
    assert.equal(normalizeAppOrigin("https://mosaicbizhub.com"), DEFAULT_APP_ORIGIN);
    assert.equal(
      buildAppUrl("/partners/connect/return?businessId=abc"),
      "https://mosaicbizhub.com/partners/connect/return?businessId=abc"
    );
  });

  it("preserves the legacy app subdomain when it is the runtime transition origin", () => {
    assert.equal(
      buildAppUrl("/partners/connect/return?businessId=abc", "https://app.mosaicbizhub.com"),
      "https://app.mosaicbizhub.com/partners/connect/return?businessId=abc"
    );
  });

  it("keeps preview origins for preview checkout flows", () => {
    assert.equal(
      buildAppUrl("/payment-success", "https://mosaic-biz-frontend-launch.vercel.app"),
      "https://mosaic-biz-frontend-launch.vercel.app/payment-success"
    );
  });

  it("uses NEXT_PUBLIC_APP_URL before the client-base fallback", () => {
    const previousAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    const previousClientBaseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://mosaicbizhub.com";
    process.env.NEXT_PUBLIC_CLIENT_BASE_URL = "https://mosaic-biz-frontend-launch.vercel.app";

    try {
      assert.equal(
        getConfiguredAppOrigin(),
        "https://mosaicbizhub.com"
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

  it("falls back to the apex marketplace domain when env is missing or invalid", () => {
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

  it("does not allow the API hostname to become the frontend origin", () => {
    const previousAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    const previousClientBaseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://api.mosaicbizhub.com";
    delete process.env.NEXT_PUBLIC_CLIENT_BASE_URL;

    try {
      assert.equal(getConfiguredAppOrigin(), DEFAULT_APP_ORIGIN);
      assert.equal(
        buildAppUrl("https://api.mosaicbizhub.com/partners/connect/return?businessId=abc"),
        "https://mosaicbizhub.com/partners/connect/return?businessId=abc"
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

  it("does not allow redirect-only or arbitrary origins to become app return URLs", () => {
    const previousAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    const previousClientBaseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://www.mosaicbizhub.com";
    process.env.NEXT_PUBLIC_CLIENT_BASE_URL = "https://evil.example.com";

    try {
      assert.equal(getConfiguredAppOrigin(), DEFAULT_APP_ORIGIN);
      assert.equal(
        buildAppUrl("https://www.mosaicbizhub.com/partners/connect/return?businessId=abc"),
        "https://mosaicbizhub.com/partners/connect/return?businessId=abc"
      );
      assert.equal(
        buildAppUrl("https://evil.example.com/payment-success?source=cart"),
        "https://mosaicbizhub.com/payment-success?source=cart"
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
});
