"use client";

import React, { useState, useEffect } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import FarmsCard from "./FarmsCard";

interface FarmItem {
  id: number;
  title: string;
  description: string;
  location: string;
  image: string;
  tags: string[];
  rating: number;
  reviews: number;
  mapQuery: string;
  number: string;
}

const dummyFarmItems: FarmItem[] = [
    {
        id: 1,
        title: "1. LOREM IPSUM",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae libero venenatis, tristique justo.",
        location: "San Francisco, CA",
        image: "/Service/19099.png",
        tags: ["Fruit", "Vegetable", "dairy"],
        rating: 3.5,
        reviews: 12,
        mapQuery: "1600+Amphitheatre+Parkway,+Mountain+View,+CA",
        number: "+123456789"
    },
    {
        id: 2,
        title: "2. LOREM IPSUM",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae libero venenatis, tristique justo.",
        location: "Los Angeles, CA",
        image: "/Service/19099.png",
        tags: ["Dairy"],
        rating: 4.7,
        reviews: 10,
        mapQuery: "6801+Hollywood+Blvd,+Los+Angeles,+CA",
        number: "+123456789"
    },
    {
        id: 3,
        title: "3. LOREM IPSUM",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae libero venenatis, tristique justo.",
        location: "New York, NY",
        image: "/Service/19099.png",
        tags: ["Fruit", "Oil", "Pulses"],
        rating: 4.2,
        reviews: 15,
        mapQuery: "Times+Square,+New+York,+NY",
        number: "+123456789"
    },
];
export default function FoodFromFarm() {
  const [activeFarm, setActiveFarm] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const selectedFarm = dummyFarmItems.find((item) => item.id === activeFarm);

  return (
    <main className="bg-white text-black">
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Filter Controls */}
          <div>
            <div className="flex flex-wrap gap-2 text-[12px]">
              <div className="capitalize border border-black px-3 py-1 rounded-full flex gap-1 justify-center items-center cursor-pointer">
                <SlidersHorizontal size={"15px"} /> all
              </div>

              {/* Price Dropdown */}
              <div className="relative">
                <select className="capitalize border border-black px-3 py-1 rounded-full bg-white appearance-none cursor-pointer">
                  <option value="">price</option>
                  <option value="low">Low to High</option>
                  <option value="high">High to Low</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-black"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select className="capitalize border border-black px-3 py-1 rounded-full bg-white appearance-none cursor-pointer">
                  <option value="">sort by</option>
                  <option value="rating">Rating</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="new">Newest</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-black"
                />
              </div>

              <div className="capitalize border border-black px-3 py-1 rounded-full cursor-pointer">
                available now
              </div>
              <div className="capitalize border border-black px-3 py-1 rounded-full cursor-pointer">
                discounts
              </div>
            </div>
          </div>

          {/* List of Farm Items */}
          {dummyFarmItems.map((item) => {
            const isActive = activeFarm === item.id;
            return (
              <FarmsCard
                key={item.id}
                service={item}
                isActive={isActive}
                isMobile={isMobile}
                onClick={setActiveFarm}
              />
            );
          })}
        </div>

        {/* Desktop Map Sidebar */}
        {!isMobile && activeFarm !== null && selectedFarm && (
          <div className="w-full h-96 sticky top-20 animate-fade-in rounded shadow overflow-hidden transition-opacity duration-500">
            <iframe
              src={`https://www.google.com/maps?q=${selectedFarm.mapQuery}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded"
            />
          </div>
        )}
      </section>
    </main>
  );
}
