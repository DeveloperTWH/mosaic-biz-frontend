"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const slides = [
  {
    img: "/Carousel/nature-1.jpg",
    title: "Support Local. Shop Unique.",
    desc: "Discover handcrafted treasures and exclusive deals from minority-owned businesses.",
  },
  {
    img: "/Carousel/nature-2.jpg",
    title: "Empower Through Every Purchase",
    desc: "Your shopping supports vibrant, local entrepreneurs. Make every dollar count.",
  },
  {
    img: "/Carousel/nature-3.jpg",
    title: "Shop Black-Owned. Stand With Purpose.",
    desc: "Join a movement that fuels innovation, culture, and community.",
  },
  {
    img: "/Carousel/nature-4.jpg",
    title: "Shop Black-Owned. Stand With Purpose.",
    desc: "Join a movement that fuels innovation, culture, and community.",
  },
];

export default function PromoCarousel() {
  return (
    <section className="relative w-full h-[400px] overflow-hidden mb-20 mt-20">
      <Swiper
        
        modules={[ Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
        centeredSlides={true}          // Centers the active slide
        slidesPerView={1.2}            // Shows 1 full slide and a little of the next
        spaceBetween={20}              // Adds space between slides

      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-start px-10 md:px-20">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-lg text-white max-w-xl">
                  {slide.desc}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
