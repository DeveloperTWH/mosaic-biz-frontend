import React from 'react';
import { Package, Trash2, Upload, Loader } from 'lucide-react';

interface Variant {
  _id: string;
  attributes: Record<string, string>;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  shipping?: {
    standard?: number;
    overnight?: number;
    local?: number;
  };
  isPublished: boolean;
}

interface Props {
  variants: Variant[];
  productAttributes: Array<{ name: string; values: string[] }>;
  onAddVariant: () => void;
  onUpdateVariant: (variantId: string, updatedData: any) => Promise<void>;
  onRemoveVariant: (variantId: string) => void;
  onVariantImageUpload: (file: File, variantKey: string) => Promise<string>;
  uploading: Record<string, boolean>;
  loadingVariantId: string | null;
}

export default function VariantsSection({
  variants,
  productAttributes,
  onAddVariant,
  onUpdateVariant,
  onRemoveVariant,
  onVariantImageUpload,
  uploading,
  loadingVariantId: _loadingVariantId
}: Props) {
  const fallbackAttribute1Name =
    variants.map(v => Object.keys(v.attributes || {})[0]).find(Boolean) || '';
  const fallbackAttribute2Name =
    variants.map(v => Object.keys(v.attributes || {})[1]).find(Boolean) || '';

  const attribute1Name = (productAttributes[0]?.name || fallbackAttribute1Name || '').trim();
  const attribute2Name = (productAttributes[1]?.name || fallbackAttribute2Name || '').trim();

  const showAttribute1 = Boolean(attribute1Name);
  const showAttribute2 = Boolean(attribute2Name);

  const attribute1Options =
    productAttributes.find((attr) => attr.name === attribute1Name)?.values || [];
  const attribute2Options =
    productAttributes.find((attr) => attr.name === attribute2Name)?.values || [];

  const unique = (values: string[] = []) => [...new Set(values)];
  const uniqueAttribute1Options = unique(attribute1Options);
  const uniqueAttribute2Options = unique(attribute2Options);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Product Variants</h3>
        <button
          onClick={onAddVariant}
          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 flex items-center gap-1"
        >
          <Package className="w-3 h-3" />
          Add Variant
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              {showAttribute1 && (
                <>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Attribute name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Attribute value
                  </th>
                </>
              )}
              {showAttribute2 && (
                <>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Attribute name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Attribute value
                  </th>
                </>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Old Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avalinility</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Standard Ship</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overnight Ship</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local Ship</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Images</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {variants.map((variant, idx) => (
              <tr key={variant._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={variant.sku || ''}
                    onChange={(e) => onUpdateVariant(variant._id, { sku: e.target.value })}
                    className="w-28 px-2 py-1 text-xs border border-gray-300 rounded font-mono"
                    placeholder="SKU"
                  />
                </td>

                {showAttribute1 && (
                  <>
                    <td className="px-4 py-3 text-xs text-gray-500">{attribute1Name}</td>
                    <td className="px-4 py-3">
                      {uniqueAttribute1Options.length > 0 ? (
                        <select
                          value={variant.attributes?.[attribute1Name] || ''}
                          onChange={(e) =>
                            onUpdateVariant(variant._id, {
                              attributes: { ...variant.attributes, [attribute1Name]: e.target.value }
                            })
                          }
                          className="w-24 px-2 py-1 text-xs border border-gray-300 rounded"
                        >
                          <option value="">Select</option>
                          {uniqueAttribute1Options.map((val, optionIdx) => (
                            <option key={`attr1-${idx}-${optionIdx}-${val}`} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={variant.attributes?.[attribute1Name] || ''}
                          onChange={(e) =>
                            onUpdateVariant(variant._id, {
                              attributes: { ...variant.attributes, [attribute1Name]: e.target.value }
                            })
                          }
                          className="w-24 px-2 py-1 text-xs border border-gray-300 rounded"
                        />
                      )}
                    </td>
                  </>
                )}

                {showAttribute2 && (
                  <>
                    <td className="px-4 py-3 text-xs text-gray-500">{attribute2Name}</td>
                    <td className="px-4 py-3">
                      {uniqueAttribute2Options.length > 0 ? (
                        <select
                          value={variant.attributes?.[attribute2Name] || ''}
                          onChange={(e) =>
                            onUpdateVariant(variant._id, {
                              attributes: { ...variant.attributes, [attribute2Name]: e.target.value }
                            })
                          }
                          className="w-24 px-2 py-1 text-xs border border-gray-300 rounded"
                        >
                          <option value="">Select</option>
                          {uniqueAttribute2Options.map((val, optionIdx) => (
                            <option key={`attr2-${idx}-${optionIdx}-${val}`} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={variant.attributes?.[attribute2Name] || ''}
                          onChange={(e) =>
                            onUpdateVariant(variant._id, {
                              attributes: { ...variant.attributes, [attribute2Name]: e.target.value }
                            })
                          }
                          className="w-24 px-2 py-1 text-xs border border-gray-300 rounded"
                        />
                      )}
                    </td>
                  </>
                )}

                <td className="px-4 py-3 text-gray-500">
                  <input
                    type="number"
                    value={variant.price ?? 0}
                    onChange={(e) => onUpdateVariant(variant._id, { price: parseFloat(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td className="px-4 py-3 text-gray-500">
                  <input
                    type="number"
                    value={variant.salePrice ?? ''}
                    onChange={(e) =>
                      onUpdateVariant(variant._id, {
                        salePrice: e.target.value ? parseFloat(e.target.value) : undefined
                      })
                    }
                    className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={variant.stock ?? 0}
                    onChange={(e) => onUpdateVariant(variant._id, { stock: parseInt(e.target.value) || 0 })}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                    min="0"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={variant.isPublished ? 'published' : 'draft'}
                    onChange={(e) => onUpdateVariant(variant._id, { isPublished: e.target.value === 'published' })}
                    className="px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </td>

                <td className="px-4 py-3 text-gray-600">
                  <input
                    type="number"
                    value={variant.shipping?.standard ?? 0}
                    onChange={(e) =>
                      onUpdateVariant(variant._id, {
                        shipping: {
                          standard: parseFloat(e.target.value) || 0,
                          overnight: variant.shipping?.overnight ?? 0,
                          local: variant.shipping?.local ?? 0
                        }
                      })
                    }
                    className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <input
                    type="number"
                    value={variant.shipping?.overnight ?? 0}
                    onChange={(e) =>
                      onUpdateVariant(variant._id, {
                        shipping: {
                          standard: variant.shipping?.standard ?? 0,
                          overnight: parseFloat(e.target.value) || 0,
                          local: variant.shipping?.local ?? 0
                        }
                      })
                    }
                    className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <input
                    type="number"
                    value={variant.shipping?.local ?? 0}
                    onChange={(e) =>
                      onUpdateVariant(variant._id, {
                        shipping: {
                          standard: variant.shipping?.standard ?? 0,
                          overnight: variant.shipping?.overnight ?? 0,
                          local: parseFloat(e.target.value) || 0
                        }
                      })
                    }
                    className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                    step="0.01"
                    min="0"
                  />
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {(variant.images || []).slice(0, 2).map((img, imgIdx) => (
                      <img
                        key={`img-${variant._id}-${imgIdx}`}
                        src={img}
                        alt=""
                        className="w-6 h-6 object-cover rounded"
                      />
                    ))}
                    {(variant.images || []).length > 2 && (
                      <span className="text-xs text-gray-500">+{(variant.images || []).length - 2}</span>
                    )}

                    <input
                      type="file"
                      id={`variant-upload-${variant._id}`}
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const inputEl = e.currentTarget;
                        const file = inputEl.files?.[0];
                        if (!file) return;
                        // Clear immediately so selecting the same file again triggers onChange
                        inputEl.value = '';
                        const url = await onVariantImageUpload(file, variant._id);
                        onUpdateVariant(variant._id, { images: [...(variant.images || []), url] });
                      }}
                    />
                    <label
                      htmlFor={`variant-upload-${variant._id}`}
                      className="p-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                      title="Upload image"
                    >
                      {uploading[`variant-${variant._id}`] ? (
                        <Loader className="w-3 h-3 animate-spin text-gray-600" />
                      ) : (
                        <Upload className="w-3 h-3 text-gray-600" />
                      )}
                    </label>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => onRemoveVariant(variant._id)}
                    className="p-1 hover:bg-red-50 rounded transition-colors"
                    title="Remove variant row"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}

            {variants.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-xs text-gray-500" colSpan={12}>
                  No variants yet. Click "Add Variant" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
