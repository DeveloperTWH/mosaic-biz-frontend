import React, { useState } from 'react';

interface Props {
  onAdd: (name: string, values: string[]) => void;
  onCancel: () => void;
}

export default function NewAttributeForm({ onAdd, onCancel }: Props) {
  const [name, setName] = useState('');
  const [values, setValues] = useState('');

  const handleSubmit = () => {
    if (!name || !values) {
      alert('Please fill in both fields');
      return;
    }
    const valuesArray = values.split(',').map(v => v.trim()).filter(v => v);
    onAdd(name, valuesArray);
  };

  return (
    <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <h4 className="text-xs font-medium text-gray-700 mb-3">New Attribute</h4>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Attribute Name (e.g., Size, Color)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
        />
        <input
          type="text"
          placeholder="Values (comma separated, e.g., Small, Medium, Large)"
          value={values}
          onChange={(e) => setValues(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}