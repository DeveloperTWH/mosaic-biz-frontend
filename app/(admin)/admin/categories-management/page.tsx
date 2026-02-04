'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Package, Wrench, Utensils, PlusCircle, Pencil, Trash2 } from "lucide-react";
import CreateCategoryModal from './components/CreateCategoryModal';


interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    img?: string;
    subcategories?: Subcategory[];
}

interface Subcategory {
    _id: string;
    name: string;
    slug: string;
    description?: string;
}

export default function CategoriesManagementPage() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [productCategories, setProductCategories] = useState<Category[]>([]);
    const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
    const [foodCategories, setFoodCategories] = useState<Category[]>([]);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showProductSubModal, setShowProductSubModal] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showFoodModal, setShowFoodModal] = useState(false);
    const [showServiceSubModal, setShowServiceSubModal] = useState(false);
    const [showFoodSubModal, setShowFoodSubModal] = useState(false);
    const [allServiceCategories, setAllServiceCategories] = useState<Category[]>([]);
    const [allFoodCategories, setAllFoodCategories] = useState<Category[]>([]);
    const [allProductCategories, setAllProductCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<Category | null>(null);

    const [editMode, setEditMode] = useState(false);



    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/categories`, {
                withCredentials: true,
            });

            const data = res.data?.data || {};
            setProductCategories(data.productCategories || []);
            setServiceCategories(data.serviceCategories || []);
            setFoodCategories(data.foodCategories || []);
            setAllProductCategories(data.productCategories || []);
            setAllServiceCategories(data.serviceCategories || []);
            setAllFoodCategories(data.foodCategories || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching categories:', err);
            toast.error('Failed to fetch categories');
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (categoryId: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/category/product/${categoryId}`,
                { withCredentials: true }
            );
            toast.success("Category deleted successfully");
            fetchCategories(); // Refresh after deletion
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete category");
        }
    };

    const handleServiceSubcategoryDelete = async (subcategoryId: string) => {
        if (!confirm("Are you sure you want to delete this subcategory?")) return;
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/category/service-subcategory/${subcategoryId}`,
                { withCredentials: true }
            );
            toast.success("Subcategory deleted successfully");
            fetchCategories();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete subcategory");
        }
    };

    const handleFoodSubcategoryDelete = async (subcategoryId: string) => {
        if (!confirm("Are you sure you want to delete this subcategory?")) return;
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/category/food-subcategory/${subcategoryId}`,
                { withCredentials: true }
            );
            toast.success("Subcategory deleted successfully");
            fetchCategories();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete subcategory");
        }
    };

    const handleSubcategoryDelete = async (subcategoryId: string) => {
        if (!confirm("Are you sure you want to delete this subcategory?")) return;

        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/category/product-subcategory/${subcategoryId}`,
                { withCredentials: true }
            );
            toast.success("Subcategory deleted successfully");
            fetchCategories(); // Refresh
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete subcategory");
        }
    };



    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/category/service/${id}`, {
                withCredentials: true,
            });
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to delete category');
        }
    };




    const handleDeleteFoodCategory = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/category/food/${id}`, {
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success('Category deleted');
                fetchCategories(); // re-fetch updated list
            } else {
                toast.error('Delete failed');
            }
        } catch (err) {
            toast.error('Something went wrong');
        }
    };






    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar setIsSidebarOpen={setSidebarOpen} />

                <main className="flex-1 px-8 py-6 overflow-y-auto">
                    <h1 className="mb-6 text-2xl font-bold text-black heading">Categories Management</h1>

                    {loading ? (
                        <p className="text-gray-600">Loading...</p>
                    ) : (
                        <>
                            {/* 🛍️ Product Categories */}
                            <section className="mb-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="flex items-center gap-2 text-xl font-semibold heading">
                                        <Package className="w-5 h-5 text-indigo-600" />
                                        Product Categories
                                    </h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowProductModal(true)}
                                            className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700">
                                            <PlusCircle className="w-4 h-4" /> Add Category
                                        </button>
                                        <button
                                            onClick={() => setShowProductSubModal(true)}
                                            className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700">
                                            <PlusCircle className="w-4 h-4" /> Add Subcategory
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {productCategories.map((cat) => (
                                        <div key={cat._id} className="relative p-4 transition bg-white border rounded shadow hover:shadow-md">
                                            {/* Edit/Delete buttons */}
                                            <div className="absolute flex gap-2 top-2 right-2">
                                                <button
                                                    className="text-indigo-600 hover:text-indigo-800"
                                                    onClick={() => {
                                                        setSelectedCategory(cat);
                                                        setEditMode(true);
                                                        setShowProductModal(true);
                                                    }}>
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800"
                                                    onClick={() => handleDelete(cat._id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Image */}
                                            <div className="flex items-center justify-center w-full h-40 mb-3 overflow-hidden bg-gray-100 rounded">
                                                <img src={cat.img} alt={cat.name} className="object-contain w-full h-full" />
                                            </div>

                                            {/* Name & Slug */}
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                                                <span className="text-sm text-gray-500">{cat.slug}</span>
                                            </div>

                                            {/* Description */}
                                            <p className="mb-2 text-sm text-gray-600">{cat.description}</p>

                                            {/* Subcategories */}
                                            {Array.isArray(cat.subcategories) && cat.subcategories.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="mb-1 text-sm font-semibold text-gray-700">Subcategories:</h4>
                                                    <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
                                                        {cat.subcategories.map((sub) => (
                                                            <li key={sub._id} className="flex items-center justify-between pr-2 group">
                                                                <span>
                                                                    <span className="font-medium">{sub.name}</span> — {sub.slug}
                                                                </span>
                                                                <div className="flex items-center gap-2 transition opacity-0 group-hover:opacity-100">
                                                                    <button
                                                                        className="text-indigo-600 hover:text-indigo-800"
                                                                        onClick={() => {
                                                                            setSelectedSubCategory(sub);
                                                                            setEditMode(true);
                                                                            setShowProductSubModal(true);
                                                                        }}>
                                                                        <Pencil className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        className="text-red-600 hover:text-red-800"
                                                                        onClick={() => handleSubcategoryDelete(sub._id)}>
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* 🛠️ Service Categories */}
                            <section className="mb-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="flex items-center gap-2 text-xl font-semibold heading">
                                        <Wrench className="w-5 h-5 text-indigo-600" />
                                        Service Categories
                                    </h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowServiceModal(true)}
                                            className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700">
                                            <PlusCircle className="w-4 h-4" /> Add Category
                                        </button>
                                        <button
                                            onClick={() => setShowServiceSubModal(true)}
                                            className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700">
                                            <PlusCircle className="w-4 h-4" /> Add Subcategory
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    {serviceCategories.map((cat) => (
                                        <div key={cat._id} className="relative p-4 bg-white border rounded shadow hover:shadow-md">
                                            <div className="absolute flex gap-2 top-2 right-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCategory(cat); // set state for edit
                                                        setEditMode(true);
                                                        setShowServiceModal(true);
                                                    }}
                                                    className="p-1 text-sm text-blue-600 rounded bg-blue-50 hover:bg-blue-100"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat._id)}
                                                    className="p-1 text-sm text-red-600 rounded bg-red-50 hover:bg-red-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-center w-full h-40 mb-3 overflow-hidden bg-gray-100 rounded">
                                                <img src={cat.img} alt={cat.name} className="object-contain w-full h-full" />
                                            </div>
                                            <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                                            <p className="text-sm text-gray-500">{cat.slug}</p>
                                            <p className="mt-1 text-sm text-gray-600">{cat.description}</p>
                                            
                                            {Array.isArray(cat.subcategories) && cat.subcategories.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="mb-1 text-sm font-semibold text-gray-700">Subcategories:</h4>
                                                    <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
                                                        {cat.subcategories.map((sub) => (
                                                            <li key={sub._id} className="flex items-center justify-between pr-2 group">
                                                                <span>
                                                                    <span className="font-medium">{sub.name}</span> — {sub.slug}
                                                                </span>
                                                                <div className="flex items-center gap-2 transition opacity-0 group-hover:opacity-100">
                                                                    <button
                                                                        className="text-indigo-600 hover:text-indigo-800"
                                                                        onClick={() => {
                                                                            setSelectedSubCategory(sub);
                                                                            setEditMode(true);
                                                                            setShowServiceSubModal(true);
                                                                        }}>
                                                                        <Pencil className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        className="text-red-600 hover:text-red-800"
                                                                        onClick={() => handleServiceSubcategoryDelete(sub._id)}>
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* 🍽️ Food Categories */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="flex items-center gap-2 text-xl font-semibold heading">
                                        <Utensils className="w-5 h-5 text-indigo-600" />
                                        Food Categories
                                    </h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowFoodModal(true)}
                                            className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700">
                                            <PlusCircle className="w-4 h-4" /> Add Category
                                        </button>
                                        <button
                                            onClick={() => setShowFoodSubModal(true)}
                                            className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700">
                                            <PlusCircle className="w-4 h-4" /> Add Subcategory
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    {foodCategories.map((cat) => (
                                        <div
                                            key={cat._id}
                                            className="relative p-4 bg-white border rounded shadow hover:shadow-md"
                                        >
                                            {/* Action Buttons */}
                                            <div className="absolute flex gap-2 top-2 right-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCategory(cat); // for prefill
                                                        setEditMode(true);
                                                        setShowFoodModal(true); // open modal in edit mode
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteFoodCategory(cat._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                                            <p className="text-sm text-gray-500">{cat.slug}</p>
                                            <p className="mt-1 text-sm text-gray-600">{cat.description}</p>
                                            
                                            {Array.isArray(cat.subcategories) && cat.subcategories.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="mb-1 text-sm font-semibold text-gray-700">Subcategories:</h4>
                                                    <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
                                                        {cat.subcategories.map((sub) => (
                                                            <li key={sub._id} className="flex items-center justify-between pr-2 group">
                                                                <span>
                                                                    <span className="font-medium">{sub.name}</span> — {sub.slug}
                                                                </span>
                                                                <div className="flex items-center gap-2 transition opacity-0 group-hover:opacity-100">
                                                                    <button
                                                                        className="text-indigo-600 hover:text-indigo-800"
                                                                        onClick={() => {
                                                                            setSelectedSubCategory(sub);
                                                                            setEditMode(true);
                                                                            setShowFoodSubModal(true);
                                                                        }}>
                                                                        <Pencil className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        className="text-red-600 hover:text-red-800"
                                                                        onClick={() => handleFoodSubcategoryDelete(sub._id)}>
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                </main>
            </div>
            <CreateCategoryModal type="product" isOpen={showProductModal} onClose={() => setShowProductModal(false)} onSuccess={fetchCategories} />
            <CreateCategoryModal type="product-subcategory" isOpen={showProductSubModal} onClose={() => setShowProductSubModal(false)} onSuccess={fetchCategories} productCategoryOptions={allProductCategories} />
            <CreateCategoryModal type="service" isOpen={showServiceModal} onClose={() => setShowServiceModal(false)} onSuccess={fetchCategories} />
            <CreateCategoryModal type="service-subcategory" isOpen={showServiceSubModal} onClose={() => setShowServiceSubModal(false)} onSuccess={fetchCategories} serviceCategoryOptions={allServiceCategories} />
            <CreateCategoryModal type="food" isOpen={showFoodModal} onClose={() => setShowFoodModal(false)} onSuccess={fetchCategories} />
            <CreateCategoryModal type="food-subcategory" isOpen={showFoodSubModal} onClose={() => setShowFoodSubModal(false)} onSuccess={fetchCategories} foodCategoryOptions={allFoodCategories} />

            {/* for edit bellow */}

            <CreateCategoryModal
                type="product"
                isOpen={showProductModal}
                onClose={() => {
                    setShowProductModal(false);
                    setEditMode(false);
                    setSelectedCategory(null);
                }}
                onSuccess={fetchCategories}
                editMode={editMode}
                selectedCategory={selectedCategory}
            />

            <CreateCategoryModal
                type="product-subcategory"
                isOpen={showProductSubModal}
                onClose={() => {
                    setShowProductSubModal(false);
                    setEditMode(false);
                    setSelectedSubCategory(null);
                }}
                onSuccess={fetchCategories}
                editMode={editMode}
                selectedCategory={selectedSubCategory} // ✅ reuse selectedCategory prop
                productCategoryOptions={allProductCategories}
            />
            <CreateCategoryModal
                type="service"
                isOpen={showServiceModal}
                onClose={() => {
                    setShowServiceModal(false);
                    setSelectedCategory(null);
                    setEditMode(false);
                }}
                editMode={editMode}
                selectedCategory={selectedCategory}
                onSuccess={fetchCategories}
            />
            <CreateCategoryModal
                type="service-subcategory"
                isOpen={showServiceSubModal}
                onClose={() => {
                    setShowServiceSubModal(false);
                    setEditMode(false);
                    setSelectedSubCategory(null);
                }}
                onSuccess={fetchCategories}
                editMode={editMode}
                selectedCategory={selectedSubCategory}
                serviceCategoryOptions={allServiceCategories}
            />
            <CreateCategoryModal
                type="food-subcategory"
                isOpen={showFoodSubModal}
                onClose={() => {
                    setShowFoodSubModal(false);
                    setEditMode(false);
                    setSelectedSubCategory(null);
                }}
                onSuccess={fetchCategories}
                editMode={editMode}
                selectedCategory={selectedSubCategory}
                foodCategoryOptions={allFoodCategories}
            />





        </div>
    );
}
