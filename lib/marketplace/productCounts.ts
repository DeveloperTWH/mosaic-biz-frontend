export function getPublicProductListTotal(
  response: { total?: unknown },
  fallbackVisibleCount: number
): number {
  const total = Number(response.total);
  if (Number.isFinite(total) && total >= 0) return total;
  return fallbackVisibleCount;
}

export function getVendorInventoryProductCount(products: readonly unknown[]): number {
  return products.length;
}
