"use client";

import MarketEmptyState from "./Components/MarketEmptyState";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-page py-16">
      <MarketEmptyState
        title="Something went wrong"
        description={error.message || "We couldn't load this page. Please try again."}
      />
      <div className="mt-4 text-center">
        <button type="button" className="market-btn-primary min-h-11 px-6" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
