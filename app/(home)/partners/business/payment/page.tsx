
'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AlertCircle, Loader, CheckCircle, Lock, ArrowLeft } from 'lucide-react';
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  submitStage1,
  VendorSubmissionError,
  waitForStage1PaymentConfirmation,
} from '@/lib/api/vendorOnboarding';

type PostPaymentPhase = 'idle' | 'confirming' | 'submitting' | 'pending' | 'success';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Spinner component
const Spinner = () => (
  <svg 
    style={{ animation: 'spin 1s linear infinite', height: '1rem', width: '1rem' }} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Check icon
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="8" fill="#C9A962"/>
    <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Payment Form Component
function VendorPaymentForm({ 
  onPaymentSucceeded, 
  onError 
}: { 
  onPaymentSucceeded: () => Promise<void>;
  onError: (error: string) => void;
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
    } catch (err: any) {
      onError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1.5rem' }}>
        <PaymentElement onReady={() => setIsPaymentElementReady(true)} />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || isProcessing || !isPaymentElementReady}
        style={{
          width: '100%',
          padding: '0.875rem',
          backgroundColor: '#C9A962',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          opacity: isProcessing ? 0.7 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s'
        }}
      >
        {isProcessing && <Spinner />}
        {isProcessing ? 'Processing...' : 'Pay Application Fee'}
      </button>
    </form>
  );
}

// Main content component that uses useSearchParams
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
    // Add spin animation
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('spin-animation');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'spin-animation';
        style.textContent = `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

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

  const showPaymentForm =
    postPaymentPhase === 'idle' && !success;

  const features = [
    'Vendor registration application',
    'Business verification',
    'Document verification',
    'Account setup',
    'Priority processing',
    'Email support',
    'Profile creation',
    'Listing access'
  ];

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader style={{ width: '2rem', height: '2rem', color: '#1e3a8a', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#6b7280' }}>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
          <AlertCircle style={{ width: '3rem', height: '3rem', color: '#ef4444', margin: '0 auto 1rem' }} />
          <p style={{ textAlign: 'center', color: '#374151', marginBottom: '1.5rem' }}>{error}</p>
          <button 
            onClick={handleGoBack}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#C9A962',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Back to Registration
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>No payment data found</p>
          <button 
            onClick={handleGoBack}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#C9A962',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={handleGoBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6b7280',
              background: 'none',
              border: 'none',
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <ArrowLeft size={16} />
            Back to Registration Form
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ 
            display: 'inline-block', 
            padding: '0.5rem 1rem', 
            backgroundColor: '#c9a227', 
            color: 'white', 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            borderRadius: '9999px', 
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Business Owner
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
            Vendor Registration Payment
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Complete your registration by paying the application fee
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '1.5rem', 
          alignItems: 'flex-start' 
        }}>
          
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            height: 'fit-content'
          }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', marginBottom: '1.5rem' }}>
              Registration Summary
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '0.25rem' }}>
                Stage 1 Registration
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Vendor Onboarding Application</p>
            </div>

            <div style={{ 
              borderTop: '1px solid #e5e7eb', 
              paddingTop: '1.5rem', 
              marginBottom: '1.5rem' 
            }}>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.75rem' 
              }}>
                {features.map((feature, index) => (
                  <li key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    fontSize: '0.875rem', 
                    color: '#374151' 
                  }}>
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ 
              backgroundColor: '#fefce8', 
              borderRadius: '0.5rem', 
              padding: '1rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Application Fee</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>One-time payment</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1e3a5f' }}>${paymentAmount}</span>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>.00</span>
              </div>
            </div>

            <div style={{ 
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#fff7ed',
              borderRadius: '0.5rem',
              border: '1px solid #fed7aa'
            }}>
              <p style={{ 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                color: '#9a3412', 
                marginBottom: '0.5rem' 
              }}>
                ⚠️ Important
              </p>
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#9a3412'
              }}>
                After successful payment, your application will be submitted for admin review. 
                You will receive an email confirmation within 24-48 hours.
              </p>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            height: 'fit-content'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '1.5rem' 
            }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151' }}>
                Secure Payment
              </h2>
              <Lock size={16} style={{ color: '#9ca3af' }} />
            </div>
            
            {success ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  backgroundColor: '#22c55e', 
                  borderRadius: '9999px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
                  Payment Successful!
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Your application has been submitted successfully.
                </p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '1rem' }}>
                  Redirecting to success page...
                </p>
              </div>
            ) : postPaymentPhase === 'confirming' ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Loader style={{ width: '2rem', height: '2rem', color: '#C9A962', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
                  Confirming payment with Mosaic…
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Please wait while we verify your payment.
                </p>
              </div>
            ) : postPaymentPhase === 'submitting' ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Loader style={{ width: '2rem', height: '2rem', color: '#C9A962', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
                  Submitting your application…
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Almost done. This should only take a moment.
                </p>
              </div>
            ) : postPaymentPhase === 'pending' ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: '#fef3c7',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <Loader style={{ width: '1.5rem', height: '1.5rem', color: '#d97706', animation: 'spin 1s linear infinite' }} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#92400e', marginBottom: '0.75rem' }}>
                  Payment received
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#78350f', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  We are still confirming your application. Please refresh or contact support if this does not update shortly.
                </p>
                <button
                  onClick={handleRetryConfirmation}
                  disabled={isRetrying}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    backgroundColor: '#C9A962',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: isRetrying ? 'not-allowed' : 'pointer',
                    opacity: isRetrying ? 0.7 : 1,
                    marginBottom: '0.75rem',
                  }}
                >
                  {isRetrying ? 'Checking confirmation…' : 'Retry confirmation'}
                </button>
                <button
                  onClick={handleGoBack}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Back to partners hub
                </button>
              </div>
            ) : showPaymentForm ? (
              <>
                <Elements 
                  key={clientSecret}
                  stripe={stripePromise} 
                  options={{
                    clientSecret: clientSecret,
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
                  />
                </Elements>

                <div style={{ 
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.375rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem'
                }}>
<span style={{ fontSize: '0.75rem', color: '#6b7280' }}>We accept:</span>

<FaCcVisa size={40} />
<FaCcMastercard size={40} />
<FaCcAmex size={40} />
                </div>

                <div style={{ 
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                </div>
              </>
            ) : null}

            {paymentError && showPaymentForm && (
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: '#fef2f2', 
                borderRadius: '0.375rem', 
                marginTop: '1rem' 
              }}>
                <p style={{ fontSize: '0.875rem', color: '#dc2626', textAlign: 'center' }}>
                  {paymentError}
                </p>
              </div>
            )}
          </div>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          padding: '1rem',
          color: '#6b7280',
          fontSize: '0.75rem'
        }}>
          <p>
            Having trouble? Contact our support team at{' '}
            <a href="mailto:support@example.com" style={{ color: '#C9A962', textDecoration: 'none' }}>
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function VendorBusinessPaymentPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader style={{ width: '2rem', height: '2rem', color: '#1e3a8a', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#6b7280' }}>Loading payment page...</p>
        </div>
      </div>
    }>
      <VendorBusinessPaymentContent />
    </Suspense>
  );
}


// 'use client';

// import { useState, useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { AlertCircle, Loader, CheckCircle, Lock, ArrowLeft } from 'lucide-react';
// import Link from 'next/link';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { submitStage1 } from '@/lib/api/vendorOnboarding'; // Import submit API

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// // Spinner component
// const Spinner = () => (
//   <svg 
//     style={{ animation: 'spin 1s linear infinite', height: '1rem', width: '1rem' }} 
//     xmlns="http://www.w3.org/2000/svg" 
//     fill="none" 
//     viewBox="0 0 24 24"
//   >
//     <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//     <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//   </svg>
// );

// // Check icon
// const CheckIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
//     <circle cx="8" cy="8" r="8" fill="#C9A962"/>
//     <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

// // Payment Form Component
// function VendorPaymentForm({ 
//   clientSecret, 
//   onSuccess, 
//   onError 
// }: { 
//   clientSecret: string; 
//   onSuccess: () => void;
//   onError: (error: string) => void;
// }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!stripe || !elements) {
//       return;
//     }
    
//     setIsProcessing(true);
    
//     try {
//       const { error, paymentIntent } = await stripe.confirmPayment({
//         elements,
//         confirmParams: {
//           return_url: `${window.location.origin}/partners`,
//         },
//         redirect: 'if_required',
//       });
      
//       if (error) {
//         onError(error.message || 'Payment failed');
//       } else if (paymentIntent && paymentIntent.status === 'succeeded') {
//         // ✅ Submit Stage 1 for admin review after successful payment
//         try {
//           await submitStage1();
//           onSuccess();
//         } catch (submitError: any) {
//           console.error('Submission error:', submitError);
//           onError('Payment successful but submission failed. Our team will contact you.');
//         }
//       }
//     } catch (err: any) {
//       onError(err.message || 'Payment failed');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div style={{ marginBottom: '1.5rem' }}>
//         <PaymentElement />
//       </div>
      
//       <button
//         type="submit"
//         disabled={!stripe || isProcessing}
//         style={{
//           width: '100%',
//           padding: '0.875rem',
//           backgroundColor: '#C9A962',
//           color: 'white',
//           border: 'none',
//           borderRadius: '0.375rem',
//           fontSize: '0.875rem',
//           fontWeight: 500,
//           cursor: isProcessing ? 'not-allowed' : 'pointer',
//           opacity: isProcessing ? 0.7 : 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           gap: '0.5rem',
//           transition: 'all 0.2s'
//         }}
//       >
//         {isProcessing && <Spinner />}
//         {isProcessing ? 'Processing...' : 'Pay Application Fee'}
//       </button>
//     </form>
//   );
// }

// // Main Page Component
// export default function VendorBusinessPaymentPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [clientSecret, setClientSecret] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [paymentAmount, setPaymentAmount] = useState<number>(99); // Default fee

//   useEffect(() => {
//     // Add spin animation
//     if (typeof document !== 'undefined') {
//       const existingStyle = document.getElementById('spin-animation');
//       if (!existingStyle) {
//         const style = document.createElement('style');
//         style.id = 'spin-animation';
//         style.textContent = `
//           @keyframes spin {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//           }
//         `;
//         document.head.appendChild(style);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const loadPaymentData = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         // Get payment data from sessionStorage (set by Stage 1 component)
//         const paymentDataStr = sessionStorage.getItem('vendorRegistrationPayment');
        
//         if (!paymentDataStr) {
//           setError('No payment data found. Please restart the registration process.');
//           return;
//         }

//         const paymentData = JSON.parse(paymentDataStr);
        
//         if (!paymentData.clientSecret) {
//           setError('Invalid payment data format');
//           return;
//         }

//         setClientSecret(paymentData.clientSecret);
//         setPaymentAmount(paymentData.amount || 99);
        
//         // Don't clear immediately - keep it in case of page refresh
//         // We'll clear after successful payment
//       } catch (err) {
//         console.error('Error loading payment data:', err);
//         setError('Failed to load payment details.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadPaymentData();
//   }, []);

//   const handlePaymentSuccess = () => {
//     setSuccess(true);
    
//     // Clear payment data from sessionStorage
//     sessionStorage.removeItem('vendorRegistrationPayment');
    
//     // Clear Stage 1 form data if needed (optional)
//     // sessionStorage.removeItem('stage1FormData');
    
//     // Redirect to success page after 2 seconds
//     setTimeout(() => {
//       router.push('/partners');
//     }, 2000);
//   };

//   const handleGoBack = () => {
//     router.push('/partners');
//   };

//   // Features list for vendor registration
//   const features = [
//     'Vendor registration application',
//     'Business verification',
//     'Document verification',
//     'Account setup',
//     'Priority processing',
//     'Email support',
//     'Profile creation',
//     'Listing access'
//   ];

//   // Loading state
//   if (isLoading) {
//     return (
//       <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <div style={{ textAlign: 'center' }}>
//           <Loader style={{ width: '2rem', height: '2rem', color: '#1e3a8a', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
//           <p style={{ color: '#6b7280' }}>Loading payment details...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
//         <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
//           <AlertCircle style={{ width: '3rem', height: '3rem', color: '#ef4444', margin: '0 auto 1rem' }} />
//           <p style={{ textAlign: 'center', color: '#374151', marginBottom: '1.5rem' }}>{error}</p>
//           <button 
//             onClick={handleGoBack}
//             style={{
//               display: 'block',
//               width: '100%',
//               padding: '0.75rem',
//               backgroundColor: '#C9A962',
//               color: 'white',
//               border: 'none',
//               borderRadius: '0.375rem',
//               fontSize: '0.875rem',
//               fontWeight: 500,
//               cursor: 'pointer'
//             }}
//           >
//             Back to Registration
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // No client secret state
//   if (!clientSecret) {
//     return (
//       <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <div style={{ textAlign: 'center' }}>
//           <p style={{ color: '#6b7280', marginBottom: '1rem' }}>No payment data found</p>
//           <button 
//             onClick={handleGoBack}
//             style={{
//               padding: '0.75rem 1.5rem',
//               backgroundColor: '#C9A962',
//               color: 'white',
//               border: 'none',
//               borderRadius: '0.375rem',
//               fontSize: '0.875rem',
//               fontWeight: 500,
//               cursor: 'pointer'
//             }}
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem 1rem' }}>
//       <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
//         {/* Back Navigation */}
//         <div style={{ marginBottom: '1.5rem' }}>
//           <button
//             onClick={handleGoBack}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.5rem',
//               color: '#6b7280',
//               background: 'none',
//               border: 'none',
//               fontSize: '0.875rem',
//               cursor: 'pointer',
//               padding: '0.5rem',
//               borderRadius: '0.375rem',
//               transition: 'all 0.2s'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = '#f3f4f6';
//               e.currentTarget.style.color = '#111827';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = 'transparent';
//               e.currentTarget.style.color = '#6b7280';
//             }}
//           >
//             <ArrowLeft size={16} />
//             Back to Registration Form
//           </button>
//         </div>

//         {/* Header */}
//         <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
//           <span style={{ 
//             display: 'inline-block', 
//             padding: '0.5rem 1rem', 
//             backgroundColor: '#c9a227', 
//             color: 'white', 
//             fontSize: '0.75rem', 
//             fontWeight: 600, 
//             borderRadius: '9999px', 
//             marginBottom: '1rem',
//             textTransform: 'uppercase',
//             letterSpacing: '0.05em'
//           }}>
//             Business Owner
//           </span>
//           <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
//             Vendor Registration Payment
//           </h1>
//           <p style={{ color: '#6b7280', fontSize: '1rem' }}>
//             Complete your registration by paying the application fee
//           </p>
//         </div>

//         <div style={{ 
//           display: 'grid', 
//           gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
//           gap: '1.5rem', 
//           alignItems: 'flex-start' 
//         }}>
          
//           {/* Left Column - Order Summary */}
//           <div style={{ 
//             backgroundColor: 'white', 
//             borderRadius: '0.75rem', 
//             padding: '1.5rem', 
//             boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
//             height: 'fit-content'
//           }}>
//             <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', marginBottom: '1.5rem' }}>
//               Registration Summary
//             </h2>
            
//             <div style={{ marginBottom: '1.5rem' }}>
//               <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '0.25rem' }}>
//                 Stage 1 Registration
//               </h3>
//               <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Vendor Onboarding Application</p>
//             </div>

//             <div style={{ 
//               borderTop: '1px solid #e5e7eb', 
//               paddingTop: '1.5rem', 
//               marginBottom: '1.5rem' 
//             }}>
//               <ul style={{ 
//                 listStyle: 'none', 
//                 padding: 0, 
//                 margin: 0, 
//                 display: 'flex', 
//                 flexDirection: 'column', 
//                 gap: '0.75rem' 
//               }}>
//                 {features.map((feature, index) => (
//                   <li key={index} style={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     gap: '0.75rem', 
//                     fontSize: '0.875rem', 
//                     color: '#374151' 
//                   }}>
//                     <CheckIcon />
//                     {feature}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Total Price Box */}
//             <div style={{ 
//               backgroundColor: '#fefce8', 
//               borderRadius: '0.5rem', 
//               padding: '1rem', 
//               display: 'flex', 
//               justifyContent: 'space-between', 
//               alignItems: 'center' 
//             }}>
//               <div>
//                 <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Application Fee</p>
//                 <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>One-time payment</p>
//               </div>
//               <div style={{ textAlign: 'right' }}>
//                 <span style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1e3a5f' }}>${paymentAmount}</span>
//                 <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>.00</span>
//               </div>
//             </div>

//             {/* Important Note */}
//             <div style={{ 
//               marginTop: '1.5rem',
//               padding: '1rem',
//               backgroundColor: '#fff7ed',
//               borderRadius: '0.5rem',
//               border: '1px solid #fed7aa'
//             }}>
//               <p style={{ 
//                 fontSize: '0.875rem', 
//                 fontWeight: 600, 
//                 color: '#9a3412', 
//                 marginBottom: '0.5rem' 
//               }}>
//                 ⚠️ Important
//               </p>
//               <p style={{ 
//                 fontSize: '0.75rem', 
//                 color: '#9a3412'
//               }}>
//                 After successful payment, your application will be submitted for admin review. 
//                 You will receive an email confirmation within 2-3 business days.
//               </p>
//             </div>
//           </div>

//           {/* Right Column - Stripe Payment Form */}
//           <div style={{ 
//             backgroundColor: 'white', 
//             borderRadius: '0.75rem', 
//             padding: '1.5rem', 
//             boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
//             height: 'fit-content'
//           }}>
//             <div style={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               justifyContent: 'space-between',
//               marginBottom: '1.5rem' 
//             }}>
//               <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151' }}>
//                 Secure Payment
//               </h2>
//               <Lock size={16} style={{ color: '#9ca3af' }} />
//             </div>
            
//             {success ? (
//               <div style={{ textAlign: 'center', padding: '2rem' }}>
//                 <div style={{ 
//                   width: '3rem', 
//                   height: '3rem', 
//                   backgroundColor: '#22c55e', 
//                   borderRadius: '9999px', 
//                   display: 'flex', 
//                   alignItems: 'center', 
//                   justifyContent: 'center',
//                   margin: '0 auto 1rem'
//                 }}>
//                   <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
//                 </div>
//                 <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
//                   Payment Successful!
//                 </h3>
//                 <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
//                   Your application has been submitted successfully.
//                 </p>
//                 <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '1rem' }}>
//                   Redirecting to success page...
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <Elements 
//                   stripe={stripePromise} 
//                   options={{
//                     clientSecret: clientSecret,
//                     appearance: {
//                       theme: 'stripe',
//                       variables: {
//                         colorPrimary: '#C9A962',
//                         colorBackground: '#ffffff',
//                         colorText: '#111827',
//                         colorDanger: '#ef4444',
//                         fontFamily: 'system-ui, -apple-system, sans-serif',
//                         spacingUnit: '4px',
//                         borderRadius: '6px',
//                       },
//                     },
//                   }}
//                 >
//                   <VendorPaymentForm 
//                     clientSecret={clientSecret}
//                     onSuccess={handlePaymentSuccess}
//                     onError={(error) => setError(error)}
//                   />
//                 </Elements>

//                 {/* Payment Methods Info */}
//                 <div style={{ 
//                   marginTop: '1rem',
//                   padding: '0.75rem',
//                   backgroundColor: '#f9fafb',
//                   borderRadius: '0.375rem',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   gap: '1rem'
//                 }}>
//                   <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>We accept:</span>
//                   <img src="/images/visa.svg" alt="Visa" style={{ height: '20px' }} />
//                   <img src="/images/mastercard.svg" alt="Mastercard" style={{ height: '20px' }} />
//                   <img src="/images/amex.svg" alt="American Express" style={{ height: '20px' }} />
//                 </div>

//                 {/* Security Badges */}
//                 <div style={{ 
//                   marginTop: '1rem',
//                   paddingTop: '1rem',
//                   borderTop: '1px solid #e5e7eb',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   gap: '1rem',
//                   flexWrap: 'wrap'
//                 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                     <Lock size={12} style={{ color: '#9ca3af' }} />
//                     <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>256-bit SSL</span>
//                   </div>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                     <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//                       <circle cx="6" cy="6" r="5" stroke="#9ca3af" strokeWidth="1"/>
//                       <path d="M4 6L5.5 7.5L8 4.5" stroke="#9ca3af" strokeWidth="1"/>
//                     </svg>
//                     <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>PCI Compliant</span>
//                   </div>
//                 </div>
//               </>
//             )}

//             {error && !success && (
//               <div style={{ 
//                 padding: '0.75rem', 
//                 backgroundColor: '#fef2f2', 
//                 borderRadius: '0.375rem', 
//                 marginTop: '1rem' 
//               }}>
//                 <p style={{ fontSize: '0.875rem', color: '#dc2626', textAlign: 'center' }}>
//                   {error}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Help Section */}
//         <div style={{ 
//           marginTop: '2rem', 
//           textAlign: 'center',
//           padding: '1rem',
//           color: '#6b7280',
//           fontSize: '0.75rem'
//         }}>
//           <p>
//             Having trouble? Contact our support team at{' '}
//             <a href="mailto:support@example.com" style={{ color: '#C9A962', textDecoration: 'none' }}>
//               support@example.com
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
