"use client";

import Image from "next/image";
import { Quote, CircleUserRound, Star, StarHalf, StarOff } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Jasmine Brooks",
    rating: 4.5,
    image: "",
    quote:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis distinctio illum reprehenderit laborum eaque accusantium quae labore autem excepturi ipsa praesentium similique, id nostrum magni possimus eius esse tempore voluptate deleniti accusamus eos exercitationem numquam.",
  },
  {
    id: 2,
    name: "Marcus Taylor",
    rating: 3,
    image: "",
    quote:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis distinctio illum reprehenderit laborum eaque accusantium quae labore autem excepturi ipsa praesentium similique, id nostrum magni possimus eius esse tempore voluptate deleniti accusamus eos exercitationem numquam.",
  },
];

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} className="text-custom-blue w-3 h-3 fill-custom-blue" />);
    } else if (rating >= i - 0.5) {
      stars.push(<StarHalf key={i} className="text-custom-blue w-3 h-3 fill-custom-blue" />);
    } else {
      stars.push(<StarOff key={i} className="text-gray-300 w-3 h-3" />);
    }
  }
  return stars;
};

export default function ClientTestimonials() {
  return (
    <section className="py-20 px-5 md:px-20 text-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold uppercase mb-1 heading">
          What Our Clients Say
        </h2>
        <div className="flex justify-center flex-col items-center">
          <hr className="h-[2px] w-[100px] bg-gray-700" />
          <hr className="h-[2px] w-[100px] mt-[2px] mb-4 bg-gray-700" />
        </div>
        <p className="text-[13px] text-gray-600 max-w-xl mx-auto">
          Dive into powerful narratives, business tips, and local spotlights curated for our vibrant Mosaic Biz Hub community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-[90%] mx-auto">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white text-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition mb-6"
          >
            <Quote className="text-custom-yellow mb-4 rotate-180" size={64} />
            <p className="text-sm mb-6">{testimonial.quote}</p>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                {testimonial.image ? (
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <CircleUserRound className="text-gray-400 w-10 h-10" />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm text-custom-blue">{testimonial.name}</p>
                <div className="flex mt-1">{renderStars(testimonial.rating)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
