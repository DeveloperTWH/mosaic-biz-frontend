"use client";

import Image from "next/image";
import Link from "next/link";

export default function BrowseFoodAndGrocery() {
  const categories = [
    {
      name: "Restaurants",
      href: "/foods",
      image: "/restorant.png",
    },
    {
      name: "Grocery",
      href: "/foods",
      image: "/grocerry.png",
    },
    {
      name: "Others",
      href: "/foods",
      image: "/others.png",
    },
  ];

  return (
    <section className="bg-market-bg py-6 sm:py-10">
      <div className="container-page">
        <div className="mb-6 text-center sm:mb-8">
          <h2 className="market-section-heading">Browse Food & Grocery</h2>
          <div className="market-section-divider" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="group text-center">
              <div className="market-card relative h-44 w-full overflow-hidden sm:h-52">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-market-header/85 via-market-header/20 to-transparent" />
                <p className="absolute inset-x-0 bottom-0 px-3 py-3 font-poppins text-base font-semibold text-market-text sm:text-lg">
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
