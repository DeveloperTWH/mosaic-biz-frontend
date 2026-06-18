'use client';

import { useState, useEffect } from 'react';
import CustomSelect from './CustomSelect';
import Link from 'next/link';

interface Vendor {
    _id: string;
    businessName: string;
    logo: string;
    slug: string;
}

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}


function getVisiblePages(current: number, total: number): number[] {
    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages = new Set<number>([1, total, current]);
    if (current > 1) pages.add(current - 1);
    if (current < total) pages.add(current + 1);
    if (current <= 2) {
        pages.add(2);
        pages.add(3);
    }
    if (current >= total - 1) {
        pages.add(total - 1);
        pages.add(total - 2);
    }
    return Array.from(pages).sort((a, b) => a - b);
}

export default function VendorGrid() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const [category, setCategory] = useState('');
    const [city, setCity] = useState('');
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500); // debounce delay in ms
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                setLoading(true); // Start loading
                const queryParams = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                    ...(category ? { productCategory: category } : {}),
                    ...(city ? { city } : {}),
                    ...(debouncedSearch ? { search: debouncedSearch } : {}),
                });

                console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business?${queryParams}`);

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business?${queryParams}`);
                const data = await res.json();

                if (data.success) {
                    setVendors(data.data);
                    setTotalPages(data.totalPages || 1);
                } else {
                    setVendors([]);
                    setTotalPages(1);
                }
            } catch (err) {
                console.error('Error fetching vendors:', err);
                setVendors([]);
                setTotalPages(1);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchVendors();
    }, [page, category, city, debouncedSearch]); // 👈 use debouncedSearch instead of search


    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const clearFilters = () => {
        setCategory('');
        setCity('');
        setSearch('');
        setPage(1);
    };


    return (
        <>
            {/* Filters */}
            <div className="grid items-stretch grid-cols-1 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-12">
                <div className="sm:col-span-2 md:col-span-3">
                    <CustomSelect category={category} setCategory={setCategory} />
                </div>

                <input
                    type="text"
                    className="market-input sm:col-span-1 md:col-span-3"
                    placeholder="Enter City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />

                <input
                    type="text"
                    className="market-input sm:col-span-1 md:col-span-4"
                    placeholder="Search Business Name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button onClick={clearFilters} className="market-btn-outline w-full sm:col-span-2 md:col-span-2">
                    Clear
                </button>
            </div>

            {/* Vendor Grid */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-market-muted border-t-market-gold"></div>
                </div>
            ) : (
                <div className="mb-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                    {vendors.map((vendor) => (
                        <Link key={vendor._id} href={`/vendors/${vendor.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-market-bg rounded-2xl">
                            <div className="market-card p-4 text-center">
                                <div className="market-card-media mx-auto mb-3 flex h-20 w-full items-center justify-center rounded-lg">
                                    {vendor.logo ? (
                                        <img src={vendor.logo} alt={vendor.businessName} className="mx-auto h-16 max-w-full object-contain" />
                                    ) : (
                                        <div className="market-card-placeholder h-16">No logo</div>
                                    )}
                                </div>
                                <p className="market-card-title line-clamp-2 text-sm">{vendor.businessName}</p>
                                <span className="market-card-action mt-2 inline-block text-xs">View store</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}


            {/* Pagination */}
            <div className="flex flex-col items-center justify-center gap-4 mt-4 sm:flex-row">
                {totalPages > 0 ? (
                    <>
                        <span className="whitespace-nowrap text-lg font-semibold text-market-text">
                            Page {page} of {totalPages}
                        </span>

                        <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
                            <button onClick={() => page > 1 && setPage(page - 1)} disabled={page === 1} className="market-btn-outline min-h-11 px-4 py-2 text-sm disabled:opacity-50">
                                Prev
                            </button>

                            {getVisiblePages(page, totalPages).map((pageNum, index, arr) => {
                                const showEllipsis = index > 0 && pageNum - arr[index - 1] > 1;
                                return (
                                    <span key={pageNum} className="flex items-center gap-2">
                                        {showEllipsis ? (
                                            <span className="px-1 text-market-muted" aria-hidden>…</span>
                                        ) : null}
                                        <button
                                            onClick={() => setPage(pageNum)}
                                            className={`min-h-11 min-w-11 rounded-full px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50 ${
                                              page === pageNum
                                                ? "bg-market-gold font-semibold text-market-header"
                                                : "border border-white/10 bg-market-elevated text-market-text hover:border-market-gold/40"
                                            }`}
                                            aria-current={page === pageNum ? "page" : undefined}
                                        >
                                            {pageNum}
                                        </button>
                                    </span>
                                );
                            })}

                            <button onClick={() => page < totalPages && setPage(page + 1)} disabled={page === totalPages} className="market-btn-outline min-h-11 px-4 py-2 text-sm disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    <h2 className="market-empty-state-title text-center text-2xl">No vendors found</h2>
                )}
            </div>
        </>
    );
}
