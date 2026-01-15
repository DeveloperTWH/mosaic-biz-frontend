'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitApplication = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Simple API call - no body needed
      const response = await fetch('http://localhost:3001/api/vendor-onboarding/submit', {
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '28rem', width: '100%', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ width: '4rem', height: '4rem', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <svg style={{ width: '2rem', height: '2rem', color: '#16a34a' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Payment Successful!
          </h1>
          
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Thank you for your payment. Click the button below to complete your application submission.
          </p>
        </div>

        {/* Submit Button */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={submitApplication}
            disabled={isSubmitting}
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem', 
              backgroundColor: isSubmitting ? '#9ca3af' : '#ea580c',
              color: 'white', 
              fontWeight: '500', 
              borderRadius: '0.5rem', 
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s'
            }}
          >
            {isSubmitting ? (
              <>
                <div style={{ 
                  width: '1rem', 
                  height: '1rem', 
                  border: '2px solid transparent', 
                  borderTop: '2px solid white', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite' 
                }}></div>
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
          
          {error && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem' }}>
              <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>{error}</p>
              <button
                onClick={submitApplication}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>What happens next?</h3>
            <ul style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '0.25rem', margin: 0, paddingLeft: 0 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', listStyleType: 'none' }}>
                <svg style={{ width: '1rem', height: '1rem', color: '#10b981', marginRight: '0.5rem', marginTop: '0.125rem' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Your documents will be verified
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', listStyleType: 'none' }}>
                <svg style={{ width: '1rem', height: '1rem', color: '#10b981', marginRight: '0.5rem', marginTop: '0.125rem' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Background checks will be initiated
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', listStyleType: 'none' }}>
                <svg style={{ width: '1rem', height: '1rem', color: '#10b981', marginRight: '0.5rem', marginTop: '0.125rem' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                You'll receive an email confirmation within 24 hours
              </li>
            </ul>
          </div>

          <div style={{ paddingTop: '1rem' }}>
            <Link
              href="/vendor/onboarding"
              style={{ 
                display: 'block', 
                width: '100%', 
                padding: '0.75rem 1rem', 
                backgroundColor: 'transparent', 
                color: '#374151', 
                fontWeight: '500', 
                borderRadius: '0.5rem', 
                border: '1px solid #d1d5db',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
                textAlign: 'center',
                marginBottom: '0.5rem'
              }}
            >
              Back to Onboarding
            </Link>
            
            <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
              Have questions?{' '}
              <a href="mailto:support@example.com" style={{ color: '#ea580c', textDecoration: 'underline' }}>
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          width: '3rem', 
          height: '3rem', 
          border: '2px solid transparent', 
          borderTop: '2px solid #ea580c', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
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