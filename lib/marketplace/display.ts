export function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (value && typeof value === "object" && "$numberDecimal" in value) {
    const parsed = Number((value as { $numberDecimal?: string }).$numberDecimal);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function isDisplayablePrice(value: unknown, options?: { allowZero?: boolean }): boolean {
  const price = toFiniteNumber(value);
  if (price === null) return false;
  return options?.allowZero ? price >= 0 : price > 0;
}

export function formatMarketPrice(
  value: unknown,
  options?: {
    allowZero?: boolean;
    currency?: string;
    locale?: string;
  }
): string | null {
  const price = toFiniteNumber(value);
  if (price === null) return null;
  if (!options?.allowZero && price <= 0) return null;

  return new Intl.NumberFormat(options?.locale ?? "en-US", {
    style: "currency",
    currency: options?.currency ?? "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
