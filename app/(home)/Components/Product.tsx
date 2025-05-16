"use client"
import Image from 'next/image';
import React, { useState } from 'react'

const Product = () => {
    const [active, setActive] = useState<"left" | "right" | null>(null);
    return (
        <div className='w-screen flex justify-center items-center mt-20'>
            <div className='w-screen md:w-4/5' >
                <div className='flex justify-between mb-10'>
                    <div>
                        <h1 className='text-3xl font-bold text-zinc-800 heading'>BROWSE BY CATEGORY</h1>
                    </div>
                    <div className='flex justify-items-end items-end space-x-3'>
                        <button
                            onClick={() => setActive("left")}
                            className={`border border-custom-orange px-1 py-1 ${active === "left" ? "bg-custom-orange text-white" : "text-custom-orange"
                                }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-chevron-left"
                            >
                                <path d="M15 18L9 12L15 6" />
                            </svg>
                        </button>

                        <button
                            onClick={() => setActive("right")}
                            className={`border border-custom-orange px-1 py-1 ${active === "right" ? "bg-custom-orange text-white" : "text-custom-orange"
                                }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-chevron-right"
                            >
                                <path d="M9 18L15 12L9 6" />
                            </svg>
                        </button>

                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 w-[95%] mx-auto my-6 mt-20">
                    {[
                        { src: "/Group 44.png", label: "FURNITURES" },
                        { src: "/Group 44 (1).png", label: "MEN, WOMEN, KIDS FASHION" },
                        { src: "/Group 44 (2).png", label: "HEALTH & BEAUTY PRODUCTS" },
                        { src: "/Group 44 (3).png", label: "BOOKS" },
                        { src: "/Group 44 (4).png", label: "KITCHEN APPLIANCES" },
                        { src: "/Group 44 (5).png", label: "FURNISHING DECOR ITEMS" },
                        { src: "/Group 44 (6).png", label: "SPORTS AND FITNESS" },
                        { src: "/Group 44 (7).png", label: "SHOES" },
                    ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center mt-5 mb-5">
                            <Image src={item.src} alt={item.label} width={60} height={60} />
                            <div className="text-xs text-center mt-10">{item.label}</div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default Product