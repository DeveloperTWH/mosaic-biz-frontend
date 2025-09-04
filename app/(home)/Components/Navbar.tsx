"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { logoutUser } from "@/utils/logoutUser";
import { ShoppingCart } from "lucide-react";
import { useCartCount } from "@/hooks/useCartCount";
import CartSyncPrompt from "./CartSyncPrompt";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [gender, setGender] = useState<string | null>(null);
  const [bump, setBump] = useState(false);
  const [delta, setDelta] = useState(0);
  const prevCountRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);


  const { count: cartCount, source, loading } = useCartCount(isLoggedIn);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    setIsLoggedIn(session === 'true');

    const userGender = localStorage.getItem("user_gender");
    setGender(userGender);

    setMounted(true);
  }, []);

  useEffect(() => {
    if (prevCountRef.current === null) {
      prevCountRef.current = cartCount;
      return;
    }
    const change = cartCount - prevCountRef.current;
    if (change !== 0) {
      setDelta(change);
      setBump(true);
      const t1 = setTimeout(() => setBump(false), 300);
      const t2 = setTimeout(() => setDelta(0), 550);
      prevCountRef.current = cartCount;
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    prevCountRef.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    const header = document.getElementById("site-header");
    const setH = () => {
      const h = header?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };
    setH();
    const ro = new ResizeObserver(setH);
    if (header) ro.observe(header);
    window.addEventListener("resize", setH);
    return () => { ro.disconnect(); window.removeEventListener("resize", setH); };
  }, []);


  return (
    <header
      id="site-header"
      className="fixed top-0 left-0 z-50 w-full px-6 py-4 bg-white shadow md:px-10 lg:px-20"
    >
      <CartSyncPrompt />
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
                  {/* <Link
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
                  </Link> */}
                  <button
                    onClick={async () => await logoutUser()}
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
          <Link
            href="/cart"
            className={`relative inline-flex items-center h-9 px-3 rounded-full text-sm transition text-sky-600 hover:bg-sky-50
    focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2
    ${mounted && bump ? "ring-2 ring-sky-300" : ""}`}
            aria-label={`Cart${mounted && cartCount > 0 ? `, ${cartCount} item${cartCount > 1 ? "s" : ""}` : ""}`}
            title="Cart"
          >
            <span className="relative mr-2">
              <ShoppingCart size={24} className={`transition-transform ${mounted && bump ? "scale-110" : ""}`} aria-hidden="true" />
              {mounted && cartCount > 0 && (
                <span
                  className={`absolute -top-2 -right-3 min-w-[1.15rem] h-5 px-1.5 rounded-full
          bg-red-600 text-white text-[10px] leading-5 text-center font-bold
          ring-2 ring-white shadow transition-transform ${mounted && bump ? "scale-110" : ""}`}
                  aria-hidden="true"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}

              {mounted && delta !== 0 && (
                <span
                  className={`absolute -top-4 right-0 text-xs font-bold pointer-events-none
          transition-all duration-500
          ${delta > 0 ? "text-green-600" : "text-red-600"}
          ${delta !== 0 ? "opacity-100 -translate-y-2" : "opacity-0 translate-y-0"}`}
                  aria-hidden="true"
                >
                  {delta > 0 ? `+${delta}` : `${delta}`}
                </span>
              )}
            </span>
            <span>Cart</span>
          </Link>
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
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="border border-sky-500 text-sky-500 px-4 py-1.5 rounded text-sm w-full flex items-center justify-center"
            >
              <ShoppingCart size={24} className="mr-2" aria-hidden="true" />
              <span>Cart</span>
            </Link>

            {isLoggedIn === null ? (
              <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
            ) : isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Image
                    src={gender === "female" ? "/female-avatar.png" : "/male-avatar.png"}
                    width={36}
                    height={36}
                    alt="Profile"
                    className="border border-gray-300 rounded-full"
                  />
                  <span className="text-sm text-gray-700">My Account</span>
                </div>

                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="px-4 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={async () => {
                    await logoutUser();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left text-red-500 rounded hover:bg-red-50"
                >
                  Logout
                </button>
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
