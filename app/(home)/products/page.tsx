import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import MarketLoadingBlock from "../Components/MarketLoadingBlock";

export const dynamic = "force-dynamic"; // avoid prerender/export error

export default function Page() {
  return (
    <Suspense fallback={<MarketLoadingBlock label="Loading shop..." minHeight="min-h-[40vh]" />}>
      <ProductsClient />
    </Suspense>
  );
}
