'use client';

import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useBusinessStore } from '@/app/store/businessStore';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';



export type ProductListingItem = {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  variants: {
    variantId: string;
    color: string;
    label: string;
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
  const [expandedVariants, setExpandedVariants] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'product' | 'variant';
    productId: string;
    variantId?: string;
  }>({ type: 'product', productId: '' });




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

  const handleDelete = async () => {
    try {
      if (deleteTarget.type === 'product') {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/delete-product/${deleteTarget.productId}`, {
          withCredentials: true,
        });
        toast.success('Product deleted successfully');
      } else {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/delete-variant/${deleteTarget.productId}/${deleteTarget.variantId}`, {
          withCredentials: true,
        });
        toast.success('Variant deleted successfully');
      }

      changePage(currentPage)
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const toggleVariantExpand = (variantId: string) => {
    setExpandedVariants(prev =>
      prev.includes(variantId)
        ? prev.filter(id => id !== variantId)
        : [...prev, variantId]
    );
  };



  if (products.length === 0) {
    return (
      <div className="p-6 text-center bg-white border rounded shadow-sm">
        <p className="mb-4 text-gray-700 text-md">No products found for this business.</p>
        <Link href={`/partners/${businessid}/inventory/add-product`}>
          <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
            + Add Product
          </button>
        </Link>
      </div>
    )
  }

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

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[800px text-sm text-left border-collapse">
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
                  className={`border-b hover:bg-gray-50 ${hasOutOfStockVariant(product) ? 'bg-red-200' : ''}`}
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
                    <div className="flex items-start gap-2">
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
                          setDeleteTarget({ type: 'product', productId: product._id });
                          setShowDeleteModal(true);
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
                      <div className="flex flex-col">
                        {product.variants.map((variant, idx) => {
                          const isOutOfStock = variant.sizes.some(size => size.stock === 0);
                          const isExpanded = expandedVariants.includes(variant.variantId);
                          return (
                            <div
                              key={variant.variantId}
                              className={`flex flex-col justify-between h-full p-4 space-y-4 bg-white border rounded-md shadow ${isOutOfStock ? 'bg-red-200' : ''}`}  // Add highlight here
                            >
                              {/* Header */}
                              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleVariantExpand(variant.variantId)}>
                                <p className="text-sm font-semibold text-gray-700">
                                  {idx + 1}. Variant Color: <span className="text-black">{variant.color}</span>
                                </p>
                                <button>
                                  {isExpanded ? <ChevronUp /> : <ChevronDown />}
                                </button>
                              </div>

                              {/* Images */}
                              <div className="flex gap-2">
                                {variant.images.slice(0, 3).map((img, i) => (
                                  <div key={i} className="w-16 h-16 overflow-hidden border rounded">
                                    <Image
                                      src={img}
                                      alt={`variant-img-${i}`}
                                      width={64}
                                      height={64}
                                      className="object-cover w-full h-full rounded"
                                    />
                                  </div>
                                ))}
                              </div>

                              {/* Collapsible Content */}
                              {isExpanded && (
                                <div
                                  className={`flex flex-col gap-4 pl-10 ${variant.sizes.some(size => size.stock === 0) ? 'bg-red-200' : ''}`}
                                >
                                  {variant.sizes.map(size => (
                                    <div
                                      key={size.sizeId}
                                      className={`relative border rounded-md p-4 space-y-1 text-sm shadow-sm transition ${size.stock === 0
                                        ? 'bg-red-100 text-red-700 font-semibold' // Individual size is out of stock
                                        : 'bg-gray-50'
                                        }`}
                                    >
                                      <p><strong>{variant.label} :</strong> {size.size}</p>
                                      <p><strong>SKU:</strong> {size.sku}</p>
                                      <p><strong>Stock:</strong> {size.stock}</p>
                                      {variant.isPublished ? (
                                        <span className="text-xs font-medium text-green-600">Published</span>
                                      ) : (
                                        <span className="text-xs font-medium text-yellow-600">Unpublished</span>
                                      )}

                                      {size.salePrice && size.discountEndDate && new Date() < new Date(size.discountEndDate) ? (
                                        <>
                                          <p>
                                            <strong>Price:</strong>{' '}
                                            <span className="text-gray-500 line-through">${size.price}</span>{' '}
                                            <span className="font-semibold text-green-600">${size.salePrice}</span>
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            <strong>Offer valid till:</strong>{' '}
                                            {new Date(size.discountEndDate).toLocaleDateString()}
                                          </p>
                                        </>
                                      ) : (
                                        <p><strong>Price:</strong> ${size.price}</p>
                                      )}

                                      {/* Actions */}
                                      <div className="absolute flex gap-1 top-2 right-2">
                                        <button className="p-1 bg-blue-500 rounded hover:bg-blue-600" title="View">
                                          <Eye className="w-4 h-4 text-white" />
                                        </button>
                                        <Link href={`/partners/${businessid}/inventory/edit/${product._id}/${variant.variantId}`}>
                                          <button className="h-full p-1 bg-yellow-500 rounded hover:bg-yellow-600" title="Edit">
                                            <Pencil className="w-4 h-4 text-white" />
                                          </button>
                                        </Link>
                                        <button
                                          onClick={() => {
                                            setDeleteTarget({ type: 'variant', productId: product._id, variantId: variant.variantId });
                                            setShowDeleteModal(true);
                                          }}
                                          className="p-1 bg-gray-500 rounded hover:bg-gray-600"
                                          title="Delete"
                                        >
                                          <Trash2 className="w-4 h-4 text-white" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Add Variant Block */}
                        <Link href={`/partners/${businessid}/inventory/edit/${product._id}/add-variant`}>
                          <div className="flex items-center justify-center h-full p-4 text-center bg-gray-100 border border-dashed rounded-md cursor-pointer hover:border-gray-500">
                            <button className="flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-black">
                              <Plus className="w-6 h-6" />
                              <span className="text-sm font-medium">Add Variant</span>
                            </button>
                          </div>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}


              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {products.map(product => (
          <div key={product._id} className="p-4 bg-white border rounded shadow-sm">
            <div className="flex items-start gap-4">
              {product.coverImage && (
                <Image
                  src={product.coverImage}
                  alt="cover"
                  width={56}
                  height={56}
                  className="object-cover rounded w-14 h-14"
                />
              )}
              <div>
                <h4 className="text-base font-semibold">{product.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                <p className="mt-1 text-xs text-gray-500">{product.variants.length} Variants</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
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
                  setDeleteTarget({ type: 'product', productId: product._id });
                  setShowDeleteModal(true);
                }}
                className="p-1 bg-gray-400 rounded hover:bg-gray-500"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Expand variants */}
            {expanded.includes(product._id) && (
              <div className="mt-4 space-y-4">
                {product.variants.map(variant => (
                  <div key={variant.variantId} className="p-4 border rounded bg-gray-50">
                    <p className="text-sm font-semibold">
                      Color: <span className="text-black">{variant.color}</span>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {variant.images.slice(0, 3).map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          alt={`variant-${i}`}
                          width={48}
                          height={48}
                          className="object-cover w-12 h-12 border rounded"
                        />
                      ))}
                    </div>
                    <div className="mt-3 space-y-2">
                      {variant.sizes.map(size => (
                        <div
                          key={size.sizeId}
                          className={`p-2 rounded-md border ${size.stock === 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-white'
                            }`}
                        >
                          <p className="text-sm"><strong>{variant.label}:</strong> {size.size}</p>
                          <p className="text-sm"><strong>Stock:</strong> {size.stock}</p>
                          <p className="text-sm"><strong>SKU:</strong> {size.sku}</p>
                          {variant.isPublished ? (
                            <span className="text-xs font-medium text-green-600">Published</span>
                          ) : (
                            <span className="text-xs font-medium text-yellow-600">Unpublished</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => toggleExpand(product._id)} className="mt-3 text-sm text-blue-600 underline">
              {expanded.includes(product._id) ? 'Hide Variants' : 'Show Variants'}
            </button>
          </div>
        ))}
      </div>


      {renderPagination()}

      {showDeleteModal && (
        <DeleteConfirmationModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Confirm Delete"
          message={
            deleteTarget.type === 'product'
              ? 'Are you sure you want to delete this product? This action will also delete all its variants.'
              : 'Are you sure you want to delete this variant?'
          }
        />
      )}


    </div>
  );
};

export default ProductTable;
