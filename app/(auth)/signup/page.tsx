"use client";
export const dynamic = "force-dynamic";
import React from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { Eye, EyeOff, X } from "lucide-react";

type MinorityType = {
  _id: string;
  name: string;
};

function SignupContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // "vendor" or "customer"
  const [isValidType, setIsValidType] = useState(true);
  const [minorityTypes, setMinorityTypes] = useState<MinorityType[]>([]);
  const [loadingMinority, setLoadingMinority] = useState(true);
  const [password, setPassword] = useState("");
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [pwdChecks, setPwdChecks] = useState({
    hasMinLen: false,
    hasUpper: false,
    hasLower: false,
    hasDigit: false,
    hasSpecial: false,
  });
  const [showPwdHints, setShowPwdHints] = useState(false);



  useEffect(() => {
    const fetchMinorityTypes = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/minority-types`
        );
        const data = await res.json();
        setMinorityTypes(data);
      } catch (err) {
        console.error("Failed to load minority types", err);
      } finally {
        setLoadingMinority(false); // ✅ Stop loading after fetch
      }
    };
    fetchMinorityTypes();
  }, []);

  useEffect(() => {
    if (type !== "vendor" && type !== "customer") {
      setIsValidType(false);
    }
  }, [type]);

  if (!isValidType) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 text-center bg-white rounded shadow">
          <p className="font-semibold text-red-600">Invalid account type.</p>
        </div>
      </div>
    );
  }

  const isVendor = type === "vendor";
  const title = isVendor ? "Vendor Registration" : "Customer Registration";
  const router = useRouter();
  const pathname = usePathname();
  const handleClose = () => {
    const isAuthPage =
      pathname.includes("/login") || pathname.includes("/signup");

    if (isAuthPage) {
      router.push("/"); // Replace with your landing page or dashboard route
    } else {
      router.back();
    }
  };

  function computePwdChecks(pwd: string) {
    const hasMinLen = pwd.length >= 10;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    return { hasMinLen, hasUpper, hasLower, hasDigit, hasSpecial };
  }




  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement; // ✅ Fix here
    const formData = new FormData(form);

    const firstName = (formData.get("firstName") as string).trim();
    const lastName = (formData.get("lastName") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = (formData.get("password") as string) || "";
    const checks = computePwdChecks(password);
    setPwdChecks(checks);

    if (Object.values(checks).some(v => v === false)) {
      setShowPwdHints(true);
      setPwdError("Please meet all password requirements before continuing.");
      return;
    }
    setPwdError(null);

    const payload = {
      name: `${firstName} ${lastName}`.trim(),
      email,
      password,
      role: type === "vendor" ? "business_owner" : "customer",
      mobile: formData.get("mobile"),
      gender: formData.get("gender"), // vendor can skip gender
      minorityType: formData.get("minorityType"),
    };
    console.log("api calls", payload);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      const data = await res.json();
      if (data.success) {
        router.push(`/verify-otp?email=${payload.email}&type=${type}`);
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

if (isVendor == true)
  return (
    <div className="min-h-screen  relative">
      {/* Top Header */}
        <header className="w-full px-0 py-4 flex items-center justify-between bg-white md:bg-transparent absolute top-0 left-20 z-20">
        <span className="text-xl font-bold tracking-wide text-blue-900 md:text-white">
          <img
          src="/login/logo.png"
          alt="background"
          className=""
          height={256}
          width={256}
        />
        </span>
      </header>

      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[40%_60%]">
        {/* Left Section */}
        <div className="relative hidden  md:flex bg-gradient-to-br from-blue-950 via-blue-900 to-teal-800 text-white">
          <img
            src="/login/sideImgVendor.png"
            alt="background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative z-10 flex flex-col justify-center px-12 max-w-xl">
            <h1 className="text-3xl font-bold font-poppins leading-tight mb-4">
              JOIN THE <span className="text-3xl font-bold font-poppins leading-tight mb-4 text-amber-400">MINORITY BIZ <br/> HUB</span>{" "}
              COMMUNITY
            </h1>
            <p className="text-sm text-gray-200 mb-10">
              Get access to tools, resources, and a powerful network designed to
              help minority-owned businesses grow and succeed.
            </p>

            <div className="space-y-6">
              <Feature
                title="Access Resources"
                description="Get access to tools, resources, and support to grow your business."
                divider={true}
                src="/login/VendorIcon.png"
              />
              <Feature
                title="Sell your products"
                description="Reach a wider audience by listing your products in our marketplace."
                divider={true}
                src="/login/VendorIcon2.png"
              />
              <Feature
                title="Network with other Business Owners"
                description="Connect with other minority entrepreneurs and grow your network."
                divider={true}
                src="/login/VendorIcon3.png"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
     <div className="flex items-center justify-center bg-white px-6">
          <div className="w-full max-w-xl">
            <span className="inline-block mb-2 rounded-full bg-[#FFF6E0] px-2 text-[10px] font-thin font-montserrat text-[#C7A040]">
              Business Owner
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              CREATE ACCOUNT
            </h2>


            <div className="flex flex-col justify-start mb-5">
              <hr className="h-[2px] w-[80px] bg-gray-700" />
              <hr className="h-[2px] w-[80px] mt-[2px] mb-4 bg-gray-700" />
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input className="w-full rounded-md border border-gray-300 px-6 py-2 focus:ring-2 focus:ring-blue-900 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input className="w-full rounded-md border border-gray-300 px-6 py-2 focus:ring-2 focus:ring-blue-900 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input className="w-full rounded-md border border-gray-300 px-6 py-2 focus:ring-2 focus:ring-blue-900 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input type="email" className="w-full rounded-md border border-gray-300 px-6 py-2 focus:ring-2 focus:ring-blue-900 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full rounded-md border border-gray-300 px-6 py-2 pr-10 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full rounded-md border border-gray-300 px-6 py-2 pr-10 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showConfirmPassword ?<EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-gray-600">
                <input type="checkbox" className="mt-2" />
                <p>
                  Your personal data will be used to support your experience
                  throughout this website, to manage access to your account, and
                  for other purposes described in our{" "}
                  <a href="#" className="text-blue-900 underline">
                    privacy policy
                  </a>.
                </p>
              </div>

              <div className="flex items-center justify-between mt-4">
              <button className="bg-blue-900 text-white px-[120px] py-2 font-montserrat font-thin hover:bg-blue-800 transition">
                Register
              </button>
              <p className="text-sm text-gray-600">
                Already a member?{" "}
                <a href="#" className="text-blue-900 font-semibold underline">
                  Sign In
                </a>
              </p>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );


else
    return (
    <div className="min-h-screen font-sans relative">
      {/* Top Header */}
        <header className="w-full px-0 py-4 flex items-center justify-between bg-white md:bg-transparent absolute top-0 left-20 z-20">
        <span className="text-xl font-bold tracking-wide text-blue-900 md:text-white">
          <img
          src="/login/logo.png"
          alt="background"
          className=""
          height={256}
          width={256}
        />
        </span>
      </header>

      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Left Section */}
        <div className="relative hidden md:flex bg-gradient-to-br from-blue-950 via-blue-900 to-teal-800 text-white">
          <img
            src="/login/sideImg.png"
            alt="background"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />

          <div className="relative z-10 flex flex-col justify-center px-12 max-w-xl">
            <h1 className="text-3xl font-bold font-poppins leading-tight mb-4">
              SIGN UP & SUPPORT{" "}
              <span className="text-amber-400 font-bold font-poppins">MINORITY-OWNED BUSINESSES</span>
            </h1>
            <p className="text-sm font-thin font-montserrat text-gray-200 mb-10">
Lorem ipsum dolor sit amet consectetur adipisicing elitsed eiusmod tempor enim minim veniam quis notru exercit ation Lorem ipsum dolor sit amet.Veniam quis notru exercit.
            </p>

            <div className="space-y-6">
              <Feature
                title="Get Authentic Products"
                description="Shop genuine products directly from verified sellers."
                src="/login/icon.png"
                divider={true}
              />
              <Feature
                title="Track Your Orders"
                description="View order status, delivery updates, and purchase history in one place."
                src="/login/icon2.png"
                divider={true}
              />
              <Feature
                title="Support Minority Communities"
                description="Every purchase helps empower minority-owned businesses."
                  src="/login/icon3.png"
                divider={false}

              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center bg-white px-6">
          <div className="w-full max-w-md">
            <span className="inline-block mb-2 rounded-full bg-[#FFF6E0] px-2 text-[10px] font-thin font-montserrat text-[#C7A040]">
              Customer
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              CREATE ACCOUNT
            </h2>


            <div className="flex flex-col justify-start mb-5">
              <hr className="h-[2px] w-[80px] bg-gray-700" />
              <hr className="h-[2px] w-[80px] mt-[2px] mb-4 bg-gray-700" />
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#9E9E9E] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9E9E9E] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}

                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-gray-600">
                <input type="checkbox" className="mt-2" />
                <p className="font-montserrat font-thin">
                  Your personal data will be used to support your experience
                  throughout this website, to manage access to your account,
                  and for other purposes described in our{" "}
                  <a href="#" className="text-blue-900 font-medium underline">
                    privacy policy
                  </a>.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-2 text-[16px] hover:bg-blue-800 transition font-montserrat font-extralight"
              >
                Register
              </button>
            </form>

            <p className="mt-6 text-center underline text-[16px] text-gray-600">
              Already a member?{" "}
              <a href="#">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );




}

  // return (
  //   <div className="min-h-screen bg-black bg-[url('/login/footer-bg.jpg')] bg-cover bg-center bg-fixed relative py-10 p-1">
  //     <div
  //       className="fixed z-50 p-2 text-white bg-gray-700 rounded-lg cursor-pointer top-4 right-4"
  //       onClick={handleClose}
  //     >
  //       <X size={20} />
  //     </div>
  //     <div className="z-10 w-full max-w-md p-8 mx-auto bg-white shadow-xl rounded-xl">
  //       <Link href="/">
  //         <div className="mb-6 text-center">
  //           <Image
  //             src="/logo.png"
  //             alt="Logo"
  //             width={350}
  //             height={100}
  //             className="mx-auto"
  //           />
  //         </div>
  //       </Link>

  //       <div className="mb-2 text-lg font-bold text-center">{title}</div>

  //       {/* Tabs */}
  //       <div className="flex justify-center mb-4 border-b border-gray-300">
  //         <Link
  //           href={`/login?type=${type}`}
  //           className="px-4 py-2 font-semibold text-gray-500 hover:text-black"
  //         >
  //           Sign In
  //         </Link>
  //         <Link
  //           href={`/create-account?type=${type}`}
  //           className="px-4 py-2 font-semibold border-b-2 border-black"
  //         >
  //           Create Account
  //         </Link>
  //       </div>

  //       {/* Full page scrollable form */}
  //       <form onSubmit={handleSubmit}>
  //         <label className="block mb-2 text-gray-700">First Name</label>
  //         <input
  //           name="firstName"
  //           type="text"
  //           required
  //           className="w-full p-2 mb-4 border rounded"
  //         />

  //         <label className="block mb-2 text-gray-700">Last Name</label>
  //         <input
  //           name="lastName"
  //           type="text"
  //           required
  //           className="w-full p-2 mb-4 border rounded"
  //         />

  //         <label className="block mb-2 text-gray-700">Mobile Number</label>
  //         <input
  //           name="mobile"
  //           type="text"
  //           required
  //           className="w-full p-2 mb-4 border rounded"
  //         />

  //         {/* <label className="block mb-2 text-gray-700" htmlFor="minorityType">
  //           Minority Type
  //         </label>
  //         <select
  //           id="minorityType"
  //           name="minorityType"
  //           required
  //           className="w-full p-2 mb-4 border rounded"
  //           disabled={loadingMinority}
  //         >
  //           {loadingMinority ? (
  //             <option>Loading types...</option>
  //           ) : (
  //             <>
  //               <option value="">Select Minority Type</option>
  //               {minorityTypes.map((type) => (
  //                 <option key={type._id} value={type._id}>
  //                   {type.name}
  //                 </option>
  //               ))}
  //             </>
  //           )}
  //         </select>

  //         <label className="block mb-2 text-gray-700" htmlFor="gender">
  //           Gender
  //         </label> */}
  //         {/* <select
  //           id="gender"
  //           name="gender"
  //           required
  //           className="w-full p-2 mb-4 border rounded"
  //         >
  //           <option value="">Select Gender</option>
  //           <option value="male">Male</option>
  //           <option value="female">Female</option>
  //           <option value="other">Other</option>
  //         </select> */}
  //         <label className="block mb-2 text-gray-700">Email</label>
  //         <input
  //           name="email"
  //           type="email"
  //           required
  //           className="w-full p-2 mb-4 border rounded"
  //         />

  //         <label className="block mb-2 text-gray-700">Password</label>
  //         <div className="relative">
  //           <input
  //             name="password"
  //             type={showPassword ? "text" : "password"}
  //             required
  //             className="w-full p-2 pr-10 mb-2 border rounded"
  //             autoComplete="off"
  //             autoCorrect="off"
  //             autoCapitalize="none"
  //             value={password}
  //             onFocus={() => setShowPwdHints(true)}
  //             onBlur={() => {
  //               if (!password) setShowPwdHints(false);
  //             }}
  //             onChange={(e) => {
  //               const val = e.target.value;
  //               setPassword(val);
  //               setPwdError(null);
  //               setPwdChecks(computePwdChecks(val));
  //             }}
  //           />

  //           <button
  //             type="button"
  //             onClick={() => setShowPassword((prev) => !prev)}
  //             className="absolute inset-y-0 flex items-center text-gray-500 right-2"
  //             tabIndex={-1}
  //           >
  //             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  //           </button>
  //         </div>

  //         {showPwdHints && (
  //           <ul className="mb-3 space-y-1 text-sm">
  //             <li className={pwdChecks.hasMinLen ? "text-green-600" : "text-gray-600"}>
  //               {pwdChecks.hasMinLen ? "✓" : "•"} At least 10 characters
  //             </li>
  //             <li className={pwdChecks.hasUpper ? "text-green-600" : "text-gray-600"}>
  //               {pwdChecks.hasUpper ? "✓" : "•"} One uppercase letter (A–Z)
  //             </li>
  //             <li className={pwdChecks.hasLower ? "text-green-600" : "text-gray-600"}>
  //               {pwdChecks.hasLower ? "✓" : "•"} One lowercase letter (a–z)
  //             </li>
  //             <li className={pwdChecks.hasDigit ? "text-green-600" : "text-gray-600"}>
  //               {pwdChecks.hasDigit ? "✓" : "•"} One number (0–9)
  //             </li>
  //             <li className={pwdChecks.hasSpecial ? "text-green-600" : "text-gray-600"}>
  //               {pwdChecks.hasSpecial ? "✓" : "•"} One special character (!@#$% etc.)
  //             </li>
  //           </ul>
  //         )}

  //         {pwdError && (
  //           <p className="mb-3 text-sm text-red-600">{pwdError}</p>
  //         )}

  //         <button
  //           type="submit"
  //           className="bg-[#10A3C9] text-white w-full py-2 font-semibold"
  //         >
  //           Register
  //         </button>
  //       </form>

  //       <p className="mt-4 text-sm text-center">
  //         Already a member?{" "}
  //         <Link href={`/login?type=${type}`} className="font-bold underline">
  //           Sign In
  //         </Link>
  //       </p>
  //     </div>

  //     <footer className="absolute w-full text-sm text-yellow-500 bottom-2">
  //       <div className="pr-5 w-[80%] mx-auto">
  //         <p>Copyright 2025. All Rights Reserved.</p>
  //       </div>
  //     </footer>
  //   </div>
  // );




function Feature({ title, description, src,  divider } : {title : string, description : string , src : string, divider : boolean}) {
  return (
    <div>
      <div className="flex gap-4 items-start">
        <div className="h-10 w-10 rounded-lg  flex items-center justify-center">
          {/* <span className="text-lg">□</span>
           */}
           <Image
           src={src}
           alt="icon"
           height={30}
           width={30}

           />
        </div>
        <div>
          <h4 className="font-sm">{title}</h4>
          <p className="text-xs font-thin text-[#ACACAC] font-montserrat text-gray-200">{description}</p>
        </div>
      </div>

      {divider && (
        <div className="mt-6 h-px w-full bg-white/30" />
      )}
    </div>
  );
}


export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
