"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type ListingFilters,
  DEFAULT_LISTING_FILTERS,
  parseListingFiltersFromSearchParams,
  buildListingPageUrl,
} from "@/app/(home)/Components/publicSearch";

export function useListingFilters(basePath?: string) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = basePath ?? pathname;

  const filters = useMemo(
    () => parseListingFiltersFromSearchParams(searchParams),
    [searchParams]
  );

  const setFilters = useCallback(
    (next: Partial<ListingFilters>, options?: { replace?: boolean }) => {
      const merged: ListingFilters = { ...filters, ...next };
      const url = buildListingPageUrl(path, merged);
      if (options?.replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [filters, path, router]
  );

  const resetFilters = useCallback(() => {
    router.push(path);
  }, [path, router]);

  return {
    filters,
    setFilters,
    resetFilters,
    defaults: DEFAULT_LISTING_FILTERS,
  };
}
