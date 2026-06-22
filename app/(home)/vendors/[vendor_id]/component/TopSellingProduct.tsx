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
      <h3 className="market-section-heading text-center">Top Selling Products</h3>
      <div className="market-section-divider" />
      <div className="mx-auto mt-4 max-w-2xl">
        <p className="text-center font-montserrat text-sm text-market-muted">
          Discover top-rated products from trusted minority-owned businesses in our community.
        </p>
      </div>

      <div className="mb-10 mt-10">
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={4}
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="top-selling-swiper pb-10"
        >
          {products.map((product) => {
            const fullStars = Math.floor(product.rating);
            const hasHalfStar = product.rating % 1 >= 0.25 && product.rating % 1 < 0.75;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            return (
              <SwiperSlide key={product.id}>
                <div className="market-card p-4">
                  <div className="market-card-media relative mx-auto mb-4 flex h-[200px] w-full items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="market-card-title line-clamp-1 text-sm">{product.title}</h3>

                  <div className="mb-1 mt-1 flex items-center text-market-gold">
                    {Array(fullStars)
                      .fill(0)
                      .map((_, idx) => (
                        <Star key={`full-${idx}`} size={12} fill="currentColor" stroke="currentColor" />
                      ))}
                    {hasHalfStar && (
                      <StarHalf key="half" size={12} fill="currentColor" stroke="currentColor" />
                    )}
                    {Array(emptyStars)
                      .fill(0)
                      .map((_, idx) => (
                        <Star
                          key={`empty-${idx}`}
                          size={12}
                          className="text-market-muted/40"
                          fill="transparent"
                          stroke="currentColor"
                        />
                      ))}
                  </div>

                  <p className="market-card-price text-sm">${product.price.toFixed(2)}</p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <style jsx global>{`
        .top-selling-swiper .swiper-pagination-bullets {
          bottom: 6px !important;
        }
        .top-selling-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.35);
          opacity: 1;
          margin: 0 3px !important;
        }
        .top-selling-swiper .swiper-pagination-bullet-active {
          background: #e2b84b;
        }
      `}</style>
    </div>
  );
};

export default TopSellingProduct;
