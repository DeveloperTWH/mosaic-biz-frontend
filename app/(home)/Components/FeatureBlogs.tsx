"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";

const blogs = [
  {
    id: 1,
    title: "Breaking Barriers in Business Ownership",
    category: "Success Stories",
    description:
      "Discover how local entrepreneurs are challenging the status quo and thriving in today’s economy.",
    date: "May 12, 2025",
    img: "/hero-image.png",
  },
  {
    id: 2,
    title: "Top Black-Owned Restaurants to Try",
    category: "Food & Culture",
    description:
      "Explore must-visit restaurants serving up culture, flavor, and community spirit.",
    date: "9 May, 2025",
    img: "/hero-image.png",
  },
  {
    id: 3,
    title: "Funding Resources for Minority Startups",
    category: "Finance & Grants",
    description:
      "Get access to crucial funding programs and grant opportunities for your business.",
    date: "May 7, 2025",
    img: "/hero-image.png",
  },
];

export default function FeatureBlogs() {
  return (
    <></>
    // <section className="px-5 py-20 md:px-20 bg-custom-soil">
    //   <div className="mb-10 text-center">
    //     <h2 className="mb-2 text-3xl font-semibold text-gray-800 uppercase heading">
    //       FEATURED BLOGS & STORIES
    //     </h2>
    //     <div className="flex flex-col items-center justify-center">
    //       <hr className="h-[2px] w-[100px] bg-green-900" />
    //       <hr className="h-[2px] w-[100px] mt-[2px] mb-4 bg-green-900" />
    //     </div>
    //     <p className="text-[13px] text-gray-600 max-w-xl mx-auto">
    //       Dive into powerful narratives, business tips, and local spotlights curated for our vibrant Mosaic Biz Hub community.
    //     </p>
    //   </div>

    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-[90%] mx-auto">
    //     {blogs.map((blog, index) => {
    //       const isMiddleCard = index === 1;
    //       return (
    //         <div
    //           key={blog.id}
    //           className="overflow-hidden "
    //         >
    //           <div className="relative w-full h-[220px]">
    //             <Image
    //               src={blog.img}
    //               alt={blog.title}
    //               fill
    //               className="object-cover"
    //             />
    //             <div className="absolute flex items-center gap-2 px-3 py-1 text-xs text-black shadow-sm bottom-3 right-3 bg-custom-yellow">
    //               <CalendarCheck className="w-4 h-4" />
    //               <span>{blog.date}</span>
    //             </div>
    //           </div>

    //           <div className={`p-5 ${isMiddleCard ? "bg-gray-800 text-white" : ""}`}>
    //             <span className={`inline-block bg-custom-blue text-white text-xs px-3 py-1 mb-1`}>
    //               {blog.category}
    //             </span>

    //             <h3 style={{fontFamily:"Roboto Slab", fontWeight:700}} className={`text-lg font-semibold mb-2 ${isMiddleCard ? "text-white" : "text-gray-800"}`}>
    //               {blog.title}
    //             </h3>

    //             <p className={`text-[13px] mb-4 ${isMiddleCard ? "text-gray-200" : "text-gray-600"}`}>
    //               {blog.description}
    //             </p>

    //             <Link
    //               href="/blogs"
    //               className={`font-medium inline-flex items-center text-sm hover:underline hover:text-custom-orange ${
    //                 isMiddleCard ? "text-white" : ""
    //               }`}
    //             >
    //               Read More <span className="ml-1">→</span>
    //             </Link>
    //           </div>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </section>
  );
}
