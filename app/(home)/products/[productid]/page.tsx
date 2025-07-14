import { Suspense } from "react";
import SearchPageContent from "./Component/SearchPageContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
