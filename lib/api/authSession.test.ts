import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  checkAuthSession,
  checkAuthSessionResult,
} from "./authSession";

const originalFetch = globalThis.fetch;

process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.mosaicbizhub.com/";

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("checkAuthSessionResult", () => {
  it("uses the canonical auth-check route with credentials included", async () => {
    let requestedUrl = "";
    let requestedCredentials: RequestCredentials | undefined;

    globalThis.fetch = (async (input, init) => {
      requestedUrl = String(input);
      requestedCredentials = init?.credentials;

      return new Response(
        JSON.stringify({
          success: true,
          user: {
            id: "user_1",
            name: "Vendor",
            email: "vendor@example.com",
            role: "business_owner",
            mobile: "",
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        }
      );
    }) as typeof fetch;

    const result = await checkAuthSessionResult();

    assert.equal(requestedUrl, "https://api.mosaicbizhub.com/api/users/auth/check");
    assert.equal(requestedCredentials, "include");
    assert.equal(result.kind, "authenticated");
    if (result.kind === "authenticated") {
      assert.equal(result.user.role, "business_owner");
    }
  });

  it("classifies a 401 as an absent session", async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ success: false }), {
        status: 401,
        headers: { "content-type": "application/json" },
      })) as typeof fetch;

    const result = await checkAuthSessionResult();

    assert.deepEqual(result, { kind: "unauthenticated", status: 401 });
  });

  it("preserves server failures instead of reporting them as unauthenticated", async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ message: "Service unavailable" }), {
        status: 503,
        headers: { "content-type": "application/json" },
      })) as typeof fetch;

    const result = await checkAuthSessionResult();

    assert.equal(result.kind, "error");
    if (result.kind === "error") {
      assert.equal(result.status, 503);
      assert.equal(result.error.kind, "serverError");
    }
  });

  it("classifies network and CORS-style fetch failures separately", async () => {
    globalThis.fetch = (async () => {
      throw new TypeError("Failed to fetch");
    }) as typeof fetch;

    const result = await checkAuthSessionResult();

    assert.equal(result.kind, "error");
    if (result.kind === "error") {
      assert.equal(result.error.kind, "network");
    }
  });

  it("classifies a successful response without a user as malformed", async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })) as typeof fetch;

    const result = await checkAuthSessionResult();

    assert.equal(result.kind, "error");
    if (result.kind === "error") {
      assert.equal(result.status, 200);
      assert.equal(result.error.kind, "malformed");
    }
  });
});

describe("checkAuthSession backward compatibility", () => {
  it("continues returning null for unauthenticated callers", async () => {
    globalThis.fetch = (async () =>
      new Response(null, { status: 401 })) as typeof fetch;

    const user = await checkAuthSession();

    assert.equal(user, null);
  });
});
