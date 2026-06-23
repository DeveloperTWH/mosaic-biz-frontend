'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { FormField } from '@/components/ui/form-field';
import { FormAlert } from '@/components/ui/form-alert';
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
        <form className="auth-form-stack" onSubmit={handleRequestOtp}>
          <FormField
            label="Email"
            htmlFor="email"
            required
            surface="auth"
            helperText="We'll send a one-time code to this address."
          >
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              surface="auth"
            />
          </FormField>

          {error ? <FormAlert variant="error">{error}</FormAlert> : null}
          {success ? <FormAlert variant="success">{success}</FormAlert> : null}

          <div className="auth-form-actions">
            <Button type="submit" size="lg" className="w-full normal-case" disabled={loading}>
              {loading ? 'Sending code…' : 'Send verification code'}
            </Button>
          </div>
        </form>
      ) : (
        <form className="auth-form-stack" onSubmit={handleResetPassword}>
          <FormField label="Email" surface="auth">
            <Input type="email" value={email} readOnly surface="auth" className="bg-surface-panel text-brand-muted" />
          </FormField>

          <FormField
            label="Verification code"
            htmlFor="otp"
            required
            surface="auth"
            helperText="Enter the 6-digit code from your email."
          >
            <Input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              surface="auth"
              className="tracking-[0.3em]"
            />
          </FormField>

          <FormField
            label="New password"
            htmlFor="newPassword"
            required
            surface="auth"
            helperText="At least 6 characters with letters and numbers."
          >
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create a new password"
                surface="auth"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex min-h-11 min-w-11 items-center justify-center text-brand-muted hover:text-brand-navy"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm password" htmlFor="confirmPassword" required surface="auth">
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                surface="auth"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex min-h-11 min-w-11 items-center justify-center text-brand-muted hover:text-brand-navy"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </FormField>

          {error ? <FormAlert variant="error">{error}</FormAlert> : null}
          {success ? <FormAlert variant="info">{success}</FormAlert> : null}

          <div className="auth-form-actions">
            <Button type="submit" size="lg" className="w-full normal-case" disabled={loading}>
              {loading ? 'Resetting password…' : 'Reset password'}
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
              className="min-h-11 text-center font-poppins text-sm font-medium text-brand-navy-light underline"
            >
              Use a different email
            </button>
          </div>
        </form>
      )}

      <p className="auth-path-switch mt-6">
        <Link href={loginHref}>Back to sign in</Link>
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
