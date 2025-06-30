"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const gender = Cookies.get("user_gender");

  useEffect(() => {
    const session = Cookies.get("user_session");
    setIsLoggedIn(!!session);
  }, []);

  return (
    <header className="w-full px-6 py-4 bg-white shadow md:px-10 lg:px-20">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/logo.png" alt="Mosaic Biz Hub Logo" width={350} height={100} />
        </div>

        {/* Desktop Nav */}
        <nav className="items-center hidden space-x-6 text-sm font-light lg:flex">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/foods">Foods</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>

        {/* Desktop Buttons / Profile */}
        <div className="items-center hidden space-x-2 lg:flex">
          {isLoggedIn === null ? (
            <div className="flex gap-2 animate-pulse">
              <div className="w-32 bg-gray-200 rounded h-9" />
              <div className="w-32 bg-gray-200 rounded h-9" />
            </div>
          ) : isLoggedIn ? (
            <div className="w-[190px] relative flex justify-end items-center">
              <button onClick={() => setShowDropdown(!showDropdown)} className="focus:outline-none">
                <Image
                  src={gender === "female" ? "/female-avatar.png" : "/male-avatar.png"}
                  width={40}
                  height={40}
                  alt="Profile"
                  className="border border-gray-300 rounded-full"
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl top-full w-44">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 rounded-t-lg hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={async () => {
                      Cookies.remove("user_session");
                      Cookies.remove("user_gender");
                      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/logout`, {
                        method: "POST",
                        credentials: "include",
                      });
                      window.location.href = "/";
                    }}
                    className="w-full px-4 py-2 text-sm text-left text-red-500 rounded-b-lg hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login?type=customer">
                <button className="border border-sky-500 text-sky-500 px-4 py-1.5 rounded text-sm">
                  Login As Customer
                </button>
              </Link>
              <Link href="/login?type=vendor">
                <button className="border border-sky-500 text-sky-500 px-4 py-1.5 rounded text-sm">
                  Login As Vendor
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="text-gray-800 lg:hidden focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
        <div className="mt-4 space-y-4 lg:hidden">
          <nav className="flex flex-col space-y-2 text-sm font-light">
            <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/products" onClick={() => setIsOpen(false)}>Products</Link>
            <Link href="/foods" onClick={() => setIsOpen(false)}>Foods</Link>
            <Link href="/services" onClick={() => setIsOpen(false)}>Services</Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>About Us</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)}>Contact Us</Link>
          </nav>
          <div className="flex flex-col pt-2 space-y-2">
            {isLoggedIn === null ? (
              <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
            ) : isLoggedIn ? (
              <div className="w-[190px] flex justify-end items-center">
                <Image
                  src={gender === "female" ? "/female-avatar.png" : "/male-avatar.png"}
                  width={36}
                  height={36}
                  alt="Profile"
                  className="border border-gray-300 rounded-full"
                />
              </div>
            ) : (
              <>
                <Link href="/login?type=customer">
                  <button className="border border-sky-500 text-sky-500 px-4 py-1.5 rounded text-sm w-full">
                    Login As Customer
                  </button>
                </Link>
                <Link href="/login?type=vendor">
                  <button className="border border-sky-500 text-sky-500 px-4 py-1.5 rounded text-sm w-full">
                    Login As Vendor
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
