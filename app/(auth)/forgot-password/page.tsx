'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

  const hero = (
    <>
      <h1 className="mb-3 font-poppins text-4xl font-bold leading-tight">
        RESET YOUR <span className="font-bold text-brand-gold">PASSWORD</span>
      </h1>
      <p className="mb-8 font-montserrat text-sm font-light leading-relaxed text-white/80">
        We&apos;ll send a one-time code to your email so you can securely set a new password and get back in.
      </p>
      <div className="space-y-5 text-sm">
        <div>
          <p className="font-poppins font-semibold text-white">Step 1: Request OTP</p>
          <p className="mt-1 font-montserrat text-xs font-light text-white/70">
            Enter the email address linked to your account.
          </p>
        </div>
        <div>
          <p className="font-poppins font-semibold text-white">Step 2: Verify &amp; Reset</p>
          <p className="mt-1 font-montserrat text-xs font-light text-white/70">
            Use the OTP from your inbox and choose a new password.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <AuthPageShell
      typeLabel={loginType.charAt(0).toUpperCase() + loginType.slice(1)}
      title={step === 'request' ? 'FORGOT PASSWORD' : 'RESET PASSWORD'}
      hero={hero}
    >
      {step === 'request' ? (
        <form className="space-y-4" onSubmit={handleRequestOtp}>
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

          {error ? (
            <div className="rounded border border-dashboard-warn-border bg-dashboard-warn-bg p-2 text-sm text-dashboard-warn-text">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded border border-green-300 bg-green-50 p-2 text-sm text-green-800">
              {success}
            </div>
          ) : null}

          <Button type="submit" className="w-full normal-case" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleResetPassword}>
          <FormField label="Email" surface="auth">
            <Input type="email" value={email} readOnly surface="auth" className="bg-surface-panel text-brand-muted" />
          </FormField>

          <FormField label="OTP" htmlFor="otp" required surface="auth">
            <Input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit OTP"
              surface="auth"
            />
          </FormField>

          <FormField label="New Password" htmlFor="newPassword" required surface="auth">
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                surface="auth"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-brand-muted hover:text-brand-navy"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm Password" htmlFor="confirmPassword" required surface="auth">
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                surface="auth"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-brand-muted hover:text-brand-navy"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </FormField>

          {error ? (
            <div className="rounded border border-dashboard-warn-border bg-dashboard-warn-bg p-2 text-sm text-dashboard-warn-text">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded border border-green-300 bg-green-50 p-2 text-sm text-green-800">
              {success}
            </div>
          ) : null}

          <Button type="submit" className="w-full normal-case" disabled={loading}>
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>

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
            className="w-full text-center font-poppins text-sm font-medium text-brand-navy-light underline"
          >
            Use a different email
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-base text-brand-muted underline">
        <Link href={loginHref}>Back to Sign In</Link>
      </p>
    </AuthPageShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading forgot password page...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
