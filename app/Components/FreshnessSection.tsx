"use client";

import Image from "next/image";
import Link from "next/link";

const items = [
    {
        id: 1,
        title: "From farm to your door",
        description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque maxime accusantium vero consequuntur sapiente ea laboriosam nesciunt sed magnam ipsa",
        img: "/fresh/shea-butter.jpg",
        bgColor: "bg-yellow-100",
    },
    {
        id: 2,
        title: "FLAVORS NEAR YOU - EXPLORE LOCAL RESTAURANTS",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus, quae perferendis laboriosam maxime tempora nemo",
        img: "/fresh/wall-art.jpg",
        bgColor: "bg-custom-blue",
    },
];

export default function FreshnessSection() {
    return (
        <section className="pt-20 px-5 md:px-20 bg-white text-center">
            <div className="mb-10">
                <h2 className="text-2xl md:text-3xl font-semibold uppercase text-gray-800 mb-2">
                    Freshness All Around - Pantry Picks & Nearby Kitchens
                </h2>
                <div className="flex justify-center flex-col items-center">
                    <hr className="h-[2px] w-[100px] bg-green-900" />
                    <hr className="h-[2px] w-[100px] mt-[2px] mb-4 bg-green-900" />
                </div>
                <p className="text-[13px] text-gray-600 max-w-xl mx-auto mb-12">
                    Discover flavorful finds and fresh ingredients from our vibrant community kitchens and curated pantry partners.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[80vw] mx-auto mb-10">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`pt-5 overflow-hidden shadow-md hover:shadow-xl transition ${item.bgColor}`}
                    >
                        <div className="relative w-full ">
                            <Image
                                src={item.img}
                                alt={item.title}
                                fill
                                className="object-cover"
                            />
                            <div className="p-4 text-left w-4/5 h-[100%]">
                                <h3 className="text-3xl font-bold text-gray-800 leading-10" style={{ fontFamily: "Roboto Slab", fontWeight: "700" }}>
                                    {item.title}
                                </h3>
                                <hr className="h-[2px] w-[100px] bg-gray-800 mt-5" />
                                <hr className="h-[2px] w-[100px] mt-[1px] mb-8 bg-gray-800" />

                                <p className="text-sm text-gray-700 mb-4 w-2/3">{item.description}</p>
                                <Link
                                    href="/shop"
                                    className="inline-block bg-custom-orange text-white px-6 py-2 text-sm hover:bg-green-800 transition"
                                >
                                    Shop Now
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
