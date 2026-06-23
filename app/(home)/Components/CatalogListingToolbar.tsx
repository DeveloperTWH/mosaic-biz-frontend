import type { ReactNode } from "react";

type CatalogListingToolbarProps = {
  summary: string;
  sortSlot?: ReactNode;
};

export function formatCatalogRange(
  start: number,
  end: number,
  total: number,
  label: string
): string {
  const normalizedLabel = total === 1 ? label.replace(/s$/, "") : label;

  if (total === 0) {
    return `No ${label} found`;
  }

  if (start === end) {
    return `Showing ${start} of ${total} ${normalizedLabel}`;
  }

  return `Showing ${start}–${end} of ${total} ${normalizedLabel}`;
}

export default function CatalogListingToolbar({
  summary,
  sortSlot,
}: CatalogListingToolbarProps) {
  return (
    <div className="catalog-listing-toolbar">
      <p className="market-result-count">{summary}</p>
      {sortSlot ? <div className="catalog-listing-sort">{sortSlot}</div> : null}
    </div>
  );
}
