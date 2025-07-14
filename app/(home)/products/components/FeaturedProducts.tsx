// components/FeaturedProducts.tsx
import React, { useState } from 'react';
import Image from 'next/image';



const itemsPerPage = 12;
type Product = {
    id: number;
    title: string;
    price: number;
    rating: number;
    image: string;
};

type Props = {
    products: Product[];
};


const FeaturedProducts: React.FC<Props> = ({ products }) => {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

    return (
        <section className="px-6 py-16 mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center">SHOP PRODUCTS</h2>
            <p className="max-w-xl mx-auto mt-2 text-center text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor enim minim veniam quis.
            </p>

            <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {paginatedProducts.map((product) => (
                    <div
                        key={product.id}
                        className="flex flex-col justify-between p-4 bg-white border rounded-lg hover:shadow-md"
                    >
                        <div className="relative flex items-center justify-center w-full h-48">
                            <Image
                                src={product.image}
                                alt={product.title}
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-800">{product.title}</h3>
                            <div className="flex items-center mt-1">
                                <div className="text-yellow-400">{'★'.repeat(Math.round(Number(product.rating)))}</div>
                                <span className="ml-1 text-xs text-gray-500">({product.rating})</span>
                            </div>
                            <p className="mt-1 font-bold text-gray-900">${product.price}</p>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Image
                                src="/ShopProduct/Mask group.png"
                                alt="Cart Icon"
                                width={32}
                                height={32}
                            />
                        </div>
                    </div>
                ))}
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
