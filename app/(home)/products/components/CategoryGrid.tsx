'use client';

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import { Category } from "@/types/Category";

const CategoryGrid = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Track hovered card
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const prevButtonRef = React.useRef<HTMLButtonElement>(null);
  const nextButtonRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/category/product`);
        setCategories(res.data.data);
      } catch (err) {
        console.error("Failed to fetch product categories", err);
      }
    };

    fetchCategories();
  }, []);

  const sampleCategories = [
    { 
      _id: "1", 
      name: "Electronics", 
      slug: "electronics", 
      img: "/browsservice/electronics.png" 
    },
    { 
      _id: "2", 
      name: "Fashion And Apparel", 
      slug: "fashion-apparel", 
      img: "/browsservice/fashion.png" 
    },
    { 
      _id: "3", 
      name: "Beauty And Personal Care", 
      slug: "beauty-care", 
      img: "/browsservice/beauty.png" 
    },
    { 
      _id: "4", 
      name: "Home And Kitchen Essentials", 
      slug: "home-kitchen", 
      img: "/browsservice/home.png" 
    },
    { 
      _id: "5", 
      name: "Health And Wellness", 
      slug: "health-wellness", 
      img: "/browsservice/health.png" 
    },
    { 
      _id: "6", 
      name: "Toys And Hobbies", 
      slug: "toys-hobbies", 
      img: "/browsservice/toys.png" 
    },
  ];

  const displayCategories = categories.length > 0 ? categories.map(cat => ({
    ...cat,
    img: cat.img || `/browsservice/${cat.slug}.png`
  })) : sampleCategories;

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <section className="bg-[#fbf4e6] py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-20">
          <h2 className="text-4xl font-bold tracking-wide text-gray-900 mb-6 md:mb-0">
            BROWSE BY CATEGORIES
          </h2>
        </div>

        {/* Slider Container */}
        <div className="relative flex items-center justify-center">
          {/* Left Arrow */}
          <button
            ref={prevButtonRef}
            className="absolute left-0 md:-left-16 z-10 flex items-center justify-center w-14 h-14 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-xl"
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Previous categories"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Categories Carousel */}
          <Swiper
            onSwiper={setSwiperInstance}
            modules={[Navigation, Autoplay]}
            spaceBetween={50}
            slidesPerView={2}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 50,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 60,
              },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="w-full"
          >
            {displayCategories.map((category, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <SwiperSlide key={category._id}>
                  <div className="text-center px-3">
                    {/* Circular Image Container */}
                    <Link
                      href={`/products/${category.slug}`}
                      className="block group"
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className={`relative w-[128px] h-[128px]  mx-auto rounded-full overflow-hidden border-8 ${isHovered ? 'border-custom-orange ring-4 ring-orange-200' : 'border-white'} shadow-2xl transition-all duration-300`}>
                        <Image
                          src={category.img}
                          alt={category.name}
                          fill
                          className={`object-cover transition-all duration-300 ${isHovered ? 'scale-110' : 'group-hover:scale-105'}`}
                          sizes="(max-width: 176px) 100vw, 176px"
                        />
                        
                        {/* Hover overlay */}
                        {isHovered && (
                          <div className="absolute inset-0 bg-custom-orange/80 flex items-center justify-center">
                            <span className="text-white font-bold text-xl px-6 text-center leading-tight">
                              {category.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Category Name (hidden when hovered) */}
                    <h3 className={`mt-8 text-xl font-bold transition-colors duration-300 ${isHovered ? 'text-custom-orange' : 'text-gray-800'}`}>
                      <Link 
                        href={`/products/${category.slug}`}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {category.name}
                      </Link>
                    </h3>
                  </div>
                </SwiperSlide>
              );
            })}
  </Swiper>

          {/* Right Arrow */}
          <button
            ref={nextButtonRef}
            className="absolute right-0 md:-right-16 z-10 flex items-center justify-center w-14 h-14 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-xl"
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Next categories"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;