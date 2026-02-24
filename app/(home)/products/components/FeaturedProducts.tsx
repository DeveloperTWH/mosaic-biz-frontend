// components/FeaturedProducts.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { ProductListingItem } from "@/types/product";
import { useRouter } from 'next/navigation';
import { PackageX } from 'lucide-react';
import Link from 'next/link';

const itemsPerPage = 12;

type Props = {
    products: ProductListingItem[];
    loading: boolean
};


const FeaturedProducts: React.FC<Props> = ({ products, loading }) => {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

    const router = useRouter();

    if (loading) {
        return (
            <div className="flex items-center justify-center w-screen h-screen">
                <div className='text-gray-400'>
                    Loading..
                </div>
            </div>
        )
    }

    if (paginatedProducts.length === 0) {
        return (
            <section className="px-6 py-16 mx-auto text-center max-w-7xl">
                <div className="flex justify-center mb-4">
                    <PackageX className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-700 uppercase">No Products Found</h2>
                <p className="max-w-xl mx-auto mt-2 text-gray-500">
                    Please try again later or adjust your filters.
                </p>
            </section>
        );
    }

    return (
        <section className="px-6 py-16 mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center">BEST  SELLERS</h2>
            <p className="mx-auto mt-2 text-center text-gray-600">
                Explore a diverse selection of products from trusted minority-owned businesses. Find everything you need, from handmade goods to specialty foods, all in one convenient place.
            </p>
            <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {paginatedProducts.map((product) => {
                    const variant = product.variants?.[0];
                    const size = variant?.sizes?.[0];
                    const now = new Date();
                    const hasDiscount =
                        size?.salePrice &&
                        size?.salePrice < size?.price &&
                        size?.discountEndDate &&
                        new Date(size.discountEndDate) > now;


                    return (
                        <div
                            key={product._id}
                            className="flex flex-col p-4 bg-white border rounded-lg hover:shadow-lg transition-shadow duration-200 min-h-[350px]"
                        >
                            <div
  key={product._id}
  onClick={() => router.push(`/product/${product._id}`)}
  className="flex flex-col p-4 bg-white border rounded-lg hover:shadow-lg transition-shadow duration-200 min-h-[350px] cursor-pointer"
>
                                {/* Clickable area (redirects to product detail) */}
                                <div
                                    className="cursor-pointer"
                                >
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={product.coverImage}
                                            alt={product.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="text-base font-semibold text-gray-800 truncate">
                                            {product.title}
                                        </h3>

                                        <p
                                            className="overflow-hidden text-sm text-gray-600 text-ellipsis"
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                lineHeight: '1.2rem',
                                                maxHeight: '2.4rem',
                                            }}
                                        >
                                            {product.description}
                                        </p>

                                        <div className="flex items-center mt-1">
                                            <div className="text-yellow-400">
                                                {'★'.repeat(Math.round(Number(variant?.averageRating || 0)))}
                                            </div>
                                            <span className="ml-1 text-xs text-gray-500">
                                                ({variant?.totalReviews || 0})
                                            </span>
                                        </div>

                                        <div className="mt-1 font-bold text-gray-900">
                                            {hasDiscount ? (
                                                <>
                                                    <span className="text-red-600">
                                                        ${Number(size.salePrice).toFixed(2)}
                                                    </span>{' '}
                                                    <span className="ml-1 text-sm text-gray-500 line-through">
                                                        ${Number(size.price).toFixed(2)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span>${Number(size?.price || 0).toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Cart Icon - stays outside the click zone */}
                                {/* <div className="flex justify-end mt-4">
                                <button onClick={() => {
                                    console.log(product._id);
                                }}>
                                    <Image
                                        src="/ShopProduct/Mask group.png"
                                        alt="Cart Icon"
                                        width={32}
                                        height={32}
                                    />
                                </button>
                            </div> */}
                            </div>
                        </div>

                    );
                })}
            </div>


            {/* Pagination */}
            <div className="flex items-center justify-center mt-10 space-x-2">
                <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Prev
                </button>
                {Array.from({ length: totalPages })
                    .map((_, i) => i + 1)
                    .filter((p) => p >= page - 2 && p <= page + 2)
                    .map((p) => (
                        <button
                            key={p}
                            className={`px-3 py-1 border rounded ${page === p ? 'bg-black text-white' : ''}`}
                            onClick={() => setPage(p)}
                        >
                            {p}
                        </button>
                    ))}

                <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>

            <p className="mt-4 text-sm text-center text-gray-500">Page {page} of {totalPages}</p>
        </section>
    );
};

export default FeaturedProducts;
