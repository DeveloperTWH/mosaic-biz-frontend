import React from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface Props {
  product: Product;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ViewProductModal({ product, onClose, onEdit, onDelete }: Props) {
  
  const getStockStatus = (stock: number = 0) => {
    if (stock === 0) return { label: 'Out of Stock', className: 'bg-red-100 text-red-600' };
    if (stock < 10) return { label: 'Low Stock', className: 'bg-yellow-100 text-yellow-600' };
    return { label: 'Available', className: 'bg-green-100 text-green-600' };
  };

  const stockStatus = getStockStatus(product.totalStock || 0);

  const formatPrice = (price: number | undefined): string => {
    if (price === undefined || price === null) return '0.00';
    return price.toFixed(2);
  };

  const getVariantAttributes = (variant: ProductVariant) => {
    const entries = Object.entries(variant.attributes || {});
    return {
      firstValue: entries[0]?.[1] || '-',
      secondValue: entries[1]?.[1] || '-'
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#c9a227] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">View Product Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          
          {/* Top Section - Image + Basic Info */}
          <div className="flex gap-6">
            {/* Product Image */}
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {product.coverImage && product.coverImage !== 'https://via.placeholder.com/300 ' ? (
                <img 
                  src={product.coverImage} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-xs">No Image</span>
              )}
            </div>

            {/* Product Info Grid */}
            <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <h3 className="text-xs text-gray-500 uppercase mb-1">Product Title</h3>
                <p className="text-sm font-semibold text-gray-900">{product.title}</p>
              </div>
              <div>
                <h3 className="text-xs text-gray-500 uppercase mb-1">Sub Category Name</h3>
                <p className="text-sm text-gray-900">{product.subcategoryId?.name || '-'}</p>
              </div>
              <div>
                <h3 className="text-xs text-gray-500 uppercase mb-1">Category Name</h3>
                <p className="text-sm text-gray-900">{product.categoryId?.name || '-'}</p>
              </div>
              <div>
                <h3 className="text-xs text-gray-500 uppercase mb-1">Product ID</h3>
                <p className="text-sm font-mono text-gray-900">#{product._id.slice(-4)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs text-gray-500 uppercase mb-2">Description of your products</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Attribute Values */}
          {product.attributes && product.attributes.length > 0 && (
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2">Attribute Values</h3>
              <div className="space-y-2">
                {product.attributes.map((attr, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="text-xs font-medium text-gray-700 w-24">{attr.name}:</span>
                    <div className="flex flex-wrap gap-2">
                      {attr.values.map((value, vidx) => (
                        <span key={vidx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs border border-gray-200">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Variants */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 border-l-4 border-[#c9a227] pl-3">Product Variants</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-gray-200 rounded">
                  <thead className="bg-gray-400">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white">Attribute 1</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white">Attribute 2</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white">Product Price ($)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white">Slashed Price ($)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white">Availability</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white">Standard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {product.variants.map((variant: ProductVariant, vidx: number) => {
                      const { firstValue, secondValue } = getVariantAttributes(variant);
                      return (
                        <tr key={variant._id} className={vidx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2 text-gray-900">{firstValue}</td>
                          <td className="px-3 py-2 text-gray-900">{secondValue}</td>
                          <td className="px-3 py-2 font-medium text-gray-900">${formatPrice(variant.price)}</td>
                          <td className="px-3 py-2 text-gray-500">
                            {variant.salePrice ? `$${formatPrice(variant.salePrice)}` : '-'}
                          </td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              (variant.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {variant.stock || 0}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-gray-600">{variant.stock || 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Shipping Options */}
          {product.shipping && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 border-l-4 border-[#c9a227] pl-3">Shipping Options</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500">Standard</p>
                  <p className="text-lg font-semibold text-gray-900">${formatPrice(product.shipping.standard)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500">Overnight</p>
                  <p className="text-lg font-semibold text-gray-900">${formatPrice(product.shipping.overnight)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500">Local</p>
                  <p className="text-lg font-semibold text-gray-900">${formatPrice(product.shipping.local)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-400 text-white text-sm font-medium rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}