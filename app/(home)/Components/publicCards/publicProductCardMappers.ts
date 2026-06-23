import { trimDescription, toDisplayPrice } from "./publicCardUtils";
import type { PublicProductCardProps } from "./PublicProductCard";

type FirstEligible = {
  images?: string[];
  price?: number;
  salePrice?: number | null;
  onSale?: boolean;
  effectivePrice?: number;
  totalStock?: number;
  allowBackorder?: boolean;
};

type RankedLike = {
  _id: string;
  title?: string;
  description?: string;
  coverImage?: string;
  averageRating?: number;
  totalReviews?: number;
  firstEligible?: FirstEligible;
  price?: unknown;
  badge?: string | null;
  businessId?: { businessName?: string; badge?: string | null } | string;
  businessDetails?: { badge?: string | null };
};

function pickBadge(item: RankedLike): string | null {
  const raw =
    item.badge ??
    item.businessDetails?.badge ??
    (typeof item.businessId === "object" ? item.businessId?.badge : null);
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function pickVendorName(item: RankedLike): string | undefined {
  if (typeof item.businessId === "object" && item.businessId?.businessName) {
    return item.businessId.businessName.trim();
  }
  return undefined;
}

function gatherImage(item: RankedLike): string | undefined {
  return item.firstEligible?.images?.[0] ?? item.coverImage ?? undefined;
}

function pickPriceFields(item: RankedLike) {
  const fe = item.firstEligible;
  if (fe) {
    const price = Number(fe.price ?? 0);
    const salePrice = fe.salePrice == null ? null : Number(fe.salePrice);
    const onSale = Boolean(fe.onSale && salePrice != null);
    const effective = onSale ? (salePrice as number) : (fe.effectivePrice ?? price);
    return { price, compareAtPrice: onSale ? price : null, onSale, effective };
  }

  const price = toDisplayPrice(item.price) ?? 0;
  return { price, compareAtPrice: null as number | null, onSale: false, effective: price };
}

export function getStockHint(
  stock?: number | null,
  allowBackorder?: boolean
): string | null {
  if (stock == null) return null;
  if (stock <= 0 && !allowBackorder) return "Out of stock";
  if (stock > 0 && stock <= 5) return `Only ${stock} left`;
  return null;
}

export function mapRankedItemToPublicProductCard(item: RankedLike): PublicProductCardProps {
  const { price, compareAtPrice, onSale } = pickPriceFields(item);
  const rating =
    typeof item.averageRating === "number"
      ? Math.max(0, Math.min(5, item.averageRating))
      : undefined;

  return {
    href: `/product/${item._id}`,
    title: item.title?.trim() || "Untitled product",
    description: trimDescription(item.description),
    image: gatherImage(item),
    price: onSale ? compareAtPrice : price,
    compareAtPrice: onSale ? price : null,
    onSale,
    vendorName: pickVendorName(item),
    badge: pickBadge(item),
    rating,
    reviewCount: item.totalReviews ?? 0,
    actionLabel: "View product",
    stockHint: getStockHint(item.firstEligible?.totalStock, item.firstEligible?.allowBackorder),
  };
}

export function mapApiProductToPublicProductCard(item: {
  _id: string;
  title?: string;
  description?: string;
  price?: unknown;
  coverImage?: string;
  businessId?: { businessName?: string; badge?: string | null };
}): PublicProductCardProps {
  const price = toDisplayPrice(item.price) ?? 0;

  return {
    href: `/product/${item._id}`,
    title: item.title?.trim() || "Untitled product",
    description: trimDescription(item.description),
    image: item.coverImage,
    price,
    vendorName: item.businessId?.businessName?.trim(),
    badge: item.businessId?.badge ?? null,
    actionLabel: "View product",
  };
}
