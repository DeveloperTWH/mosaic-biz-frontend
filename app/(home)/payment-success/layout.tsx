import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Payment Success",
  description: "Payment confirmation for a Mosaic Biz Hub marketplace order.",
  path: "/payment-success",
  noIndex: true,
});

export default function PaymentSuccessLayout({ children }: { children: ReactNode }) {
  return children;
}
