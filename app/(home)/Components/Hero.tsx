"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import MinorityType from "./MinorityType";

const Hero = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minorityType, setMinorityType] = useState("");
  const router = useRouter();

  const go = () => {
    const qs = new URLSearchParams();

    if (search.trim()) qs.set("search", search.trim());
    if (location.trim()) qs.set("location", location.trim());
    if (minorityType) qs.set("minorityType", minorityType);

    router.push(`/products${qs.toString() ? `?${qs}` : ""}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") go();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search & Filters */}
      <section className="bg-gray-50 py-4 md:px-20 p-5 flex flex-col md:flex-row items-start justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-col w-full md:w-1/3">
          <label htmlFor="search" className="text-sm font-medium mb-1">
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="e.g. Products, Services..."
            className="px-4 py-2 border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>

        <MinorityType value={minorityType} onChange={setMinorityType} />

        <div className="flex flex-col w-full md:w-auto">
          <label htmlFor="location" className="text-sm font-medium mb-1">
            Filter By Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="e.g. India, USA"
            className="px-4 py-2 border rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>

        <div className="flex flex-col justify-end w-full md:w-auto">
          <label className="text-sm font-medium mb-1 invisible">Search</label>
          <button
            className="bg-custom-orange text-white px-20 py-2"
            onClick={go}
          >
            Search Here
          </button>
        </div>
      </section>

      {/* Hero Section */}
      <section
        className="relative h-[650px] bg-cover bg-center"
        style={{ backgroundImage: "url(/hero-image.png)" }}
      >
        <div className="absolute inset-0 bg-stone-800 bg-opacity-50 flex flex-col justify-center items-center text-center text-white px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Empowering Minority-Owned
          </h2>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Businesses to Thrive in the Digital Age
          </h2>
          <p className="mb-6 max-w-2xl">
            Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Nullam
            Laoreet, Diam Sit Amet Porta Eleifend, Turpis Justo Maximus Eros,
            Rhoncus Ullamcorper Mi Tortor Et Libero. Maecenas Lacinia Lorem
            Ultrices Ligulaeros.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <Link href="/login?type=customer">
              <button className="border border-white text-white py-2 rounded px-7">
                Login As Customer
              </button>
            </Link>
            <Link href="/login?type=vendor">
              <button className="border border-white text-white py-2 rounded px-7">
                Login As Vendor
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
