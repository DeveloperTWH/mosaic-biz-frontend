import { api } from "@/lib/api";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function handleApiError(err: unknown, fallback = "Request failed"): Promise<never> {
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

export { api };
