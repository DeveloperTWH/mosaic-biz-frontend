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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
          
          {/* Filter By Business Type */}
          <div className="flex-1 min-w-0">
            <label className="block mb-2 text-sm font-medium text-white">
              Filter By Business Type
            </label>
            <input
              type="text"
              placeholder="Type Here"
              className="w-full h-12 px-4 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Filter By Location */}
          <div className="flex-1 min-w-0">
            <label className="block mb-2 text-sm font-medium text-white">
              Filter By Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Location"
                className="w-full h-12 px-4 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Filter By Minority */}
          <div className="flex-1 min-w-0">
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
                  <option>Loading minority types...</option>
                ) : minorityTypes.length > 0 ? (
                  <>
                    <option value="">Choose Minority</option>
                    {minorityTypes.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.name}
                      </option>
                    ))}
                  </>
                ) : (
                  <option disabled>No minority types available</option>
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Search Button with Icon */}
          <div className="flex-1 min-w-0">
            <label className="block mb-2 text-sm font-medium text-white">
              Search
            </label>
            <div className="relative">
              <button
                onClick={onSearch}
                className="w-full h-12 pl-12 pr-4 text-left text-lg font-semibold text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-custom-orange"
              >
                Search Here
              </button>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FilterBar;