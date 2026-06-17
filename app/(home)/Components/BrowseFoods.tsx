"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Category, FoodCategoryResponse } from "@/types/Category";

interface BrowseFoodsProps {
  onCategorySelect?: (category: Category) => void;
}

export default function BrowseFoods({ onCategorySelect }: BrowseFoodsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/foods`);
        const data: FoodCategoryResponse = await response.json();
        setCategories(data.data.foodCategories);
      } catch (err) {
        console.error("Error fetching food categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getImageForCategory = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case "restaurants":
        return "/restorant.png";
      case "grocery":
        return "/grocerry.png";
      case "others":
        return "/others.png";
      default:
        return "/others.png";
    }
  };

  if (loading) {
    return (
      <section className="bg-market-bg py-10">
        <div className="mx-auto flex h-[280px] max-w-7xl items-center justify-center px-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-market-gold"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-market-bg py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="font-poppins text-2xl font-bold uppercase tracking-wide text-market-text sm:text-3xl">
            Browse Food &amp; Grocery
          </h2>
          <div className="market-section-divider mt-3" />
        </div>
        <div className="flex flex-wrap items-start justify-center gap-8 sm:justify-around">
          {categories.map((category, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={category._id}
                className="flex cursor-pointer flex-col justify-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onCategorySelect?.(category)}
              >
                <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-white/15 shadow-market-card transition-all duration-300 sm:h-44 sm:w-44">
                  <div
                    className={`relative h-full w-full ${
                      isHovered ? "ring-2 ring-market-gold ring-offset-2 ring-offset-market-bg" : ""
                    }`}
                  >
                    <Image
                      src={category.img || getImageForCategory(category.name)}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                        isHovered ? "bg-market-gold/85" : "bg-transparent"
                      }`}
                    >
                      <span
                        className={`px-4 text-center font-poppins text-base font-bold text-market-header transition-opacity duration-300 ${
                          isHovered ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {category.name}
                      </span>
                    </div>
                  </div>
                </div>
                <p
                  className={`mt-6 self-center font-poppins text-sm font-medium transition-all duration-300 sm:text-base ${
                    isHovered ? "font-semibold text-market-gold" : "text-market-muted"
                  }`}
                >
                  {category.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
