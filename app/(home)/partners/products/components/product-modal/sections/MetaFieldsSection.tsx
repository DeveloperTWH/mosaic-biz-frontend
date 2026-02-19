import React from 'react';

interface Props {
  metaFields: Array<{ key: string; value: string }>;
  onChange: (index: number, field: 'key' | 'value', value: string) => void;
}

export default function MetaFieldsSection({ metaFields, onChange }: Props) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Meta Fields</h3>
      <div className="space-y-2">
        {metaFields.map((field, idx) => (
          <div key={idx} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={field.key}
              onChange={(e) => onChange(idx, 'key', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
              placeholder="Key"
            />
            <input
              type="text"
              value={field.value}
              onChange={(e) => onChange(idx, 'value', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
              placeholder="Value"
            />
          </div>
        ))}
      </div>
    </div>
  );
}