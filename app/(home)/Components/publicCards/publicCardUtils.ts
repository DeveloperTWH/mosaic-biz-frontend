export function stripHtml(value?: string): string {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, "").trim() : "";
}

export function trimDescription(value?: string, maxLength = 100): string {
  const text = stripHtml(value);
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}...` : text;
}

export function toDisplayPrice(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (value && typeof value === "object" && "$numberDecimal" in value) {
    const parsed = Number((value as { $numberDecimal?: string }).$numberDecimal);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
