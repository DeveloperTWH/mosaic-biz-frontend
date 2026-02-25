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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        setLoadingMinority(false);
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
      router.push("/");
    } else {
      router.back();
    }
  };

  function computePwdChecks(pwd: string) {
    const hasMinLen = pwd.length >= 6;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    return { hasMinLen, hasUpper, hasLower, hasDigit, hasSpecial };
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPwdError(null);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const firstName = (formData.get("firstName") as string)?.trim() || "";
    const lastName = (formData.get("lastName") as string)?.trim() || "";
    const email = (formData.get("email") as string)?.trim() || "";
    const password = (formData.get("password") as string) || "";
    const confirmPassword = (formData.get("confirmPassword") as string) || "";
    
    if (type === "vendor" && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    const checks = computePwdChecks(password);
    setPwdChecks(checks);

    if (!checks.hasMinLen || (!checks.hasUpper && !checks.hasLower) || !checks.hasDigit) {
      setShowPwdHints(true);
      setPwdError("Password must be at least 6 characters with letters and numbers.");
      setLoading(false);
      return;
    }

    const payload = {
      name: type === "vendor" ? `${firstName} ${lastName}`.trim() : undefined,
      email,
      password,
      role: type === "vendor" ? "business_owner" : "customer",
      mobile: formData.get("mobile"),
      gender: formData.get("gender"),
      minorityType: formData.get("minorityType"),
    };
    
    console.log("Registration payload:", payload);

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
      console.log("Registration response:", data);
      
      if (data.success) {
        router.push(`/verify-otp?email=${payload.email}&type=${type}`);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

if (isVendor == true)
  return (
    <div className="min-h-screen  relative">
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

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium font-poppins text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="firstName"
                    type="text"
                    required
                    className="w-full rounded-md border border-gray-300 px-6 py-2 focus:ring-2 focus:ring-blue-900 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-base font-medium font-poppins text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="lastName"
                    type="text"
                    required
                    className="w-full rounded-md border border-gray-300 px-6 py-2 focus:ring-2 focus:ring-blue-900 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium font-poppins text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="mobile"
                    type="tel"
                    required
                    className="w-full rounded-md border border-gray-300 px-6 py-2 focus:ring-2 focus:ring-blue-900 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-base font-medium font-poppins text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="email"
                    type="email" 
                    required
                    className="w-full rounded-md border border-gray-300 px-6 py-2 focus:ring-2 focus:ring-blue-900 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium font-poppins text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
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
                  <label className="block text-base font-medium font-poppins text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
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
                <input type="checkbox" className="mt-2" required />
                <p>
                  Your personal data will be used to support your experience
                  throughout this website, to manage access to your account, and
                  for other purposes described in our{" "}
                  <a href="#" className="text-blue-900 underline">
                    privacy policy
                  </a>.
                </p>
              </div>

              {(error || pwdError) && (
                <div className="text-sm text-red-600">
                  {error || pwdError}
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-900 text-white px-[120px] py-2 font-montserrat font-thin hover:bg-blue-800 transition disabled:opacity-60"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
              <p className="text-sm text-gray-600">
                Already a member?{" "}
                <a href={`/login?type=${type}`} className="text-blue-900 font-semibold underline">
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

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium font-poppins text-[#9E9E9E] mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium font-poppins text-[#9E9E9E] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
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
                <input type="checkbox" className="mt-2" required />
                <p className="font-montserrat font-thin">
                  Your personal data will be used to support your experience
                  throughout this website, to manage access to your account,
                  and for other purposes described in our{" "}
                  <a href="#" className="text-blue-900 font-medium underline">
                    privacy policy
                  </a>.
                </p>
              </div>

              {(error || pwdError) && (
                <div className="text-sm text-red-600">
                  {error || pwdError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white py-2 text-[16px] hover:bg-blue-800 transition font-montserrat font-extralight disabled:opacity-60"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <p className="mt-6 text-center underline text-[16px] text-gray-600">
              Already a member?{" "}
              <a href={`/login?type=${type}`}>
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, description, src,  divider } : {title : string, description : string , src : string, divider : boolean}) {
  return (
    <div>
      <div className="flex gap-4 items-start">
        <div className="h-10 w-10 rounded-lg  flex items-center justify-center">
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
