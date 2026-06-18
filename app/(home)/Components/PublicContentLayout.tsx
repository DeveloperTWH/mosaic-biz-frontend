import type { ReactNode } from "react";
import PublicPageHero, { PublicPageHeroProps } from "./PublicPageHero";

export interface PublicContentLayoutProps extends PublicPageHeroProps {
  children: ReactNode;
  maxWidthClass?: string;
}

export default function PublicContentLayout({
  children,
  maxWidthClass = "max-w-[900px]",
  ...heroProps
}: PublicContentLayoutProps) {
  return (
    <main className="w-full bg-market-bg">
      <PublicPageHero {...heroProps} />
      <div className={`container-page public-prose py-8 sm:py-12 ${maxWidthClass}`}>
        {children}
      </div>
    </main>
  );
}
