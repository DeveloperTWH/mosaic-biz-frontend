import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';

interface Amenity {
  label: string;
  available: boolean;
  price?: number;
}

interface Props {
  features: string[];
  amenities: Amenity[];
  onAddFeature: (feature: string) => void;
  onRemoveFeature: (index: number) => void;
  onAddAmenity: () => void;
  onUpdateAmenity: (index: number, field: keyof Amenity, value: any) => void;
  onRemoveAmenity: (index: number) => void;
}

export default function ServiceFeatures({
  features,
  amenities,
  onAddFeature,
  onRemoveFeature,
  onAddAmenity,
  onUpdateAmenity,
  onRemoveAmenity,
}: Props) {
  const [newFeature, setNewFeature] = useState('');

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      onAddFeature(newFeature.trim());
      setNewFeature('');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Features & Amenities</h2>

      {/* Features */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Features
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {features.map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {feature}
              <button
                onClick={() => onRemoveFeature(index)}
                className="hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
            placeholder="Add a feature (e.g., Eco-Friendly)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
          />
          <button
            onClick={handleAddFeature}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
          >
            Add
          </button>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Amenities
          </label>
          <button
            onClick={onAddAmenity}
            className="text-sm text-[#c9a227] hover:text-[#b8921f] flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Amenity
          </button>
        </div>

        <div className="space-y-3">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <button
                onClick={() => onUpdateAmenity(index, 'available', !amenity.available)}
                className={`w-5 h-5 rounded border flex items-center justify-center ${
                  amenity.available 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300'
                }`}
              >
                {amenity.available && <Check className="w-3 h-3 text-white" />}
              </button>
              
              <input
                type="text"
                value={amenity.label}
                onChange={(e) => onUpdateAmenity(index, 'label', e.target.value)}
                placeholder="Amenity name"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
              />
              
              <input
                type="number"
                value={amenity.price || ''}
                onChange={(e) => onUpdateAmenity(index, 'price', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Price (if any)"
                className="w-24 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
                step="0.01"
                min="0"
              />
              
              <button
                onClick={() => onRemoveAmenity(index)}
                className="p-1 hover:bg-red-100 rounded"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}