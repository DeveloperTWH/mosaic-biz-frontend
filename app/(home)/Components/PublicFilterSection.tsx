import { ReactNode } from "react";

type PublicFilterSectionProps = {
  children: ReactNode;
};

/** Padded card wrapper for listing-page search/filter bars (matches HomeSearchSection spacing). */
export default function PublicFilterSection({ children }: PublicFilterSectionProps) {
  return (
    <section className="bg-market-bg px-4 pb-2 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/15 bg-market-elevated p-4 shadow-market-card sm:p-6">
        {children}
      </div>
    </section>
  );
}
