import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { deleteVendorProduct } from "./vendorProducts";

const originalFetch = globalThis.fetch;
const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalApiBaseUrl === undefined) {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
  } else {
    process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
  }
});

describe("vendor product API", () => {
  it("deletes products through the singular backend route with credentials", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.mosaicbizhub.com/";
    let requestedUrl = "";
    let requestedInit: RequestInit | undefined;

    globalThis.fetch = async (input, init) => {
      requestedUrl = String(input);
      requestedInit = init;
      return new Response(JSON.stringify({ message: "Deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const result = await deleteVendorProduct("prod 123");

    assert.equal(
      requestedUrl,
      "https://api.mosaicbizhub.com/api/product/delete-product/prod%20123"
    );
    assert.equal(requestedInit?.method, "DELETE");
    assert.equal(requestedInit?.credentials, "include");
    assert.equal(result.message, "Deleted");
  });

  it("rejects delete responses that have a message but fail HTTP status", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.mosaicbizhub.com";

    globalThis.fetch = async () =>
      new Response(JSON.stringify({ message: "Cannot delete product" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });

    await assert.rejects(
      () => deleteVendorProduct("prod_500"),
      /Cannot delete product/
    );
  });
});
