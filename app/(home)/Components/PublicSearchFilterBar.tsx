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
}: PublicSearchFilterBarProps) {
  const [minorityTypes, setMinorityTypes] = useState<MinorityType[]>([]);
  const [loadingMinorityTypes, setLoadingMinorityTypes] = useState(true);

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
      } catch (error) {
        console.error("Failed to load minority types", error);
        if (isMounted) {
          setMinorityTypes([]);
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
              <option value="">Choose State</option>
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
        </div>

        <div className="min-w-0 flex-1">
          <label className="market-label">{minorityLabel}</label>
          <div className="market-select-wrap">
            <select
              value={filters.minorityType}
              onChange={(event) => onChange({ ...filters, minorityType: event.target.value })}
              disabled={loadingMinorityTypes}
              className="market-select"
            >
              <option value="">
                {loadingMinorityTypes ? "Loading minority types..." : "Choose Minority"}
              </option>
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
        </div>

        <div className="min-w-0 flex-1">
          <button
            type="submit"
            className="market-btn-primary flex h-10 w-full items-center justify-center text-sm normal-case"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
