'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Package, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts, toggleProductFeatured } from '@/lib/api/products-admin';
import { Product, ProductsResponse } from '@/types/product-admin';

export default function ProductsPage() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(20);

    const fetchProducts = async (page: number = 1) => {
        try {
            setLoading(true);
            const data: ProductsResponse = await getProducts(page, limit);
            setProducts(data.products);
            setPagination(data.pagination);
            setCurrentPage(page);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            toast.error('Failed to fetch products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(1);
    }, []);

    const handleToggleFeatured = async (productId: string, currentFeatured: boolean) => {
        try {
            await toggleProductFeatured(productId, !currentFeatured);
            toast.success(`Product ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`);
            fetchProducts(currentPage);
        } catch (err) {
            console.error(err);
            toast.error('Failed to update product');
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= pagination.totalPages) {
            fetchProducts(page);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar setIsSidebarOpen={setSidebarOpen} />

                <main className="flex-1 px-8 py-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-black heading flex items-center gap-2">
                            <Package className="w-6 h-6 text-indigo-600" />
                            Manage products
                        </h1>
                        <div className="text-sm text-gray-600">
                            Total Products: {pagination.totalProducts}
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-gray-600">Loading...</p>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th> */}
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map((product) => (
                                            <tr key={product._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-12 w-12">
                                                            <img className="h-12 w-12 rounded object-cover" src={product.coverImage} alt={product.title} />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{product.title}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {product.categoryId?.name || 'No Category'}
                                                    </div>
                                                    {product.subcategoryId && (
                                                        <div className="text-sm text-gray-500">{product.subcategoryId.name}</div>
                                                    )}
                                                </td>
                                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {product.businessId?.businessName || 'N/A'}
                                                </td> */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        product.isPublished 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {product.isPublished ? 'Published' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
                                                        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                                            product.isFeatured
                                                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        <Star className={`w-3 h-3 mr-1 ${product.isFeatured ? 'fill-current' : ''}`} />
                                                        {product.isFeatured ? 'Featured' : 'Feature'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(product.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-center mt-8 space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="flex items-center px-3 py-2 text-sm text-gray-700 bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Previous
                                    </button>

                                    <div className="flex space-x-1">
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-3 py-2 text-sm rounded ${
                                                    page === currentPage
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-white text-gray-700 border hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === pagination.totalPages}
                                        className="flex items-center px-3 py-2 text-sm text-gray-700 bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            )}

                            {/* Page info */}
                            <div className="text-center mt-4 text-sm text-gray-600">
                                Showing page {currentPage} of {pagination.totalPages} 
                                ({pagination.totalProducts} total products)
                            </div>
                        </>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No products found.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}