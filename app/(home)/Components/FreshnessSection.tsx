"use client";

import Image from "next/image";
import Link from "next/link";

const items = [
  {
    id: 1,
    title: "ESSENTIALS NEAR YOU - GROCERIES",
    description:
      "Shop fresh produce, pantry staples, and specialty goods sourced from local markets and trusted vendors in your community.",
    img: "/gros.png",
    bgColor: "bg-yellow-100",
  },
  {
    id: 2,
    title: "FLAVORS NEAR YOU - RESTAURANTS",
    description:
      "Explore delicious meals made with love by neighborhood chefs and minority-owned restaurants near you.",
    img: "/restaurant.png",
    bgColor: "bg-custom-blue",
  },
];

export default function FreshnessSection() {
  return (
    <section className="px-5 pt-20 text-center bg-white md:px-20">
      <div className="mb-10">
        <h2 className="mb-2 text-2xl font-semibold text-gray-800 uppercase md:text-3xl heading">
          Freshness All Around - Pantry Picks & Nearby Kitchens
        </h2>
        <div className="flex flex-col items-center justify-center">
          <hr className="h-[2px] w-[100px] bg-green-900" />
          <hr className="h-[2px] w-[100px] mt-[2px] mb-4 bg-green-900" />
        </div>
        <p className="text-[13px] text-gray-600 max-w-xl mx-auto mb-12">
          Discover flavorful finds and fresh ingredients from our vibrant
          community kitchens and curated pantry partners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[80vw] mx-auto mb-10">
        {items.map((item) => (
          <div
            key={item.id}
            className={`pt-5 overflow-hidden shadow-md hover:shadow-xl relative transition ${item.bgColor}`}
          >
            {/* <div className="relative w-full "> */}
            <Image
              src={item.img}
              alt={item.title}
              width={300} // set custom width
              height={200} // set custom height
              className=" absolute bottom-0 z-[0] right-0"
            />
            <div className="p-4 text-left w-4/5 h-[100%] relative z-10">
              <h3
                className="text-3xl font-bold leading-10 text-gray-800 heading"
              >
                {item.title}
              </h3>
              <hr className="h-[2px] w-[100px] bg-gray-800 mt-5" />
              <hr className="h-[2px] w-[100px] mt-[1px] mb-8 bg-gray-800" />

              <p className="w-2/3 mb-4 text-sm text-gray-700">
                {item.description}
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-2 text-sm text-white transition bg-custom-orange hover:bg-green-800"
              >
                Shop Now
              </Link>
            </div>
          </div>
          // </div>
        ))}
      </div>
    </section>
  );
}
