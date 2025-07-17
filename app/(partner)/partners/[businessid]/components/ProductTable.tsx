'use client';

import React from 'react';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';
import { ProductListingItem } from '@/types/product';

interface ProductTableProps {
  products: ProductListingItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  error?: string | null;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  error
}) => {
  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) onPageChange(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => changePage(i)}
          className={`px-3 py-1 border rounded ${currentPage === i
            ? 'bg-black text-white'
            : 'bg-white text-black hover:bg-gray-100'
            }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-end gap-2 mt-4">
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-black bg-white border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {pages}
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-black bg-white border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  const getDisplayPrice = (product: ProductListingItem) => {
    const today = new Date();
    const discountEnd = new Date(product.discountEndDate || '');

    if (discountEnd > today && (product as any).salePrice) {
      return `$${(product as any).salePrice} (Sale)`;
    }

    return `$${product.price}`;
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-bold">Products</h3>
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#333333] text-white">
              <tr>
                <th className="px-4 py-2"></th>
                <th className="px-4 py-2">Product Image</th>
                <th className="px-4 py-2">Product Title</th>
                <th className="px-4 py-2">Product Description</th>
                <th className="px-4 py-2">Size</th>
                <th className="px-4 py-2">SKU</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Mobile View Skeleton */}
        <div className="grid gap-4 lg:hidden">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-4 border rounded shadow">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full space-y-2">
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <div className="flex-1 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-bold text-red-600">Failed to Load Products</h3>
        <p className="text-sm text-gray-600">{error || "Something went wrong. Please try again."}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 mt-4 text-white rounded bg-custom-orange hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }


  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex flex-col items-start justify-between gap-2 mb-4 sm:flex-row sm:items-center">
        <h3 className="text-xl font-bold">Products</h3>
        <button className="flex items-center w-full gap-1 px-3 py-1 text-white rounded bg-custom-orange hover:opacity-90 sm:w-auto">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* ✅ Desktop Table View */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-[#333333] text-white">
            <tr>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">Product Image</th>
              <th className="px-4 py-2">Product Title</th>
              <th className="px-4 py-2">Product Description</th>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={`${product._id}-${product.sizeId}`}
                className="border-b hover:bg-gray-50 text-[14px]"
              >
                <td className="px-4 py-3">
                  <input type="checkbox" value={`${product._id}-${product.sizeId}`} />
                </td>
                <td className="px-4 py-3">
                  <Image
                    src={product.images[0]}
                    alt={product.color}
                    width={80}
                    height={80}
                    className="rounded"
                  />
                </td>
                <td className="px-4 py-3 font-semibold">
                  {product.productId?.title || '-'}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {product.productId?.description || '-'}
                </td>
                <td className="px-4 py-3">{product.size}</td>
                <td className="px-4 py-3">{product.sku}</td>
                <td className="px-4 py-3">
                  {product.stock === 0 ? (
                    <span className="font-bold text-red-600">Out Of Stock</span>
                  ) : (
                    product.stock
                  )}
                </td>
                <td className="px-4 py-3">
                  {product.price ? getDisplayPrice(product) : <span>-</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1 rounded bg-custom-orange hover:opacity-90 ">
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-1 rounded bg-custom-yellow hover:opacity-90 ">
                      <Pencil className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-1 bg-gray-400 rounded hover:bg-gray-500">
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile View */}
      <div className="grid gap-4 lg:hidden">
        {products.map((product) => (
          <div
            key={`${product._id}-${product.sizeId}`}
            className="p-4 border rounded shadow hover:bg-gray-50"
          >
            <div className="flex flex-col items-center gap-4">
              <Image
                src={product.images[0]}
                alt={product.color}
                width={80}
                height={80}
                className="rounded"
              />
              <div className="w-full">
                <p className="text-sm font-semibold">
                  {product.productId?.title || '-'}
                </p>
                <p className="text-xs text-gray-600">
                  {product.productId?.description || '-'}
                </p>
                <p className="text-xs">Size: {product.size}</p>
                <p className="text-xs">SKU: {product.sku}</p>
                <p className="text-xs">
                  Stock:{' '}
                  {product.stock === 0 ? (
                    <span className="font-bold text-red-600">Out Of Stock</span>
                  ) : (
                    product.stock
                  )}
                </p>
                <p className="text-xs">Price: {getDisplayPrice(product)}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 p-1 rounded bg-custom-orange hover:opacity-90 ">
                <Eye className="w-4 h-4 mx-auto text-white" />
              </button>
              <button className="flex-1 p-1 rounded bg-custom-yellow hover:opacity-90 ">
                <Pencil className="w-4 h-4 mx-auto text-white" />
              </button>
              <button className="flex-1 p-1 bg-gray-400 rounded hover:bg-gray-500">
                <Trash2 className="w-4 h-4 mx-auto text-white" />
              </button>
            </div>
          </div>
        ))
        }
      </div>

      {renderPagination()}
    </div>
  );
};

export default ProductTable;
