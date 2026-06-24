import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import {
  checkAuthSession,
  checkAuthSessionResult,
  confirmPostLoginSession,
  extractAuthUserFromPayload,
  normalizeAuthUser,
} from "./authSession";

describe("authSession helpers", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it("normalizes users with id and role", () => {
    assert.deepEqual(
      normalizeAuthUser({
        id: "507f1f77bcf86cd799439011",
        role: "business_owner",
        name: "Vendor",
        email: "vendor@example.test",
        mobile: "5555550100",
      }),
      {
        id: "507f1f77bcf86cd799439011",
        role: "business_owner",
        name: "Vendor",
        email: "vendor@example.test",
        mobile: "5555550100",
        gender: undefined,
      }
    );
  });

  it("accepts Mongo-style _id values", () => {
    assert.deepEqual(
      normalizeAuthUser({
        _id: "507f1f77bcf86cd799439012",
        role: "customer",
      }),
      {
        id: "507f1f77bcf86cd799439012",
        role: "customer",
        name: "",
        email: "",
        mobile: "",
        gender: undefined,
      }
    );
  });

  it("extracts users from top-level and nested envelopes", () => {
    assert.equal(
      extractAuthUserFromPayload({
        user: { id: "1", role: "business_owner" },
      })?.role,
      "business_owner"
    );

    assert.equal(
      extractAuthUserFromPayload({
        data: { user: { _id: "2", role: "customer" } },
      })?.role,
      "customer"
    );
  });
});

describe("checkAuthSessionResult", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it("uses the canonical auth-check route with credentials included", async () => {
    const previousBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.mosaicbizhub.com/";

    let requestedUrl = "";
    let requestedCredentials: RequestCredentials | undefined;

    mock.method(globalThis, "fetch", async (input, init) => {
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
    });

    try {
      const result = await checkAuthSessionResult();

      assert.equal(requestedUrl, "https://api.mosaicbizhub.com/api/users/auth/check");
      assert.equal(requestedCredentials, "include");
      assert.equal(result.kind, "authenticated");
      if (result.kind === "authenticated") {
        assert.equal(result.user.role, "business_owner");
      }
    } finally {
      if (previousBaseUrl === undefined) {
        delete process.env.NEXT_PUBLIC_API_BASE_URL;
      } else {
        process.env.NEXT_PUBLIC_API_BASE_URL = previousBaseUrl;
      }
    }
  });

  it("classifies a 401 as an absent session", async () => {
    const previousBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.mosaicbizhub.com";

    mock.method(globalThis, "fetch", async () =>
      new Response(JSON.stringify({ success: false }), {
        status: 401,
        headers: { "content-type": "application/json" },
      })
    );

    try {
      const result = await checkAuthSessionResult();
      assert.deepEqual(result, { kind: "unauthenticated", status: 401 });
    } finally {
      if (previousBaseUrl === undefined) {
        delete process.env.NEXT_PUBLIC_API_BASE_URL;
      } else {
        process.env.NEXT_PUBLIC_API_BASE_URL = previousBaseUrl;
      }
    }
  });

  it("accepts nested auth/check payloads with _id", async () => {
    const previousBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.mosaicbizhub.com";

    mock.method(globalThis, "fetch", async () =>
      new Response(
        JSON.stringify({
          success: true,
          data: {
            user: {
              _id: "507f1f77bcf86cd799439099",
              role: "business_owner",
              name: "Vendor",
              email: "vendor@example.test",
              mobile: "5555550100",
            },
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    );

    try {
      const result = await checkAuthSessionResult();
      assert.equal(result.kind, "authenticated");
      if (result.kind === "authenticated") {
        assert.equal(result.user.id, "507f1f77bcf86cd799439099");
      }
    } finally {
      if (previousBaseUrl === undefined) {
        delete process.env.NEXT_PUBLIC_API_BASE_URL;
      } else {
        process.env.NEXT_PUBLIC_API_BASE_URL = previousBaseUrl;
      }
    }
  });

  it("preserves server failures instead of reporting them as unauthenticated", async () => {
    const previousBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.mosaicbizhub.com";

    mock.method(globalThis, "fetch", async () =>
      new Response(JSON.stringify({ message: "Service unavailable" }), {
        status: 503,
        headers: { "content-type": "application/json" },
      })
    );

    try {
      const result = await checkAuthSessionResult();
      assert.equal(result.kind, "error");
      if (result.kind === "error") {
        assert.equal(result.status, 503);
        assert.equal(result.error.kind, "serverError");
      }
    } finally {
      if (previousBaseUrl === undefined) {
        delete process.env.NEXT_PUBLIC_API_BASE_URL;
      } else {
        process.env.NEXT_PUBLIC_API_BASE_URL = previousBaseUrl;
      }
    }
  });

  it("classifies network and CORS-style fetch failures separately", async () => {
    const previousBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.mosaicbizhub.com";

    mock.method(globalThis, "fetch", async () => {
      throw new TypeError("Failed to fetch");
    });

    try {
      const result = await checkAuthSessionResult();
      assert.equal(result.kind, "error");
      if (result.kind === "error") {
        assert.equal(result.error.kind, "network");
      }
    } finally {
      if (previousBaseUrl === undefined) {
        delete process.env.NEXT_PUBLIC_API_BASE_URL;
      } else {
        process.env.NEXT_PUBLIC_API_BASE_URL = previousBaseUrl;
      }
    }
  });
});

describe("confirmPostLoginSession", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it("retries post-login session checks before reporting unauthenticated", async () => {
    const previousBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.mosaicbizhub.com";

    let calls = 0;
    mock.method(globalThis, "fetch", async () => {
      calls += 1;
      if (calls === 1) {
        return new Response(JSON.stringify({ message: "Authentication required" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          user: {
            id: "507f1f77bcf86cd799439099",
            role: "business_owner",
            name: "Vendor",
            email: "vendor@example.test",
            mobile: "5555550100",
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    });

    try {
      const result = await confirmPostLoginSession({
        retryDelaysMs: [0, 0],
      });
      assert.equal(result.kind, "authenticated");
      assert.equal(calls, 2);
    } finally {
      if (previousBaseUrl === undefined) {
        delete process.env.NEXT_PUBLIC_API_BASE_URL;
      } else {
        process.env.NEXT_PUBLIC_API_BASE_URL = previousBaseUrl;
      }
    }
  });

  it("returns network errors immediately without retrying", async () => {
    const previousBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.mosaicbizhub.com";

    let calls = 0;
    mock.method(globalThis, "fetch", async () => {
      calls += 1;
      throw new TypeError("Failed to fetch");
    });

    try {
      const result = await confirmPostLoginSession({
        retryDelaysMs: [0, 0, 0],
      });
      assert.equal(result.kind, "error");
      assert.equal(calls, 1);
    } finally {
      if (previousBaseUrl === undefined) {
        delete process.env.NEXT_PUBLIC_API_BASE_URL;
      } else {
        process.env.NEXT_PUBLIC_API_BASE_URL = previousBaseUrl;
      }
    }
  });
});

describe("checkAuthSession backward compatibility", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it("continues returning null for unauthenticated callers", async () => {
    const previousBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.mosaicbizhub.com";

    mock.method(globalThis, "fetch", async () => new Response(null, { status: 401 }));

    try {
      const user = await checkAuthSession();
      assert.equal(user, null);
    } finally {
      if (previousBaseUrl === undefined) {
        delete process.env.NEXT_PUBLIC_API_BASE_URL;
      } else {
        process.env.NEXT_PUBLIC_API_BASE_URL = previousBaseUrl;
      }
    }
  });
});
