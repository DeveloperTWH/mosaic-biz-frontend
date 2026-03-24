'use client';

import PublicSearchFilterBar from "../../Components/PublicSearchFilterBar";
import { PublicSearchFilters } from "../../Components/publicSearch";

interface FilterBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  minorityType: string;
  setMinorityType: (type: string) => void;
  searchLocation: string;
  setSearchLocation: (location: string) => void;
  onSearch: () => void;
}

export default function FilterBar({
  searchText,
  setSearchText,
  minorityType,
  setMinorityType,
  searchLocation,
  setSearchLocation,
  onSearch,
}: FilterBarProps) {
  const filters: PublicSearchFilters = {
    keyword: searchText,
    location: searchLocation,
    minorityType,
  };

  return (
    <PublicSearchFilterBar
      filters={filters}
      onChange={(nextFilters) => {
        setSearchText(nextFilters.keyword);
        setSearchLocation(nextFilters.location);
        setMinorityType(nextFilters.minorityType);
      }}
      onSubmit={onSearch}
    />
  );
}
