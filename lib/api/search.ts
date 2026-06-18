import { api, handleApiError, normalizeListResponse, type ListResponse } from "./client";
import { listingFiltersToApiParams, type ListingFilters } from "@/app/(home)/Components/publicSearch";

export type FoodListItem = Record<string, unknown>;

export async function listFoods(filters: Partial<ListingFilters> = {}): Promise<ListResponse<FoodListItem>> {
  try {
    const res = await api.get("/api/food/list", {
      params: { page: 1, limit: 10, ...listingFiltersToApiParams(filters) },
    });
    return normalizeListResponse<FoodListItem>(res.data || {});
  } catch (err) {
    return handleApiError(err, "Failed to load foods");
  }
}
