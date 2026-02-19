import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  totalServices: number;
}

export default function ServiceFilters({ filters, onFilterChange, totalServices }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-40 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          className="w-40 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Showing {totalServices} services
      </div>
    </div>
  );
}