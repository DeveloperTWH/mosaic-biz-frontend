"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Category, ServiceCategoryResponse } from "@/types/Category";
import "swiper/css";
import "swiper/css/navigation";

interface BrowseServicesProps {
  showAllService: boolean;
  onCategorySelect?: (category: Category) => void;
  selectedCategoryId?: string | null;
}

export default function BrowseServices({
  showAllService,
  onCategorySelect,
  selectedCategoryId,
}: BrowseServicesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const prevButtonRef = React.useRef<HTMLButtonElement>(null);
  const nextButtonRef = React.useRef<HTMLButtonElement>(null);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/services`);
        const data: ServiceCategoryResponse = await response.json();
        setCategories(data.data.serviceCategories);
      } catch (err) {
        console.error('Error fetching service categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: Category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
      return;
    }

    const params = new URLSearchParams({
      categoryId: category._id,
      categorySlug: category.slug,
    });

    router.push(`/services?${params.toString()}`);
  };

  if (loading) {
    return (
      <section className="bg-[#fbf4e6] py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d1aa45]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#fbf4e6] py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl font-bold tracking-wide text-gray-900 font-poppins">
            BROWSE SERVICES
          </h2>

          {showAllService && (
            <Link
              href="/services"
              className="px-8 py-3 text-lg font-semibold text-white bg-[#d1aa45] hover:bg-[#c19a38] transition font-montserrat"
            >
              Show All Services
            </Link>
          )}
        </div>

        <div className="relative flex items-center">
          <button
            ref={prevButtonRef}
            className="absolute -left-12 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-lg"
            onClick={() => swiperInstance?.slidePrev()}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="w-full mx-auto px-4">
            <Swiper
              onSwiper={setSwiperInstance}
              modules={[Navigation]}
              spaceBetween={40}
              slidesPerView={5}
breakpoints={{
  0: { slidesPerView: 2, spaceBetween: 20 },
  640: { slidesPerView: 3, spaceBetween: 30 },
  768: { slidesPerView: 4, spaceBetween: 40 },
  1024: { slidesPerView: 6, spaceBetween: 40 }, // changed from 5 -> 6
}}
              navigation={{
                prevEl: prevButtonRef.current,
                nextEl: nextButtonRef.current,
              }}
              className="w-full"
              onInit={(swiper) => {
                if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                  swiper.params.navigation.prevEl = prevButtonRef.current;
                  swiper.params.navigation.nextEl = nextButtonRef.current;
                }
                swiper.navigation.init();
                swiper.navigation.update();
              }}
            >
              {categories.map((category, index) => (
                <SwiperSlide key={category._id}>
                  {(() => {
                    const isSelected = selectedCategoryId === category._id;
                    const isActive = hoveredIndex === index || isSelected;

                    return (
                  <div 
                    className="text-center cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden border-8 border-white shadow-xl transition-all duration-300">
                      <div className={`relative w-full h-full ${
                        isActive
                          ? "ring-4 ring-[#d1aa45] border-[#d1aa45]" 
                          : ""
                      }`}>
                        <Image
                          src={category.img || "/browsservice/electronics 1.png"}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                        
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-[#d1aa45]/90" 
                            : "bg-[#d1aa45]/0"
                        }`}>
                          <span className={`text-white font-bold text-lg px-4 text-center transition-opacity duration-300 font-poppins ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}>
                            {category.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className={`mt-6 text-sm font-medium transition-all duration-300 font-poppins ${
                      isActive
                        ? "text-[#d1aa45] font-semibold" 
                        : "text-gray-800"
                    }`}>
                      {category.name}
                    </p>
                  </div>
                    );
                  })()}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <button
            ref={nextButtonRef}
            className="absolute -right-12 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-lg"
            onClick={() => swiperInstance?.slideNext()}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
