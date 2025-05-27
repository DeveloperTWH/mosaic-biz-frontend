'use client';

import { Star, StarHalf } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const TopSellingProduct = () => {
  const products = [
    {
      id: 1,
      title: 'Feature Product 1',
      price: 29.99,
      rating: 4.5,
      image: '/ShopProduct/Aria-SK6-Helmet 1 (3).png',
    },
    {
      id: 2,
      title: 'Feature Product 2',
      price: 19.99,
      rating: 5,
      image: '/ShopProduct/Aria-SK6-Helmet 1 (2).png',
    },
    {
      id: 3,
      title: 'Feature Product 3',
      price: 15.99,
      rating: 3.2,
      image: '/ShopProduct/Aria-SK6-Helmet 1 (1).png',
    },
    {
      id: 5,
      title: 'Feature Product 4',
      price: 45.0,
      rating: 2.7,
      image: '/ShopProduct/Aria-SK6-Helmet 1.png',
    },
    {
      id: 6,
      title: 'Feature Product 1',
      price: 29.99,
      rating: 4.5,
      image: '/ShopProduct/Aria-SK6-Helmet 1 (3).png',
    },
    {
      id: 7,
      title: 'Feature Product 2',
      price: 19.99,
      rating: 5,
      image: '/ShopProduct/Aria-SK6-Helmet 1 (2).png',
    },
    {
      id: 8,
      title: 'Feature Product 3',
      price: 15.99,
      rating: 3.2,
      image: '/ShopProduct/Aria-SK6-Helmet 1 (1).png',
    },
    {
      id: 9,
      title: 'Feature Product 4',
      price: 45.0,
      rating: 2.7,
      image: '/ShopProduct/Aria-SK6-Helmet 1.png',
    },
    {
      id: 10,
      title: 'Feature Product 1',
      price: 29.99,
      rating: 4.5,
      image: '/ShopProduct/Aria-SK6-Helmet 1 (3).png',
    },
    {
      id: 11,
      title: 'Feature Product 2',
      price: 19.99,
      rating: 5,
      image: '/ShopProduct/Aria-SK6-Helmet 1 (2).png',
    },
    {
      id: 12,
      title: 'Feature Product 3',
      price: 15.99,
      rating: 3.2,
      image: '/ShopProduct/Aria-SK6-Helmet 1 (1).png',
    },
    {
      id: 13,
      title: 'Feature Product 4',
      price: 45.0,
      rating: 2.7,
      image: '/ShopProduct/Aria-SK6-Helmet 1.png',
    },
  ];

  return (
    <div className="mt-12">
      <h3 className="text-4xl font-bold mb-4 uppercase text-center heading">
        Top selling Products
      </h3>
      <hr className="h-[2px] w-[100px] bg-green-900 mx-auto" />
      <hr className="h-[2px] w-[100px] bg-green-900 mx-auto mt-[1px]" />
      <div className="w-3/5 mx-auto">
        <p className="text-gray-600 text-center mt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elitsed eiusmod tempor enim minim veniam quis notru exercit ation Lorem ipsum dolor sit amet. Veniam quis notru exercit.
        </p>
      </div>

      {/* Swiper Slider */}
      <div className="mt-10 mb-10">
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={4}
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },      // Mobile: 1 card per slide
            640: { slidesPerView: 2 },    // Small tablets
            768: { slidesPerView: 3 },    // Tablets
            1024: { slidesPerView: 4 },   // Laptops & up
          }}
          className='pb-10'
        >
          {products.map((product) => {
            const fullStars = Math.floor(product.rating);
            const hasHalfStar = product.rating % 1 >= 0.25 && product.rating % 1 < 0.75;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            return (
              <SwiperSlide key={product.id}>
                <div className="border rounded-lg p-4 ">
                  <div className="w-[200px] h-[200px] relative mx-auto flex justify-center items-center">
                    <img src={product.image} alt={product.title} className="w-full mb-10" />
                    <img src="/ShopProduct/Mask group.png" alt="Cart icon" className="absolute right-0 bottom-0 w-[40px]" />
                  </div>
                  <h3 className="font-semibold text-sm">{product.title}</h3>

                  <div className="flex justify- items-center text-yellow-500 mb-1 mt-1">
                    {Array(fullStars).fill(0).map((_, idx) => (
                      <Star key={`full-${idx}`} size={12} fill="currentColor" stroke="currentColor" />
                    ))}
                    {hasHalfStar && (
                      <StarHalf key="half" size={12} fill="currentColor" stroke="currentColor" />
                    )}
                    {Array(emptyStars).fill(0).map((_, idx) => (
                      <Star key={`empty-${idx}`} size={12} fill="gray" stroke="gray" />
                    ))}
                  </div>

                  <p className="text-gray-500 text-sm">${product.price.toFixed(2)}</p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default TopSellingProduct;
