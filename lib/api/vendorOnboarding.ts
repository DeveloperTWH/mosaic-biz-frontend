// lib/api/vendorOnboarding.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Shared JSON headers
 * (Auth handled via cookies, not headers)
 */
const jsonHeaders = {
  "Content-Type": "application/json",
};

/**
 * Save or update Stage-1 onboarding draft
 */
export async function saveStage1Draft(payload: any) {
  const res = await fetch(`${BASE_URL}/api/vendor-onboarding/draft`, {
    method: "POST",
    headers: jsonHeaders,
    credentials: "include", // ✅ REQUIRED for cookies
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to save draft");
  }

  return data;
}

/**
 * Fetch existing Stage-1 draft
 */
export async function getStage1Draft() {
  const res = await fetch(`${BASE_URL}/api/vendor-onboarding/draft`, {
    method: "GET",
    headers: jsonHeaders,
    credentials: "include", // ✅ REQUIRED
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to load draft");
  }

  return data.data;
}

/**
 * Create Stripe payment intent for Stage-1 verification
 */
export async function createStage1Payment() {
  const res = await fetch(`${BASE_URL}/api/vendor-onboarding/stage1/create-payment`, {
    method: "POST",
    headers: jsonHeaders,
    credentials: "include", // ✅ REQUIRED
  });
 
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Payment creation failed");
  }

  return data; // Return full response instead of data.data
}


/**
 * Submit Stage-1 onboarding for admin review
 */
export async function submitStage1() {
  const res = await fetch(`${BASE_URL}/api/vendor-onboarding/submit`, {
    method: "POST",
    headers: jsonHeaders,
    credentials: "include", // ✅ REQUIRED
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Submission failed");
  }

  return data;
}
