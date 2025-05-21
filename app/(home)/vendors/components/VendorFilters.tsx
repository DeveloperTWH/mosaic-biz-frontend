'use client';

import { useState } from 'react';

export default function VendorFilters() {
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    console.log({ category, city, search });
    // Later: push query to URL or update filter state for fetch
  };

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
      <select
        className="border p-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option>Men & Women Fashion</option>
        <option>Electronics</option>
      </select>

      <input
        type="text"
        className="border p-2"
        placeholder="Enter City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        type="text"
        className="border p-2"
        placeholder="Search Business Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Search
      </button>
    </div>
  );
}
