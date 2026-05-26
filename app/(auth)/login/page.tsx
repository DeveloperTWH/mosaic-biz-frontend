'use client'
export const dynamic = 'force-dynamic';

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, X } from 'lucide-react';

function LoginContent() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const searchParams = useSearchParams()
  const pathname = usePathname()

  const type = searchParams.get('type')
  const redirect = searchParams.get('redirect')
  const resetStatus = searchParams.get('reset')
  const isValidType = type === 'vendor' || type === 'customer'

  const role = type === 'vendor' ? 'business_owner' : 'customer';

  const handleGoogleLoginRedirect = () => {
    const returnTo =
      typeof window !== 'undefined' ? window.location.origin : '';
    const url =
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google` +
      `?role=${encodeURIComponent(role)}` +
      `&redirect=${encodeURIComponent(returnTo)}`;
    window.location.href = url;
  };

  if (!isValidType) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 text-center bg-white rounded shadow">
          <p className="font-semibold text-red-600">Invalid login type.</p>
        </div>
      </div>
    )
  }

  const title = type === 'vendor' ? 'Vendor Login' : 'Customer Login'
  const router = useRouter();
  const safeRedirect =
    redirect && redirect.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : null;

  useEffect(() => {
    if (resetStatus === 'success') {
      setSuccessMessage('Password reset successful. Please sign in with your new password.');
    }
  }, [resetStatus]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: type === 'vendor' ? 'business_owner' : 'customer',
        }),
        credentials: 'include'
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('user_session', 'true');
        localStorage.setItem('user_gender', data.user.gender || '');
        window.dispatchEvent(new Event("auth:login"));
  
        router.push(data.user.role === 'business_owner' ? '/partners' : (safeRedirect || '/'));

      } else if (data.otpPending) {
        const otpType = data.user.role === 'business_owner' ? 'vendor' : data.user.role;
        const nextUrl = safeRedirect
          ? `/verify-otp?email=${encodeURIComponent(data.user.email)}&type=${encodeURIComponent(otpType)}&redirect=${encodeURIComponent(safeRedirect)}`
          : `/verify-otp?email=${encodeURIComponent(data.user.email)}&type=${encodeURIComponent(otpType)}`;
        router.push(nextUrl);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <header className="w-full px-0 py-4 flex items-center justify-between bg-white md:bg-transparent absolute top-0 left-20 z-20">
        <span className="text-xl font-bold tracking-wide text-blue-900 md:text-white">
          <img
            src="/login/logo.png"
            alt="background"
            className=""
          />
        </span>
      </header>

      {/* Left Section */}
      <div className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-teal-800 text-white">
        <img
          src="/login/sideImg.png"
          alt="background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 max-w-md px-10">
          {type === 'vendor' ? (
            <>
              <h1 className="text-4xl font-bold font-poppins mb-3 leading-tight">
                WELCOME BACK TO YOUR{" "}
                <span className="text-amber-400 font-bold">STOREFRONT</span>
              </h1>
              <p className="text-sm text-gray-200 font-montserrat font-thin leading-relaxed mb-8">
                Sign in to manage your products, track orders, and grow your business on Mosaic BizHub.
              </p>

              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold font-poppins text-white">Your Business, Your Dashboard</p>
                  <div className="mt-4 h-px w-full bg-white/20" />
                </div>
                <div>
                  <p className="text-sm font-semibold font-poppins text-white">Manage Your Storefront</p>
                  <p className="text-xs font-thin font-montserrat text-gray-300 mt-1">Update listings, pricing, and inventory from a single dashboard.</p>
                  <div className="mt-4 h-px w-full bg-white/20" />
                </div>
                <div>
                  <p className="text-sm font-semibold font-poppins text-white">Track &amp; Fulfil Orders</p>
                  <p className="text-xs font-thin font-montserrat text-gray-300 mt-1">View incoming orders, manage shipments, and keep customers informed.</p>
                  <div className="mt-4 h-px w-full bg-white/20" />
                </div>
                <div>
                  <p className="text-sm font-semibold font-poppins text-white">Grow Your Reach</p>
                  <p className="text-xs font-thin font-montserrat text-gray-300 mt-1">Connect with customers who are actively looking to support businesses like yours.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold font-poppins mb-3 leading-tight">
                WELCOME BACK,{" "}
                <span className="text-amber-400 font-bold">CHANGEMAKER</span>
              </h1>
              <p className="text-sm text-gray-200 font-montserrat font-thin leading-relaxed mb-8">
                Sign in to continue shopping authentic products and supporting the businesses that matter.
              </p>

              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold font-poppins text-white">Pick Up Where You Left Off</p>
                  <p className="text-xs font-thin font-montserrat text-gray-300 mt-1">Access your cart &amp; browse right where you stopped.</p>
                  <div className="mt-4 h-px w-full bg-white/20" />
                </div>
                <div>
                  <p className="text-sm font-semibold font-poppins text-white">Track Every Order</p>
                  <p className="text-xs font-thin font-montserrat text-gray-300 mt-1">Stay updated on deliveries and revisit your purchase history anytime.</p>
                  <div className="mt-4 h-px w-full bg-white/20" />
                </div>
                <div>
                  <p className="text-sm font-semibold font-poppins text-white">Keep Making an Impact</p>
                  <p className="text-xs font-thin font-montserrat text-gray-300 mt-1">Every return visit means more support for minority-owned businesses.</p>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-md">
          <span className="inline-block mb-2 rounded-full bg-[#FFF6E0] px-2 text-[10px] font-thin font-montserrat text-[#C7A040]">
            {type?.charAt(0).toUpperCase() + type?.slice(1)}
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">SIGN IN</h2>

          <div className="flex flex-col justify-start mb-5">
            <hr className="h-[2px] w-[80px] bg-gray-700" />
            <hr className="h-[2px] w-[80px] mt-[2px] mb-4 bg-gray-700" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2 font-poppins">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-300 px-6 py-2 font-medium font-poppins focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2 font-poppins">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-gray-300 px-6 py-2 pr-10 font-medium font-poppins focus:outline-none focus:ring-2 focus:ring-blue-900"
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
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 font-montserrat font-thin">
                <input type="checkbox" className="rounded border-gray-300" />
                Keep Me Signed In
              </label>
              <Link
                href={`/forgot-password?type=${encodeURIComponent(type)}`}
                className="text-blue-900 font-medium hover:underline"
              >
                Forget Password
              </Link>
            </div>

            {successMessage && (
              <div className="p-2 text-sm text-green-700 bg-green-100 border border-green-300 rounded">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="p-2 text-sm text-red-600 bg-red-100 border border-red-300 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 text-[16px] hover:bg-blue-800 transition font-montserrat font-extralight"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="my-4" />

          <p className="mt-6 text-center underline text-[16px] text-gray-600">
            New Here?{" "}
            <a href={`/signup?type=${type}`}>
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading login page...</div>}>
      <LoginContent />
    </Suspense>
  )
}
