"use client";

import { FormEvent, useEffect, useState } from "react";
import { DEFAULT_PUBLIC_SEARCH_FILTERS, PublicSearchFilters, US_STATE_OPTIONS } from "./publicSearch";

type MinorityType = {
  _id: string;
  name: string;
};

type PublicSearchFilterBarProps = {
  filters?: PublicSearchFilters;
  onChange: (filters: PublicSearchFilters) => void;
  onSubmit: () => void;
  keywordLabel?: string;
  keywordPlaceholder?: string;
  locationLabel?: string;
  minorityLabel?: string;
  submitLabel?: string;
  showClearFilters?: boolean;
  onClearFilters?: () => void;
};

export default function PublicSearchFilterBar({
  filters = DEFAULT_PUBLIC_SEARCH_FILTERS,
  onChange,
  onSubmit,
  keywordLabel = "Search by keyword",
  keywordPlaceholder = "Product, service, or business name",
  locationLabel = "Filter by state",
  minorityLabel = "Filter by minority type",
  submitLabel = "Search marketplace",
  showClearFilters = false,
  onClearFilters,
}: PublicSearchFilterBarProps) {
  const [minorityTypes, setMinorityTypes] = useState<MinorityType[]>([]);
  const [loadingMinorityTypes, setLoadingMinorityTypes] = useState(true);
  const [minorityTypesError, setMinorityTypesError] = useState(false);

  const hasActiveFilters =
    Boolean(filters.keyword.trim()) ||
    Boolean(filters.location.trim()) ||
    Boolean(filters.minorityType.trim());

  useEffect(() => {
    let isMounted = true;

    const fetchMinorityTypes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/minority-types`);
        const data = await res.json();

        if (!isMounted) {
          return;
        }

        setMinorityTypes(Array.isArray(data) ? data : []);
        setMinorityTypesError(false);
      } catch (error) {
        console.error("Failed to load minority types", error);
        if (isMounted) {
          setMinorityTypes([]);
          setMinorityTypesError(true);
        }
      } finally {
        if (isMounted) {
          setLoadingMinorityTypes(false);
        }
      }
    };

    fetchMinorityTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full py-2 text-market-text">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6"
      >
        <div className="min-w-0 flex-[3]">
          <label className="market-label">{keywordLabel}</label>
          <input
            type="text"
            placeholder={keywordPlaceholder}
            value={filters.keyword}
            onChange={(event) => onChange({ ...filters, keyword: event.target.value })}
            className="market-input"
          />
        </div>

        <div className="min-w-0 flex-1">
          <label className="market-label">{locationLabel}</label>
          <div className="market-select-wrap">
            <select
              value={filters.location}
              onChange={(event) => onChange({ ...filters, location: event.target.value })}
              className="market-select"
            >
              <option value="">All locations</option>
              {US_STATE_OPTIONS.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <div className="market-select-chevron">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="market-filter-loading-hint">
            State filters search current marketplace listings; availability may vary.
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <label className="market-label">{minorityLabel}</label>
          <div
            className={`market-select-wrap ${loadingMinorityTypes ? "market-select-wrap--loading" : ""}`}
          >
            <select
              value={filters.minorityType}
              onChange={(event) => onChange({ ...filters, minorityType: event.target.value })}
              className="market-select"
              aria-busy={loadingMinorityTypes}
            >
              <option value="">All business types</option>
              {minorityTypes.map((option) => (
                <option key={option._id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
            <div className="market-select-chevron">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {loadingMinorityTypes ? (
            <p className="market-filter-loading-hint">Loading business types…</p>
          ) : minorityTypesError ? (
            <p className="market-filter-loading-hint">Business types unavailable — search still works.</p>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <button
            type="submit"
            className="market-btn-primary flex h-10 w-full items-center justify-center text-sm normal-case"
          >
            {submitLabel}
          </button>
          {showClearFilters && hasActiveFilters && onClearFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="market-btn-outline flex h-10 w-full items-center justify-center text-sm normal-case"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
