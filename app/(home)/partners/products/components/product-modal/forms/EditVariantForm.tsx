import React from 'react';
import { Save, Loader, Upload } from 'lucide-react';

interface Props {
  variant: any;
  showAttribute1: boolean;
  showAttribute2: boolean;
  attribute1Name: string;
  attribute2Name: string;
  attribute1Options: string[];
  attribute2Options: string[];
  onSave: () => void;
  onCancel: () => void;
  onChange: (updated: any) => void;
  onImageUpload: (file: File) => Promise<void>;
  uploading?: boolean;
  loading?: boolean;
}

export default function EditVariantForm({
  variant,
  showAttribute1,
  showAttribute2,
  attribute1Name,
  attribute2Name,
  attribute1Options,
  attribute2Options,
  onSave,
  onCancel,
  onChange,
  onImageUpload,
  uploading,
  loading
}: Props) {
  const handleInputChange = (field: string, value: any) => {
    onChange({ ...variant, [field]: value });
  };

  const handleAttributeChange = (attrName: string, value: string) => {
    onChange({
      ...variant,
      attributes: { ...variant.attributes, [attrName]: value }
    });
  };

  // Helper to get unique values
  const getUniqueValues = (values: string[] = []) => {
    return [...new Set(values)];
  };

  const handleShippingChange = (
    field: 'standard' | 'overnight' | 'local',
    value: number
  ) => {
    onChange({
      ...variant,
      shipping: {
        standard: variant.shipping?.standard ?? 0,
        overnight: variant.shipping?.overnight ?? 0,
        local: variant.shipping?.local ?? 0,
        [field]: value
      }
    });
  };

  const uniqueAttribute1Options = getUniqueValues(attribute1Options);
  const uniqueAttribute2Options = getUniqueValues(attribute2Options);

  return (
    <tr className="bg-yellow-50">
      <td className="px-4 py-3">
        <input
          type="text"
          value={variant.sku}
          onChange={(e) => handleInputChange('sku', e.target.value)}
          className="w-28 px-2 py-1 text-xs border border-gray-300 rounded font-mono"
        />
      </td>
      
      {/* Attribute 1 */}
      {showAttribute1 && (
        <>
          <td className="px-4 py-3">
            <span className="text-xs text-gray-500">{attribute1Name}</span>
          </td>
          <td className="px-4 py-3">
            {uniqueAttribute1Options.length > 0 ? (
              <select
                value={variant.attributes?.[attribute1Name] || ''}
                onChange={(e) => handleAttributeChange(attribute1Name, e.target.value)}
                className="w-24 px-2 py-1 text-xs border border-gray-300 rounded"
              >
                <option value="">Select</option>
                {uniqueAttribute1Options.map((val, idx) => (
                  <option key={`attr1-${idx}-${val}`} value={val}>{val}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={variant.attributes?.[attribute1Name] || ''}
                onChange={(e) => handleAttributeChange(attribute1Name, e.target.value)}
                className="w-24 px-2 py-1 text-xs border border-gray-300 rounded"
              />
            )}
          </td>
        </>
      )}

      {/* Attribute 2 */}
      {showAttribute2 && (
        <>
          <td className="px-4 py-3">
            <span className="text-xs text-gray-500">{attribute2Name}</span>
          </td>
          <td className="px-4 py-3">
            {uniqueAttribute2Options.length > 0 ? (
              <select
                value={variant.attributes?.[attribute2Name] || ''}
                onChange={(e) => handleAttributeChange(attribute2Name, e.target.value)}
                className="w-24 px-2 py-1 text-xs border border-gray-300 rounded"
              >
                <option value="">Select</option>
                {uniqueAttribute2Options.map((val, idx) => (
                  <option key={`attr2-${idx}-${val}`} value={val}>{val}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={variant.attributes?.[attribute2Name] || ''}
                onChange={(e) => handleAttributeChange(attribute2Name, e.target.value)}
                className="w-24 px-2 py-1 text-xs border border-gray-300 rounded"
              />
            )}
          </td>
        </>
      )}

      <td className="px-4 py-3">
        <input
          type="number"
          value={variant.price}
          onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
          step="0.01"
          min="0"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={variant.salePrice || ''}
          onChange={(e) => handleInputChange('salePrice', e.target.value ? parseFloat(e.target.value) : undefined)}
          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
          step="0.01"
          min="0"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={variant.stock}
          onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
          className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
          min="0"
        />
      </td>
      <td className="px-4 py-3">
        <select
          value={variant.isPublished ? 'published' : 'draft'}
          onChange={(e) => handleInputChange('isPublished', e.target.value === 'published')}
          className="px-2 py-1 text-xs border border-gray-300 rounded"
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={variant.shipping?.standard ?? 0}
          onChange={(e) => handleShippingChange('standard', parseFloat(e.target.value) || 0)}
          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
          step="0.01"
          min="0"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={variant.shipping?.overnight ?? 0}
          onChange={(e) => handleShippingChange('overnight', parseFloat(e.target.value) || 0)}
          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
          step="0.01"
          min="0"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={variant.shipping?.local ?? 0}
          onChange={(e) => handleShippingChange('local', parseFloat(e.target.value) || 0)}
          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
          step="0.01"
          min="0"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {(variant.images || []).map((img: string, imgIdx: number) => (
            <img key={`img-${variant._id}-${imgIdx}`} src={img} alt="" className="w-6 h-6 object-cover rounded" />
          ))}
          <input
            type="file"
            id={`variant-edit-upload-${variant._id}`}
            className="hidden"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                await onImageUpload(file);
              }
            }}
          />
          <label
            htmlFor={`variant-edit-upload-${variant._id}`}
            className="p-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
          >
            {uploading ? (
              <Loader className="w-3 h-3 animate-spin text-gray-600" />
            ) : (
              <Upload className="w-3 h-3 text-gray-600" />
            )}
          </label>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            disabled={loading}
            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
          >
            {loading ? (
              <Loader className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            Done
          </button>
          <button
            onClick={onCancel}
            className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
}
