import { api, handleApiError, normalizeListResponse, type ListResponse } from "./client";
import { listingFiltersToApiParams, type ListingFilters } from "@/app/(home)/Components/publicSearch";

export type ServiceListItem = Record<string, unknown>;

export async function listServices(filters: Partial<ListingFilters> = {}): Promise<ListResponse<ServiceListItem>> {
  try {
    const res = await api.get("/api/services/list", {
      params: { page: 1, limit: 10, ...listingFiltersToApiParams(filters) },
    });
    return normalizeListResponse<ServiceListItem>(res.data || {});
  } catch (err) {
    return handleApiError(err, "Failed to load services");
  }
}
