"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const services = [
  { title: "Salons And Spas", img: "/browsservice/frame 1.png" },
  { title: "Legal Services", img: "/browsservice/frame 2.png" },
  { title: "Health And Wellness", img: "/browsservice/frame 3.png" },
  { title: "Business Consulting", img: "/browsservice/frame 4.png" },
  { title: "IT Consulting", img: "/browsservice/frame 5.png" },
  { title: "Marketing", img: "/browsservice/frame 6.png" },
  { title: "Education", img: "/browsservice/frame 7.png" },
  { title: "Home Services", img: "/browsservice/frame 8.png" },
  { title: "Financial Services", img: "/browsservice/frame 9.png" },
];

export default function BrowseServices() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const prevButtonRef = React.useRef<HTMLButtonElement>(null);
  const nextButtonRef = React.useRef<HTMLButtonElement>(null);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  return (
    <section className="bg-[#fbf4e6] py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl font-bold tracking-wide text-gray-900 font-poppins">
            BROWSE SERVICES
          </h2>

          <Link
            href="/services"
            className="px-8 py-3 text-lg font-semibold text-white bg-[#d1aa45] hover:bg-[#c19a38] transition font-montserrat"
          >
            Show All Services
          </Link>
        </div>

        {/* Slider Container */}
        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button
            ref={prevButtonRef}
            className="absolute -left-12 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-lg"
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Previous services"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Services Carousel */}
          <div className="w-full mx-auto px-4">
            <Swiper
              onSwiper={setSwiperInstance}
              modules={[Navigation]}
              spaceBetween={40}
              slidesPerView={5}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 50,
                },
              }}
              navigation={{
                prevEl: prevButtonRef.current,
                nextEl: nextButtonRef.current,
              }}
              className="w-full"
              onInit={(swiper) => {
                // Update navigation buttons after init
                if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                  swiper.params.navigation.prevEl = prevButtonRef.current;
                  swiper.params.navigation.nextEl = nextButtonRef.current;
                }
                swiper.navigation.init();
                swiper.navigation.update();
              }}
            >
              {services.map((service, index) => (
                <SwiperSlide key={index}>
                  <div 
                    className="text-center"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Circular Image Container */}
                    <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden border-8 border-white shadow-xl transition-all duration-300">
                      <div className={`relative w-full h-full ${
                        hoveredIndex === index 
                          ? "ring-4 ring-[#d1aa45] border-[#d1aa45]" 
                          : ""
                      }`}>
                        <Image
                          src={service.img}
                          alt={service.title}
                          fill
                          className="object-cover"
                        />
                        
                        {/* Hover overlay - Yellow with text */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                          hoveredIndex === index 
                            ? "bg-[#d1aa45]/90" 
                            : "bg-[#d1aa45]/0"
                        }`}>
                          <span className={`text-white font-poppins font-bold text-lg px-4 text-center transition-opacity duration-300 font-poppins ${
                            hoveredIndex === index ? "opacity-100" : "opacity-0"
                          }`}>
                            {service.title}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Service Title (shown when not hovered) */}
                    <p className={`mt-6 text-sm font-medium transition-all duration-300 font-poppins ${
                      hoveredIndex === index 
                        ? "text-[#d1aa45] font-semibold" 
                        : "text-gray-800"
                    }`}>
                      {service.title}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right Arrow */}
          <button
            ref={nextButtonRef}
            className="absolute -right-12 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-lg"
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Next services"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}