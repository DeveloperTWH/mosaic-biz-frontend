'use client';

import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useBusinessStore } from '@/app/store/businessStore';
import axios from 'axios';
import { toast } from 'react-toastify';



export type ProductListingItem = {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  variants: {
    variantId: string;
    color: string;
    isPublished: boolean;
    images: string[];
    averageRating: number;
    totalReviews: number;
    sizes: {
      sizeId: string;
      size: string;
      sku: string;
      stock: number;
      price: number;
      salePrice?: number | null;
      discountEndDate?: string | null;
    }[];
  }[];
};

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
  const { businessid } = useParams();
  const { business } = useBusinessStore();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);



  const router = useRouter();


  const toggleExpand = (id: string) => {
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };


  const hasOutOfStockVariant = (product: ProductListingItem) =>
    product.variants.some(variant => variant.sizes.some(size => size.stock === 0));

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

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/delete-product/${selectedProductId}`, {
        withCredentials: true,
      });
      toast.success('Product deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete product', error);
      toast.error('Failed to delete product');
    } finally {
      setShowDeleteModal(false);
    }
  };



  return (
    <div className="p-4 bg-white rounded shadow md:p-6">
      <div className="flex flex-col items-start justify-between gap-3 mb-6 sm:flex-row sm:items-center">
        <h3 className="text-xl font-bold capitalize">{business?.listingType}</h3>
        <Link
          href={`/partners/${businessid}/inventory/add-${business?.listingType}`}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded bg-custom-orange hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add {business?.listingType}
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-[#333333] text-white">
            <tr>
              <th className="px-4 py-2">Toggle</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Variants</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <React.Fragment key={product._id}>
                <tr
                  className={`border-b hover:bg-gray-50 ${hasOutOfStockVariant(product) ? 'bg-yellow-100' : ''}`}
                >
                  <td className="px-4 py-3 align-top">
                    <button onClick={() => toggleExpand(product._id)}>
                      {expanded.includes(product._id) ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-semibold align-top">
                    <div className="flex items-start gap-3">
                      {product.coverImage && (
                        <div className="flex-shrink-0 overflow-hidden rounded w-14 h-14">
                          <Image
                            src={product.coverImage}
                            alt="cover"
                            width={56}
                            height={56}
                            className="object-cover w-full h-full rounded"
                          />
                        </div>
                      )}
                      <span className="text-base font-medium">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 align-top">{product.description}</td>
                  <td className="px-4 py-3 text-sm align-top">{product.variants.length} Variants</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <Link href={`/products/view/${product._id}`}>
                        <button className="p-1 rounded bg-custom-orange hover:opacity-90">
                          <Eye className="w-4 h-4 text-white" />
                        </button>
                      </Link>
                      <Link href={`/partners/${businessid}/inventory/edit/${product._id}`}>
                        <button className="p-1 rounded bg-custom-yellow hover:opacity-90">
                          <Pencil className="w-4 h-4 text-white" />
                        </button>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProductId(product._id);  // Pass the ID
                          setShowDeleteModal(true);          // Show modal
                        }}
                        className="p-1 bg-gray-400 rounded hover:bg-gray-500">
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </td>
                </tr>

                {expanded.includes(product._id) && (
                  <tr>
                    <td colSpan={5} className="p-4 bg-gray-50">
                      <div className="grid gap-6 sm:grid-cols-2">
                        {product.variants.map(variant => (
                          <div
                            key={variant.variantId}
                            className="flex flex-col justify-between h-full p-4 space-y-4 bg-white border rounded-md shadow"
                          >
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col gap-2">
                                <p className="text-sm font-semibold text-gray-700">
                                  Variant Color: <span className="text-black">{variant.color}</span>
                                </p>
                                <div className="flex gap-2">
                                  {variant.images.slice(0, 2).map((img, i) => (
                                    <div key={i} className="w-16 h-16 overflow-hidden border rounded">
                                      <Image
                                        src={img}
                                        alt={`variant-img-${i}`}
                                        width={64}
                                        height={64}
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid gap-4 sm:grid-cols-1">
                                {variant.sizes.map(size => (
                                  <div
                                    key={size.sizeId}
                                    className={`relative border rounded-md p-4 space-y-1 text-sm shadow-sm transition ${size.stock === 0
                                      ? 'bg-red-100 text-red-700 font-semibold'
                                      : 'bg-gray-50'
                                      }`}
                                  >
                                    <p><strong>Size:</strong> {size.size}</p>
                                    <p><strong>SKU:</strong> {size.sku}</p>
                                    <p><strong>Stock:</strong> {size.stock}</p>
                                    <p><strong>Price:</strong> ₹{size.price}</p>
                                    {size.salePrice && (
                                      <p className="text-green-600"><strong>Sale:</strong> ₹{size.salePrice}</p>
                                    )}

                                    <div className="absolute flex gap-1 top-2 right-2">
                                      <button className="p-1 bg-blue-500 rounded hover:bg-blue-600" title="View">
                                        <Eye className="w-4 h-4 text-white" />
                                      </button>
                                      <button className="p-1 bg-yellow-500 rounded hover:bg-yellow-600" title="Edit">
                                        <Pencil className="w-4 h-4 text-white" />
                                      </button>
                                      <button className="p-1 bg-gray-500 rounded hover:bg-gray-600" title="Delete">
                                        <Trash2 className="w-4 h-4 text-white" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add Variant Block */}
                        <div className="flex items-center justify-center h-full p-4 text-center bg-gray-100 border border-dashed rounded-md cursor-pointer hover:border-gray-500">
                          <button className="flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-black">
                            <Plus className="w-6 h-6" />
                            <span className="text-sm font-medium">Add Variant</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}


              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {renderPagination()}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md p-6 bg-white rounded-md shadow-lg">
            <h3 className="mb-2 text-lg font-semibold text-red-600">Confirm Delete</h3>
            <p className="mb-4 text-sm text-gray-700">
              Are you sure you want to delete this product? This action will also delete all its variants.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-1 text-sm text-gray-600 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-1 text-sm text-white bg-red-600 rounded"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductTable;
