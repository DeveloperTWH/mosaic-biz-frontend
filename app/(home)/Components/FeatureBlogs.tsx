"use client";

import Image from "next/image";
import { CalendarCheck } from "lucide-react";

const blogs = [
  {
    id: 1,
    title: "Breaking Barriers in Business Ownership",
    category: "Success Stories",
    description:
      "Discover how local entrepreneurs are challenging the status quo and thriving in today's economy.",
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
    <section className="bg-brand-cream px-5 py-20 text-brand-navy md:px-20">
      <div className="mb-10 text-center">
        <h2 className="font-poppins text-2xl font-semibold uppercase tracking-wide text-brand-navy sm:text-3xl">
          Featured blogs & stories
        </h2>
        <div className="mx-auto mt-3 h-0.5 w-16 bg-brand-gold" />
        <p className="mx-auto mt-4 max-w-xl font-montserrat text-sm leading-relaxed text-brand-muted">
          Dive into powerful narratives, business tips, and local spotlights curated for our Mosaic Biz Hub community.
        </p>
      </div>

      <div className="mx-auto grid w-[90%] grid-cols-1 gap-8 md:grid-cols-3">
        {blogs.map((blog, index) => {
          const isMiddleCard = index === 1;
          return (
            <article
              key={blog.id}
              className={`overflow-hidden rounded-2xl border shadow-market-card transition-shadow duration-300 hover:shadow-market-glow ${
                isMiddleCard
                  ? "border-brand-gold/30 bg-brand-navy text-white"
                  : "market-card-light p-0"
              }`}
            >
              <div className="relative h-[220px] w-full">
                <Image
                  src={blog.img}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-brand-yellow px-3 py-1 text-xs font-medium text-brand-navy shadow-sm">
                  <CalendarCheck className="h-4 w-4" aria-hidden />
                  <span>{blog.date}</span>
                </div>
              </div>

              <div className={`p-5 ${isMiddleCard ? "bg-brand-navy" : ""}`}>
                <span className="mb-2 inline-block bg-brand-sky px-3 py-1 text-xs font-semibold text-white">
                  {blog.category}
                </span>

                <h3 className={`market-card-light-title mb-2 text-lg ${isMiddleCard ? "text-white" : ""}`}>
                  {blog.title}
                </h3>

                <p className={`market-card-light-body mb-4 ${isMiddleCard ? "text-white/85" : ""}`}>
                  {blog.description}
                </p>

                <span
                  className={`inline-flex items-center text-sm ${isMiddleCard ? "text-white/70" : "text-brand-muted"}`}
                  aria-hidden="true"
                >
                  Stories coming soon
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
