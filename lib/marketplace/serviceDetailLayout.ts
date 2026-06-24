export const SERVICE_DETAIL_RESPONSIVE_CLASSES = {
  pageShell: "market-surface-light min-h-screen overflow-x-hidden pb-24 font-sans lg:pb-0",
  contentGrid: "grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]",
  leftColumn: "min-w-0",
  sidebar: "min-w-0 space-y-6",
  detailRow: "grid min-w-0 grid-cols-1 gap-1 sm:grid-cols-[96px_1fr] sm:gap-2 items-start",
  documentRow: "grid min-w-0 grid-cols-1 gap-1 sm:grid-cols-[96px_1fr] sm:gap-2 items-center",
  hoursRow: "grid min-w-0 grid-cols-1 gap-1 sm:grid-cols-[120px_1fr] sm:gap-x-2 items-center text-[12px]",
} as const;
