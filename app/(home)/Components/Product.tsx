"use client"
import Image from "next/image";
import React, { useState } from "react";

const Product = () => {
  const [active, setActive] = useState<"left" | "right" | null>(null);

  return (
    <div className="w-full flex justify-center items-center mt-20 px-4 sm:px-6 md:px-12">
      <div className="w-full max-w-[1400px]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-800 heading mb-4 md:mb-0">
            BROWSE BY CATEGORY
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setActive("left")}
              className={`border border-custom-orange px-3 py-2 rounded transition-colors duration-200 ${
                active === "left"
                  ? "bg-custom-orange text-white"
                  : "text-custom-orange hover:bg-custom-orange hover:text-white"
              }`}
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-left"
              >
                <path d="M15 18L9 12L15 6" />
              </svg>
            </button>

            <button
              onClick={() => setActive("right")}
              className={`border border-custom-orange px-3 py-2 rounded transition-colors duration-200 ${
                active === "right"
                  ? "bg-custom-orange text-white"
                  : "text-custom-orange hover:bg-custom-orange hover:text-white"
              }`}
              aria-label="Next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right"
              >
                <path d="M9 18L15 12L9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          {[
            { src: "/Group 44.png", label: "FURNITURES" },
            { src: "/Group 44 (1).png", label: "MEN, WOMEN, KIDS FASHION" },
            { src: "/Group 44 (2).png", label: "HEALTH & BEAUTY PRODUCTS" },
            { src: "/Group 44 (3).png", label: "BOOKS" },
            { src: "/Group 44 (4).png", label: "KITCHEN APPLIANCES" },
            { src: "/Group 44 (5).png", label: "FURNISHING DECOR ITEMS" },
            { src: "/Group 44 (6).png", label: "SPORTS AND FITNESS" },
            { src: "/Group 44 (7).png", label: "SHOES" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center mt-4 mb-4 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <Image
                src={item.src}
                alt={item.label}
                width={60}
                height={60}
                className="object-contain"
              />
              <div className="text-xs sm:text-sm text-center mt-3 font-medium text-zinc-700 px-2">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
