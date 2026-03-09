import React, { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';

interface Props {
  bookingToolLink?: string;
  onBookingLinkChange: (link: string) => void;
}

export default function BookingTool({
  bookingToolLink,
  onBookingLinkChange,
}: Props) {
  const [useBookingTool, setUseBookingTool] = useState(!bookingToolLink);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        Booking Tool
      </h2>

      <div className="space-y-4">
        {/* Yes / No Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Booking Tool Required?
          </label>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={useBookingTool}
                onChange={() => setUseBookingTool(true)}
                className="w-4 h-4 text-[#c9a227]"
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!useBookingTool}
                onChange={() => setUseBookingTool(false)}
                className="w-4 h-4 text-[#c9a227]"
              />
              <span className="text-sm text-gray-700">
                No, I will use my own tool.
              </span>
            </label>
          </div>
        </div>

        {/* Show ONLY when user selects "No, I will use my own tool" */}
        {!useBookingTool && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter The Link To Your Booking Tool
            </label>

            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="url"
                value={bookingToolLink || ''}
                onChange={(e) => onBookingLinkChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
                placeholder="https://booking.example.com"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
