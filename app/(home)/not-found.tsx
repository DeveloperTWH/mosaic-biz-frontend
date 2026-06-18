import Link from "next/link";
import MarketEmptyState from "./Components/MarketEmptyState";

export default function NotFound() {
  return (
    <div className="container-page py-16">
      <MarketEmptyState
        title="Page not found"
        description="This listing or page may have moved. Browse the marketplace to continue."
        ctaLabel="Go to homepage"
        ctaHref="/"
      />
      <p className="mt-6 text-center text-sm text-market-muted">
        <Link href="/products" className="text-market-gold hover:underline">
          Shop products
        </Link>
        {" · "}
        <Link href="/search" className="text-market-gold hover:underline">
          Search marketplace
        </Link>
      </p>
    </div>
  );
}
