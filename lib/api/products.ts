import { api, handleApiError, normalizeListResponse, type ListResponse } from "./client";
import { listingFiltersToApiParams, type ListingFilters } from "@/app/(home)/Components/publicSearch";

export type ProductListItem = Record<string, unknown>;

export async function listProducts(filters: Partial<ListingFilters> = {}): Promise<ListResponse<ProductListItem>> {
  try {
    const res = await api.get("/api/products/list", {
      params: { page: 1, limit: 10, ...listingFiltersToApiParams(filters) },
    });
    return normalizeListResponse<ProductListItem>(res.data || {});
  } catch (err) {
    return handleApiError(err, "Failed to load products");
  }
}

export async function getProductById(id: string): Promise<ProductListItem | null> {
  try {
    const res = await api.get(`/api/product/${id}`);
    return (res.data?.data ?? res.data) as ProductListItem;
  } catch {
    return null;
  }
}
