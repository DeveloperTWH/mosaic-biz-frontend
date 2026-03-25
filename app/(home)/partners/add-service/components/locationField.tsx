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
    <div className="space-y-1">
      {/* Label */}
      <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
        <MapPin className="w-4 h-4 text-[#c9a227]" />
        Map Location
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

      {/* Instructions */}
      <div className="text-[10px] text-gray-500 space-y-0.5">
        <p className="font-semibold">📍 How to Add Your Business Map Link:</p>
        <ol className="list-decimal list-inside">
          <li>Open Google Maps</li>
          <li>Search for your business name</li>
          <li>Select the correct listing</li>
          <li>Click on “Share”</li>
          <li>Tap “Copy Link”</li>
          <li>Paste the link here</li>
        </ol>
      </div>
    </div>
  );
}