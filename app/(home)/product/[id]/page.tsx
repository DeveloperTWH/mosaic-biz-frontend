"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Product } from "../types/product"; // Extend as needed
import SimilarProduct from "./Component/SimilarProduct";

const product: Product = {
  id: "1",
  brand: "Metronaut",
  title: "Men Regular Fit Printed Spread Collar Casual Shirt",
  price: 663,
  actualPrice: 1663,
  image: "/products/image.png",
  rating: 4.2,
  ratingCount: 160,
  colors: ["#a64d5c", "#facc15", "#0ea5e9", "#374151"],
  sizes: ["S", "M", "L", "XL", "XXL"],
};

export default function ProductDetailPage() {
  const [liked, setLiked] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  return (
    <div className="px-8 py-10 max-w-screen-xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side - Image */}
        <div className="flex-1">
          <div className="relative">
            <img
              src={product.image}
              alt={product.title}
              className="rounded shadow  h-[500px] object-cover"
            />
            <button
              className="absolute top-4 right-4"
              onClick={() => setLiked(!liked)}
            >
              <Heart
                className={`w-6 h-6 transition-colors ${liked ? "text-red-500 fill-red-500" : "text-gray-400"
                  }`}
                fill={liked ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 border rounded bg-gray-300"
              ></div>
            ))}
          </div>
        </div>

        {/* Right Side - Info */}
        <div className="flex-1 space-y-4">
          <h2 className="text-sm text-gray-400 uppercase">{product.brand}</h2>
          <h1 className="text-xl font-bold leading-tight">{product.title}</h1>
          <div className="text-2xl font-bold text-[#c79b44]">
            ₹{product.price}{" "}
            <span className="line-through text-gray-400 text-base ml-2">
              ₹{product.actualPrice}
            </span>{" "}
            <span className="text-green-600 text-sm ml-2">
              {Math.round(((product.actualPrice - product.price) / product.actualPrice) * 100)}% OFF
            </span>
          </div>

          <div className="space-y-1">
            <p className="font-semibold">COLOR</p>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full cursor-pointer border-2 ${selectedColor === color ? "border-black" : "border-gray-300"
                    }`}
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-semibold">SIZE CHART</p>
            <div className="flex gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-3 py-1 rounded ${selectedSize === size
                    ? "bg-black text-white"
                    : "bg-white text-black"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-semibold">AVAILABLE OFFERS</p>
            <ul className="list-disc ml-6 text-sm text-gray-600">
              <li>
                Bank Offer: 5% cashback on Axis Bank Credit Card – T&C apply
              </li>
              <li>
                SBI Credit Card: 10% off on orders above ₹1,000 – T&C apply
              </li>
            </ul>
          </div>

          <div className="flex gap-4 mt-4">
            <button className="bg-yellow-400 text-black px-6 py-2 font-bold rounded">
              🛒 ADD TO CART
            </button>
            <button className="bg-black text-white px-6 py-2 font-bold rounded">
              BUY NOW
            </button>
          </div>
        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="mt-12">
        <h3 className="text-lg font-bold mb-2">PRODUCT DETAILS</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-gray-700">
          <li><b>Pack Of:</b> 4 (Special Pack)</li>
          <li><b>Style Code:</b> MLYCRA_16_BEIGE</li>
          <li><b>Closure:</b> Button</li>
          <li><b>Fit:</b> Regular</li>
          <li><b>Fabric:</b> Lycra Blend</li>
          <li><b>Sleeve:</b> Half Sleeve</li>
          <li><b>Pattern:</b> Printed</li>
          <li><b>Reversible:</b> No</li>
          <li><b>Collar:</b> Spread</li>
          <li><b>Color:</b> Beige, Pink</li>
          <li><b>Fabric Care:</b> Gentle Machine Wash</li>
          <li><b>Suitable For:</b> Western Wear</li>
        </ul>
        <p className="mt-6 text-sm text-gray-700">
          Add a stylish, laidback vibe to your wardrobe with this shirt...
          (copy the full paragraph from your design)
        </p>
      </div>

      {/* RATINGS */}
      <div className="mt-10">
        <h3 className="text-lg font-bold">RATINGS & REVIEWS</h3>
        <div className="flex items-center gap-2 text-yellow-600 mt-2">
          ⭐ {product.rating} <span className="text-gray-700">({product.ratingCount} ratings)</span>
        </div>
        <p className="text-sm mt-2">ITS SO GOOD</p>
        <button className="mt-4 bg-yellow-400 px-4 py-2 font-bold rounded">RATE PRODUCT</button>
      </div>

      {/* SIMILARS */}
      {/* <div className="mt-12">
        <h3 className="text-4xl font-bold mb-4 uppercase text-center heading">SIMILARS PRODUCTS</h3>
        <hr className="h-[2px] w-[100px] bg-green-900 mx-auto" />
        <hr className="h-[2px] w-[100px] bg-green-900 mx-auto mt-[1px]" />
        <div className="w-3/5 mx-auto">
          <p className="text-gray-600 mb-10 text-center mt-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elitsed eiusmod tempor enim minim veniam quis notru exercit ation Lorem ipsum dolor sit amet. Veniam quis notru exercit.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 mb-20">
          {products.map((product) => {
            const fullStars = Math.floor(product.rating);
            const hasHalfStar = product.rating % 1 >= 0.25 && product.rating % 1 < 0.75;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            return (
              <div key={product.id} className="border rounded-lg p-4">
                <div className='w-[200px] relative flex justify-center items-center'>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full  mb-10"
                  />
                  <img
                    src="/ShopProduct/Mask group.png"
                    alt="Cart icon"
                    className='absolute right-0 bottom-0 w-[40px]' />
                </div>
                <h3 className="font-semibold text-sm">{product.title}</h3>

                <div className="flex items-center text-yellow-500 mb-1">
                  {Array(fullStars).fill(0).map((_, idx) => (
                    <Star
                      key={`full-${idx}`}
                      size={10}
                      fill="currentColor"
                      stroke="currentColor"
                    />
                  ))}

                  {hasHalfStar && (
                    <StarHalf
                      key="half"
                      size={10}
                      fill="currentColor"
                      stroke="currentColor"
                    />
                  )}

                  {Array(emptyStars).fill(0).map((_, idx) => (
                    <Star
                      key={`empty-${idx}`}
                      size={12}
                      fill="gray"
                      stroke='gray'
                    />
                  ))}
                </div>

                <p className="text-gray-500 text-sm">${product.price.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      </div> */}
      <SimilarProduct/>
    </div>
  );
}
