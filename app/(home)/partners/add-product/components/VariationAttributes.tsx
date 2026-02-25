import React, { useState } from 'react';
import { Plus, X, Grid } from 'lucide-react';
import { Attribute } from '../types';

interface Props {
  attributes: Attribute[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Attribute, value: any) => void;
  onRemove: (index: number) => void;
  onAddValue: (attrIndex: number, value: string) => void;
  onRemoveValue: (attrIndex: number, valueIndex: number) => void;
  onGenerateVariants: () => void;
  disabled?: boolean;
}

export default function VariationAttributes({
  attributes,
  onAdd,
  onUpdate,
  onRemove,
  onAddValue,
  onRemoveValue,
  onGenerateVariants,
  disabled = false,
}: Props) {
  const [newValue, setNewValue] = useState<Record<number, string>>({});

  const handleAddValue = (attrIndex: number) => {
    const value = newValue[attrIndex]?.trim();
    if (value) {
      onAddValue(attrIndex, value);
      setNewValue(prev => ({ ...prev, [attrIndex]: '' }));
    }
  };

  if (disabled) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-5 opacity-50">
        <h2 className="text-base font-semibold text-gray-400 mb-2">Product Variations Attributes</h2>
        <p className="text-xs text-gray-400 text-center py-4">
          Enable "hasVariants" to configure attributes
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Product Variations Attributes</h2>
        {attributes.length >= 1 && (
          <button
            type="button"
            onClick={onGenerateVariants}
            className="px-3 py-1.5 bg-blue-900 text-white text-xs font-medium rounded hover:bg-[#b8921f] transition-colors flex items-center gap-1"
          >
            <Grid className="w-3 h-3" />
            Generate Variants
          </button>
        )}
      </div>

      <div className="space-y-4">
        {attributes.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-gray-300 rounded">
            <p className="text-xs text-gray-500 mb-3">No attributes added yet</p>
            <button
              type="button"
              onClick={onAdd}
              className="px-3 py-1.5 bg-blue-900 text-white text-xs rounded hover:bg-[#b8921f] transition-colors inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add First Attribute
            </button>
          </div>
        ) : (
          <>
            {attributes.map((attr, attrIndex) => (
              <div key={attrIndex} className="border border-gray-200 rounded p-3">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="text"
                    value={attr.attributeName}
                    onChange={(e) => onUpdate(attrIndex, 'attributeName', e.target.value)}
                    placeholder="Attribute Name"
                    className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
                  />
                  <button
                    type="button"
                    onClick={() => onRemove(attrIndex)}
                    className="p-1 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {attr.attributeValues.map((value, valueIndex) => (
                      <span
                        key={valueIndex}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {value} {valueIndex + 1}
                        <button
                          type="button"
                          onClick={() => onRemoveValue(attrIndex, valueIndex)}
                          className="hover:bg-gray-200 rounded-full p-0.5"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newValue[attrIndex] || ''}
                      onChange={(e) => setNewValue(prev => ({ ...prev, [attrIndex]: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddValue(attrIndex)}
                      placeholder="Attribute Value"
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddValue(attrIndex)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={onAdd}
              className="mt-2 px-3 py-1.5 border border-dashed border-gray-300 text-gray-600 text-xs rounded hover:border-[#c9a227] hover:text-[#c9a227] transition-colors w-full flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Another Attribute
            </button>

            {attributes.length < 1 && (
              <p className="text-xs text-amber-600 mt-2">
                ⚠️ Need at least 1 attributes (e.g., Size or Color) to generate variants
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}