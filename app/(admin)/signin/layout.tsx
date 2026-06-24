import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Admin Sign In",
  description: "Sign in to the Mosaic Biz Hub admin portal.",
  path: "/signin",
  noIndex: true,
});

export default function AdminSigninLayout({ children }: { children: ReactNode }) {
  return children;
}
