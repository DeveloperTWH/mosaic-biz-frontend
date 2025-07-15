'use client';

import React, { useState, useMemo } from 'react';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';

const ProductTable = () => {
  const dummyProducts = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        id: i + 1,
        name: `Feature Product Title ${i + 1}`,
        details:
          'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Praesent Vitae Libero Venenatis, Tristique Justo.',
        sku: `0${(i % 10) + 1}`,
        stock: i % 7 === 0 ? 0 : 1000 + i,
        price: '$499.00',
        image: '/ShopProduct/Aria-SK6-Helmet 1 (3).png',
      })),
    []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(dummyProducts.length / itemsPerPage);

  const currentProducts = dummyProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
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

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex flex-col items-start justify-between gap-2 mb-4 sm:flex-row sm:items-center">
        <h3 className="text-xl font-bold">Products</h3>
        <button className="flex items-center w-full gap-1 px-3 py-1 text-white bg-orange-500 rounded hover:bg-orange-600 sm:w-auto">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* ✅ Desktop/Table View */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-[#333333] text-white">
            <tr>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">Product Image</th>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Product Details</th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-gray-50 text-[14px]"
              >
                <td className="px-4 py-3">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="rounded"
                  />
                </td>
                <td className="px-4 py-3 font-semibold">{product.name}</td>
                <td className="px-4 py-3 text-gray-600">{product.details}</td>
                <td className="px-4 py-3">{product.sku}</td>
                <td className="px-4 py-3">
                  {product.stock === 0 ? (
                    <span className="font-bold text-red-600">Out Of Stock</span>
                  ) : (
                    product.stock
                  )}
                </td>
                <td className="px-4 py-3">{product.price}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1 bg-orange-400 rounded hover:bg-orange-500">
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-1 bg-yellow-400 rounded hover:bg-yellow-500">
                      <Pencil className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-1 bg-gray-400 rounded hover:bg-gray-500">
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile View */}
      <div className="grid gap-4 lg:hidden">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="p-4 border rounded shadow hover:bg-gray-50"
          >
            <div className="flex flex-col items-center gap-4">
              <Image
                src={product.image}
                alt={product.name}
                width={80}
                height={80}
                className="rounded"
              />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-xs text-gray-600">{product.details}</p>
                <p className="text-xs">SKU: {product.sku}</p>
                <p className="text-xs">
                  Stock:{' '}
                  {product.stock === 0 ? (
                    <span className="font-bold text-red-600">
                      Out Of Stock
                    </span>
                  ) : (
                    product.stock
                  )}
                </p>
                <p className="font-bold">{product.price}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 p-1 bg-orange-400 rounded hover:bg-orange-500">
                <Eye className="w-4 h-4 text-white" />
              </button>
              <button className="flex-1 p-1 bg-yellow-400 rounded hover:bg-yellow-500">
                <Pencil className="w-4 h-4 text-white" />
              </button>
              <button className="flex-1 p-1 bg-gray-400 rounded hover:bg-gray-500">
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {renderPagination()}
    </div>
  );
};

export default ProductTable;
