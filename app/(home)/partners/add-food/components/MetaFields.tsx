import React from 'react';
import { Plus, X } from 'lucide-react';
import { MetaField } from '../types';

interface Props {
  metaFields: MetaField[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof MetaField, value: string) => void;
  onRemove: (index: number) => void;
}

export default function MetaFields({ metaFields, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4 border-l-4 border-[#c9a227] pl-3">
        Additional Meta Fields
      </h2>

      <div className="space-y-3">
        {metaFields.map((field, index) => (
          <div key={index} className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={field.key}
              onChange={(e) => onUpdate(index, 'key', e.target.value)}
              placeholder="Field key"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={field.value}
                onChange={(e) => onUpdate(index, 'value', e.target.value)}
                placeholder="Field value"
                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-2 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onAdd}
          className="mt-2 px-3 py-1.5 border border-dashed border-gray-300 text-gray-600 text-xs rounded hover:border-[#c9a227] hover:text-[#c9a227] transition-colors w-full flex items-center justify-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add Meta Field
        </button>
      </div>
    </div>
  );
}
