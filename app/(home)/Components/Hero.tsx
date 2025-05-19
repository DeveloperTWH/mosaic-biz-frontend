import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Search & Filters */}
      <section className="bg-gray-50 py-4 px-20 flex flex-col md:flex-row items-start justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-col w-full md:w-1/3">
          <label htmlFor="search" className="text-sm font-medium mb-1">Search</label>
          <input
            id="search"
            type="text"
            placeholder="e.g. Products, Services, Location..."
            className="px-4 py-2 border rounded"
          />
        </div>

        <div className="flex flex-col w-full md:w-auto">
          <label htmlFor="minorityType" className="text-sm font-medium mb-1">Filter By Minority Type</label>
          <select id="minorityType" className="px-4 py-2 border rounded"   defaultValue=" ">
            <option value="black-owned">Black-Owned</option>
            <option value="women-owned">Women-Owned</option>
            <option value="latino-owned">Latino-Owned</option>
          </select>
        </div>

        <div className="flex flex-col w-full md:w-auto">
          <label htmlFor="priceRange" className="text-sm font-medium mb-1">Filter By Loaction</label>
          <input
            id="search"
            type="text"
            placeholder="e.g. India, USA , Location..."
            className="px-4 py-2 border rounded"
          />
        </div>

        <div className="flex flex-col justify-end w-full md:w-auto">
          <label className="text-sm font-medium mb-1 invisible">Search</label> {/* invisible just to maintain alignment */}
          <button className="bg-custom-orange text-white px-20 py-2">Search Here</button>
        </div>
      </section>


      {/* Hero Section */}
      <section className="relative h-[650px] bg-cover bg-center" style={{ backgroundImage: 'url(/hero-image.png)' }}>
        <div className="absolute inset-0 bg-stone-800 bg-opacity-50 flex flex-col justify-center items-center text-center text-white px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Empowering Minority-Owned</h2>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Businesses to Thrive in the Digital Age</h2>
          <p className="mb-6 max-w-2xl">
            Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Nullam Laoreet, Diam Sit Amet Porta Eleifend, Turpis Justo Maximus Eros, Rhoncus Ullamcorper Mi Tortor Et Libero. Maecenas Lacinia Lorem Ultrices Ligulaeros.
          </p>
          <div className="space-x-4">
            <Link href="/login?type=customer">
              <button className="border border-white text-white py-2 rounded px-7">Login As Customer</button>
            </Link>
            <Link href="/login?type=vendor">
              <button className="border border-white text-white py-2 rounded px-7">Login As Vendor</button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Hero