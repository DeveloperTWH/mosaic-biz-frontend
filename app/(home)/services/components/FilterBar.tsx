"use client";

import { useState } from "react";

// Define the types for the props that FilterBar will receive
interface FilterBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  minorityType: string;
  setMinorityType: (type: string) => void;
  searchLocation: string;
  setSearchLocation: (location: string) => void;
  onSearch: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchText,
  setSearchText,
  minorityType,
  setMinorityType,
  searchLocation,
  setSearchLocation,
  onSearch,
}) => {
  return (
    <section className="py-10 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search Here"
          className="border px-4 py-2 w-full md:w-1/4"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="border px-4 py-2 w-full md:w-1/4 text-gray-500"
          value={minorityType}
          onChange={(e) => setMinorityType(e.target.value)}
        >
          <option value="">Choose Minority Type</option>
          <option value="black-owned">Black-Owned</option>
          <option value="latinx-owned">Latinx-Owned</option>
          <option value="women-owned">Women-Owned</option>
        </select>

        <input
          type="text"
          placeholder="Search by Location"
          className="border px-4 py-2 w-full md:w-1/4"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />

        <button
          onClick={onSearch}
          className="bg-custom-orange text-white px-10 py-2 text-base md:text-lg"
        >
          Search Here
        </button>

      </div>
    </section>
  );
};

export default FilterBar;
