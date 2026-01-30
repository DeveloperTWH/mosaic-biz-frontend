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
          <div className="w-full max-w-[60%] mx-auto">
            <h1 className="mb-4 text-4xl font-bold text-white uppercase md:text-5xl lg:text-6xl font-sans tracking-tight">
              EMPOWERING MINORITY-OWNED BUSINESSES
            </h1>
            <p className="mb-8 text-lg text-white md:text-xl font-sans">
              Unlock New Opportunities In The Digital Era, Expand Your Reach, And Connect With A Vibrant Community Of Entrepreneurs Thriving Together.
            </p>
            {isLoggedIn === null && (
              <div className="flex flex-col gap-4 md:flex-row justify-center">
                <div className="w-40 h-10 py-2 rounded bg-gray-100/70 px-7" />
                <div className="w-40 h-10 py-2 rounded bg-gray-100/70 px-7" />
              </div>
            )}
            {isLoggedIn === false && (
              <div className="flex flex-col gap-4 md:flex-row justify-center">
                <Link href="/login?type=customer">
                  <button className="py-3 text-lg font-semibold text-white uppercase transition-colors border-2 border-white  px-9 font-sans tracking-wide hover:bg-white/10">
                    Login As Customer
                  </button>
                </Link>
                <Link href="/login?type=vendor">
                  <button className="py-3 text-lg font-semibold text-white uppercase transition-colors border-2 border-white  px-9 font-sans tracking-wide hover:bg-white/10">
                    Login As Vendor
                  </button>
                </Link>
              </div>
            )}
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
