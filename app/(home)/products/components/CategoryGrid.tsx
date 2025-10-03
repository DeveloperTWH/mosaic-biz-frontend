'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Category } from "@/types/Category";

const CategoryGrid = () => {

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/category/product`);

        setCategories(res.data.data); // Adjust if API shape is different
      } catch (err) {
        console.error("Failed to fetch product categories", err);
      }
    };

    fetchCategories();
  }, []);


  return (
    <section className="px-6 mx-auto max-w-7xl">
      <h2 className="mt-6 mb-6 text-xl font-bold text-center md:text-2xl heading">Browse by Category</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/products/${cat.slug}`} // or `/service/${cat.slug}` depending on your route
            className="p-4 text-center transition rounded hover:shadow"
          >
            <Image
              src={cat.img || "/placeholder.png"}
              alt={cat.name}
              width={60}
              height={60}
              className="mx-auto mb-2 grayscale hover:grayscale-0"
            />
            <div className="text-sm font-medium md:text-base">{cat.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
