"use client";

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
      stars.push(<Star key={i} className="h-3 w-3 text-brand-gold fill-brand-gold" />);
    } else if (rating >= i - 0.5) {
      stars.push(<StarHalf key={i} className="h-3 w-3 text-brand-gold fill-brand-gold" />);
    } else {
      stars.push(<StarOff key={i} className="h-3 w-3 text-brand-muted/40" />);
    }
  }
  return stars;
};

export default function ClientTestimonials() {
  return (
    <section className="bg-surface-panel px-5 py-16 text-brand-navy md:px-20">
      <div className="mb-12 text-center">
        <h2 className="section-heading">What our clients say</h2>
        <div className="section-divider" />
        <p className="mx-auto mt-4 max-w-xl font-montserrat text-sm leading-relaxed text-brand-muted">
          <strong className="font-semibold text-brand-navy">Real voices. Real growth. Real impact.</strong>{" "}
          At Mosaic Biz Hub, we don&apos;t just connect businesses and buyers — we build bridges of trust,
          visibility, and community.
        </p>
      </div>

      <div className="mx-auto w-[90%] max-w-6xl">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1280: { slidesPerView: 2, spaceBetween: 32 },
          }}
          className="!pb-14 [&_.swiper-button-next]:text-brand-navy-light [&_.swiper-button-prev]:text-brand-navy-light [&_.swiper-button-next:after]:text-2xl [&_.swiper-button-prev:after]:text-2xl [&_.swiper-pagination-bullet-active]:bg-brand-gold"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className="h-auto">
              <article className="market-card-light flex h-full min-h-[330px] flex-col p-6 transition-shadow hover:shadow-market-glow">
                <Quote className="mb-4 rotate-180 text-brand-gold" size={48} aria-hidden />
                <h3 className="market-card-light-title mb-4 text-base">{testimonial.heading}</h3>
                <p className="market-card-light-body mb-6 flex-1">{testimonial.quote}</p>

                <div className="mt-auto flex items-center gap-3">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-cream">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <CircleUserRound className="h-10 w-10 text-brand-muted" aria-hidden />
                    )}
                  </div>
                  <div>
                    <p className="font-montserrat text-sm font-semibold text-brand-navy-light">
                      {testimonial.name}
                    </p>
                    <div className="mt-1 flex">{renderStars(testimonial.rating)}</div>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
