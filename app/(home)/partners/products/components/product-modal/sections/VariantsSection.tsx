import React, { useState } from 'react';
import { Package, Edit2, Save, Loader, Upload } from 'lucide-react';
import NewVariantForm from '../forms/NewVariantForm';
import EditVariantForm from '../forms/EditVariantForm';

interface Variant {
  _id: string;
  attributes: Record<string, string>;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  isPublished: boolean;
}

interface Props {
  variants: Variant[];
  productAttributes: Array<{ name: string; values: string[] }>;
  onAddVariant: (variant: any) => Promise<void>;
  onUpdateVariant: (variantId: string, updatedData: any) => Promise<void>;
  onVariantImageUpload: (file: File, index: number) => Promise<string>;
  uploading: Record<string, boolean>;
  loadingVariantId: string | null;
}

export default function VariantsSection({
  variants,
  productAttributes,
  onAddVariant,
  onUpdateVariant,
  onVariantImageUpload,
  uploading,
  loadingVariantId
}: Props) {
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const getVariantAttributes = (variant: Variant) => {
    const entries = Object.entries(variant.attributes || {});
    return {
      firstAttr: entries[0]?.[0] || '',
      firstValue: entries[0]?.[1] || '-',
      secondAttr: entries[1]?.[0] || '',
      secondValue: entries[1]?.[1] || '-'
    };
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', className: 'bg-red-100 text-red-600' };
    if (stock < 10) return { label: 'Low Stock', className: 'bg-yellow-100 text-yellow-600' };
    return { label: 'Available', className: 'bg-green-100 text-green-600' };
  };

  const formatPrice = (price: number | undefined): string => {
    if (price === undefined || price === null) return '0.00';
    return price.toFixed(2);
  };

  const startEditing = (variant: Variant) => {
    setEditingVariantId(variant._id);
    setEditForm({ ...variant });
  };

  const cancelEditing = () => {
    setEditingVariantId(null);
    setEditForm(null);
  };

  const handleEditVariantImageUpload = async (file: File) => {
    if (!editingVariantId) return;
    const url = await onVariantImageUpload(file, variants.findIndex(v => v._id === editingVariantId));
    setEditForm({
      ...editForm,
      images: [...editForm.images, url]
    });
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Product Variants</h3>
        <button
          onClick={() => setShowNewForm(true)}
          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 flex items-center gap-1"
        >
          <Package className="w-3 h-3" />
          Add Variant
        </button>
      </div>

      {showNewForm && (
        <NewVariantForm
          attributes={productAttributes}
          onAdd={async (variantData) => {
            await onAddVariant(variantData);
            setShowNewForm(false);
          }}
          onCancel={() => setShowNewForm(false)}
          onImageUpload={async (file, index) => {
            return await onVariantImageUpload(file, index);
          }}
          uploading={uploading}
        />
      )}

      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attribute 1</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attribute 2</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price ($)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Images</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {variants.map((variant, idx) => {
              const { firstAttr, firstValue, secondAttr, secondValue } = getVariantAttributes(variant);
              const stockStatus = getStockStatus(variant.stock);
              
              if (editingVariantId === variant._id && editForm) {
                return (
                  <EditVariantForm
                    key={variant._id}
                    variant={editForm}
                    productAttributes={productAttributes}
                    onSave={async () => {
                      await onUpdateVariant(variant._id, editForm);
                      cancelEditing();
                    }}
                    onCancel={cancelEditing}
                    onChange={setEditForm}
                    onImageUpload={handleEditVariantImageUpload}
                    uploading={uploading[`variant-${idx}`]}
                    loading={loadingVariantId === variant._id}
                  />
                );
              }
              
              return (
                <tr key={variant._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{variant.sku}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{firstAttr}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                      {firstValue}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{secondAttr}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                      {secondValue}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">${formatPrice(variant.price)}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {variant.salePrice ? `$${formatPrice(variant.salePrice)}` : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.className}`}>
                      {variant.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      variant.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {variant.isPublished ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {variant.images.slice(0, 2).map((img, imgIdx) => (
                        <img key={imgIdx} src={img} alt="" className="w-6 h-6 object-cover rounded" />
                      ))}
                      {variant.images.length > 2 && (
                        <span className="text-xs text-gray-500">+{variant.images.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => startEditing(variant)}
                      className="p-1 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}