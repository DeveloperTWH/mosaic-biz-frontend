import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface Props {
  products: Product[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  getStockStatus: (stock: number) => { label: string; className: string };
}

export default function ProductsTable({ 
  products, 
  onView,
  onEdit, 
  onDelete,
  getStockStatus 
}: Props) {
  
  const tableHeaders = [
    { key: 'product', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'subcategory', label: 'Sub Category' },
    // { key: 'sku', label: 'SKU' },
    { key: 'stock', label: 'Stock' },
    { key: 'status', label: 'Status' },
    { key: 'price', label: 'Price' },
    { key: 'action', label: 'Action' }
  ];

  // Helper function to safely get stock value
  const getSafeStock = (stock: number | undefined): number => {
    return stock ?? 0;
  };

  // Helper function to safely get price
  const getSafePrice = (priceRange: { min: number; max: number } | undefined): number => {
    return priceRange?.min ?? 0;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-400">
            <tr>
              {tableHeaders.map(header => (
                <th 
                  key={header.key}
                  className="text-left py-3 px-4 text-xs font-medium text-white uppercase"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product, index) => {
                const safeStock = getSafeStock(product.totalStock);
                const stockStatus = getStockStatus(safeStock);
                const displaySku = `SKU-${(index + 1).toString().padStart(2, '0')}`;
                const safePrice = getSafePrice(product.priceRange);
                
                return (
                  <tr key={product._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                          {product.coverImage && product.coverImage !== 'https://via.placeholder.com/300 ' ? (
                            <img 
                              src={product.coverImage} 
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">No img</span>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{product.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {product.categoryId?.name || '-'}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {product.subcategoryId?.name || '-'}
                    </td>
                    {/* <td className="py-4 px-4 text-gray-600 font-mono text-xs">
                      {displaySku}
                    </td> */}
                    <td className="py-4 px-4">
                      <span className={`font-medium ${
                        safeStock < 10 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {safeStock}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.className}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      ${safePrice.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onView(product._id)}
                          className="w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => onEdit(product._id)}
                          className="w-8 h-8 flex items-center justify-center bg-yellow-100 hover:bg-yellow-200 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-yellow-600" />
                        </button>
                        <button
                          onClick={() => onDelete(product._id)}
                          className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}