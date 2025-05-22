'use client'
export const dynamic = 'force-dynamic';

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const type = searchParams.get('type')
  const isValidType = type === 'vendor' || type === 'customer'

  if (!isValidType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-red-600 font-semibold">Invalid login type.</p>
        </div>
      </div>
    )
  }

  const title = type === 'vendor' ? 'Vendor Login' : 'Customer Login'
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center bg-[url('/login/footer-bg.jpg')] bg-cover bg-center relative p-1 py-10">
      <div className="fixed top-4 right-4 z-50 text-white bg-gray-700 rounded-lg p-2 cursor-pointer" onClick={() => router.back()}>
        <X size={20} />
      </div>

      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 z-10">
        <Link href="/">
          <div className="text-center mb-6">
            <Image src="/logo.png" alt="Logo" width={350} height={100} className="mx-auto" />
          </div>
        </Link>

        <div className="text-center font-bold text-lg mb-4">{title}</div>

        <div className="flex justify-center mb-6 border-b border-gray-300">
          <Link
            href={`/login?type=${type}`}
            className={`px-4 py-2 font-semibold ${pathname.includes('/login') ? 'border-b-2 border-black' : 'text-gray-500'}`}
          >
            Sign In
          </Link>
          <Link
            href={`/signup?type=${type}`}
            className={`px-4 py-2 font-semibold ${pathname.includes('/signup') ? 'border-b-2 border-black' : 'text-gray-500'}`}
          >
            Create Account
          </Link>
        </div>

        <form>
          <label className="block text-gray-700 mb-2">Email</label>
          <input type="email" className="w-full border p-2 mb-4 rounded" />

          <label className="block text-gray-700 mb-2">Password</label>
          <input type="password" className="w-full border p-2 mb-2 rounded" />

          <div className="flex items-center justify-between text-sm mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Keep Me Signed In
            </label>
            <a href="#" className="text-blue-600 font-medium">Forget Password</a>
          </div>

          <button type="submit" className="bg-[#10A3C9] text-white w-full py-2 font-semibold">
            Sign In
          </button>
        </form>

        <div className="flex justify-center space-x-4 mt-4">
          <button className="bg-blue-600 text-white w-10 font-bold h-10 rounded-full">f</button>
          <button className="bg-gray-200 text-black w-10 h-10 rounded-full">G</button>
        </div>

        <p className="text-center text-sm mt-4">
          New {type}?{' '}
          <Link href={`/signup?type=${type}`} className="font-bold underline">
            Create Account
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading login page...</div>}>
      <LoginContent />
    </Suspense>
  )
}
