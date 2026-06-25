import { Suspense } from "react";
import SearchPageContent from "./Component/SearchPageContent";
import MarketLoadingBlock from "../../Components/MarketLoadingBlock";

export default function SearchPage() {
  return (
    <Suspense fallback={<MarketLoadingBlock label="Loading search…" minHeight="min-h-[50vh]" />}>
      <SearchPageContent />
    </Suspense>
  );
}
