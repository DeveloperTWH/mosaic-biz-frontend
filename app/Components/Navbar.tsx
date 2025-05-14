"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full shadow px-6 py-4 md:px-10 lg:px-20 bg-white">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/logo.png" alt="Mosaic Biz Hub Logo" width={200} height={50} />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-light">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/foods">Foods</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex space-x-2">
          <Link href="/login?type=customer">
            <button className="border border-sky-500 text-sky-500 px-4 py-1.5 rounded text-sm">Login As Customer</button>
          </Link>
          <Link href="/login?type=vendor">
            <button className="border border-sky-500 text-sky-500 px-4 py-1.5 rounded text-sm">Login As Vendor</button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-gray-800 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden mt-4 space-y-4">
          <nav className="flex flex-col space-y-2 text-sm font-light">
            <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/products" onClick={() => setIsOpen(false)}>Products</Link>
            <Link href="/foods" onClick={() => setIsOpen(false)}>Foods</Link>
            <Link href="/services" onClick={() => setIsOpen(false)}>Services</Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>About Us</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)}>Contact Us</Link>
          </nav>
          <div className="flex flex-col space-y-2 pt-2">
            <Link href="/login?type=customer">
              <button className="border border-sky-500 text-sky-500 px-4 py-1.5 rounded text-sm w-full">Login As Customer</button>
            </Link>
            <Link href="/login?type=vendor">
              <button className="border border-sky-500 text-sky-500 px-4 py-1.5 rounded text-sm w-full">Login As Vendor</button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
