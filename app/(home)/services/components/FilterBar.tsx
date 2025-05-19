"use client";

import { useState } from "react";

const FilterBar = () => {
  const [searchText, setSearchText] = useState("");
  const [minorityType, setMinorityType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = () => {
    console.log({
      searchText,
      minorityType,
      priceRange,
    });

    // Add navigation or filter logic here
  };

  return (
    <section className="py-10 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search Here"
          className="border px-4 py-2 rounded w-full md:w-1/4"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded w-full md:w-1/4"
          value={minorityType}
          onChange={(e) => setMinorityType(e.target.value)}
        >
          <option value="">Choose Minority Type</option>
          <option value="black-owned">Black-Owned</option>
          <option value="latinx-owned">Latinx-Owned</option>
          <option value="women-owned">Women-Owned</option>
        </select>

        <select
          className="border px-4 py-2 rounded w-full md:w-1/4"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <option value="">Choose Price Range</option>
          <option value="0-50">$0 - $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100+">$100+</option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-custom-orange text-white px-10 py-3 text-base md:text-lg rounded"
        >
          Search Here
        </button>

      </div>
    </section>
  );
};

export default FilterBar;
