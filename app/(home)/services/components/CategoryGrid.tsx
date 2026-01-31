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
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const prevButtonRef = React.useRef<HTMLButtonElement>(null);
  const nextButtonRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/category/service`);
        setCategories(res.data.categories);
      } catch (err) {
        console.error("Failed to fetch service categories", err);
      }
    };

    fetchCategories();
  }, []);

  const sampleCategories = [
    { 
      _id: "1", 
      name: "Legal Services", 
      slug: "legal-services", 
      img: "/browsservice/legal.png" 
    },
    { 
      _id: "2", 
      name: "Health Services", 
      slug: "health-services", 
      img: "/browsservice/health.png" 
    },
    { 
      _id: "3", 
      name: "Business Consulting", 
      slug: "business-consulting", 
      img: "/browsservice/business.png" 
    },
    { 
      _id: "4", 
      name: "IT Services", 
      slug: "it-services", 
      img: "/browsservice/it.png" 
    },
    { 
      _id: "5", 
      name: "Marketing", 
      slug: "marketing", 
      img: "/browsservice/marketing.png" 
    },
    { 
      _id: "6", 
      name: "Education", 
      slug: "education", 
      img: "/browsservice/education.png" 
    },
  ];

  const displayCategories = categories.length > 0 ? categories.map(cat => ({
    ...cat,
    img: cat.img || `/browsservice/${cat.slug}.png`
  })) : sampleCategories;

  return (
    <section className="bg-[#fbf4e6] py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-20">
          <h2 className="text-4xl font-bold tracking-wide text-gray-900 mb-6 md:mb-0">
            BROWSE SERVICE CATEGORIES
          </h2>

          {/* <Link
            href="/services"
            className="px-10 py-4 text-lg font-bold text-white bg-custom-orange rounded-lg hover:bg-orange-600 transition shadow-md hover:shadow-lg"
          >
            Show All Services
          </Link> */}
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
            modules={[Navigation]}
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
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            className="w-full"
          >
            {displayCategories.map((category) => (
              <SwiperSlide key={category._id}>
                <div className="text-center px-3">
                  {/* Circular Image Container */}
                  <div className="group relative">
                    <Link
                      href={`/services/${category.slug}`}
                      className="block"
                    >
                      <div className="relative w-[128px] h-[128px] mx-auto rounded-full overflow-hidden border-8 border-white shadow-2xl group-hover:border-custom-orange group-hover:ring-4 group-hover:ring-orange-200 transition-all duration-300">
                        <Image
                          src={category.img || "/placeholder.png"}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 176px) 100vw, 176px"
                        />
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-custom-orange/0 group-hover:bg-custom-orange/80 flex items-center justify-center transition-all duration-300">
                          <span className="text-white font-bold text-xl px-6 text-center leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {category.name}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Category Name */}
                    <h3 className="mt-6 text-lg font-bold text-gray-800 group-hover:text-custom-orange transition-colors duration-300">
                      <Link href={`/services/${category.slug}`}>
                        {category.name}
                      </Link>
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
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