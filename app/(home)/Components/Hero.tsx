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
    setIsLoggedIn(session === "true");
  }, []);

  const go = () => {
    const qs = new URLSearchParams();

    if (search.trim()) qs.set("q", search.trim());
    if (location.trim()) qs.set("city", location.trim());
    if (minorityType) qs.set("minorityType", minorityType);

    router.push(`/products${qs.toString() ? `?${qs}` : ""}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") go();
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="relative h-[650px] bg-cover bg-center"
        style={{ backgroundImage: "url(/herobanner.png)" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center bg-opacity-50 bg-stone-800">
          <div className="w-full max-w-[80%] mx-auto">
            <h1 className="mb-4 text-4xl font-bold text-white uppercase md:text-5xl lg:text-6xl  tracking-tight font-poppins">
             Your Marketplace for Minority‑Owned Excellence.
            </h1>
            <p className="mb-8 w-[60%] ml-[18%]  ml-10 text-sm text-white  font-poppins">
             From food to fashion to services, Mosaic Biz Hub connects you to verified businesses and gives entrepreneurs the tools to shine. We provide consumers with a trusted place to shop and vendors the tools to scale.
            </p>
            {isLoggedIn === null && (
              <div className="flex flex-col gap-4 md:flex-row justify-center">
                <div className="w-40 h-10 py-2 rounded bg-gray-100/70 px-7" />
                <div className="w-40 h-10 py-2 rounded bg-gray-100/70 px-7" />
              </div>
            )}
            {isLoggedIn === false && (
              <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
                <Link href="/products">
                  <button className="w-full min-w-[220px] px-9 py-3 font-poppins text-xs font-semibold uppercase tracking-wide text-white transition-colors border-2 border-[#C7A040] bg-[#C7A040] hover:bg-[#a88432] sm:w-auto">
                    Explore Marketplace
                  </button>
                </Link>
                <Link href="/become-a-vendor">
                  <button className="w-full min-w-[220px] px-9 py-3 font-poppins text-xs font-semibold uppercase tracking-wide text-white transition-colors border-2 border-white hover:bg-white/10 sm:w-auto">
                    Become a Vendor
                  </button>
                </Link>
              </div>
            )}
            {isLoggedIn === false ? (
              <p className="mt-6 text-xs text-white/80">
                Already have an account?{" "}
                <Link href="/login?type=customer" className="underline hover:text-white">
                  Sign in as customer
                </Link>
                {" · "}
                <Link href="/login?type=vendor" className="underline hover:text-white">
                  Sign in as vendor
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;

// "use client";
// import { useRouter } from "next/navigation";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import MinorityType from "./MinorityType";

// const Hero = () => {
//   const [search, setSearch] = useState("");
//   const [location, setLocation] = useState("");
//   const [minorityType, setMinorityType] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const session = localStorage.getItem("user_session");
//     setIsLoggedIn(session === "true");
//   }, []);

//   const go = () => {
//     const qs = new URLSearchParams();

//     if (search.trim()) qs.set("q", search.trim());
//     if (location.trim()) qs.set("city", location.trim());
//     if (minorityType) qs.set("minorityType", minorityType);

//     router.push(`/products${qs.toString() ? `?${qs}` : ""}`);
//   };

//   const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") go();
//   };

//   return (
//     <div className="bg-white">

//       {/* Hero Section */}
//       <section
//         className="relative h-[650px] bg-cover bg-center"
//         style={{ backgroundImage: "url(/herobanner.png)" }}
//       >
//         <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white bg-opacity-50 bg-stone-800">
//           <h2 className="mb-4 text-3xl font-bold md:text-5xl">
//             Empowering Minority-Owned
//           </h2>
//           <h2 className="mb-4 text-3xl font-bold md:text-5xl">
//             Businesses to Thrive in the Digital Age
//           </h2>
//           <p className="max-w-2xl mb-6">
//             Empowering Minority-Owned Businesses to Succeed in the Digital Era. Unlock New Opportunities, Expand Your Reach, and Connect with a Vibrant Community of Entrepreneurs. Your Business, Your Future, Thriving Together
//           </p>
//           {isLoggedIn === null && (
//             <div className="flex flex-col gap-4 md:flex-row">
//               <div className="w-40 h-10 py-2 rounded bg-gray-100/70 px-7" />
//               <div className="w-40 h-10 py-2 rounded bg-gray-100/70 px-7" />
//             </div>
//           )}
//           {isLoggedIn === false && (
//             <div className="flex flex-col gap-4 md:flex-row">
//               <Link href="/signup?type=customer">
//                 <button className="py-2 text-white border border-white rounded px-7">
//                   Register As Customer
//                 </button>
//               </Link>
//               <Link href="/signup?type=vendor">
//                 <button className="py-2 text-white border border-white rounded px-7">
//                   Register As Vendor
//                 </button>
//               </Link>
//             </div>
//           )}
//           {/* <div className="flex flex-col gap-4 md:flex-row">
//             <Link href="/login?type=customer">
//               <button className="py-2 text-white border border-white rounded px-7">
//                 Login As Customer
//               </button>
//             </Link>
//             <Link href="/login?type=vendor">
//               <button className="py-2 text-white border border-white rounded px-7">
//                 Login As Vendor
//               </button>
//             </Link>
//           </div> */}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Hero;
