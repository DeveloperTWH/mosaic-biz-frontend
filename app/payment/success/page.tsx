'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve the data from sessionStorage
    const userFormData = sessionStorage.getItem('userFormData');
    const subscriptionInfo = sessionStorage.getItem('subscriptionData');

    if (userFormData) {
      try {
        setUserData(JSON.parse(userFormData));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    if (subscriptionInfo) {
      try {
        setSubscriptionData(JSON.parse(subscriptionInfo));
      } catch (e) {
        console.error('Failed to parse subscription data:', e);
      }
    }

    setIsLoading(false);
  }, []);

  const submitApplication = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Simple API call - no body needed
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Cookies will be sent automatically with credentials: 'include'
        },
        credentials: 'include', // This sends the auth_token cookie
      });

   if (!response.ok) {
  throw new Error(`Submission failed: ${response.statusText}`);
}


      const result = await response.json();
      
      if (result.success) {
        // Success - redirect to dashboard
        router.push('/partners');
      } else {
        throw new Error(result.message || 'Submission failed');
      }
      
    } catch (error: any) {
      console.error('Failed to submit application:', error);
      setError(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '36rem', width: '100%' }}>
        {/* Success Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden', marginBottom: '1.5rem' }}>
          {/* Confetti decoration */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6rem', overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '0.5rem', left: '1rem', width: '0.5rem', height: '0.5rem', backgroundColor: '#f9a8d4', borderRadius: '50%', opacity: 0.6 }}></div>
            <div style={{ position: 'absolute', top: '1.5rem', left: '3rem', width: '0.75rem', height: '0.75rem', backgroundColor: '#fde047', borderRadius: '50%', opacity: 0.6 }}></div>
            <div style={{ position: 'absolute', top: '1rem', left: '5rem', width: '0.5rem', height: '0.5rem', backgroundColor: '#93c5fd', borderRadius: '50%', opacity: 0.6 }}></div>
            <div style={{ position: 'absolute', top: '2rem', left: '7rem', width: '0.5rem', height: '0.5rem', backgroundColor: '#86efac', borderRadius: '50%', opacity: 0.6 }}></div>
            <div style={{ position: 'absolute', top: '0.75rem', right: '4rem', width: '0.75rem', height: '0.75rem', backgroundColor: '#c4b5fd', borderRadius: '50%', opacity: 0.6 }}></div>
            <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', width: '0.5rem', height: '0.5rem', backgroundColor: '#f9a8d4', borderRadius: '50%', opacity: 0.6 }}></div>
            <div style={{ position: 'absolute', top: '2.5rem', right: '6rem', width: '0.5rem', height: '0.5rem', backgroundColor: '#fde047', borderRadius: '50%', opacity: 0.6 }}></div>
            <div style={{ position: 'absolute', top: '0.5rem', right: '8rem', width: '0.5rem', height: '0.5rem', backgroundColor: '#93c5fd', borderRadius: '50%', opacity: 0.6 }}></div>
            {/* Streamers */}
            <div style={{ position: 'absolute', top: 0, left: '2rem', width: '0.25rem', height: '4rem', background: 'linear-gradient(to bottom, #f9a8d4, transparent)', transform: 'rotate(12deg)', opacity: 0.4 }}></div>
            <div style={{ position: 'absolute', top: 0, right: '3rem', width: '0.25rem', height: '5rem', background: 'linear-gradient(to bottom, #93c5fd, transparent)', transform: 'rotate(-12deg)', opacity: 0.4 }}></div>
            <div style={{ position: 'absolute', top: 0, left: '6rem', width: '0.25rem', height: '3rem', background: 'linear-gradient(to bottom, #fde047, transparent)', transform: 'rotate(6deg)', opacity: 0.4 }}></div>
          </div>

          {/* Green Wallet Icon */}
          <div style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 10 }}>
            <div style={{ width: '4rem', height: '4rem', margin: '0 auto', position: 'relative' }}>
              <div style={{ width: '3.5rem', height: '2.5rem', backgroundColor: '#22c55e', borderRadius: '0.5rem', position: 'absolute', top: '0.5rem', left: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: 'white', borderRadius: '50%', opacity: 0.8 }}></div>
              </div>
              <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#4ade80', borderRadius: '0.5rem', position: 'absolute', top: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: 'white', borderRadius: '50%' }}></div>
              </div>
              <div style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#facc15', borderRadius: '50%', position: 'absolute', bottom: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                <svg style={{ width: '1rem', height: '1rem', color: 'white' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#10b981', marginBottom: '0.5rem' }}>
            Payment Successful
          </h1>

          {/* Subtitle */}
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Your subscription has been activated.<br />
            Thank you for your payment.
          </p>
        </div>

        {/* Details Cards */}
        {!isLoading && (userData || subscriptionData) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {userData && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Information</h3>
                <div>
                  <p style={{ color: '#1f2937', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>Name:</span> {userData.firstName} {userData.lastName}
                  </p>
                  <p style={{ color: '#1f2937', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>Email:</span> {userData.email}
                  </p>
                  <p style={{ color: '#1f2937', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 600 }}>Phone:</span> {userData.phone}
                  </p>
                </div>
              </div>
            )}

            {subscriptionData && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subscription Details</h3>
                <div>
                  <p style={{ color: '#1f2937', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>Subscription ID:</span>
                  </p>
                  <code style={{ display: 'block', fontSize: '0.75rem', backgroundColor: '#f3f4f6', color: '#1f2937', padding: '0.5rem', borderRadius: '0.375rem', marginBottom: '0.5rem', wordBreak: 'break-all' }}>{subscriptionData.subscriptionId}</code>
                  <p style={{ color: '#1f2937', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>Amount:</span> ${subscriptionData.amount ? (subscriptionData.amount / 100).toFixed(2) : '0.00'} {subscriptionData.currency ? subscriptionData.currency.toUpperCase() : 'USD'}
                  </p>
                  <p style={{ color: '#1f2937', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 600 }}>Valid for:</span> 365 days
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Action Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
          {/* Next Steps */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>What's Next?</h2>
            <ol style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.625', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Review your subscription details above</li>
              <li style={{ marginBottom: '0.5rem' }}>Check your email for a confirmation message</li>
              <li style={{ marginBottom: '0.5rem' }}>Complete the application submission below</li>
              <li>Start listing your products and services</li>
            </ol>
          </div>

          {/* Submit Button */}
          <button
            onClick={submitApplication}
            disabled={isSubmitting}
            style={{ 
              width: '100%', 
              padding: '0.75rem 1.5rem', 
              backgroundColor: isSubmitting ? '#6366f1' : '#1e3a8a',
              color: 'white', 
              fontWeight: 500, 
              borderRadius: '0.5rem',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: isSubmitting ? 0.5 : 1,
              transition: 'background-color 0.2s'
            }}
          >
            {isSubmitting ? (
              <>
                <svg style={{ animation: 'spin 1s linear infinite', height: '1.25rem', width: '1.25rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>

          {error && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '0.5rem' }}>
              <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{error}</p>
              <button
                onClick={submitApplication}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg style={{ animation: 'spin 1s linear infinite', height: '2rem', width: '2rem', color: '#312e81' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

// Add spinner animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}