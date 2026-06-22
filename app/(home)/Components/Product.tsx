"use client"
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Category } from "@/types/Category";

const Product = () => {
  const [active, setActive] = useState<"left" | "right" | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/category/product`);

        setCategories(res.data.data); // Adjust if API shape is different
      } catch (err) {
        console.error("Failed to fetch product categories", err);
      }
    };

    fetchCategories();
  }, []);


  return (
    <div className="flex items-center justify-center w-full px-4 mt-20 sm:px-6 md:px-12">
      <div className="w-full max-w-[1400px]">
        <div className="flex flex-col items-center justify-between mb-10 md:flex-row">
          <h1 className="market-section-heading mb-4 text-left md:mb-0">
            BROWSE BY CATEGORY
          </h1>
          {/* <div className="flex space-x-3">
            <button
              onClick={() => setActive("left")}
              className={`border border-custom-orange px-3 py-2 rounded transition-colors duration-200 ${active === "left"
                ? "bg-custom-orange text-white"
                : "text-custom-orange hover:bg-custom-orange hover:text-white"
                }`}
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-left"
              >
                <path d="M15 18L9 12L15 6" />
              </svg>
            </button>

            <button
              onClick={() => setActive("right")}
              className={`border border-custom-orange px-3 py-2 rounded transition-colors duration-200 ${active === "right"
                ? "bg-custom-orange text-white"
                : "text-custom-orange hover:bg-custom-orange hover:text-white"
                }`}
              aria-label="Next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right"
              >
                <path d="M9 18L15 12L9 6" />
              </svg>
            </button>
          </div> */}
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/products/${cat.slug}`}
              className="flex flex-col items-center mt-4 mb-4 transition-transform duration-300 cursor-pointer hover:scale-105"
            >
              <Image
                src={cat.img || "/default-category.png"} // fallback image
                alt={cat.name}
                width={60}
                height={60}
                className="object-contain grayscale hover:grayscale-0"
              />
              <div className="mt-3 px-2 text-center text-xs font-medium text-market-text sm:text-sm">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
