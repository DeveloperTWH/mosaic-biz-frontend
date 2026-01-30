"use client";

import Image from "next/image";
import Link from "next/link";

export default function BrowseFoodAndGrocery() {
  const categories = [
    {
      name: "Restaurants",
      href: "/restaurants",
      image: "/restorant.png",
    },
    {
      name: "Grocery",
      href: "/grocery",
      image: "/grocerry.png",
    },
    {
      name: "Others",
      href: "/others",
      image: "/others.png",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-gray-900 tracking-wide font-poppins">
            BROWSE FROM DELICIOUS FOOD AND GROCERY
          </h1>

          {/* Divider (exact style) */}
          <div className="flex justify-center mt-4">
            <div className="w-28 h-[2px] bg-gray-400"></div>
          </div>
        </div>

        {/* Image Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {categories.map((category, index) => (
            <Link key={index} href={"/"} className="text-center">
              <div className="relative w-full h-64 rounded-xl overflow-hidden font-poppins">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>

              <p className="mt-4 text-lg font-semibold text-gray-800 font-poppins">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
