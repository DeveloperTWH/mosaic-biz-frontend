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
        console.error('Error fetching food categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className='bg-[#C7A04024] h-[300px] flex justify-center items-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d1aa45]"></div>
      </div>
    );
  }

  const getImageForCategory = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'restaurants':
        return '/restorant.png';
      case 'grocery':
        return '/grocerry.png';
      case 'others':
        return '/others.png';
      default:
        return '/others.png';
    }
  };

  return (
    <div className='bg-[#C7A04024] h-[300px] flex justify-around'>
      {categories.map((category, index) => (
        <div 
          key={category._id}
          className='justify-center flex flex-col cursor-pointer'
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onCategorySelect?.(category)}
        >
          <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden border-8 border-white shadow-xl transition-all duration-300">
            <div className={`relative w-full h-full ${
              hoveredIndex === index 
                ? "ring-4 ring-[#d1aa45] border-[#d1aa45]" 
                : ""
            }`}>
              <Image
                src={category.img || getImageForCategory(category.name)}
                alt={category.name}
                fill
                className="object-cover"
              />
              
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                hoveredIndex === index 
                  ? "bg-[#d1aa45]/90" 
                  : "bg-[#d1aa45]/0"
              }`}>
                <span className={`text-white font-bold text-lg px-4 text-center transition-opacity duration-300 font-poppins ${
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                }`}>
                  {category.name}
                </span>
              </div>
            </div>
          </div>

          <p className={`mt-6 self-center font-medium font-poppins transition-all duration-300 ${
            hoveredIndex === index 
              ? "text-[#d1aa45] font-semibold" 
              : "text-gray-800"
          }`}>
            {category.name}
          </p>
        </div>
      ))}
    </div>
  );
}