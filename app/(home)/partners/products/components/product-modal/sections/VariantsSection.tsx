import React, { useState } from 'react';
import { Package, Edit2 } from 'lucide-react';
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

  const getVariantAttributes = (variant: Variant) => {
    const attrs = variant.attributes || {};
    const entries = Object.entries(attrs);
    const resolvedFirstAttr = attribute1Name || entries[0]?.[0] || '';
    const resolvedSecondAttr = attribute2Name || entries[1]?.[0] || '';

    return {
      firstAttr: resolvedFirstAttr,
      firstValue: resolvedFirstAttr ? attrs[resolvedFirstAttr] || '-' : '',
      secondAttr: resolvedSecondAttr,
      secondValue: resolvedSecondAttr ? attrs[resolvedSecondAttr] || '-' : ''
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
              {showAttribute1 && (
                <>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attribute name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                </>
              )}
              {showAttribute2 && (
                <>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attribute name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                </>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Old Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avalibility</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Std Ship</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overnight</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
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
                    onSave={async () => {
                      cancelEditing();
                    }}
                    onCancel={cancelEditing}
                    onChange={(updated) => {
                      setEditForm(updated);
                      // keep parent `variants` state in-sync so the modal's single Save button persists everything
                      onUpdateVariant(variant._id, updated);
                    }}
                    onImageUpload={handleEditVariantImageUpload}
                    showAttribute1={showAttribute1}
                    showAttribute2={showAttribute2}
                    attribute1Name={attribute1Name}
                    attribute2Name={attribute2Name}
                    attribute1Options={attribute1Options}
                    attribute2Options={attribute2Options}
                    uploading={uploading[`variant-${idx}`]}
                    loading={loadingVariantId === variant._id}
                  />
                );
              }
              
              return (
                <tr key={variant._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{variant.sku}</td>
                  {showAttribute1 && (
                    <>
                      <td className="px-4 py-3 text-xs text-gray-500">{firstAttr}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {firstValue}
                        </span>
                      </td>
                    </>
                  )}
                  {showAttribute2 && (
                    <>
                      <td className="px-4 py-3 text-xs text-gray-500">{secondAttr}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                          {secondValue}
                        </span>
                      </td>
                    </>
                  )}
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
                  <td className="px-4 py-3 text-gray-600">{formatPrice(variant.shipping?.standard)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatPrice(variant.shipping?.overnight)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatPrice(variant.shipping?.local)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {(variant.images || []).slice(0, 2).map((img, imgIdx) => (
                        <img key={imgIdx} src={img} alt="" className="w-6 h-6 object-cover rounded" />
                      ))}
                      {(variant.images || []).length > 2 && (
                        <span className="text-xs text-gray-500">+{(variant.images || []).length - 2}</span>
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
