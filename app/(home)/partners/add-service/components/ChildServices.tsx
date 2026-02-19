import React from 'react';
import { Plus, X } from 'lucide-react';

interface ChildService {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

interface Props {
  childServices: ChildService[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof ChildService, value: any) => void;
  onRemove: (index: number) => void;
}

export default function ChildServices({
  childServices,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Create Service</h2>

      <button
        type="button"
        onClick={onAdd}
        className="mb-4 px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-[#c9a227] hover:text-[#c9a227] w-full text-sm flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Service
      </button>

      {childServices.map((service, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Service Name</label>
              <input
                type="text"
                value={service.name}
                onChange={(e) => onUpdate(index, 'name', e.target.value)}
                placeholder="Service Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Service Description</label>
              <input
                type="text"
                value={service.description}
                onChange={(e) => onUpdate(index, 'description', e.target.value)}
                placeholder="Service Description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Service Duration</label>
              <select
                value={service.durationMinutes}
                onChange={(e) => onUpdate(index, 'durationMinutes', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
              >
                <option value="">-- Choose Duration --</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
              <input
                type="number"
                value={service.price}
                onChange={(e) => onUpdate(index, 'price', parseFloat(e.target.value))}
                placeholder="Price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}