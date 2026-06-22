import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ApiClientError,
  getUserSafeMessage,
  mapStatusToErrorKind,
} from "./errors";
import { createApiClientError } from "./httpClient";
import { getBackendMessage, normalizeFieldErrors } from "./parseResponse";

describe("mapStatusToErrorKind", () => {
  it("maps auth and payment statuses", () => {
    assert.equal(mapStatusToErrorKind(401), "unauthenticated");
    assert.equal(mapStatusToErrorKind(403), "forbidden");
    assert.equal(mapStatusToErrorKind(404), "notFound");
    assert.equal(mapStatusToErrorKind(402), "paymentPending");
    assert.equal(mapStatusToErrorKind(429), "rateLimited");
    assert.equal(mapStatusToErrorKind(422), "validation");
    assert.equal(mapStatusToErrorKind(500), "serverError");
  });
});

describe("createApiClientError", () => {
  it("preserves requestId and field errors", () => {
    const error = createApiClientError(
      422,
      {
        status: 422,
        ok: false,
        isJson: true,
        data: null,
        payload: {
          message: "Validation failed",
          requestId: "req_123",
          fieldErrors: { businessName: "Required" },
        },
      },
      "Request failed"
    );

    assert.equal(error.kind, "validation");
    assert.equal(error.requestId, "req_123");
    assert.deepEqual(error.fieldErrors, { businessName: "Required" });
  });

  it("maps non-json 500 to server error with status preserved", () => {
    const error = createApiClientError(
      500,
      {
        status: 500,
        ok: false,
        isJson: false,
        data: null,
        payload: { message: "Internal Server Error" },
        rawText: "Internal Server Error",
      },
      "Request failed"
    );

    assert.equal(error.kind, "serverError");
    assert.equal(error.status, 500);
    assert.match(error.message, /500|Internal Server Error/);
  });
});

describe("getUserSafeMessage", () => {
  it("returns explicit forbidden text for wrong-role errors", () => {
    const message = getUserSafeMessage(
      new ApiClientError({
        kind: "forbidden",
        message: "Admin access required",
        status: 403,
      }),
      "fallback"
    );
    assert.equal(message, "Admin access required");
  });

  it("returns recoverable payment-pending copy", () => {
    const message = getUserSafeMessage(
      new ApiClientError({
        kind: "paymentPending",
        message: "Verification fee still processing",
        status: 402,
      }),
      "fallback"
    );
    assert.equal(message, "Verification fee still processing");
  });
});

describe("parseResponse helpers", () => {
  it("extracts backend message and field errors", () => {
    const payload = {
      message: "Invalid payload",
      fieldErrors: { einNumber: "Invalid format" },
    };
    assert.equal(getBackendMessage(payload), "Invalid payload");
    assert.deepEqual(normalizeFieldErrors(payload), { einNumber: "Invalid format" });
  });
});
