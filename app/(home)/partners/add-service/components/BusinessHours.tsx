import React from 'react';
import { Clock } from 'lucide-react';

interface BusinessHour {
  day: string;
  hours: string;
  closed?: boolean;
}

interface Props {
  businessHours: BusinessHour[];
  onUpdate: (index: number, field: keyof BusinessHour, value: any) => void;
}

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const defaultHours = '00:00 - 00:00';

export default function BusinessHours({
  businessHours,
  onUpdate,
}: Props) {
  return (
    <div className="space-y-2">
      {businessHours.map((hour, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-32 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-700">
            {daysOfWeek[index]}
          </div>

          <div className="flex-1 relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={hour.hours || defaultHours}
              onChange={(e) => onUpdate(index, 'hours', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
              placeholder="00:00 - 00:00"
            />
          </div>

          <label className="flex items-center gap-2 text-sm min-w-[70px]">
            <input
              type="checkbox"
              checked={hour.closed || false}
              onChange={(e) => onUpdate(index, 'closed', e.target.checked)}
              className="w-4 h-4 text-[#c9a227] rounded"
            />
            Closed
          </label>
        </div>
      ))}
    </div>
  );
}