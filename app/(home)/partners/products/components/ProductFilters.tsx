import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { FilterOptions } from '../types';

interface Props {
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: any) => void;
  totalProducts: number;
}

export default function ProductFilters({ filters, onFilterChange, totalProducts }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Here..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
          />
        </div>

        {/* Status Filter */}
        <div className="w-40 relative">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227] appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="low-stock">Low Stock</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Sort By */}
        <div className="w-40 relative">
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227] appearance-none bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Filter Button */}
        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Filter Chips */}
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span>Filters:</span>
        <button className="hover:text-[#c9a227]">Filter by status</button>
        <span className="text-gray-300">|</span>
        <button className="hover:text-[#c9a227]">Filter by price</button>
        <span className="text-gray-300">|</span>
        <button className="hover:text-[#c9a227]">Filter by action</button>
      </div>

      {/* Results Count */}
      <div className="mt-3 text-xs text-gray-500">
        Showing {totalProducts} products
      </div>
    </div>
  );
}