"use client";

import Image from "next/image";
import { Quote, CircleUserRound, Star, StarHalf, StarOff } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Jasmine R., Founder, Rooted & Radiant Skincare (Gold Vendor)",
    rating: 4.5,
    image: "",
    quote:
      "Before Mosaic Biz Hub, we were just another small brand trying to be seen. Within weeks of joining, we landed three new clients, got featured in a Gold Vendor spotlight, and finally felt like our story mattered. This platform doesn’t just list your business—it amplifies it",
  },
  {
    id: 2,
    name: "Marcus T., CEO, Legacy Fit Apparel (Platinum Vendor)",
    rating: 3,
    image: "",
    quote:
      "The CRM, push notifications, and analytics helped us double our repeat customers. The strategy call alone was worth the investment. Mosaic Biz Hub gave us the tools and the tribe to scale with purpose.",
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
    <section className="px-5 py-20 text-white md:px-20">
      <div className="mb-12 text-center">
        <h2 className="mb-1 heading">
          What Our Clients Say
        </h2>
        <div className="flex flex-col items-center justify-center">
          <hr className="h-[2px] w-[100px] bg-gray-700" />
          <hr className="h-[2px] w-[100px] mt-[2px] mb-4 bg-gray-700" />
        </div>
        <p className="text-[13px] text-gray-600 max-w-xl mx-auto font-montserrat">
          <b>Real voices. Real growth. Real impact.</b> <br />
          At Mosaic Biz Hub, we don’t just connect businesses and buyers—we build bridges of trust, visibility, and community. Here’s what our vendors and customers are saying:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-[90%] mx-auto">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="p-6 mb-6 text-gray-800 transition bg-white shadow-md rounded-xl hover:shadow-xl"
          >
            <Quote className="mb-4 rotate-180 text-custom-yellow" size={64} />
            <p className="mb-6 text-sm font-montserrat">{testimonial.quote}</p>

            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 rounded-full">
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
                <p className="text-sm font-semibold text-custom-blue font-montserrat">{testimonial.name}</p>
                <div className="flex mt-1">{renderStars(testimonial.rating)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
