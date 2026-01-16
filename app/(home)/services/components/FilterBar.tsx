'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

type MinorityType = {
  _id: string;
  name: string;
};

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
    <div className="w-full bg-blue-800 py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end gap-4">
          
          {/* Search Input */}
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-white">
              Search Here
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Here"
                className="w-full h-12 pl-12 pr-4 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Filter By Minority Type */}
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-white">
              Filter By Minority
            </label>
            <div className="relative">
              <select
                className="w-full h-12 px-4 text-gray-700 bg-white rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-custom-orange"
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
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Filter By Location */}
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-white">
              Search by Location
            </label>
            <input
              type="text"
              placeholder="Search by Location"
              className="w-full h-12 px-4 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-white">
              &nbsp;
            </label>
            <button
              onClick={onSearch}
              className="w-full h-12 text-lg font-semibold text-black bg-white rounded-lg hover:bg-white-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Search Here
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FilterBar;