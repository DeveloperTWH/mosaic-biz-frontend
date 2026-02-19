import React from 'react';
import { MapPin } from 'lucide-react';

interface Location {
  address?: string;
}

interface Props {
  location?: Location;
  onLocationChange: (location: Location) => void;
}

export default function LocationField({ location, onLocationChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Map Location
      </label>
      <div className="relative">
        <input
          type="text"
          value={location?.address || ''}
          onChange={(e) => onLocationChange({ address: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm bg-white focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
          placeholder="Enter location"
        />
      </div>
    </div>
  );
}