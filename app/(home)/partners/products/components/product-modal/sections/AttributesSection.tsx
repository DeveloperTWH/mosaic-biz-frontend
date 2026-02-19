import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import NewAttributeForm from '../forms/NewAttributeForm';

interface Attribute {
  name: string;
  values: string[];
}

interface Props {
  attributes: Attribute[];
  onAddAttribute: (name: string, values: string[]) => void;
  onUpdateAttribute: (index: number, values: string[]) => void;
  onRemoveAttribute: (index: number) => void;
}

export default function AttributesSection({
  attributes,
  onAddAttribute,
  onUpdateAttribute,
  onRemoveAttribute
}: Props) {
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (index: number, currentValues: string[]) => {
    setEditingIndex(index);
    setEditValue(currentValues.join(', '));
  };

  const handleSaveEdit = (index: number) => {
    const newValues = editValue.split(',').map(v => v.trim()).filter(v => v);
    if (newValues.length > 0) {
      onUpdateAttribute(index, newValues);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Attribute Values</h3>
        <button
          onClick={() => setShowNewForm(true)}
          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add Attribute
        </button>
      </div>

      {showNewForm && (
        <NewAttributeForm
          onAdd={(name, values) => {
            onAddAttribute(name, values);
            setShowNewForm(false);
          }}
          onCancel={() => setShowNewForm(false)}
        />
      )}

      {attributes.length > 0 && (
        <div className="space-y-3">
          {attributes.map((attr, idx) => (
            <div key={idx} className="flex items-start gap-4 bg-gray-50 p-3 rounded-lg">
              <span className="text-sm font-medium text-gray-700 min-w-24 pt-2">
                {attr.name}:
              </span>
              
              <div className="flex-1">
                {editingIndex === idx ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
                      placeholder="Enter values separated by commas"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(idx)}
                      className="px-3 py-2 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-2 bg-gray-500 text-white text-xs rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {attr.values.join(', ')}
                    </span>
                    <button
                      onClick={() => handleStartEdit(idx, attr.values)}
                      className="p-1 hover:bg-blue-100 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => onRemoveAttribute(idx)}
                className="p-1 hover:bg-red-100 rounded"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}