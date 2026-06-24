'use client';
export const dynamic = 'force-dynamic';
import { toast } from 'react-toastify';

import React, { Suspense, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { logAuthRequest } from '@/utils/authDebug';
import { parseAuthJsonResponse } from '@/utils/parseAuthErrorResponse';
import {
  AUTH_NETWORK_ERROR_MESSAGE,
  AUTH_VERIFICATION_NOT_ESTABLISHED_MESSAGE,
  isBusinessOwner,
  persistClientSession,
} from '@/utils/authUtils';
import { confirmPostLoginSession } from '@/lib/api/authSession';
import { buildApiUrl } from '@/lib/api/httpClient';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormAlert } from '@/components/ui/form-alert';

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
  const [loading, setLoading] = useState(false);
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
      setError('Please enter the full 6-digit code.');
      return;
    }

    setLoading(true);

    try {
      const verifyUrl = buildApiUrl('/api/users/verify-otp');
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
        const sessionResult = await confirmPostLoginSession();
        const sessionCheckUrl = buildApiUrl('/api/users/auth/check');

        logAuthRequest({
          endpoint: sessionCheckUrl,
          method: 'GET',
          status: sessionResult.kind === 'unauthenticated' ? 401 : 200,
          credentialsIncluded: true,
          body:
            sessionResult.kind === 'authenticated'
              ? { success: true, user: { role: sessionResult.user.role } }
              : sessionResult.kind === 'error'
                ? { outcome: sessionResult.kind, errorKind: sessionResult.error.kind }
                : { outcome: sessionResult.kind },
        });

        if (sessionResult.kind === 'unauthenticated') {
          setError(AUTH_VERIFICATION_NOT_ESTABLISHED_MESSAGE);
          return;
        }

        if (sessionResult.kind === 'error') {
          switch (sessionResult.error.kind) {
            case 'network':
            case 'timeout':
              setError(AUTH_NETWORK_ERROR_MESSAGE);
              break;
            default:
              setError(AUTH_VERIFICATION_NOT_ESTABLISHED_MESSAGE);
          }
          return;
        }

        persistClientSession(sessionResult.user);
        router.push(
          isBusinessOwner(sessionResult.user) ? '/partners' : (safeRedirect || '/')
        );
      } else {
        setError(errorMessage || data?.message || 'Invalid code. Please try again.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || !type || resendDisabled) return;

    setResendDisabled(true);
    setCountdown(30);

    try {
      const resendUrl = buildApiUrl('/api/users/resend-otp');
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
        toast.success('A new code has been sent to your email.');
      } else {
        toast.error(errorMessage || data?.message || 'Failed to resend code');
      }
    } catch {
      toast.error('Error while resending code');
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
    <AuthPageShell typeLabel={typeLabel} title="VERIFY CODE" hero={hero}>
      {email ? (
        <p className="mb-1 font-montserrat text-sm text-brand-muted">
          Code sent to{' '}
          <span className="font-semibold text-brand-navy">{email}</span>
        </p>
      ) : null}
      <p className="mb-5 font-montserrat text-xs text-brand-muted">
        Check your inbox and spam folder. The code expires shortly.
      </p>

      <form className="auth-form-stack" onSubmit={handleSubmit}>
        <div>
          <p className="mb-2 font-poppins text-sm font-medium text-brand-navy">
            Verification code <span className="text-red-500">*</span>
          </p>
          <div className="flex justify-between gap-2" role="group" aria-label="6-digit verification code">
            {[...Array(6)].map((_, idx) => (
              <Input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                surface="auth"
                className="auth-otp-input"
                value={otp[idx] || ''}
                onChange={(e) => handleOtpChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                aria-label={`Digit ${idx + 1} of 6`}
                ref={(el) => {
                  if (el) inputRefs.current[idx] = el;
                }}
              />
            ))}
          </div>
        </div>

        {error ? <FormAlert variant="error">{error}</FormAlert> : null}

        <div className="auth-form-actions">
          <Button type="submit" size="lg" className="w-full normal-case" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify and continue'}
          </Button>
        </div>
      </form>

      <p className="mt-5 text-center font-montserrat text-sm text-brand-muted">
        Didn&apos;t receive the code?{' '}
        {resendDisabled ? (
          <span className="font-semibold text-brand-muted">Resend in {countdown}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            className="min-h-11 font-semibold text-brand-navy-light underline hover:text-brand-navy"
          >
            Resend code
          </button>
        )}
      </p>

      <p className="auth-path-switch mt-6">
        <Link href="/">Back to home</Link>
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
