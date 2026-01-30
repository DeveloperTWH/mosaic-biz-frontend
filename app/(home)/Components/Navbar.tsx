

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { logoutUser } from "@/utils/logoutUser";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { useCartCount } from "@/hooks/useCartCount";
import CartSyncPrompt from "./CartSyncPrompt";
import { getLoggedInCustomer } from "@/utils/authUtils";
import { Poppins } from "next/font/google";

const popinFont = Poppins({
 weight : "600",
 style : 'normal'
 
})

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isCustomer, setIsCustomer] = useState<boolean | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [gender, setGender] = useState<string | null>(null);
  const [bump, setBump] = useState(false);
  const [delta, setDelta] = useState(0);
  const prevCountRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [moreDropdown, setMoreDropdown] = useState(false);
  
  const { count: cartCount, source, loading } = useCartCount(isLoggedIn);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    setIsLoggedIn(session === "true");
    const userGender = localStorage.getItem("user_gender");
    setGender(userGender);
    
    (async () => {
      const user = await getLoggedInCustomer(); // returns user only if role === 'customer'
      setIsCustomer(!!user);
    })();
    
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
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
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
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setH);
    };
  }, []);

  return (
    <header
      id="site-header"
      className="fixed top-0 left-0 z-50 w-full px-6 py-4 bg-white shadow md:px-10 lg:px-20 font-sans"
    >
      <CartSyncPrompt />
      
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="OSAIC BIZ HUB Logo"
              width={280}
              height={60}
              className="h-auto"
            />
          </Link>
        </div>

        {/* Desktop Nav - Screenshot Design */}
        <nav className="items-center hidden space-x-4 text-[12px] font-medium tracking-wide lg:flex">
          <Link 
            href="/" 
            className={`text-[#A2A2A2] hover:text-sky-600 transition-colors font-medium uppercase ${popinFont.className}`}
          >
            HOME
          </Link>
          
          {/* SHOP Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShopDropdown(!shopDropdown)}
              onMouseEnter={() => setShopDropdown(true)}
              className={`flex items-center text-[#A2A2A2] hover:text-sky-600 transition-colors focus:outline-none font-medium uppercase ${popinFont.className}`}
            >
              SHOP <ChevronDown className={`ml-1 w-3.5 h-3.5 transition-transform ${shopDropdown ? "rotate-180" : ""}`} />
            </button>
            {shopDropdown && (
              <div 
                className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 py-2 z-50"
                onMouseLeave={() => setShopDropdown(false)}
              >
                <Link href="/products" className={`block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 font-medium ${popinFont.className}`}>
                  Products
                </Link>
                <Link href="/foods" className={`block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 font-medium ${popinFont.className}`}>
                  Foods
                </Link>
                <Link href="/services" className={`block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 font-medium ${popinFont.className}`}>
                  Services
                </Link>
              </div>
            )}
          </div>
          
          <Link 
            href="/become-a-vendor" 
            className={`text-[#A2A2A2] hover:text-sky-600 transition-colors font-medium uppercase  ${popinFont.className}`}
          >
            BECOME A VENDOR
          </Link>
          
          <Link 
            href="/about" 
            className={`text-[#A2A2A2] hover:text-sky-600 transition-colors font-medium uppercase  ${popinFont.className}`}
          >
            ABOUT
          </Link>
          
          <Link 
            href="/contact" 
            className={`text-[#A2A2A2] hover:text-sky-600 transition-colors font-small uppercase  ${popinFont.className}`}
          >
            CONTACT
          </Link>
          
          {/* MORE Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdown(!moreDropdown)}
              onMouseEnter={() => setMoreDropdown(true)}
              className={`flex items-center text-[#A2A2A2] hover:text-sky-600 transition-colors focus:outline-none font-small uppercase  ${popinFont.className}`}
            >
              MORE <ChevronDown className={`ml-1 w-3.5 h-3.5 transition-transform ${moreDropdown ? "rotate-180" : ""}`} />
            </button>
            {moreDropdown && (
              <div 
                className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-56 py-2 z-50"
                onMouseLeave={() => setMoreDropdown(false)}
              >

                <Link href="/faq" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 font-medium">
                  FAQ
                </Link>
                <Link href="/terms" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 font-medium">
                  Terms & Conditions
                </Link>
                <Link href="/privacy" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 font-medium">
                  Privacy Policy
                </Link>
              </div>
            )}

          </div>
              <Link href="/how-to-use-this-app"   className="text-[#A2A2A2] hover:text-sky-600 transition-colors font-small uppercase font-poppins" >
                  HOW TO USE THIS APP
              </Link>
        </nav>

        {/* Desktop Buttons / Profile */}
        <div className="items-center hidden space-x-4 lg:flex">
          {/* Login Button */}
          {isLoggedIn === null ? (
            <div className="flex gap-2 animate-pulse">
              <div className="w-32 bg-gray-200 rounded h-9" />
            </div>
          ) : isLoggedIn ? (
            <div className="relative flex items-center space-x-4">
              {/* Cart Icon */}
              <Link
                href="/cart"
                className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-700 hover:bg-gray-100 transition ${mounted && bump ? "ring-2 ring-sky-300" : ""}`}
                aria-label={`Cart${mounted && cartCount > 0 ? `, ${cartCount} item${cartCount > 1 ? "s" : ""}` : ""}`}
                title="Cart"
              >
                <ShoppingCart size={22} className={`transition-transform ${mounted && bump ? "scale-110" : ""}`} />
                {mounted && cartCount > 0 && (
                  <span className={`absolute -top-1 -right-1 min-w-[1.15rem] h-5 px-1.5 rounded-full bg-red-600 text-white text-[10px] leading-5 text-center font-bold ring-2 ring-white shadow transition-transform ${mounted && bump ? "scale-110" : ""}`}>
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <Image
                    src={gender === "female" ? "/female-avatar.png" : "/male-avatar.png"}
                    width={40}
                    height={40}
                    alt="Profile"
                    className="border border-gray-300 rounded-full"
                  />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl w-48">
                    {isCustomer ? (
                      <Link
                        href="/customer/order"
                        className="block px-4 py-3 text-sm text-gray-700 rounded-t-lg hover:bg-gray-100 font-medium"
                        onClick={() => setShowDropdown(false)}
                      >
                        My Orders
                      </Link>
                    ) : (
                      <Link
                        href="/dashboard"
                        className="block px-4 py-3 text-sm text-gray-700 rounded-t-lg hover:bg-gray-100 font-medium"
                        onClick={() => setShowDropdown(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={async () => await logoutUser()}
                      className="w-full px-4 py-3 text-sm text-left text-red-500 rounded-b-lg hover:bg-red-50 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-5">
              {/* Login Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenLogin(!openLogin)}
                  onMouseEnter={() => setOpenLogin(true)}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-[#1A1F71]  hover:bg-blue-700 transition-colors flex items-center uppercase tracking-wide"
                >
                  Login
                  <ChevronDown className={`ml-1.5 w-3.5 h-3.5 transition-transform ${openLogin ? "rotate-180" : ""}`} />
                </button>
                {openLogin && (
                  <div
                    className="absolute right-0 z-20 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-48"
                    onMouseLeave={() => setOpenLogin(false)}
                  >
                    <Link
                      href="/login?type=customer"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                    >
                      Login as Customer
                    </Link>
                    <Link
                      href="/login?type=vendor"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                    >
                      Login as Vendor
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Cart for non-logged in users */}
              <Link
                href="/cart"
                className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-700 hover:bg-gray-100 transition ${mounted && bump ? "ring-2 ring-sky-300" : ""}`}
              >
                <ShoppingCart size={22} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[1.15rem] h-5 px-1.5 rounded-full bg-red-600 text-white text-[10px] leading-5 text-center font-bold ring-2 ring-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="text-gray-800 lg:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
        <div className="mt-4 space-y-4 lg:hidden bg-white border-t border-gray-200 pt-4">
          <nav className="flex flex-col space-y-1">
            <Link href="/" onClick={() => setIsOpen(false)} className="px-4 py-3 text-gray-800 hover:bg-gray-100 font-medium uppercase">
              HOME
            </Link>
            
            <div className="px-4 py-3">
              <div className="font-medium text-gray-800 mb-3 uppercase">SHOP</div>
              <div className="ml-4 space-y-3">
                <Link href="/products" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                  Products
                </Link>
                <Link href="/foods" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                  Foods
                </Link>
                <Link href="/services" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                  Services
                </Link>
              </div>
            </div>
            
            <Link href="/become-a-vendor" onClick={() => setIsOpen(false)} className="px-4 py-3 text-gray-800 hover:bg-gray-100 font-medium uppercase">
              BECOME A VENDOR
            </Link>
            
            <Link href="/about" onClick={() => setIsOpen(false)} className="px-4 py-3 text-gray-800 hover:bg-gray-100 font-medium uppercase">
              ABOUT
            </Link>
            
            <Link href="/contact" onClick={() => setIsOpen(false)} className="px-4 py-3 text-gray-800 hover:bg-gray-100 font-medium uppercase">
              CONTACT
            </Link>
            
            <div className="px-4 py-3">
              <div className="font-medium text-gray-800 mb-3 uppercase">MORE</div>
              <div className="ml-4 space-y-3">
                {/* <Link href="/how-to-use-this-app" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                  HOW TO USE THIS APP
                </Link> */}
                <Link href="/faq" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                  FAQ
                </Link>
                <Link href="/terms" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                  Terms & Conditions
                </Link>
                <Link href="/privacy" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </nav>
          
          <div className="px-4 pt-4 border-t border-gray-200">
            {isLoggedIn === null ? (
              <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
            ) : isLoggedIn ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 py-3">
                  <Image
                    src={gender === "female" ? "/female-avatar.png" : "/male-avatar.png"}
                    width={44}
                    height={44}
                    alt="Profile"
                    className="border border-gray-300 rounded-full"
                  />
                  <span className="text-gray-800 font-medium">My Account</span>
                </div>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-100 rounded font-medium"
                >
                  <ShoppingCart size={20} className="mr-3" />
                  Cart
                  {mounted && cartCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {isCustomer ? (
                  <Link
                    href="/customer/order"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-800 hover:bg-gray-100 rounded font-medium"
                  >
                    My Orders
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-800 hover:bg-gray-100 rounded font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await logoutUser();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-50 rounded font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-gray-800 font-medium mb-3 uppercase">Login As:</div>
                <Link href="/login?type=customer">
                  <button className="w-full bg-blue-600 text-white px-4 py-3.5 rounded text-sm font-semibold hover:bg-blue-700 uppercase tracking-wide">
                    Customer
                  </button>
                </Link>
                <Link href="/login?type=vendor">
                  <button className="w-full border border-blue-600 text-blue-600 px-4 py-3.5 rounded text-sm font-semibold hover:bg-blue-50 uppercase tracking-wide">
                    Vendor
                  </button>
                </Link>
                <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-center px-4 py-3 text-gray-800 hover:bg-gray-100 rounded font-medium">
                  <ShoppingCart size={20} className="mr-3" />
                  Cart
                  {mounted && cartCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;






// "use client";
// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { logoutUser } from "@/utils/logoutUser";
// import { ShoppingCart, ChevronDown } from "lucide-react";
// import { useCartCount } from "@/hooks/useCartCount";
// import CartSyncPrompt from "./CartSyncPrompt";
// import { getLoggedInCustomer } from "@/utils/authUtils";


// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
//   const [isCustomer, setIsCustomer] = useState<boolean | null>(null);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [gender, setGender] = useState<string | null>(null);
//   const [bump, setBump] = useState(false);
//   const [delta, setDelta] = useState(0);
//   const prevCountRef = useRef<number | null>(null);
//   const [mounted, setMounted] = useState(false);
//   const [openLogin, setOpenLogin] = useState(false);


//   const { count: cartCount, source, loading } = useCartCount(isLoggedIn);

//   useEffect(() => {
//     const session = localStorage.getItem("user_session");
//     setIsLoggedIn(session === "true");

//     const userGender = localStorage.getItem("user_gender");
//     setGender(userGender);

//     (async () => {
//       const user = await getLoggedInCustomer(); // returns user only if role === 'customer'
//       setIsCustomer(!!user);
//     })();

//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (prevCountRef.current === null) {
//       prevCountRef.current = cartCount;
//       return;
//     }
//     const change = cartCount - prevCountRef.current;
//     if (change !== 0) {
//       setDelta(change);
//       setBump(true);
//       const t1 = setTimeout(() => setBump(false), 300);
//       const t2 = setTimeout(() => setDelta(0), 550);
//       prevCountRef.current = cartCount;
//       return () => { clearTimeout(t1); clearTimeout(t2); };
//     }
//     prevCountRef.current = cartCount;
//   }, [cartCount]);

//   useEffect(() => {
//     const header = document.getElementById("site-header");
//     const setH = () => {
//       const h = header?.offsetHeight ?? 0;
//       document.documentElement.style.setProperty("--header-h", `${h}px`);
//     };
//     setH();
//     const ro = new ResizeObserver(setH);
//     if (header) ro.observe(header);
//     window.addEventListener("resize", setH);
//     return () => { ro.disconnect(); window.removeEventListener("resize", setH); };
//   }, []);


//   return (
//     <header
//       id="site-header"
//       className="fixed top-0 left-0 z-50 w-full px-6 py-4 bg-white shadow md:px-10 lg:px-20"
//     >
//       <CartSyncPrompt />
//       <div className="flex items-center justify-between">
//         {/* Logo */}
//         <div className="flex items-center">
//           <Link href="/">
//             <Image src="/logo.png" alt="Mosaic Biz Hub Logo" width={350} height={100} />
//           </Link>
//         </div>

//         {/* Desktop Nav */}
//         <nav className="items-center hidden space-x-6 text-sm font-light lg:flex">
//           {/* <Link href="/">Home</Link> */}
//           <Link href="/products">Products</Link>
//           <Link href="/foods">Foods</Link>
//           <Link href="/services">Services</Link>
//           <Link href="/about">About Us</Link>
//           <Link href="/contact">Contact Us</Link>
//         </nav>

//         {/* Desktop Buttons / Profile */}
//         <div className="items-center hidden space-x-2 lg:flex">
//           {isLoggedIn === null ? (
//             <div className="flex gap-2 animate-pulse">
//               <div className="w-32 bg-gray-200 rounded h-9" />
//               <div className="w-32 bg-gray-200 rounded h-9" />
//             </div>
//           ) : isLoggedIn ? (
//             <div className="w-[190px] relative flex justify-end items-center">
//               <button onClick={() => setShowDropdown(!showDropdown)} className="focus:outline-none">
//                 <Image
//                   src={gender === "female" ? "/female-avatar.png" : "/male-avatar.png"}
//                   width={40}
//                   height={40}
//                   alt="Profile"
//                   className="border border-gray-300 rounded-full"
//                 />
//               </button>

//               {showDropdown && (
//                 <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl top-full w-44">
//                   {isCustomer ? (
//                     <Link
//                       href="/customer/order"
//                       className="block px-4 py-2 text-sm text-gray-700 rounded-t-lg hover:bg-gray-100"
//                       onClick={() => setShowDropdown(false)}
//                     >
//                       Orders
//                     </Link>
//                   ) : (
//                     <Link
//                       href="/dashboard"
//                       className="block px-4 py-2 text-sm text-gray-700 rounded-t-lg hover:bg-gray-100"
//                       onClick={() => setShowDropdown(false)}
//                     >
//                       Dashboard
//                     </Link>
//                   )}
//                   {/* <Link
//                     href="/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={() => setShowDropdown(false)}
//                   >
//                     Profile
//                   </Link> */}
//                   <button
//                     onClick={async () => await logoutUser()}
//                     className="w-full px-4 py-2 text-sm text-left text-red-500 rounded-b-lg hover:bg-red-50"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="relative flex items-center gap-4">
//               {/* Login Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => setOpenLogin(!openLogin)}
//                   className="border border-sky-500 text-sky-500 px-4 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-sky-50 transition"
//                 >
//                   Login
//                   <ChevronDown className={`w-4 h-4 transition-transform ${openLogin ? "rotate-180" : ""}`} />
//                 </button>

//                 {openLogin && (
//                   <div
//                     className="absolute z-20 mt-2 overflow-hidden bg-white border border-gray-200 rounded-md shadow-lg w-44"
//                     onMouseLeave={() => setOpenLogin(false)}
//                   >
//                     <Link
//                       href="/login?type=customer"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-50"
//                     >
//                       Login as Customer
//                     </Link>
//                     <Link
//                       href="/login?type=vendor"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-50"
//                     >
//                       Login as Vendor
//                     </Link>
//                   </div>
//                 )}
//               </div>

//               {/* Become Vendor Button */}
//               <Link href="/become-a-vendor">
//                 <button className="bg-sky-500 text-white px-4 py-1.5 rounded text-sm hover:bg-sky-600 transition">
//                   Become a Vendor
//                 </button>
//               </Link>
//             </div>
//           )}
//           <Link
//             href="/cart"
//             className={`relative inline-flex items-center h-9 px-3 rounded-full text-sm transition text-sky-600 hover:bg-sky-50
//     focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2
//     ${mounted && bump ? "ring-2 ring-sky-300" : ""}`}
//             aria-label={`Cart${mounted && cartCount > 0 ? `, ${cartCount} item${cartCount > 1 ? "s" : ""}` : ""}`}
//             title="Cart"
//           >
//             <span className="relative mr-2">
//               <ShoppingCart size={24} className={`transition-transform ${mounted && bump ? "scale-110" : ""}`} aria-hidden="true" />
//               {mounted && cartCount > 0 && (
//                 <span
//                   className={`absolute -top-2 -right-3 min-w-[1.15rem] h-5 px-1.5 rounded-full
//           bg-red-600 text-white text-[10px] leading-5 text-center font-bold
//           ring-2 ring-white shadow transition-transform ${mounted && bump ? "scale-110" : ""}`}
//                   aria-hidden="true"
//                 >
//                   {cartCount > 99 ? "99+" : cartCount}
//                 </span>
//               )}

//               {mounted && delta !== 0 && (
//                 <span
//                   className={`absolute -top-4 right-0 text-xs font-bold pointer-events-none
//           transition-all duration-500
//           ${delta > 0 ? "text-green-600" : "text-red-600"}
//           ${delta !== 0 ? "opacity-100 -translate-y-2" : "opacity-0 translate-y-0"}`}
//                   aria-hidden="true"
//                 >
//                   {delta > 0 ? `+${delta}` : `${delta}`}
//                 </span>
//               )}
//             </span>
//             <span>Cart</span>
//           </Link>
//         </div>

//         {/* Mobile Hamburger */}
//         <button className="text-gray-800 lg:hidden focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//             {isOpen ? (
//               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//             ) : (
//               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//             )}
//           </svg>
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="mt-4 space-y-4 lg:hidden">
//           <nav className="flex flex-col space-y-2 text-sm font-light">
//             {/* <Link href="/" onClick={() => setIsOpen(false)}>Home</Link> */}
//             <Link href="/products" onClick={() => setIsOpen(false)}>Products</Link>
//             <Link href="/foods" onClick={() => setIsOpen(false)}>Foods</Link>
//             <Link href="/services" onClick={() => setIsOpen(false)}>Services</Link>
//             <Link href="/about" onClick={() => setIsOpen(false)}>About Us</Link>
//             <Link href="/contact" onClick={() => setIsOpen(false)}>Contact Us</Link>
//           </nav>
//           <div className="flex flex-col pt-2 space-y-2">
//             <Link
//               href="/cart"
//               onClick={() => setIsOpen(false)}
//               className="border border-sky-500 text-sky-500 px-4 py-1.5 rounded text-sm w-full flex items-center justify-center"
//             >
//               <ShoppingCart size={24} className="mr-2" aria-hidden="true" />
//               <span>Cart</span>
//             </Link>

//             {isLoggedIn === null ? (
//               <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
//             ) : isLoggedIn ? (
//               <div className="flex flex-col gap-2">
//                 <div className="flex items-center gap-3">
//                   <Image
//                     src={gender === "female" ? "/female-avatar.png" : "/male-avatar.png"}
//                     width={36}
//                     height={36}
//                     alt="Profile"
//                     className="border border-gray-300 rounded-full"
//                   />
//                   <span className="text-sm text-gray-700">My Account</span>
//                 </div>

//                 <Link
//                   href="/dashboard"
//                   className="px-4 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Dashboard
//                 </Link>
//                 <Link
//                   href="/profile"
//                   className="px-4 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Profile
//                 </Link>
//                 <button
//                   onClick={async () => {
//                     await logoutUser();
//                     setIsOpen(false);
//                   }}
//                   className="w-full px-4 py-2 text-sm text-left text-red-500 rounded hover:bg-red-50"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <Link href="/login?type=customer">
//                   <button className="border border-sky-500 text-sky-500 px-4 py-1.5 rounded text-sm w-full">
//                     Login As Customer
//                   </button>
//                 </Link>
//                 <Link href="/login?type=vendor">
//                   <button className="border border-sky-500 text-sky-500 px-4 py-1.5 rounded text-sm w-full">
//                     Login As Vendor
//                   </button>
//                 </Link>
//                 <Link href="/become-a-vendor">
//                   <button className="bg-sky-500 text-white px-4 py-1.5 rounded text-sm hover:bg-sky-600 w-full">
//                     Become a Vendor
//                   </button>
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;
