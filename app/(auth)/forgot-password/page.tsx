'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedType = searchParams.get('type');
  const loginType = requestedType === 'vendor' ? 'vendor' : 'customer';
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginHref = useMemo(() => `/login?type=${loginType}`, [loginType]);

  const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      let data: { success?: boolean; message?: string } | null = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (res.ok && (data?.success ?? true)) {
        setStep('reset');
        setSuccess(data?.message || 'OTP sent to your email. Enter it below to reset your password.');
        return;
      }

      setError(data?.message || 'Unable to send OTP. Please try again.');
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (otp.trim().length !== 6) {
      setLoading(false);
      setError('Please enter the 6-digit OTP.');
      return;
    }

    if (newPassword.length < 6) {
      setLoading(false);
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLoading(false);
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: otp.trim(),
          newPassword,
        }),
        credentials: 'include',
      });

      let data: { success?: boolean; message?: string } | null = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (res.ok && (data?.success ?? true)) {
        router.push(`${loginHref}&reset=success`);
        return;
      }

      setError(data?.message || 'Unable to reset password. Please try again.');
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-teal-800 text-white">
        <img
          src="/login/sideImg.png"
          alt="background"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative z-10 max-w-md px-10">
          <h1 className="mb-3 font-poppins text-4xl font-bold leading-tight">
            RESET YOUR <span className="font-bold text-amber-400">PASSWORD</span>
          </h1>
          <p className="mb-8 font-montserrat text-sm font-thin leading-relaxed text-gray-200">
            We&apos;ll send a one-time code to your email so you can securely set a new password and get back in.
          </p>

          <div className="space-y-5">
            <div>
              <p className="font-poppins text-sm font-semibold text-white">Step 1: Request OTP</p>
              <p className="mt-1 font-montserrat text-xs font-thin text-gray-300">Enter the email address linked to your account.</p>
              <div className="mt-4 h-px w-full bg-white/20" />
            </div>
            <div>
              <p className="font-poppins text-sm font-semibold text-white">Step 2: Verify &amp; Reset</p>
              <p className="mt-1 font-montserrat text-xs font-thin text-gray-300">Use the OTP from your inbox and choose a new password.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-md">
          <span className="mb-2 inline-block rounded-full bg-[#FFF6E0] px-2 font-montserrat text-[10px] font-thin text-[#C7A040]">
            {loginType.charAt(0).toUpperCase() + loginType.slice(1)}
          </span>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            {step === 'request' ? 'FORGOT PASSWORD' : 'RESET PASSWORD'}
          </h2>

          <div className="mb-5 flex flex-col justify-start">
            <hr className="h-[2px] w-[80px] bg-gray-700" />
            <hr className="mt-[2px] mb-4 h-[2px] w-[80px] bg-gray-700" />
          </div>

          {step === 'request' ? (
            <form className="space-y-4" onSubmit={handleRequestOtp}>
              <div>
                <label className="mb-2 block font-poppins text-base font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-md border border-gray-300 px-6 py-2 font-poppins font-medium focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              {error && (
                <div className="rounded border border-red-300 bg-red-100 p-2 text-sm text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded border border-green-300 bg-green-100 p-2 text-sm text-green-700">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 py-2 font-montserrat text-[16px] font-extralight text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div>
                <label className="mb-2 block font-poppins text-base font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full rounded-md border border-gray-200 bg-gray-100 px-6 py-2 font-poppins font-medium text-gray-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-poppins text-base font-medium text-gray-700">
                  OTP <span className="text-red-500">*</span>
                </label>
                <input
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full rounded-md border border-gray-300 px-6 py-2 font-poppins font-medium focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="mb-2 block font-poppins text-base font-medium text-gray-700">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full rounded-md border border-gray-300 px-6 py-2 pr-10 font-poppins font-medium focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block font-poppins text-base font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full rounded-md border border-gray-300 px-6 py-2 pr-10 font-poppins font-medium focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded border border-red-300 bg-red-100 p-2 text-sm text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded border border-green-300 bg-green-100 p-2 text-sm text-green-700">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 py-2 font-montserrat text-[16px] font-extralight text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('request');
                  setOtp('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setError('');
                  setSuccess('');
                }}
                className="w-full text-center font-poppins text-sm font-medium text-blue-900 underline"
              >
                Use a different email
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-[16px] text-gray-600 underline">
            <Link href={loginHref}>Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading forgot password page...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
