import { ApiClientError, getUserSafeMessage } from "./errors";
import { apiRequest, apiRequestEnvelope } from "./httpClient";

export type PendingVendorApplication = {
  _id: string;
  applicationId: string;
  businessName: string;
  status: string;
  [key: string]: unknown;
};

export type AdminVendorApplicationDetail = Record<string, unknown> & {
  _id?: string;
  applicationId?: string;
  businessName?: string;
  status?: string;
};

export class AdminVendorReviewError extends ApiClientError {
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
    this.name = "AdminVendorReviewError";
  }
}

function wrapAdminError(error: unknown, fallback: string): never {
  if (error instanceof ApiClientError) {
    throw new AdminVendorReviewError(error);
  }
  throw new ApiClientError({
    kind: "network",
    message: getUserSafeMessage(error, fallback),
    cause: error,
    isJson: false,
  });
}

export async function listPendingVendorApplications(): Promise<PendingVendorApplication[]> {
  try {
    const envelope = await apiRequestEnvelope<PendingVendorApplication[]>(
      "/api/vendor-onboarding/pending"
    );

    if (!envelope) {
      return [];
    }

    if (envelope.success === false) {
      throw new ApiClientError({
        kind: "validation",
        message: envelope.message || "Failed to load vendor applications.",
        payload: envelope,
      });
    }

    const list = Array.isArray(envelope.data) ? envelope.data : null;
    if (!list) {
      throw new ApiClientError({
        kind: "malformed",
        message: "Unexpected vendor applications response from server.",
        payload: envelope,
      });
    }

    return list;
  } catch (error) {
    wrapAdminError(error, "Failed to fetch applications.");
  }
}

export async function getVendorApplicationDetail(
  applicationId: string
): Promise<AdminVendorApplicationDetail> {
  try {
    const envelope = await apiRequestEnvelope<AdminVendorApplicationDetail>(
      `/api/vendor-onboarding/${encodeURIComponent(applicationId)}`
    );

    if (!envelope || envelope.success === false || !envelope.data) {
      throw new ApiClientError({
        kind: envelope?.success === false ? "validation" : "malformed",
        message: envelope?.message || "Failed to load application details.",
        payload: envelope ?? undefined,
      });
    }

    return envelope.data;
  } catch (error) {
    wrapAdminError(error, "Failed to fetch application details.");
  }
}

export async function verifyVendorApplicationItem(
  applicationId: string,
  body: Record<string, unknown>
): Promise<void> {
  try {
    await apiRequest(`/api/vendor-onboarding/${encodeURIComponent(applicationId)}/verify`, {
      method: "POST",
      body,
    });
  } catch (error) {
    wrapAdminError(error, "Verification failed.");
  }
}

export async function finalizeVendorApplication(applicationId: string): Promise<void> {
  try {
    await apiRequest(`/api/vendor-onboarding/${encodeURIComponent(applicationId)}/finalize`, {
      method: "POST",
    });
  } catch (error) {
    wrapAdminError(error, "Failed to finalize application.");
  }
}

export function mapAdminVendorFetchError(error: unknown): {
  kind: "auth" | "forbidden" | "api";
  message: string;
} {
  if (error instanceof ApiClientError || error instanceof AdminVendorReviewError) {
    if (error.kind === "unauthenticated") {
      return {
        kind: "auth",
        message: "Your admin session expired. Sign in again to view applications.",
      };
    }
    if (error.kind === "forbidden") {
      return {
        kind: "forbidden",
        message: error.message || "You do not have permission to view vendor applications.",
      };
    }
    return { kind: "api", message: error.message };
  }

  return {
    kind: "api",
    message: getUserSafeMessage(error, "Failed to fetch applications."),
  };
}
