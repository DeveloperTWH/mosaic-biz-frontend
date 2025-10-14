'use client';

import React, { useEffect, useState } from 'react';

type MinorityType = {
  _id: string;
  name: string;
};

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

  const [minorityTypes, setMinorityTypes] = useState<MinorityType[]>([]);
  const [loadingMinority, setLoadingMinority] = useState(true);

  useEffect(() => {
    const fetchMinorityTypes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/minority-types`);
        const data = await res.json();
        setMinorityTypes(data);
      } catch (err) {
        console.error('Failed to load minority types', err);
      } finally {
        setLoadingMinority(false);
      }
    };

    fetchMinorityTypes();
  }, []);

  return (
    <section className="px-6 py-10 mx-auto max-w-7xl">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Search Here"
          className="w-full px-4 py-2 border md:w-1/2"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="w-full px-4 py-3 border md:w-1/3 "
          value={minorityType}
          onChange={(e) => setMinorityType(e.target.value)}
          disabled={loadingMinority}
        >
          {loadingMinority ? (
            <option>Loading types...</option>
          ) : minorityTypes.length > 0 ? (
            <>
              <option value="">All Types</option>
              {minorityTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </>
          ) : (
            <option disabled>No types available</option>
          )}
        </select>
        {/* <input
          type="text"
          placeholder="Search by Location"
          className="w-full px-4 py-2 border md:w-1/4"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        /> */}

        <button
          onClick={onSearch}
          className="py-2 text-base text-white px-7 bg-custom-orange md:text-lg"
        >
          Search Here
        </button>

      </div>
    </section>
  );
};

export default FilterBar;
