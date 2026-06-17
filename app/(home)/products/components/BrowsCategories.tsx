"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Category, CategoryResponse } from "@/types/Category";
import "swiper/css";
import "swiper/css/navigation";

interface BrowseCategoriesProps {
  onCategorySelect?: (category: Category) => void;
}

export default function BrowseCategories({ onCategorySelect }: BrowseCategoriesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const prevButtonRef = React.useRef<HTMLButtonElement>(null);
  const nextButtonRef = React.useRef<HTMLButtonElement>(null);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/products`);
        const data: CategoryResponse = await response.json();
        setCategories(data.data.productCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="bg-market-bg py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-market-gold"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-market-bg py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:mb-12 sm:flex-row sm:items-center">
          <h2 className="font-poppins text-2xl font-bold uppercase tracking-wide text-market-text sm:text-3xl">
            Browse Products
          </h2>
          <Link href="/products" className="market-btn-secondary text-sm normal-case">
            Show All Products
          </Link>
        </div>

        <div className="relative flex items-center">
          <button
            ref={prevButtonRef}
            type="button"
            className="absolute -left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-market-elevated text-market-text shadow-market-card transition hover:bg-market-surface sm:-left-12 sm:h-12 sm:w-12"
            onClick={() => swiperInstance?.slidePrev()}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="mx-auto w-full px-4">
            <Swiper
              onSwiper={setSwiperInstance}
              modules={[Navigation]}
              spaceBetween={40}
              slidesPerView={5}
              breakpoints={{
                0: { slidesPerView: 2, spaceBetween: 20 },
                640: { slidesPerView: 3, spaceBetween: 30 },
                768: { slidesPerView: 4, spaceBetween: 40 },
                1024: { slidesPerView: 5, spaceBetween: 40 },
                1280: { slidesPerView: 6, spaceBetween: 40 },
              }}
              navigation={{
                prevEl: prevButtonRef.current,
                nextEl: nextButtonRef.current,
              }}
              className="w-full"
              onInit={(swiper) => {
                if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
                  swiper.params.navigation.prevEl = prevButtonRef.current;
                  swiper.params.navigation.nextEl = nextButtonRef.current;
                }
                swiper.navigation.init();
                swiper.navigation.update();
              }}
            >
              {categories.map((category, index) => {
                const isHovered = hoveredIndex === index;
                return (
                  <SwiperSlide key={category._id}>
                    <div
                      className="cursor-pointer text-center"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => onCategorySelect?.(category)}
                    >
                      <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-white/10 shadow-market-card transition-all duration-300 sm:h-44 sm:w-44">
                        <div
                          className={`relative h-full w-full ${
                            isHovered ? "ring-2 ring-market-gold ring-offset-2 ring-offset-market-bg" : ""
                          }`}
                        >
                          <Image
                            src={category.img || "/browsecategories/electronics 1.png"}
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
                              className={`px-4 text-center font-poppins text-base font-bold text-market-header transition-opacity duration-300 sm:text-lg ${
                                isHovered ? "opacity-100" : "opacity-0"
                              }`}
                            >
                              {category.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p
                        className={`mt-6 font-poppins text-sm font-medium transition-all duration-300 sm:text-base ${
                          isHovered ? "font-semibold text-market-gold" : "text-market-muted"
                        }`}
                      >
                        {category.name}
                      </p>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          <button
            ref={nextButtonRef}
            type="button"
            className="absolute -right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-market-elevated text-market-text shadow-market-card transition hover:bg-market-surface sm:-right-12 sm:h-12 sm:w-12"
            onClick={() => swiperInstance?.slideNext()}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
