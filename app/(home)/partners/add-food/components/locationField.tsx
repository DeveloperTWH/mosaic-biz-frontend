import React from 'react';
import { MapPin, Info } from 'lucide-react';

interface Location {
  address?: string;
}

interface Props {
  location?: Location;
  onLocationChange: (location: Location) => void;
}

export default function LocationField({ location, onLocationChange }: Props) {
  return (
    <div className="space-y-1">
      {/* Label with Tooltip */}
      <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
        <MapPin className="w-4 h-4 text-[#c9a227]" />
        Map Location

        {/* Tooltip Wrapper */}
        <div className="relative group">
          <Info className="w-4 h-4 text-gray-400 cursor-pointer" />

          {/* Tooltip */}
          <div className="absolute left-0 top-6 hidden group-hover:block z-10 w-64 p-3 text-xs text-gray-700 bg-white border border-gray-200 rounded-md shadow-lg">
            <p className="font-semibold mb-1">
              📍 How to Add Your Business Map Link:
            </p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Open Google Maps</li>
              <li>Search for your business name</li>
              <li>Select the correct listing</li>
              <li>Click on “Share”</li>
              <li>Tap “Copy Link”</li>
              <li>Paste the link here</li>
            </ol>
          </div>
        </div>
      </label>

      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={location?.address || ''}
          onChange={(e) => onLocationChange({ address: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm bg-white focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
          placeholder="Enter Google Maps link here"
        />
      </div>
    </div>
  );
}