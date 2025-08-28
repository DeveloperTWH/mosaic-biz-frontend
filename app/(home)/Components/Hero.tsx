"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import MinorityType from "./MinorityType";

const Hero = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minorityType, setMinorityType] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    setIsLoggedIn(session === 'true');
  }, []);

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
    <div className="bg-white">
      {/* Search & Filters */}
      <section className="flex flex-col items-start justify-between p-5 py-4 space-y-4 bg-gray-50 md:px-20 md:flex-row md:space-y-0 md:space-x-4">
        <div className="flex flex-col w-full md:w-1/3">
          <label htmlFor="search" className="mb-1 text-sm font-medium">
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
          <label htmlFor="location" className="mb-1 text-sm font-medium">
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
          <label className="invisible mb-1 text-sm font-medium">Search</label>
          <button
            className="px-20 py-2 text-white bg-custom-orange"
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
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white bg-opacity-50 bg-stone-800">
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            Empowering Minority-Owned
          </h2>
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            Businesses to Thrive in the Digital Age
          </h2>
          <p className="max-w-2xl mb-6">
            Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Nullam
            Laoreet, Diam Sit Amet Porta Eleifend, Turpis Justo Maximus Eros,
            Rhoncus Ullamcorper Mi Tortor Et Libero. Maecenas Lacinia Lorem
            Ultrices Ligulaeros.
          </p>
          {isLoggedIn === null &&
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="w-40 h-10 py-2 rounded bg-gray-100/70 px-7" />
              <div className="w-40 h-10 py-2 rounded bg-gray-100/70 px-7" />
            </div>
          }
          {
            isLoggedIn === false && 
            <div className="flex flex-col gap-4 md:flex-row">
              <Link href="/signup?type=customer">
                <button className="py-2 text-white border border-white rounded px-7">
                  Register As Customer
                </button>
              </Link>
              <Link href="/signup?type=vendor">
                <button className="py-2 text-white border border-white rounded px-7">
                  Register As Vendor
                </button>
              </Link>
            </div>
          }
          {/* <div className="flex flex-col gap-4 md:flex-row">
            <Link href="/login?type=customer">
              <button className="py-2 text-white border border-white rounded px-7">
                Login As Customer
              </button>
            </Link>
            <Link href="/login?type=vendor">
              <button className="py-2 text-white border border-white rounded px-7">
                Login As Vendor
              </button>
            </Link>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default Hero;
