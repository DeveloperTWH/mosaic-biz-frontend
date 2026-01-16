"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const services = [
  { title: "Salons And Spas", img: "/browsservice/frame 1.png" },
  { title: "Legal Services", img: "/browsservice/frame 2.png" },
  { title: "Health And Wellness", img: "/browsservice/frame 3.png" },
  { title: "Business Consulting", img: "/browsservice/frame 4.png" },
  { title: "IT Consulting", img: "/browsservice/frame 5.png" },
  { title: "Marketing", img: "/browsservice/frame 6.png", active: true },
];

export default function BrowseServices() {
  return (
    <section className="bg-[#fbf4e6] py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl font-bold tracking-wide text-gray-900">
            BROWSE SERVICES
          </h2>

          <Link
            href="/services"
            className="px-6 py-3 font-semibold text-white bg-[#d1aa45] hover:bg-[#c19a38] transition"
          >
            Show All Services
          </Link>
        </div>

        {/* Slider */}
        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button className="absolute -left-12 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100">
            <ChevronLeft size={20} />
          </button>

          {/* Services */}
          <div className="flex gap-14 mx-auto">
            {services.map((service, index) => (
              <div key={index} className="text-center">
                <div
                  className={`relative w-40 h-40 rounded-full overflow-hidden ${
                    service.active ? "ring-8 ring-[#d1aa45]" : ""
                  }`}
                >
                  <Image
                     src={service.img}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                  {service.active && (
                    <div className="absolute inset-0 bg-[#d1aa45]/70 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {service.title}
                      </span>
                    </div>
                  )}
                </div>

                {!service.active && (
                  <p className="mt-4 text-lg font-medium text-gray-800">
                    {service.title}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button className="absolute -right-12 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
