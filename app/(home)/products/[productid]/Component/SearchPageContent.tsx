"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar from "./FilterSidebar";
import ProductCard from "./ProductCard";
import { Product } from "./types/product";
import allProducts from "./data/products.json";
import BannerSection from "./BannerSection";
import SimilarProduct from "../[id]/Component/SimilarProduct";
import Link from "next/link";


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
                <Link href={`/products/${product.id}`} key={product.id} className="block">
                  <ProductCard product={product} />
                </Link>
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
