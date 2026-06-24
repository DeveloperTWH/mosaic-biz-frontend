export type DeleteVendorProductResult = {
  message: string;
};

export const VENDOR_PRODUCT_DELETE_PATH = "/api/product/delete-product";

function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }
  return baseUrl;
}

function getResponseMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const message = record.message ?? record.error;
  return typeof message === "string" && message.trim() ? message.trim() : null;
}

export function buildVendorProductDeleteUrl(productId: string) {
  return `${getApiBaseUrl()}${VENDOR_PRODUCT_DELETE_PATH}/${encodeURIComponent(productId)}`;
}

export async function deleteVendorProduct(productId: string): Promise<DeleteVendorProductResult> {
  const response = await fetch(buildVendorProductDeleteUrl(productId), {
    method: "DELETE",
    credentials: "include",
  });

  const payload = await response.json().catch(() => null);
  const message = getResponseMessage(payload);

  if (!response.ok) {
    throw new Error(message || "Failed to delete product");
  }

  if (payload && typeof payload === "object" && (payload as Record<string, unknown>).success === false) {
    throw new Error(message || "Failed to delete product");
  }

  return {
    message: message || "Product deleted successfully",
  };
}
