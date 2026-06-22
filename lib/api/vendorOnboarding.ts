import { ApiClientError } from "./errors";
import { apiRequest, apiRequestEnvelope } from "./httpClient";

export class VendorSubmissionError extends ApiClientError {
  constructor(error: ApiClientError) {
    super({
      kind: error.kind,
      message: error.message,
      status: error.status,
      code: error.code,
      requestId: error.requestId,
      fieldErrors: error.fieldErrors,
      payload: error.payload,
      isJson: error.isJson,
      cause: error,
    });
    this.name = "VendorSubmissionError";
  }
}

function wrapVendorError(error: unknown, fallback: string): never {
  if (error instanceof ApiClientError) {
    throw new VendorSubmissionError(error);
  }
  throw new VendorSubmissionError(
    new ApiClientError({
      kind: "network",
      message: error instanceof Error ? error.message : fallback,
      cause: error,
      isJson: false,
    })
  );
}

export type Stage1DraftSaveResponse = {
  success?: boolean;
  message?: string;
  status?: string;
  data?: Stage1DraftRecord;
};

export type Stage1DraftRecord = {
  status?: string;
  [key: string]: unknown;
};

export async function saveStage1Draft(payload: unknown): Promise<Stage1DraftSaveResponse | null> {
  try {
    return await apiRequestEnvelope<Stage1DraftRecord>("/api/vendor-onboarding/draft", {
      method: "POST",
      body: payload,
      bearer: true,
    });
  } catch (error) {
    wrapVendorError(error, "Failed to save draft");
  }
}

export async function getStage1Draft(): Promise<Stage1DraftRecord | null> {
  try {
    const envelope = await apiRequestEnvelope<Stage1DraftRecord>("/api/vendor-onboarding/draft", {
      bearer: true,
    });
    return (envelope?.data as Stage1DraftRecord | undefined) ?? null;
  } catch (error) {
    wrapVendorError(error, "Failed to load draft");
  }
}

export type Stage1PaymentCreateResponse = {
  success?: boolean;
  message?: string;
  data?: {
    clientSecret?: string;
    amount?: number;
    currency?: string;
    applicationId?: string;
  };
};

export async function createStage1Payment(): Promise<Stage1PaymentCreateResponse | null> {
  try {
    return await apiRequestEnvelope<Stage1PaymentCreateResponse["data"]>(
      "/api/vendor-onboarding/stage1/create-payment",
      {
        method: "POST",
        bearer: true,
      }
    );
  } catch (error) {
    wrapVendorError(error, "Payment creation failed");
  }
}

export type Stage1PaymentStatus = {
  canSubmit: boolean;
  paymentStatus?: string;
};

export async function getStage1PaymentStatus(): Promise<Stage1PaymentStatus> {
  try {
    const envelope = await apiRequestEnvelope<Stage1PaymentStatus>(
      "/api/vendor-onboarding/stage1/payment-status",
      { bearer: true }
    );
    if (!envelope) {
      return { canSubmit: false };
    }
    const payload = (envelope.data ?? envelope) as Stage1PaymentStatus;
    return {
      canSubmit: Boolean(payload?.canSubmit),
      paymentStatus: payload?.paymentStatus,
    };
  } catch (error) {
    wrapVendorError(error, "Failed to check payment status");
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

export async function submitStage1() {
  try {
    return await apiRequestEnvelope("/api/vendor-onboarding/submit", {
      method: "POST",
      bearer: true,
    });
  } catch (error) {
    wrapVendorError(error, "Submission failed");
  }
}

export type OnboardingDataRecord = {
  businessName?: string;
  secondaryBusinessEmail?: string;
  businessEmail?: string;
  businessPhone?: string;
  primaryPhone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  ownershipType?: string;
  businessType?: string;
  yearsInBusiness?: string;
  employeesCount?: string;
  minorityCategories?: string[];
  firstName?: string;
  lastName?: string;
  primaryEmail?: string;
  language?: string;
  customLanguage?: string;
  licenseNumber?: string;
  businessBio?: string;
  characterLimit?: number;
  businessProfileImage?: { url: string; verified: boolean };
  featureBanner?: { url: string; verified: boolean };
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
  [key: string]: unknown;
};

export async function getOnboardingData(): Promise<OnboardingDataRecord | null> {
  try {
    const envelope = await apiRequestEnvelope<OnboardingDataRecord>(
      "/api/vendor-onboarding/onboarding-data",
      {
        bearer: true,
        notFoundReturnsNull: true,
      }
    );

    if (!envelope) {
      return null;
    }

    return (envelope.data as OnboardingDataRecord | undefined) ?? null;
  } catch (error) {
    if (error instanceof ApiClientError && error.kind === "notFound") {
      return null;
    }
    wrapVendorError(error, "Failed to fetch onboarding data");
  }
}

export async function updateBusinessProfile(payload: Record<string, unknown> | object) {
  try {
    const envelope = await apiRequestEnvelope<OnboardingDataRecord>(
      "/api/vendor-onboarding/business-profile",
      {
        method: "PUT",
        body: payload,
        bearer: true,
      }
    );
    return envelope?.data;
  } catch (error) {
    wrapVendorError(error, "Failed to update business profile");
  }
}
