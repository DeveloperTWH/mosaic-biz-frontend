// lib/api/vendorOnboarding.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Shared JSON headers
 * (Auth handled via cookies, plus optional bearer token when available)
 */
const jsonHeaders = {
  "Content-Type": "application/json",
};

const buildJsonHeaders = () => {
  if (typeof window === "undefined") {
    return jsonHeaders;
  }

  const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
  if (!token) {
    return jsonHeaders;
  }

  return {
    ...jsonHeaders,
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Save or update Stage-1 onboarding draft
 */
export async function saveStage1Draft(payload: any) {
  const res = await fetch(`${BASE_URL}/api/vendor-onboarding/draft`, {
    method: "POST",
    headers: buildJsonHeaders(),
    credentials: "include",
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
    headers: buildJsonHeaders(),
    credentials: "include",
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
    headers: buildJsonHeaders(),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Payment creation failed");
  }

  return data; // Return full response instead of data.data
}

export class VendorSubmissionError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "VendorSubmissionError";
    this.status = status;
  }
}

export type Stage1PaymentStatus = {
  canSubmit: boolean;
  paymentStatus?: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Check whether backend payment confirmation allows Stage-1 submit
 */
export async function getStage1PaymentStatus(): Promise<Stage1PaymentStatus> {
  const res = await fetch(`${BASE_URL}/api/vendor-onboarding/stage1/payment-status`, {
    method: "GET",
    headers: buildJsonHeaders(),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to check payment status");
  }

  const payload = data.data ?? data;

  return {
    canSubmit: Boolean(payload.canSubmit),
    paymentStatus: payload.paymentStatus,
  };
}

/**
 * Poll backend until payment is confirmed or timeout is reached
 */
export async function waitForStage1PaymentConfirmation(options?: {
  maxAttempts?: number;
  delayMs?: number;
}): Promise<boolean> {
  const { maxAttempts = 15, delayMs = 2000 } = options ?? {};

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const status = await getStage1PaymentStatus();
      if (status.canSubmit) {
        return true;
      }
    } catch (err) {
      console.error("Payment status check failed:", err);
    }

    if (attempt < maxAttempts - 1) {
      await sleep(delayMs);
    }
  }

  return false;
}

/**
 * Submit Stage-1 onboarding for admin review
 */
export async function submitStage1() {
  const res = await fetch(`${BASE_URL}/api/vendor-onboarding/submit`, {
    method: "POST",
    headers: buildJsonHeaders(),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new VendorSubmissionError(data.message || "Submission failed", res.status);
  }

  return data;
}

/**
 * Fetch complete onboarding data for business profile
 * This returns ALL fields including pre-filled non-editable data
 */
export async function getOnboardingData() {
  const res = await fetch(`${BASE_URL}/api/vendor-onboarding/onboarding-data`, {
    method: "GET",
    headers: buildJsonHeaders(),
    credentials: "include",
  });

  if (res.status === 404) {
    return null;
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch onboarding data");
  }

  return data.data; // Returns the complete onboarding document
}

/**
 * Update only the business profile specific fields
 * This preserves all existing Stage 1 data while updating profile fields
 */
export async function updateBusinessProfile(payload: {
  firstName?: string;
  lastName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  language?: string;
  licenseNumber?: string;
  businessBio?: string;
  characterLimit?: number;
  businessProfileImage?: { url: string; verified: boolean };
  featureBanner?: { url: string; verified: boolean };
  businessEmail?: string;
  businessPhone?: string;
  alternatePhone?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  refundPolicyDocument?: { url: string; verified: boolean };
  termsDocument?: { url: string; verified: boolean };
  googleReviewLink?: string;
  communityServiceLink?: string;
}) {
  const res = await fetch(`${BASE_URL}/api/vendor-onboarding/business-profile`, {
    method: "PUT",
    headers: buildJsonHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update business profile");
  }

  return data.data;
}
