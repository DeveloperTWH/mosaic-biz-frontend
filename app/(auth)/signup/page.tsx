'use client'
export const dynamic = 'force-dynamic'
import React from 'react';

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Suspense } from 'react'
import { X } from 'lucide-react';


function SignupContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') // "vendor" or "customer"
  const [isValidType, setIsValidType] = useState(true)

  useEffect(() => {
    if (type !== 'vendor' && type !== 'customer') {
      setIsValidType(false)
    }
  }, [type])

  if (!isValidType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-red-600 font-semibold">Invalid account type.</p>
        </div>
      </div>
    )
  }

  const isVendor = type === 'vendor'
  const title = isVendor ? 'Vendor Registration' : 'Customer Registration'
  const router = useRouter();
  const pathname = usePathname();
  const handleClose = () => {
    const isAuthPage = pathname.includes('/login') || pathname.includes('/signup');

    if (isAuthPage) {
      router.push('/'); // Replace with your landing page or dashboard route
    } else {
      router.back();
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement; // ✅ Fix here
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: type === 'vendor' ? 'business_owner' : 'customer',
      mobile: formData.get("mobile"),
      gender: formData.get("gender"), // vendor can skip gender
    };
    console.log("api calls" , payload);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

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


  return (
    <div className="min-h-screen bg-black bg-[url('/login/footer-bg.jpg')] bg-cover bg-center bg-fixed relative py-10 p-1">
      <div className="fixed top-4 right-4 z-50 text-white bg-gray-700 rounded-lg p-2 cursor-pointer" onClick={handleClose}>
        <X size={20} />
      </div>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto p-8 z-10">
        <Link href="/">
          <div className="text-center mb-6">
            <Image src="/logo.png" alt="Logo" width={350} height={100} className="mx-auto" />
          </div>
        </Link>

        <div className="text-center font-bold text-lg mb-2">{title}</div>

        {/* Tabs */}
        <div className="flex justify-center mb-4 border-b border-gray-300">
          <Link
            href={`/login?type=${type}`}
            className="px-4 py-2 font-semibold text-gray-500 hover:text-black"
          >
            Sign In
          </Link>
          <Link
            href={`/create-account?type=${type}`}
            className="px-4 py-2 font-semibold border-b-2 border-black"
          >
            Create Account
          </Link>
        </div>

        {/* Full page scrollable form */}
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 mb-2">Full Name</label>
          <input name="name" type="text" required className="w-full border p-2 mb-4 rounded" />

          <label className="block text-gray-700 mb-2">Mobile Number</label>
          <input name="mobile" type="text" required className="w-full border p-2 mb-4 rounded" />

          <label className="block text-gray-700 mb-2" htmlFor="gender">Gender</label>
          <select id="gender" name="gender" required className="w-full border p-2 mb-4 rounded">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <label className="block text-gray-700 mb-2">Email</label>
          <input name="email" type="email" required className="w-full border p-2 mb-4 rounded" />

          <label className="block text-gray-700 mb-2">Password</label>
          <input name="password" type="password" required className="w-full border p-2 mb-4 rounded" />

          <button type="submit" className="bg-[#10A3C9] text-white w-full py-2 font-semibold">
            Register
          </button>
        </form>


        <p className="text-center text-sm mt-4">
          Already a member?{' '}
          <Link href={`/login?type=${type}`} className="font-bold underline">
            Sign In
          </Link>
        </p>
      </div>

      <footer className="absolute bottom-2 w-full text-yellow-500 text-sm">
        <div className="pr-5 w-[80%] mx-auto">
          <p>Copyright 2025. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  )
}
