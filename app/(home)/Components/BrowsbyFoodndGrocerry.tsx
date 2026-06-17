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
    <section className="bg-market-bg py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="font-poppins text-2xl font-bold uppercase tracking-wide text-market-text sm:text-3xl">
            Browse Food & Grocery
          </h2>
          <div className="market-section-divider" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {categories.map((category, index) => (
            <Link key={index} href={"/foods"} className="group text-center">
              <div className="market-card relative h-56 w-full overflow-hidden rounded-xl sm:h-64">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-market-header/80 via-transparent to-transparent" />
              </div>

              <p className="mt-4 font-poppins text-base font-semibold text-market-text sm:text-lg">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
