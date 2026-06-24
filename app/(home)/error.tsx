"use client";

import MarketErrorState from "./Components/MarketErrorState";

export default function HomeError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-page py-16">
      <MarketErrorState
        title="Something went wrong"
        description="We could not load this page. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
