import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Clock, ShieldCheck, Store, Users } from "lucide-react";

export type TrustProofItem = {
  id: string;
  text: string;
  icon: LucideIcon;
};

export const SHOPPER_TRUST_PROOFS: TrustProofItem[] = [
  {
    id: "verified-onboarding",
    text: "Vendors complete onboarding review before they can list",
    icon: ShieldCheck,
  },
  {
    id: "badge-meaning",
    text: "Trust badges reflect verification — not customer ratings",
    icon: BadgeCheck,
  },
  {
    id: "community",
    text: "Built for minority-owned businesses and conscious shoppers",
    icon: Users,
  },
];

export const VENDOR_TRUST_BENEFITS: TrustProofItem[] = [
  {
    id: "reach",
    text: "Reach shoppers actively looking for minority-owned brands",
    icon: Store,
  },
  {
    id: "badge-visibility",
    text: "Display earned trust badges on your storefront and listings",
    icon: BadgeCheck,
  },
  {
    id: "review-speed",
    text: "Verification review begins within 48 hours of application",
    icon: Clock,
  },
];

export const SEARCH_TRUST_NOTE =
  "Listings come from vendors who completed Mosaic onboarding review. Badge levels show verification depth — not star ratings.";

export const MARKETPLACE_VITALITY_NOTE =
  "Live marketplace — new vendors and listings added as businesses complete verification.";

export const SHOPPER_PRODUCT_TRUST_NOTE =
  "Sold by a verified Mosaic vendor. Your payment is processed securely — fulfillment is handled by the seller.";

export const SHOPPER_CART_TRUST_NOTE =
  "Secure checkout. Review shipping and payment on the next step. Charges finalize only after you confirm payment.";

export const SHOPPER_LOW_INVENTORY_NOTE =
  "Our marketplace is growing — early listings are a great way to discover verified minority-owned businesses.";
