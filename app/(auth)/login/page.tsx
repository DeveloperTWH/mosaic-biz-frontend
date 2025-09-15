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

  const searchParams = useSearchParams()
  const pathname = usePathname()

  const type = searchParams.get('type')
  const isValidType = type === 'vendor' || type === 'customer'

  const role = type === 'vendor' ? 'business_owner' : 'customer';

  const handleGoogleLoginRedirect = () => {
    const returnTo =
      typeof window !== 'undefined' ? window.location.origin : '';
    const url =
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google` +
      `?role=${encodeURIComponent(role)}` +
      `&redirect=${encodeURIComponent(returnTo)}`;
    window.location.href = url; // full-page redirect
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
        router.push(data.user.role === 'business_owner' ? '/partners' : '/');
      } else if (data.otpPending) {
        router.push(`/verify-otp?email=${data.user.email}&type=${data.user.role}`);
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
    <div className="min-h-screen bg-black flex items-center justify-center bg-[url('/login/footer-bg.jpg')] bg-cover bg-center relative p-1 py-10">
      <div className="fixed z-50 p-2 text-white bg-gray-700 rounded-lg cursor-pointer top-4 right-4" onClick={() => router.push("/")}>
        <X size={20} />
      </div>

      <div className="z-10 w-full max-w-md p-8 bg-white shadow-xl rounded-xl">
        <Link href="/">
          <div className="mb-6 text-center">
            <Image src="/logo.png" alt="Logo" width={350} height={100} className="mx-auto" />
          </div>
        </Link>

        <div className="mb-4 text-lg font-bold text-center">{title}</div>

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

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />

          <label className="block mb-2 text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 pr-10 mb-2 border rounded"
              autoCapitalize="none"
              autoComplete="new-password"
              spellCheck="false"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 flex items-center text-gray-500 right-2"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-end mb-4 text-sm">
            {/* <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Keep Me Signed In
            </label> */}
            <a href="#" className="font-medium text-blue-500">Forget Password ?</a>
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#10A3C9] text-white w-full py-2 font-semibold disabled:opacity-60"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>


        <div className="flex justify-center mt-4 space-x-4">
          {/* <button
            type="button"
            onClick={handleGoogleLoginRedirect}
            className="w-10 h-10 text-black bg-gray-200 rounded-full"
            aria-label="Continue with Google"
            title="Continue with Google"
          >
            G
          </button> */}
        </div>

        <p className="mt-4 text-sm text-center">
          New {type}?{' '}
          <Link href={`/signup?type=${type}`} className="font-bold underline">
            Create Account
          </Link>
        </p>
      </div>

      <footer className="absolute w-full text-sm text-yellow-500 bottom-2">
        <div className="pr-5 w-[80%] mx-auto">
          <p>Copyright 2025. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading login page...</div>}>
      <LoginContent />
    </Suspense>
  )
}
