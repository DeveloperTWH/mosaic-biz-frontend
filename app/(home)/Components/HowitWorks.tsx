"use client";

import Image from "next/image";



import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useState } from "react";

import "swiper/css";
import "swiper/css/pagination";







export default function HowItWorks() {

  const [tabClick, setTabClick]= useState(0)
  return (
    <section className="bg-white">
      <div className="py-24 max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            HOW IT WORKS
          </h2>
          <div className="flex justify-center mt-4">
            <div className="w-24 h-[2px] bg-gray-400" />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="grid gap-4">
 
              <Image
                src={tabClick == 0 ? "/howitworks/browseClick.png" : "/howitworks/browse.png"}
                alt="How it works steps"
                width={400}
                height={150}
                onClick={()=>setTabClick(0)}
              />


              <Image
                src={tabClick == 1 ? "/howitworks/discoverClick.png" : "/howitworks/discover.png"}
                alt="How it works steps"
                width={400}
                height={150}
                // className="w-full h-auto"
                onClick={()=>setTabClick(1)}
              />

              <Image
                src={tabClick == 2 ? "/howitworks/connectClick.png" : "/howitworks/connect.png"}
                alt="How it works steps"
                width={400}
                height={150}
                // className="w-full h-auto"
                onClick={()=>setTabClick(2)}
              />

              <Image
                src={tabClick == 3 ? "/howitworks/supportClick.png" : "/howitworks/support.png"}
                alt="How it works steps"
                width={400}
                height={150}
                // className="w-full h-auto"
                onClick={()=>setTabClick(3)}
              />

          </div>

          {/* Right Content */}
          <div className="flex gap-6">
            <Image
              src="/howitworkright.png"
              alt="Discover and connect"
              width={120}
              height={120}
              className="flex-shrink-0"
            />

            <div className="text-gray-700 space-y-6 text-base leading-relaxed">
              <p>
                Discover trusted services and businesses around you with ease.
                Browse through verified listings tailored to your needs, whether
                you're looking for local professionals or essential services.
              </p>

              <p>
                Compare options, explore detailed profiles, and connect directly
                with service providers. Our platform helps you make confident
                decisions quickly and efficiently.
              </p>

              <p>
                From discovery to support, we ensure a smooth experience at
                every step, helping you save time and get the right service
                when you need it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PROMOTIONAL IMAGE (image-only) */}
      <FeaturedVendors/>
      {/* <div className="py-24">
        <Image
          src="/Promotional Slider.png"
          alt="Featured vendors"
          width={1920}
          height={600}
          className="w-full h-auto object-contain"
          priority
        />
      </div> */}
    </section>
  );
}



const images = [
  "https://img.freepik.com/free-photo/cascade-boat-clean-china-natural-rural_1417-1356.jpg?t=st=1769771282~exp=1769774882~hmac=430770117169f725ca995d3dcb9f8b8ef9b62c1827b71a4601f90ec69a8e07fc",
  "https://img.freepik.com/free-photo/mountain-covered-with-fogs_400718-5.jpg?t=st=1769771569~exp=1769775169~hmac=ad09dc5ca036aa18fbb1fc0b8d7afce8744c5e886d555b387b2e8983fab85639",
  "https://img.freepik.com/free-photo/summer-green-water-sunlight-spring-beauty_1417-1246.jpg?t=st=1769771601~exp=1769775201~hmac=c04e745eded8c592aa84da8674fc27918042302fae154caf0af4a96668b99fcb",
  "https://images.pexels.com/photos/10337816/pexels-photo-10337816.jpeg"
];
 function FeaturedVendors() {
 return (
    <section className="w-full py-12 overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        centeredSlides={true}
        slidesPerView="auto"
        spaceBetween={30}
        loop
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'my-swiper-bullet',
          bulletActiveClass: 'my-swiper-bullet-active',
        }}
        className="w-full my-swiper"
      >
        {images.map((src, index) => (
          <SwiperSlide
            key={index}
            className="!w-[600px]" // controls main image width
          >
            <div className="relative h-[200px] overflow-hidden">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

