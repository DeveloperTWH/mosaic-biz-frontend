"use client";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Quote, CircleUserRound, Star, StarHalf, StarOff } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Jasmine R., Founder, Rooted & Radiant Skincare (Gold Vendor)",
    rating: 4.5,
    image: "",
    heading: "We went from invisible to in demand.",
    quote:
      "Before Mosaic Biz Hub, we were just another small brand trying to be seen. Within weeks of joining, we landed three new clients, got featured in a Gold Vendor spotlight, and finally felt like our story mattered. This platform doesn't just list your business, it amplifies it.",
  },
  {
    id: 2,
    name: "Marcus T., CEO, Legacy Fit Apparel (Platinum Vendor)",
    rating: 5,
    image: "",
    heading: "The Platinum tools paid for themselves in 30 days.",
    quote:
      "The CRM, push notifications, and analytics helped us double our repeat customers. The strategy call alone was worth the investment. Mosaic Biz Hub gave us the tools and the tribe to scale with purpose.",
  },
  {
    id: 3,
    name: "Danielle M., Mosaic Biz Hub Shopper",
    rating: 5,
    image: "",
    heading:
      "I found a Black-owned therapist, a vegan chef, and a branding coach all in one place.",
    quote:
      "As a conscious consumer, I love knowing my dollars are circulating in the community. The app makes it easy to discover businesses that align with my values, and the trust badges give me confidence in every purchase.",
  },
  {
    id: 4,
    name: "Luis A., Owner, Cultura Creative Studio (Silver Vendor)",
    rating: 5,
    image: "",
    heading: "It's more than a marketplace, it's a movement.",
    quote:
      "Mosaic Biz Hub isn't just about selling products. It's about building legacy, visibility, and economic power for our communities. I've never felt more supported as a business owner.",
  },
];

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} className="w-3 h-3 text-custom-blue fill-custom-blue" />);
    } else if (rating >= i - 0.5) {
      stars.push(<StarHalf key={i} className="w-3 h-3 text-custom-blue fill-custom-blue" />);
    } else {
      stars.push(<StarOff key={i} className="w-3 h-3 text-gray-300" />);
    }
  }
  return stars;
};

export default function ClientTestimonials() {
  return (
    <section className="px-5 py-20 text-brand-navy md:px-20">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-center text-gray-900 uppercase tracking-wide font-poppins">
          WHAT OUR CLIENTS SAY
        </h2>
        <div className="flex flex-col items-center justify-center">
          <hr className="h-[2px] w-[100px] bg-gray-700" />
          <hr className="h-[2px] w-[100px] mt-[2px] mb-4 bg-gray-700" />
        </div>
        <p className="text-[13px] text-gray-600 max-w-xl mx-auto font-montserrat">
          <b>Real voices. Real growth. Real impact.</b> <br />
          At Mosaic Biz Hub, we don't just connect businesses and buyers, we build bridges of trust, visibility, and community. Here's what our vendors and customers are saying:
        </p>
      </div>

      <div className="w-[90%] mx-auto">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={true}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1280: {
              slidesPerView: 2,
              spaceBetween: 32,
            },
          }}
          className="!pb-14 [&_.swiper-button-next]:text-custom-blue [&_.swiper-button-prev]:text-custom-blue [&_.swiper-button-next:after]:text-2xl [&_.swiper-button-prev:after]:text-2xl [&_.swiper-pagination-bullet-active]:bg-custom-blue"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className="h-auto">
              <div className="flex h-full min-h-[330px] flex-col p-6 text-gray-800 transition bg-white shadow-md rounded-xl hover:shadow-xl">
                <Quote className="mb-4 rotate-180 text-custom-yellow" size={64} />
                <h3 className="mb-4 text-base font-semibold text-gray-900 font-montserrat">
                  {testimonial.heading}
                </h3>
                <p className="mb-6 text-sm leading-6 font-montserrat">
                  {testimonial.quote}
                </p>

                <div className="flex items-center gap-3 mt-auto">
                  <div className="relative flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 rounded-full shrink-0">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <CircleUserRound className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-custom-blue font-montserrat">
                      {testimonial.name}
                    </p>
                    <div className="flex mt-1">{renderStars(testimonial.rating)}</div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
