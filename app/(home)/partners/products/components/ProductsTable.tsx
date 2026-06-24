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

  // Helper function to safely get price (Mongo Decimal128 + other shapes)
  const getSafePrice = (price: unknown): number => {
    if (typeof price === 'number') return Number.isFinite(price) ? price : 0;
    if (typeof price === 'string') {
      const parsed = parseFloat(price);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    if (price && typeof price === 'object' && '$numberDecimal' in (price as Record<string, unknown>)) {
      const parsed = parseFloat(String((price as Record<string, unknown>).$numberDecimal));
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="divide-y divide-gray-100 md:hidden">
        {products.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            No products found
          </div>
        ) : (
          products.map((product) => {
            const safeStock = getSafeStock(product.totalStock);
            const stockStatus = getStockStatus(safeStock);
            const safePrice = getSafePrice(product.price);

            return (
              <article key={product._id} className="space-y-4 p-4">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded bg-gray-200">
                    {product.coverImage && product.coverImage !== 'https://via.placeholder.com/300 ' ? (
                      <img
                        src={product.coverImage}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No img</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-sm font-semibold text-gray-900">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {product.categoryId?.name || '-'} / {product.subcategoryId?.name || '-'}
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <dt className="font-medium uppercase text-gray-400">Stock</dt>
                    <dd className={safeStock < 10 ? 'font-semibold text-red-600' : 'font-semibold text-gray-900'}>
                      {safeStock}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium uppercase text-gray-400">Status</dt>
                    <dd>
                      <span className={`inline-flex rounded-full px-2 py-1 font-medium ${stockStatus.className}`}>
                        {stockStatus.label}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium uppercase text-gray-400">Price</dt>
                    <dd className="font-semibold text-gray-900">${safePrice.toFixed(2)}</dd>
                  </div>
                </dl>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onView(product._id)}
                    className="inline-flex min-h-10 items-center justify-center gap-1 rounded bg-blue-100 px-3 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(product._id)}
                    className="inline-flex min-h-10 items-center justify-center gap-1 rounded bg-yellow-100 px-3 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-200"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product._id)}
                    className="inline-flex min-h-10 items-center justify-center gap-1 rounded bg-red-100 px-3 text-xs font-medium text-red-700 transition-colors hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
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
                const safePrice = getSafePrice(product.price);
                
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
