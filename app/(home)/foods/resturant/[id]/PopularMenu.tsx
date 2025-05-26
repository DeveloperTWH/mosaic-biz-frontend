'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
    menu: string[];
};

export default function PopularMenu({ menu }: Props) {
    return (
        <div className="mt-5 max-w-[90vw] mx-auto">
            <h2 className="text-xl font-semibold mb-5 heading">Popular Menu</h2>

            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1}       // default for smallest screens
                slidesPerGroup={1}
                breakpoints={{
                    640: { slidesPerView: 3, slidesPerGroup: 3 },
                    768: { slidesPerView: 4, slidesPerGroup: 4 },
                }}
                navigation={{
                    prevEl: '.prev-button',
                    nextEl: '.next-button',
                }}
                className="relative mb-0"
            >
                {menu.map((img, i) => (
                    <SwiperSlide key={i}>
                        <div className="relative w-full overflow-hidden rounded max-h-[400px]">
                            <img
                                src={img}
                                alt={`Menu Image ${i + 1}`}
                                className="w-full h-auto object-contain block"
                                loading="lazy"
                            />
                        </div>

                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="flex mt-3 justify-between items-center">
                <button className="px-3 py-1 sm:px-5 sm:py-2 bg-black text-white rounded">
                    View Menu
                </button>

                <div className="flex gap-2">
                    <button className="prev-button border border-custom-orange px-2 py-2 sm:px-3 sm:py-2 rounded transition-colors duration-200 text-custom-orange bg-white hover:bg-custom-orange hover:text-white active:bg-custom-orange active:text-white">
                        <ChevronLeft size={16} />
                    </button>
                    <button className="next-button border border-custom-orange px-2 py-2 sm:px-3 sm:py-2 rounded transition-colors duration-200 text-custom-orange bg-white hover:bg-custom-orange hover:text-white active:bg-custom-orange active:text-white">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
