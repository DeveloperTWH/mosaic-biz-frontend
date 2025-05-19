"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar from "../Component/FilterSidebar";
import ProductCard from "../Component/ProductCard";
import { Product } from "../Component/types/product";
import allProducts from "../Component/data/products.json";
import BannerSection from "../Component/BannerSection";
import SimilarProduct from "../../product/[id]/Component/SimilarProduct";


export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";

  const [filters, setFilters] = useState({
    brand: "",
    minPrice: 0,
    maxPrice: 1000,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);

      const filtered = allProducts.filter((product) => {
        return (
          (!filters.brand || product.brand.toLowerCase().includes(filters.brand.toLowerCase())) &&
          product.price >= filters.minPrice &&
          product.price <= filters.maxPrice
        );
      });

      await new Promise((r) => setTimeout(r, 300));

      setProducts(filtered);
      setLoading(false);
    };

    fetchFilteredProducts();
  }, [filters, category]);

  return (
    <>
      <BannerSection />
      <div className="flex gap-6 px-6 py-8 md:flex-row flex-col mx-auto">
        <FilterSidebar filters={filters} setFilters={setFilters} />
        <main className="flex-1">
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
      <div className="px-8 py-10 max-w-screen-xl mx-auto">
        <SimilarProduct />
      </div>
    </>
  );
}
