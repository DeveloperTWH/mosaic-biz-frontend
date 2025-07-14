// components/partners/ProductTable.tsx
'use client';

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';

const dummyProducts = [
  {
    id: 1,
    name: 'Aria Helmet SK6',
    category: 'Helmet',
    price: '$199.99',
    orders: 120,
    stock: 34,
    image: '/ShopProduct/Aria-SK6-Helmet 1 (3).png',
  },
  {
    id: 2,
    name: 'Speed Visor V2',
    category: 'Visor',
    price: '$89.50',
    orders: 87,
    stock: 12,
    image: '/ShopProduct/Aria-SK6-Helmet 1 (2).png',
  },
];

const ProductTable = () => {
  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="mb-4 text-lg font-semibold">Products</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Orders</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="flex items-center gap-3 px-4 py-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  {product.name}
                </td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{product.price}</td>
                <td className="px-4 py-3">{product.orders}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3 text-right">
                  <button className="mr-2 text-blue-600 hover:underline">
                    <Pencil className="inline w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:underline">
                    <Trash2 className="inline w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;