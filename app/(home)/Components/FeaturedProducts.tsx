"use client";

import React, { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getFeaturedProducts, FeaturedProduct } from "@/lib/api/featured-products";
import MarketEmptyState from "./MarketEmptyState";
import MarketErrorState from "./MarketErrorState";
import MarketImage from "./MarketImage";
import MarketLoadingBlock from "./MarketLoadingBlock";
import MarketPrice from "./MarketPrice";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swiperRef, setSwiperRef] = useState<any>(null);

  const prevButton = React.useRef(null);
  const nextButton = React.useRef(null);

  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFeaturedProducts(1, 12);
      setProducts(Array.isArray(data.products) ? data.products : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError('Featured products are temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-3 text-2xl uppercase sm:text-3xl md:text-4xl font-bold text-gray-900 font-poppins">
            Featured Products
          </h2>
          <div className="flex flex-col items-center justify-center mb-4">
            <hr className="w-20 h-1 bg-green-900" />
            <hr className="w-20 h-1 bg-green-900" />
          </div>
        </div>
        <MarketLoadingBlock label="Loading featured products..." minHeight="min-h-[220px]" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
        <MarketErrorState
          title="Featured products are temporarily unavailable"
          description="We could not load featured products right now."
          onRetry={fetchProducts}
          retryLabel="Retry"
          ctaLabel="Browse products"
          ctaHref="/products"
          className="py-8"
        />
      </section>
    );
  }

  return (
    <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="mb-3 text-2xl uppercase sm:text-3xl md:text-4xl font-bold text-gray-900 font-poppins">
          Featured Products
        </h2>
        <div className="flex flex-col items-center justify-center mb-4">
          <hr className="w-20 h-1 bg-green-900" />
          <hr className="w-20 h-1 bg-green-900" />
        </div>
        <p className="px-2 mb-8 text-sm text-gray-600 sm:text-base sm:px-0 font-montserrat">
          Discover our handpicked selection of premium products.
        </p>
      </div>

      {products.length === 0 ? (
        <MarketEmptyState
          title="No featured products yet"
          description="Featured products will appear here as vendors publish them."
          ctaLabel="Browse products"
          ctaHref="/products"
          className="py-8"
        />
      ) : (
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 z-10">
            <button
              ref={prevButton}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 z-10">
            <button
              ref={nextButton}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Products Carousel */}
          <Swiper
            onSwiper={setSwiperRef}
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            navigation={{
              prevEl: prevButton.current,
              nextEl: nextButton.current,
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="py-4"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id} className="py-4 w-500 h-auto">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Show All Products Button */}
      <div className="flex justify-start mt-12">
        <Link
          href="/products"
          className="inline-block px-12 py-3 text-sm font-semibold text-white bg-[#1A1F71] hover:bg-blue-600 transition-colors font-montserrat"
        >
          Show All Products
        </Link>
      </div>

      {/* Bottom Decorative Line */}
      <div className="flex justify-center mt-12">
        <hr className="h-[2px] w-1/2 bg-custom-blue" />
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: FeaturedProduct }) {
  const href = `/product/${product._id}`;
  const categoryName = product.category?.name || product.categoryId?.name || "Product";
  const subcategoryName = product.subcategory?.name || product.subcategoryId?.name;

  return (
    <div className="bg-green p-3 border-2 border-[#D9D9D9] w-[300px] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-[420px]">
      {/* Product Image - Fixed Height */}
      <div className="relative h-60 overflow-hidden bg-gray-100 flex-shrink-0">
        <MarketImage
          src={product.coverImage}
          alt={product.title || "Featured product image"}
          fallbackLabel="Image coming soon"
          className="h-full w-full"
        />
        
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-bold text-white bg-yellow-600 rounded-full">
            FEATURED
          </span>
        </div>
      </div>

      {/* Product Info - Flex grow to fill space */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title - Fixed height */}
        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight line-clamp-1 h-9 overflow-hidden font-poppins">
          {product.title}
        </h3>

        {/* Description - Fixed height */}
        <p className="mb-3 text-sm text-gray-600 leading-relaxed line-clamp-2 h-10 overflow-hidden font-montserrat">
          {product.description}
        </p>

        {/* Category */}
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
            {categoryName}
          </span>
          {subcategoryName && (
            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded ml-1">
              {subcategoryName}
            </span>
          )}
        </div>

        {/* Rating placeholder */}
        <div className="flex-shrink-0 mb-3">
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill="#FBBF24"
                  stroke="#FBBF24"
                  className="text-yellow-400"
                />
              ))}
            </div>
            <p className="text-xs ml-2 text-gray-500 font-poppins">
              Featured Product
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="flex-shrink-0">
          <MarketPrice
            value={product.price}
            priceClassName="text-sm font-bold text-gray-900"
            labelClassName="sr-only"
          />
        </div>
      </div>
    </div>
  );
}
