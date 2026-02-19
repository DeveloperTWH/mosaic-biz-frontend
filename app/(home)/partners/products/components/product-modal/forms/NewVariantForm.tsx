import React, { useState } from 'react';
import { Upload, Loader } from 'lucide-react';

interface Props {
  attributes: Array<{ name: string; values: string[] }>;
  onAdd: (variant: any) => Promise<void>;
  onCancel: () => void;
  onImageUpload: (file: File, index: number) => Promise<string>;
  uploading: Record<string, boolean>;
}

export default function NewVariantForm({ attributes, onAdd, onCancel, onImageUpload, uploading }: Props) {
  const [newVariant, setNewVariant] = useState({
    attributes: {} as Record<string, string>,
    price: 0,
    salePrice: undefined as number | undefined,
    stock: 0,
    images: [] as string[]
  });

  const handleImageUpload = async (index: number, file: File) => {
    const url = await onImageUpload(file, index);
    setNewVariant({
      ...newVariant,
      images: [...newVariant.images, url]
    });
  };

  return (
    <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <h4 className="text-xs font-medium text-gray-700 mb-3">New Variant</h4>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        {attributes.map((attr, idx) => (
          <div key={idx}>
            <label className="block text-xs text-gray-500 mb-1">{attr.name}</label>

<select
  value={newVariant.attributes[attr.name] || ''}
  onChange={(e) => setNewVariant({
    ...newVariant,
    attributes: { ...newVariant.attributes, [attr.name]: e.target.value }
  })}
  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
>
  <option value="">Select {attr.name}</option>
  {[...new Set(attr.values)].map((val, valIdx) => (  // Use Set to remove duplicates
    <option key={`${attr.name}-${valIdx}-${val}`} value={val}>{val}</option>
  ))}
</select>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
          <input
            type="number"
            value={newVariant.price}
            onChange={(e) => setNewVariant({ ...newVariant, price: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            step="0.01"
            min="0"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Sale Price</label>
          <input
            type="number"
            value={newVariant.salePrice || ''}
            onChange={(e) => setNewVariant({ 
              ...newVariant, 
              salePrice: e.target.value ? parseFloat(e.target.value) : undefined 
            })}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            step="0.01"
            min="0"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Stock</label>
          <input
            type="number"
            value={newVariant.stock}
            onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            min="0"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs text-gray-500 mb-1">Images</label>
        <div className="flex flex-wrap gap-2">
          {newVariant.images.map((img, idx) => (
            <img key={idx} src={img} alt="" className="w-12 h-12 object-cover rounded" />
          ))}
          <input
            type="file"
            id={`new-variant-upload-${newVariant.images.length}`}
            className="hidden"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                await handleImageUpload(newVariant.images.length, file);
              }
            }}
          />
          <label
            htmlFor={`new-variant-upload-${newVariant.images.length}`}
            className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-[#c9a227]"
          >
            {uploading[`new-variant`] ? (
              <Loader className="w-4 h-4 animate-spin text-gray-400" />
            ) : (
              <Upload className="w-4 h-4 text-gray-400" />
            )}
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={() => onAdd(newVariant)}
          className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
        >
          Add Variant
        </button>
      </div>
    </div>
  );
}