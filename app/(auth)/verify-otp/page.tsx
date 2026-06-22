'use client';
export const dynamic = 'force-dynamic';
import { toast } from 'react-toastify';

import React, { Suspense, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { logAuthRequest } from '@/utils/authDebug';
import { parseAuthJsonResponse } from '@/utils/parseAuthErrorResponse';
import {
  getAuthenticatedUser,
  isBusinessOwner,
  persistClientSession,
} from '@/utils/authUtils';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const typeParam = searchParams.get('type');
  const type = typeParam === 'business_owner' ? 'vendor' : typeParam;
  const redirect = searchParams.get('redirect');
  const safeRedirect =
    redirect && redirect.startsWith('/') && !redirect.startsWith('//')
      ? redirect
      : null;

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const joinedOtp = otp.join('');

    if (joinedOtp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    try {
      const verifyUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/verify-otp`;
      const res = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: joinedOtp }),
        credentials: 'include',
      });

      const { data, errorMessage } = await parseAuthJsonResponse<{
        success?: boolean;
        message?: string;
        user?: { gender?: string; role?: string };
      }>(res);

      logAuthRequest({
        endpoint: verifyUrl,
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
          body: sessionUser
            ? { success: true, user: { role: sessionUser.role } }
            : undefined,
        });

        if (!sessionUser) {
          setError(
            'Verification succeeded but session was not established. Try again or contact support.'
          );
          return;
        }

        persistClientSession(sessionUser);
        router.push(
          isBusinessOwner(sessionUser) ? '/partners' : (safeRedirect || '/')
        );
      } else {
        setError(errorMessage || data?.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    if (!email || !type || resendDisabled) return;

    setResendDisabled(true);
    setCountdown(30);

    try {
      const resendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/resend-otp`;
      const res = await fetch(resendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type }),
        credentials: 'include',
      });

      const { data, errorMessage } = await parseAuthJsonResponse<{
        success?: boolean;
        message?: string;
      }>(res);

      logAuthRequest({
        endpoint: resendUrl,
        method: 'POST',
        status: res.status,
        credentialsIncluded: true,
        body: data ?? undefined,
      });

      if (data?.success) {
        toast.success('OTP resent successfully!');
      } else {
        toast.error(errorMessage || data?.message || 'Failed to resend OTP');
      }
    } catch {
      toast.error('Error while resending OTP');
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const typeLabel =
    type === 'vendor' ? 'Vendor' : type === 'customer' ? 'Customer' : 'Account';

  const hero = (
    <>
      <h1 className="mb-3 font-poppins text-4xl font-bold leading-tight">
        VERIFY YOUR <span className="font-bold text-brand-gold">ACCOUNT</span>
      </h1>
      <p className="font-montserrat text-sm font-light leading-relaxed text-white/80">
        Enter the one-time code we sent to your email to finish signing in securely.
      </p>
    </>
  );

  return (
    <AuthPageShell typeLabel={typeLabel} title="VERIFY OTP" hero={hero}>
      {email ? (
        <p className="mb-4 text-sm text-brand-muted">
          Enter the OTP sent to <span className="font-semibold text-brand-navy">{email}</span>
        </p>
      ) : null}

      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex justify-between gap-2">
          {[...Array(6)].map((_, idx) => (
            <Input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              surface="auth"
              className="h-12 w-12 px-0 text-center text-xl"
              value={otp[idx] || ''}
              onChange={(e) => handleOtpChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => {
                if (el) inputRefs.current[idx] = el;
              }}
            />
          ))}
        </div>

        {error ? (
          <p className="mb-4 text-sm text-dashboard-warn-text">{error}</p>
        ) : null}

        <Button type="submit" className="w-full normal-case">
          Verify OTP
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-brand-muted">
        Didn&apos;t receive the code?{' '}
        {resendDisabled ? (
          <span className="font-semibold text-brand-muted">Resend in {countdown}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            className="font-semibold text-brand-navy-light underline hover:text-brand-navy"
          >
            Resend OTP
          </button>
        )}
      </p>

      <p className="mt-6 text-center text-sm text-brand-muted">
        <Link href="/" className="text-brand-navy-light underline">
          Back to home
        </Link>
      </p>
    </AuthPageShell>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading verification page...</div>}>
      <VerifyOtpPage />
    </Suspense>
  );
}
