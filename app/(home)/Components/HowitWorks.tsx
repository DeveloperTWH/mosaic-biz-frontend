"use client";

import Image from "next/image";

export default function HowItWorks() {
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
          <div>
            <Image
              src="/howitworkleft.png"
              alt="How it works steps"
              width={600}
              height={600}
              className="w-full h-auto"
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
      <div className="py-24">
        <Image
          src="/Promotional Slider.png"
          alt="Featured vendors"
          width={1920}
          height={600}
          className="w-full h-auto object-contain"
          priority
        />
      </div>
    </section>
  );
}
