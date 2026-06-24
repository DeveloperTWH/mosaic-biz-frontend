'use client';

import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import { useParams } from "next/navigation";
import { useBusinessStore } from '@/app/store/businessStore';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import DashboardEmptyState from '@/components/ui/dashboard-empty-state';
import {
  DashboardActionLink,
  DashboardPagination,
  DashboardStatusPill,
} from '@/components/ui/dashboard-primitives';
import DashboardLoadingBlock from '@/components/ui/dashboard-loading-block';



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
  const [deleteInProgress, setDeleteInProgress] = useState(false);


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

  const handleDelete = async () => {
    if (deleteInProgress) return;

    setDeleteInProgress(true);
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
      setShowDeleteModal(false);
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setDeleteInProgress(false);
    }
  };

  const toggleVariantExpand = (variantId: string) => {
    setExpandedVariants(prev =>
      prev.includes(variantId)
        ? prev.filter(id => id !== variantId)
        : [...prev, variantId]
    );
  };



  if (isLoading) {
    return <DashboardLoadingBlock label="Loading products..." />;
  }

  if (error) {
    return (
      <DashboardEmptyState
        title="Products could not be loaded"
        description={error}
        className="py-10"
      />
    );
  }

  if (products.length === 0) {
    return (
      <DashboardEmptyState
        title="No products yet"
        description="Add your first product to start selling on Mosaic Biz Hub."
        ctaLabel="Add product"
        ctaHref={`/partners/${businessid}/inventory/add-product`}
      />
    );
  }

  return (
    <div className="dashboard-table-shell p-4 md:p-6">
      <div className="flex flex-col items-start justify-between gap-3 mb-6 sm:flex-row sm:items-center">
        <div>
          <p className="dashboard-page-eyebrow">Listings</p>
          <h3 className="font-poppins text-xl font-semibold capitalize text-dashboard-text">
            {business?.listingType} inventory
          </h3>
        </div>
        <DashboardActionLink
          href={`/partners/${businessid}/inventory/add-${business?.listingType}`}
        >
          <Plus className="w-4 h-4" /> Add {business?.listingType}
        </DashboardActionLink>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead>
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
                <tr className={`border-b border-dashboard-border-light hover:bg-surface-cream ${hasOutOfStockVariant(product) ? 'bg-dashboard-warn-bg' : ''}`}>
                  <td className="px-4 py-3 align-top">
                    <button
                      type="button"
                      onClick={() => toggleExpand(product._id)}
                      className="dashboard-icon-button"
                      aria-label={expanded.includes(product._id) ? "Collapse product variants" : "Expand product variants"}
                    >
                      {expanded.includes(product._id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                  <td className="px-4 py-3 text-dashboard-muted align-top">{product.description}</td>
                  <td className="px-4 py-3 text-sm align-top">{product.variants.length} Variants</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap items-start gap-2">
                      <Link href={`/products/view/${product._id}`} className="dashboard-action dashboard-action--ghost min-h-10 px-3 py-1">
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                      <Link href={`/partners/${businessid}/inventory/edit/${product._id}`} className="dashboard-action dashboard-action--primary min-h-10 px-3 py-1">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget({ type: 'product', productId: product._id });
                          setShowDeleteModal(true);
                        }}

                        className="dashboard-action dashboard-action--danger min-h-10 px-3 py-1">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                {expanded.includes(product._id) && (
                  <tr>
                    <td colSpan={5} className="bg-surface-cream p-4">
                      <div className="flex flex-col">
                        {product.variants.map((variant, idx) => {
                          const isOutOfStock = variant.sizes.some(size => size.stock === 0);
                          const isExpanded = expandedVariants.includes(variant.variantId);
                          return (
                            <div
                              key={variant.variantId}
                              className={`flex h-full flex-col justify-between space-y-4 rounded-xl border border-dashboard-border-light bg-white p-4 shadow-sm ${isOutOfStock ? 'bg-dashboard-warn-bg' : ''}`}
                            >
                              {/* Header */}
                              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleVariantExpand(variant.variantId)}>
                                <p className="text-sm font-semibold text-dashboard-text">
                                  {idx + 1}. Variant Color: <span className="text-dashboard-muted">{variant.color}</span>
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
                                  className={`flex flex-col gap-4 pl-10 ${variant.sizes.some(size => size.stock === 0) ? 'bg-dashboard-warn-bg' : ''}`}
                                >
                                  {variant.sizes.map(size => (
                                    <div
                                      key={size.sizeId}
                                      className={`relative rounded-md border border-dashboard-border-light p-4 space-y-1 text-sm shadow-sm transition ${size.stock === 0
                                        ? 'bg-dashboard-warn-bg text-dashboard-warn-text font-semibold'
                                        : 'bg-surface-panel'
                                        }`}
                                    >
                                      <p><strong>{variant.label} :</strong> {size.size}</p>
                                      <p><strong>SKU:</strong> {size.sku}</p>
                                      <p><strong>Stock:</strong> {size.stock}</p>
                                      {variant.isPublished ? (
                                        <DashboardStatusPill tone="success">Published</DashboardStatusPill>
                                      ) : (
                                        <DashboardStatusPill tone="warning">Unpublished</DashboardStatusPill>
                                      )}

                                      {size.salePrice && size.discountEndDate && new Date() < new Date(size.discountEndDate) ? (
                                        <>
                                          <p>
                                            <strong>Price:</strong>{' '}
                                            <span className="text-dashboard-muted line-through">${size.price}</span>{' '}
                                            <span className="font-semibold text-brand-teal-dark">${size.salePrice}</span>
                                          </p>
                                          <p className="text-sm text-dashboard-muted">
                                            <strong>Offer valid till:</strong>{' '}
                                            {new Date(size.discountEndDate).toLocaleDateString()}
                                          </p>
                                        </>
                                      ) : (
                                        <p><strong>Price:</strong> ${size.price}</p>
                                      )}

                                      {/* Actions */}
                                      <div className="absolute flex gap-1 top-2 right-2">
                                        <button className="dashboard-icon-button" title="View" aria-label="View variant">
                                          <Eye className="h-4 w-4" />
                                        </button>
                                        <Link href={`/partners/${businessid}/inventory/edit/${product._id}/${variant.variantId}`}>
                                          <button className="dashboard-icon-button dashboard-icon-button--warning" title="Edit" aria-label="Edit variant">
                                            <Pencil className="h-4 w-4" />
                                          </button>
                                        </Link>
                                        <button
                                          onClick={() => {
                                            setDeleteTarget({ type: 'variant', productId: product._id, variantId: variant.variantId });
                                            setShowDeleteModal(true);
                                          }}
                                          className="dashboard-icon-button dashboard-icon-button--danger"
                                          title="Delete"
                                          aria-label="Delete variant"
                                        >
                                          <Trash2 className="h-4 w-4" />
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
                          <div className="flex h-full cursor-pointer items-center justify-center rounded-md border border-dashed border-dashboard-border-light bg-surface-cream p-4 text-center hover:border-dashboard-gold">
                            <button className="flex flex-col items-center justify-center gap-2 text-dashboard-muted hover:text-dashboard-text">
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
          <div key={product._id} className="dashboard-mobile-card">
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
                <p className="text-sm text-dashboard-muted line-clamp-2">{product.description}</p>
                <p className="mt-1 text-xs text-dashboard-muted">{product.variants.length} Variants</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Link href={`/products/view/${product._id}`} className="dashboard-action dashboard-action--ghost min-h-10 px-3 py-1">
                <Eye className="h-4 w-4" />
                View
              </Link>
              <Link href={`/partners/${businessid}/inventory/edit/${product._id}`} className="dashboard-action dashboard-action--primary min-h-10 px-3 py-1">
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget({ type: 'product', productId: product._id });
                  setShowDeleteModal(true);
                }}
                className="dashboard-action dashboard-action--danger min-h-10 px-3 py-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>

            {/* Expand variants */}
            {expanded.includes(product._id) && (
              <div className="mt-4 space-y-4">
                {product.variants.map(variant => (
                  <div key={variant.variantId} className="rounded-lg border border-dashboard-border-light bg-surface-cream p-4">
                    <p className="text-sm font-semibold">
                      Color: <span className="text-dashboard-muted">{variant.color}</span>
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
                          className={`rounded-md border border-dashboard-border-light p-2 ${size.stock === 0
                            ? 'bg-dashboard-warn-bg text-dashboard-warn-text'
                            : 'bg-white'
                            }`}
                        >
                          <p className="text-sm"><strong>{variant.label}:</strong> {size.size}</p>
                          <p className="text-sm"><strong>Stock:</strong> {size.stock}</p>
                          <p className="text-sm"><strong>SKU:</strong> {size.sku}</p>
                          {variant.isPublished ? (
                            <DashboardStatusPill tone="success">Published</DashboardStatusPill>
                          ) : (
                            <DashboardStatusPill tone="warning">Unpublished</DashboardStatusPill>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => toggleExpand(product._id)} className="mt-3 font-montserrat text-sm font-semibold text-dashboard-gold underline">
              {expanded.includes(product._id) ? 'Hide Variants' : 'Show Variants'}
            </button>
          </div>
        ))}
      </div>


      <DashboardPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      {showDeleteModal && (
        <DeleteConfirmationModal
          onCancel={() => {
            if (!deleteInProgress) setShowDeleteModal(false);
          }}
          onConfirm={handleDelete}
          title="Confirm Delete"
          loading={deleteInProgress}
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
