'use client';

import { useState, useEffect } from 'react';
import { dummyVendors } from './dummyVendors';
import CustomSelect from './CustomSelect';

interface Vendor {
    name: string;
    logo: string;
    category: string;
    city: string;
}

export default function VendorGrid() {
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(dummyVendors);

    const [category, setCategory] = useState('');
    const [city, setCity] = useState('');
    const [search, setSearch] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    const totalPages = Math.ceil(filteredVendors.length / perPage);
    const paginatedVendors = filteredVendors.slice((page - 1) * perPage, page * perPage);

    useEffect(() => {
        const filtered = dummyVendors.filter(
            (v) =>
                (!category || v.category === category) &&
                (!city || v.city.toLowerCase().includes(city.toLowerCase())) &&
                (!search || v.name.toLowerCase().includes(search.toLowerCase()))
        );
        setFilteredVendors(filtered);
        setPage(1);
    }, [category, city, search]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* Filters */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 items-stretch">
  <div className="sm:col-span-2 md:col-span-3">
    <CustomSelect category={category} setCategory={setCategory} />
  </div>

  <input
    type="text"
    className="border p-2 w-full sm:col-span-1 md:col-span-3"
    placeholder="Enter City"
    value={city}
    onChange={(e) => setCity(e.target.value)}
  />

  <input
    type="text"
    className="border p-2 w-full sm:col-span-1 md:col-span-4"
    placeholder="Search Business Name"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <button
    onClick={() => {
      setCategory('');
      setCity('');
      setSearch('');
    }}
    className="bg-red-500 text-white px-4 py-2 w-full sm:col-span-2 md:col-span-2"
  >
    Clear
  </button>
</div>


            {/* Vendor Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 mb-6">
                {paginatedVendors.map((vendor, idx) => (
                    <div key={idx} className="border p-4 text-center">
                        <img src={vendor.logo} alt={vendor.name} className="mx-auto h-16 object-contain" />
                        <p className="mt-2 text-sm font-medium">{vendor.name}</p>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-center items-center mt-4 gap-4">
                {totalPages > 0 ? (
                    <>
                        <span className="font-semibold whitespace-nowrap text-lg">
                            Page {page} of {totalPages}
                        </span>

                        <div className="flex flex-wrap justify-center items-center gap-2">
                            <button
                                onClick={() => page > 1 && setPage(page - 1)}
                                className={`px-3 py-1 heading rounded ${page === 1 ? 'invisible cursor-default' : ''
                                    }`}
                                disabled={page === 1}
                            >
                                Prev
                            </button>

                            {(() => {
                                const pages: (number | 'ellipsis')[] = [];

                                if (!isMobile) {
                                    if (totalPages <= 7) {
                                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                                    } else {
                                        if (page <= 4) {
                                            pages.push(1, 2, 3, 4, 5, 'ellipsis', totalPages);
                                        } else if (page >= totalPages - 3) {
                                            pages.push(1, 'ellipsis');
                                            for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                                        } else {
                                            pages.push(1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages);
                                        }
                                    }
                                } else {
                                    pages.push('ellipsis');
                                    if (page > 1) pages.push(page - 1);
                                    pages.push(page);
                                    if (page < totalPages) pages.push(page + 1);
                                    pages.push('ellipsis');
                                }

                                const cleanPages = Array.from(new Set(pages.filter(Boolean))).filter((p) =>
                                    typeof p === 'number' ? p >= 1 && p <= totalPages : true
                                );

                                return cleanPages.map((p, idx) =>
                                    p === 'ellipsis' ? (
                                        <span key={`e-${idx}`} className="px-1">
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => setPage(Number(p))}
                                            className={`px-4 py-1 rounded ${p === page ? 'bg-black text-white rounded-full' : 'bg-gray-100'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    )
                                );
                            })()}

                            {page < totalPages ? (
                                <button
                                    onClick={() => setPage(page + 1)}
                                    className="px-3 py-1 heading rounded"
                                >
                                    Next
                                </button>
                            ) : (
                                <button className="invisible px-3 py-1 heading rounded" disabled>
                                    Next
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <h2 className="heading text-2xl text-center">No Vendor Found</h2>
                )}
            </div>
        </>
    );
}
