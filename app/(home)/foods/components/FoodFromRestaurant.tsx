"use client";

import React, { useState, useEffect } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import FarmsCard from "./FarmsCard";

type Restaurant = {
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
};

const dummyRestaurants: Restaurant[] = [
  {
    id: 1,
    title: 'Sunrise Diner',
    description: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Praesent Vitae Libero Venenatis, Tristique Justo.",
    tags: ['Breakfast', 'Coffee', 'Pancakes'],
    rating: 4.8,
    reviews: 120,
    location: '101 Morning Blvd, Connecticut',
    image: '/restaurant/res1.png',
    mapQuery: '101+Morning+Blvd,+Connecticut',
    number: '+123 456 7890',
  },
  {
    id: 2,
    title: 'Ocean Bites',
    description: "Delicious seafood with a view – your ocean craving ends here.",
    tags: ['Seafood', 'Grill', 'Dinner'],
    rating: 4.6,
    reviews: 89,
    location: '202 Coastline Ave, Connecticut',
    image: '/restaurant/res1.png',
    mapQuery: '202+Coastline+Ave,+Connecticut',
    number: '+123 456 7890',
  },
  {
    id: 3,
    title: 'The Pizza Place',
    description: "Authentic wood-fired pizzas with local ingredients and global taste.",
    tags: ['Pizza', 'Italian', 'Lunch'],
    rating: 4.9,
    reviews: 150,
    location: '303 Cheese St, Connecticut',
    image: '/restaurant/res1.png',
    mapQuery: '303+Cheese+St,+Connecticut',
    number: '+123 456 7890',
  },
  {
    id: 4,
    title: 'Brew & Bean Café',
    description: "Coffee crafted with care, pastries baked to perfection.",
    tags: ['Coffee', 'Tea', 'Snacks'],
    rating: 4.7,
    reviews: 105,
    location: '404 Caffeine Rd, Connecticut',
    image: '/restaurant/res1.png',
    mapQuery: '404+Caffeine+Rd,+Connecticut',
    number: '+123 456 7890',
  },
  {
    id: 5,
    title: 'Green Bowl',
    description: "Healthy never tasted so good – vegan and vegetarian delights.",
    tags: ['Vegan', 'Salads', 'Healthy'],
    rating: 4.5,
    reviews: 75,
    location: '505 Fresh Ln, Connecticut',
    image: '/restaurant/res1.png',
    mapQuery: '505+Fresh+Ln,+Connecticut',
    number: '+123 456 7890',
  },
  {
    id: 6,
    title: 'Burger Brothers',
    description: "Juicy burgers, crispy fries, and good vibes all around.",
    tags: ['Burgers', 'Fries', 'Fast Food'],
    rating: 4.3,
    reviews: 110,
    location: '606 Grill Dr, Connecticut',
    image: '/restaurant/res1.png',
    mapQuery: '606+Grill+Dr,+Connecticut',
    number: '+123 456 7890',
  },
  {
    id: 7,
    title: 'Wok This Way',
    description: "Fresh Asian fusion with sizzling stir-fry and spicy noodles.",
    tags: ['Asian', 'Noodles', 'Spicy'],
    rating: 4.6,
    reviews: 88,
    location: '707 Noodle St, Connecticut',
    image: '/restaurant/res1.png',
    mapQuery: '707+Noodle+St,+Connecticut',
    number: '+123 456 7890',
  },
  {
    id: 8,
    title: 'Taco Town',
    description: "Street-style tacos, burritos, and nachos packed with flavor.",
    tags: ['Tacos', 'Mexican', 'Spicy'],
    rating: 4.4,
    reviews: 97,
    location: '808 Salsa Blvd, Connecticut',
    image: '/restaurant/res1.png',
    mapQuery: '808+Salsa+Blvd,+Connecticut',
    number: '+123 456 7890',
  },
  {
    id: 9,
    title: 'The Fancy Fork',
    description: "Elevated dining with a seasonal menu and craft cocktails.",
    tags: ['Fine Dining', 'Cocktails', 'Seasonal'],
    rating: 4.9,
    reviews: 130,
    location: '909 Elegant Ave, Connecticut',
    image: '/restaurant/res1.png',
    mapQuery: '909+Elegant+Ave,+Connecticut',
    number: '+123 456 7890',
  },
  {
    id: 10,
    title: 'Sweet Spot Bakery',
    description: "Cupcakes, cookies, and cakes made with love and butter.",
    tags: ['Bakery', 'Desserts', 'Sweet'],
    rating: 4.8,
    reviews: 140,
    location: '1010 Sugar Rd, Connecticut',
    image: '/restaurant/res1.png',
    mapQuery: '1010+Sugar+Rd,+Connecticut',
    number: '+123 456 7890',
  },
];


const ITEMS_PER_PAGE = 8;

export default function FoodFromRestaurant() {
  const [activeFarm, setActiveFarm] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const totalPages = Math.ceil(dummyRestaurants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleRestaurants = dummyRestaurants.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const selectedFarm = dummyRestaurants.find((item) => item.id === activeFarm);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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

          {/* Restaurant Cards */}
          {visibleRestaurants.map((item) => {
            const isActive = activeFarm === item.id;
            return (
              <FarmsCard
                key={item.id}
                service={item}
                isActive={isActive}
                isMobile={isMobile}
                onClick={setActiveFarm}
                redirect={true}
              />
            );
          })}

          {/* Pagination */}
          {/* Pagination (visible only if more than 1 page) */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-black rounded disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-black rounded disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}

        </div>

        {/* Map Sidebar */}
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
