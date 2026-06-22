'use client'
export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react';
import { logAuthRequest } from '@/utils/authDebug';
import { parseAuthJsonResponse } from '@/utils/parseAuthErrorResponse';
import {
  getAuthenticatedUser,
  isBusinessOwner,
  persistClientSession,
} from '@/utils/authUtils';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type');
  const redirect = searchParams.get('redirect');
  const resetStatus = searchParams.get('reset');
  const isValidType = type === 'vendor' || type === 'customer';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const successMessage =
    resetStatus === 'success'
      ? 'Password reset successful. Please sign in with your new password.'
      : '';

  const role = type === 'vendor' ? 'business_owner' : 'customer';
  const safeRedirect =
    redirect && redirect.startsWith('/') && !redirect.startsWith('//')
      ? redirect
      : null;

  const handleGoogleLoginRedirect = () => {
    const returnTo =
      typeof window !== 'undefined' ? window.location.origin : '';
    const url =
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google` +
      `?role=${encodeURIComponent(role)}` +
      `&redirect=${encodeURIComponent(returnTo)}`;
    window.location.href = url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/login`;
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: type === 'vendor' ? 'business_owner' : 'customer',
        }),
        credentials: 'include'
      });

      const { data, errorMessage } = await parseAuthJsonResponse<{
        success?: boolean;
        otpPending?: boolean;
        message?: string;
        user?: { gender?: string; role?: string; email?: string };
      }>(res);

      logAuthRequest({
        endpoint: loginUrl,
        method: 'POST',
        status: res.status,
        credentialsIncluded: true,
        body: data ?? undefined,
      });

      if (data?.success && data.user) {
        const sessionUser = await getAuthenticatedUser();

        logAuthRequest({
          endpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/auth/check`,
          method: 'GET',
          status: sessionUser ? 200 : 401,
          credentialsIncluded: true,
          body: sessionUser ? { success: true, user: { role: sessionUser.role } } : undefined,
        });

        if (!sessionUser) {
          setError(
            'Sign-in succeeded but session was not established. Try again or contact support.'
          );
          return;
        }

        persistClientSession(sessionUser);
        router.push(
          isBusinessOwner(sessionUser) ? '/partners' : (safeRedirect || '/')
        );
      } else if (data?.otpPending && data.user?.email) {
        const otpType = data.user.role === 'business_owner' ? 'vendor' : data.user.role;
        const nextUrl = safeRedirect
          ? `/verify-otp?email=${encodeURIComponent(data.user.email)}&type=${encodeURIComponent(otpType || 'customer')}&redirect=${encodeURIComponent(safeRedirect)}`
          : `/verify-otp?email=${encodeURIComponent(data.user.email)}&type=${encodeURIComponent(otpType || 'customer')}`;
        router.push(nextUrl);
      } else {
        setError(errorMessage || data?.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isValidType) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-cream">
        <div className="rounded-lg bg-white p-8 text-center shadow-glass">
          <p className="font-semibold text-dashboard-warn-text">Invalid login type.</p>
        </div>
      </div>
    );
  }

  const typeLabel = type === 'vendor' ? 'Vendor' : 'Customer';
  const hero =
    type === 'vendor' ? (
      <>
        <h1 className="mb-3 font-poppins text-4xl font-bold leading-tight">
          WELCOME BACK TO YOUR{" "}
          <span className="font-bold text-brand-gold">STOREFRONT</span>
        </h1>
        <p className="mb-8 font-montserrat text-sm font-light leading-relaxed text-white/80">
          Sign in to manage your products, track orders, and grow your business on Mosaic BizHub.
        </p>
        <div className="space-y-5 text-sm">
          <div>
            <p className="font-semibold font-poppins text-white">Your Business, Your Dashboard</p>
            <div className="mt-4 h-px w-full bg-white/20" />
          </div>
          <div>
            <p className="font-semibold font-poppins text-white">Manage Your Storefront</p>
            <p className="mt-1 font-montserrat text-xs font-light text-white/70">
              Update listings, pricing, and inventory from a single dashboard.
            </p>
          </div>
        </div>
      </>
    ) : (
      <>
        <h1 className="mb-3 font-poppins text-4xl font-bold leading-tight">
          WELCOME BACK,{" "}
          <span className="font-bold text-brand-gold">CHANGEMAKER</span>
        </h1>
        <p className="mb-8 font-montserrat text-sm font-light leading-relaxed text-white/80">
          Sign in to continue shopping authentic products and supporting the businesses that matter.
        </p>
      </>
    );

  return (
    <AuthPageShell typeLabel={typeLabel} title="SIGN IN" hero={hero}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Email" htmlFor="email" required surface="auth">
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            surface="auth"
          />
        </FormField>

        <FormField label="Password" htmlFor="password" required surface="auth">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              surface="auth"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-brand-muted hover:text-brand-navy"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 font-montserrat font-light text-brand-muted">
            <input type="checkbox" className="rounded border-dashboard-input-border" />
            Keep Me Signed In
          </label>
          <Link
            href={`/forgot-password?type=${encodeURIComponent(type)}`}
            className="font-medium text-brand-navy-light hover:underline"
          >
            Forget Password
          </Link>
        </div>

        {successMessage ? (
          <div className="rounded border border-green-300 bg-green-50 p-2 text-sm text-green-800">
            {successMessage}
          </div>
        ) : null}

        {error ? (
          <div className="rounded border border-dashboard-warn-border bg-dashboard-warn-bg p-2 text-sm text-dashboard-warn-text">
            {error}
          </div>
        ) : null}

        <Button type="submit" className="w-full normal-case" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <p className="mt-6 text-center text-base text-brand-muted underline">
        New Here?{" "}
        <Link href={`/signup?type=${type}`} className="text-brand-navy-light">
          Create Account
        </Link>
      </p>
    </AuthPageShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading login page...</div>}>
      <LoginContent />
    </Suspense>
  )
}
