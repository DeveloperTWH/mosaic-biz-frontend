import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { createServiceBooking } from "./serviceBookings";

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

describe("service booking API", () => {
  it("creates bookings through the registered service booking route with credentials", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.mosaicbizhub.com/";
    let requestedUrl = "";
    let requestedInit: RequestInit | undefined;

    globalThis.fetch = async (input, init) => {
      requestedUrl = String(input);
      requestedInit = init;
      return new Response(JSON.stringify({ success: true, message: "Created" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    };

    await createServiceBooking({
      serviceId: "svc 123",
      name: "Test Customer",
      email: "customer@example.com",
      phone: "555-0100",
      services: ["Consultation"],
      date: "2026-06-24",
      slot: "10:00 AM",
    });

    assert.equal(
      requestedUrl,
      "https://api.mosaicbizhub.com/api/bookings/service/svc%20123"
    );
    assert.equal(requestedInit?.method, "POST");
    assert.equal(requestedInit?.credentials, "include");
    assert.equal(requestedInit?.headers?.["Content-Type"], "application/json");
    assert.deepEqual(JSON.parse(String(requestedInit?.body)), {
      name: "Test Customer",
      email: "customer@example.com",
      phone: "555-0100",
      services: ["Consultation"],
      date: "2026-06-24",
      slot: "10:00 AM",
    });
  });

  it("surfaces the customer sign-in requirement for unauthenticated bookings", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.mosaicbizhub.com";

    globalThis.fetch = async () =>
      new Response(JSON.stringify({ success: false, message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });

    await assert.rejects(
      () =>
        createServiceBooking({
          serviceId: "svc_unauth",
          name: "Test Customer",
          email: "customer@example.com",
          phone: "555-0100",
          services: ["Consultation"],
          date: "2026-06-24",
          slot: "10:00 AM",
        }),
      /Please sign in as a customer/
    );
  });
});
