'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Lock } from 'lucide-react';
import { FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  submitStage1,
  VendorSubmissionError,
  waitForStage1PaymentConfirmation,
} from '@/lib/api/vendorOnboarding';
import VendorApplicationShell from '../../components/VendorApplicationShell';
import VendorOnboardingStatusPanel from '../../components/VendorOnboardingStatusPanel';
import { Button } from '@/components/ui/button';

type PostPaymentPhase = 'idle' | 'confirming' | 'submitting' | 'pending' | 'success';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const REGISTRATION_FEATURES = [
  'Vendor registration application',
  'Business verification',
  'Document verification',
  'Account setup',
  'Priority processing',
  'Email support',
  'Profile creation',
  'Listing access',
] as const;

function FeatureCheckIcon() {
  return (
    <span
      className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-brand-gold"
      aria-hidden
    >
      <CheckCircle className="h-3 w-3 text-white" />
    </span>
  );
}

function VendorPaymentForm({
  onPaymentSucceeded,
  onError,
  disabled,
}: {
  onPaymentSucceeded: () => Promise<void>;
  onError: (error: string) => void;
  disabled?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !isPaymentElementReady) {
      if (!isPaymentElementReady) {
        onError('Payment form is still loading. Please wait a moment and try again.');
      }
      return;
    }

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();

      if (submitError) {
        onError(submitError.message || 'Please check your payment details and try again.');
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/partners`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        await onPaymentSucceeded();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <PaymentElement onReady={() => setIsPaymentElementReady(true)} />
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing || !isPaymentElementReady || disabled}
        className="w-full normal-case"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Processing…
          </>
        ) : (
          'Pay Application Fee'
        )}
      </Button>
    </form>
  );
}

function PaymentStatusPanel({
  postPaymentPhase,
  success,
  isRetrying,
  onRetry,
  onGoBack,
}: {
  postPaymentPhase: PostPaymentPhase;
  success: boolean;
  isRetrying: boolean;
  onRetry: () => void;
  onGoBack: () => void;
}) {
  if (success || postPaymentPhase === 'success') {
    return (
      <VendorOnboardingStatusPanel
        variant="success"
        title="Payment successful"
        description="Your application has been submitted. Redirecting to your partner hub…"
        compact
      />
    );
  }

  if (postPaymentPhase === 'confirming') {
    return (
      <VendorOnboardingStatusPanel
        variant="processing"
        title="Confirming payment with Mosaic…"
        description="Please wait while we verify your payment."
        compact
      />
    );
  }

  if (postPaymentPhase === 'submitting') {
    return (
      <VendorOnboardingStatusPanel
        variant="processing"
        title="Submitting your application…"
        description="Almost done. This should only take a moment."
        compact
      />
    );
  }

  if (postPaymentPhase === 'pending') {
    return (
      <VendorOnboardingStatusPanel
        variant="pending"
        title="Payment received"
        description="We are still confirming your application. Retry below or return to the partner hub if this does not update shortly."
        primaryAction={{
          label: isRetrying ? 'Checking confirmation…' : 'Retry confirmation',
          onClick: onRetry,
          disabled: isRetrying,
          loading: isRetrying,
        }}
        secondaryAction={{
          label: 'Back to partners hub',
          onClick: onGoBack,
          variant: 'outline',
        }}
      />
    );
  }

  return null;
}

function VendorBusinessPaymentContent() {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [postPaymentPhase, setPostPaymentPhase] = useState<PostPaymentPhase>('idle');
  const [isRetrying, setIsRetrying] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(99);

  useEffect(() => {
    const loadPaymentData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const paymentDataStr = sessionStorage.getItem('vendorRegistrationPayment');

        if (!paymentDataStr) {
          setError('No payment data found. Please restart the registration process.');
          return;
        }

        const paymentData = JSON.parse(paymentDataStr);

        if (!paymentData.clientSecret) {
          setError('Invalid payment data format');
          return;
        }

        setClientSecret(paymentData.clientSecret);
        setPaymentAmount(paymentData.amount || 99);
      } catch (err) {
        console.error('Error loading payment data:', err);
        setError('Failed to load payment details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentData();
  }, []);

  const handlePaymentSuccess = () => {
    setSuccess(true);
    setPostPaymentPhase('success');
    sessionStorage.removeItem('vendorRegistrationPayment');

    setTimeout(() => {
      router.push('/partners');
    }, 2000);
  };

  const confirmAndSubmitApplication = async () => {
    setPostPaymentPhase('confirming');
    setPaymentError(null);

    try {
      const ready = await waitForStage1PaymentConfirmation();
      if (!ready) {
        setPostPaymentPhase('pending');
        return;
      }

      setPostPaymentPhase('submitting');
      await submitStage1();
      handlePaymentSuccess();
    } catch (err) {
      if (err instanceof VendorSubmissionError && err.status === 402) {
        setPostPaymentPhase('pending');
        return;
      }

      console.error('Submission error:', err);
      setPostPaymentPhase('pending');
    }
  };

  const handlePaymentSucceeded = async () => {
    await confirmAndSubmitApplication();
  };

  const handleRetryConfirmation = async () => {
    if (isRetrying || postPaymentPhase === 'confirming' || postPaymentPhase === 'submitting') {
      return;
    }

    setIsRetrying(true);
    try {
      await confirmAndSubmitApplication();
    } finally {
      setIsRetrying(false);
    }
  };

  const handleGoBack = () => {
    router.push('/partners');
  };

  const showPaymentForm = postPaymentPhase === 'idle' && !success;
  const statusPanelVisible = success || postPaymentPhase !== 'idle';

  if (isLoading) {
    return (
      <VendorApplicationShell
        variant="market"
        eyebrow="Business Owner"
        title="Vendor Registration Payment"
        description="Complete your registration by paying the application fee"
        backHref="/partners/business/new"
        backLabel="Back to Registration Form"
      >
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-brand-gold" aria-hidden />
          <p className="text-sm text-market-muted">Loading payment details…</p>
        </div>
      </VendorApplicationShell>
    );
  }

  if (error) {
    return (
      <VendorApplicationShell
        variant="market"
        eyebrow="Business Owner"
        title="Vendor Registration Payment"
        backHref="/partners/business/new"
        backLabel="Back to Registration Form"
      >
        <VendorOnboardingStatusPanel
          variant="error"
          title="Unable to load payment"
          description={error}
          primaryAction={{
            label: 'Back to Registration',
            onClick: handleGoBack,
          }}
        />
      </VendorApplicationShell>
    );
  }

  if (!clientSecret) {
    return (
      <VendorApplicationShell
        variant="market"
        eyebrow="Business Owner"
        title="Vendor Registration Payment"
        backHref="/partners/business/new"
        backLabel="Back to Registration Form"
      >
        <VendorOnboardingStatusPanel
          variant="error"
          title="No payment data found"
          description="Return to the registration form and proceed to payment again."
          primaryAction={{
            label: 'Back to Registration',
            onClick: handleGoBack,
          }}
        />
      </VendorApplicationShell>
    );
  }

  return (
    <VendorApplicationShell
      variant="market"
      eyebrow="Business Owner"
      title="Vendor Registration Payment"
      description="Complete your registration by paying the application fee"
      backHref="/partners/business/new"
      backLabel="Back to Registration Form"
      maxWidthClass="max-w-5xl"
    >
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section className="market-surface-light rounded-2xl border border-white/10 p-6 shadow-market-card">
          <h2 className="mb-4 font-poppins text-lg font-semibold text-brand-navy">
            Registration Summary
          </h2>

          <div className="mb-6">
            <h3 className="font-poppins text-2xl font-bold text-brand-navy-light">
              Stage 1 Registration
            </h3>
            <p className="text-sm text-brand-muted">Vendor onboarding application</p>
          </div>

          <ul className="mb-6 space-y-3 border-t border-gray-200 pt-6">
            {REGISTRATION_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-brand-navy">
                <FeatureCheckIcon />
                {feature}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between rounded-lg bg-brand-cream px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-brand-navy">Application Fee</p>
              <p className="text-xs text-brand-muted">One-time payment</p>
            </div>
            <p className="font-poppins text-3xl font-bold text-brand-navy-light">
              ${paymentAmount}
              <span className="text-base font-normal text-brand-muted">.00</span>
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">Important</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-900">
              After successful payment, your application will be submitted for admin review.
              You will receive an email confirmation within 24–48 hours.
            </p>
          </div>
        </section>

        <section className="market-surface-light rounded-2xl border border-white/10 p-6 shadow-market-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-poppins text-lg font-semibold text-brand-navy">Secure Payment</h2>
            <Lock className="h-4 w-4 text-brand-muted" aria-hidden />
          </div>

          {statusPanelVisible ? (
            <PaymentStatusPanel
              postPaymentPhase={postPaymentPhase}
              success={success}
              isRetrying={isRetrying}
              onRetry={handleRetryConfirmation}
              onGoBack={handleGoBack}
            />
          ) : null}

          {showPaymentForm ? (
            <>
              <Elements
                key={clientSecret}
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#C9A962',
                      colorBackground: '#ffffff',
                      colorText: '#111827',
                      colorDanger: '#ef4444',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      spacingUnit: '4px',
                      borderRadius: '6px',
                    },
                  },
                }}
              >
                <VendorPaymentForm
                  onPaymentSucceeded={handlePaymentSucceeded}
                  onError={(message) => setPaymentError(message)}
                  disabled={postPaymentPhase !== 'idle'}
                />
              </Elements>

              <div className="mt-4 flex items-center justify-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
                <span className="text-xs text-brand-muted">We accept:</span>
                <FaCcVisa size={36} aria-hidden />
                <FaCcMastercard size={36} aria-hidden />
                <FaCcAmex size={36} aria-hidden />
              </div>
            </>
          ) : null}

          {paymentError && showPaymentForm ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-center text-sm text-red-700">{paymentError}</p>
            </div>
          ) : null}
        </section>
      </div>

      <p className="mt-8 text-center text-xs text-market-muted">
        Having trouble? Contact our support team at{' '}
        <a href="mailto:support@mosaicbizhub.com" className="text-brand-gold hover:underline">
          support@mosaicbizhub.com
        </a>
      </p>
    </VendorApplicationShell>
  );
}

function PaymentPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-cream">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-brand-gold" aria-hidden />
        <p className="text-sm text-dashboard-muted">Loading payment page…</p>
      </div>
    </div>
  );
}

export default function VendorBusinessPaymentPage() {
  return (
    <Suspense fallback={<PaymentPageFallback />}>
      <VendorBusinessPaymentContent />
    </Suspense>
  );
}
