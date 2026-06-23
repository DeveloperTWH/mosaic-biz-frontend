import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getFrontendBuildInfo,
  getFrontendCommitSha,
  getSentryRelease,
  isLikelySafePublicBuildInfo,
} from "../release/buildInfo";

describe("frontend build info", () => {
  it("reports safe short release metadata from Vercel env names", () => {
    const info = getFrontendBuildInfo({
      VERCEL_GIT_COMMIT_SHA: "abcdef1234567890abcdef1234567890abcdef12",
      VERCEL_GIT_COMMIT_REF: "develop",
      VERCEL_ENV: "preview",
      VERCEL_DEPLOYMENT_ID: "dpl_abc123",
    });

    assert.deepEqual(info, {
      service: "mosaic-biz-frontend",
      release: {
        commit: "abcdef1",
        environment: "preview",
        branch: "develop",
        deploymentId: "dpl_abc123",
      },
    });
    assert.equal(isLikelySafePublicBuildInfo(info), true);
  });

  it("falls back safely when release metadata is absent", () => {
    assert.deepEqual(getFrontendBuildInfo({}), {
      service: "mosaic-biz-frontend",
      release: {
        commit: "unknown",
        environment: "development",
        branch: "unknown",
        deploymentId: "unknown",
      },
    });
    assert.equal(getSentryRelease({}), undefined);
  });

  it("derives Sentry release from explicit release or commit", () => {
    assert.equal(getSentryRelease({ SENTRY_RELEASE: "mosaic-deadbee" }), "mosaic-deadbee");
    assert.equal(
      getSentryRelease({ NEXT_PUBLIC_RELEASE_COMMIT_SHA: "1234567890abcdef1234567890abcdef12345678" }),
      "1234567890abcdef1234567890abcdef12345678"
    );
    assert.equal(getFrontendCommitSha({ SENTRY_RELEASE: "mosaic-feedbee" }), "feedbee");
  });

  it("flags secret-like payloads as unsafe", () => {
    assert.equal(
      isLikelySafePublicBuildInfo({
        service: "mosaic-biz-frontend",
        release: {
          commit: "abc1234",
          environment: "production",
          branch: "main",
          deploymentId: "secret-value",
        },
      }),
      false
    );
  });
});
