import { api } from "@/lib/api";
import { ApiClientError } from "./errors";
import { apiRequest, buildApiUrl, getApiBaseUrl } from "./httpClient";

export { api };
export { ApiClientError, getUserSafeMessage } from "./errors";
export { apiRequest, apiRequestEnvelope, buildApiUrl, getApiBaseUrl } from "./httpClient";
export { checkAuthSession, checkAuthSessionResult, confirmPostLoginSession, isSessionActive, logoutSession } from "./authSession";
export { initiateOrder, getUserSafeOrderErrorMessage } from "./orders";
export {
  listPendingVendorApplications,
  getVendorApplicationDetail,
  verifyVendorApplicationItem,
  finalizeVendorApplication,
  mapAdminVendorFetchError,
} from "./vendorOnboardingAdmin";

/** @deprecated Prefer ApiClientError from ./errors */
export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** @deprecated Prefer ApiClientError mapping in domain modules */
export async function handleApiError(err: unknown, fallback = "Request failed"): Promise<never> {
  if (err instanceof ApiClientError) {
    throw new ApiError(err.message, err.status);
  }
  if (err && typeof err === "object" && "response" in err) {
    const ax = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
    throw new ApiError(ax.response?.data?.message || ax.message || fallback, ax.response?.status);
  }
  throw new ApiError(err instanceof Error ? err.message : fallback);
}

export type ListResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export function normalizeListResponse<T>(raw: Record<string, unknown>, dataKey = "data"): ListResponse<T> {
  const data = Array.isArray(raw[dataKey]) ? (raw[dataKey] as T[]) : [];
  return {
    data,
    total: Number(raw.total ?? data.length ?? 0),
    page: Number(raw.page ?? 1),
    pageSize: Number(raw.pageSize ?? raw.limit ?? 10),
  };
}
