'use client'
export const dynamic = 'force-dynamic'

import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Suspense } from 'react'

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

  return (
    <div className="min-h-screen bg-black bg-[url('/login/footer-bg.jpg')] bg-cover bg-center bg-fixed relative py-10">
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
        <form>
          <label className="block text-gray-700 mb-2">Email</label>
          <input type="email" className="w-full border p-2 mb-4 rounded" />

          <label className="block text-gray-700 mb-2">Password</label>
          <input type="password" className="w-full border p-2 mb-4 rounded" />

          {isVendor && (
            <>
              <label className="block text-gray-700 mb-2">First Name</label>
              <input type="text" className="w-full border p-2 mb-4 rounded" />
              <label className="block text-gray-700 mb-2">Last Name</label>
              <input type="text" className="w-full border p-2 mb-4 rounded" />

              <div className="relative group w-full mb-4">
                <label className="block text-gray-700 mb-2 relative">
                  License Number
                  <div className="absolute left-0 -top-6 bg-gray-800 text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    This is your official business license or registration number.
                  </div>
                </label>
                <input type="text" className="w-full border p-2 rounded" />
              </div>

              <label className="block text-gray-700 mb-2">Business Name</label>
              <input type="text" className="w-full border p-2 mb-4 rounded" />

              <label className="block text-gray-700 mb-2">Minority Type</label>
              <select className="w-full border p-2 mb-4 rounded">
                <option value="">CHOOSE ONE</option>
                <option value="black">Black-Owned</option>
                <option value="latino">Latino-Owned</option>
                <option value="asian">Asian-Owned</option>
                <option value="native">Native American-Owned</option>
                <option value="other">Other</option>
              </select>

              <label className="block text-gray-700 mb-2">Mobile Number</label>
              <input type="text" className="w-full border p-2 mb-4 rounded" />
            </>
          )}

          <p className="text-xs text-gray-600 mb-4">
            Your personal data will be used to support your experience throughout this website,
            to manage access to your account, and for other purposes described in our Privacy Policy.
          </p>

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
