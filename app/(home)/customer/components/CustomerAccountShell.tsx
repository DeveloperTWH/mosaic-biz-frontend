import type { ReactNode } from "react";
import PublicPageHero, { type BreadcrumbItem } from "../../Components/PublicPageHero";

export interface CustomerAccountShellProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
}

export default function CustomerAccountShell({
  title,
  breadcrumbs = [{ label: "Home", href: "/" }, { label: title }],
  children,
}: CustomerAccountShellProps) {
  return (
    <main className="w-full">
      <PublicPageHero title={title} breadcrumbs={breadcrumbs} />
      <div className="min-h-[50vh] bg-brand-cream">
        <div className="container-page py-8 sm:py-10">{children}</div>
      </div>
    </main>
  );
}
