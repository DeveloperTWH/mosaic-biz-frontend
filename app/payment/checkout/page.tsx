'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, Loader, CheckCircle, CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';
import { fetchSubscriptionPlans, getSubscriptionById } from '@/lib/api/subscription/subscriptionApi';
import { SubscriptionPlanResponse } from '@/types/subscription-response';

interface UserFormData {
  email: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
  cardHolderName: string;
}

// Spinner component with inline styles
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

// Check icon component 
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="8" fill="#C9A962"/>
    <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Visa icon
const VisaIcon = () => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none" style={{ marginLeft: 'auto' }}>
    <rect width="32" height="20" rx="2" fill="white"/>
    <path d="M12.5 14H10L11.5 6H14L12.5 14Z" fill="#1A1F71"/>
    <path d="M20.5 6.2C20.1 6 19.5 5.8 18.8 5.8C17.2 5.8 16 6.7 16 8C16 9 16.8 9.5 17.4 9.8C18 10.1 18.2 10.3 18.2 10.6C18.2 11 17.8 11.2 17.4 11.2C16.8 11.2 16.2 11 15.8 10.7L15.5 10.5L15.2 12.4C15.7 12.7 16.5 12.9 17.3 12.9C19 12.9 20.2 12 20.2 10.6C20.2 9.8 19.7 9.2 18.8 8.8C18.2 8.5 17.9 8.3 17.9 8C17.9 7.7 18.2 7.4 18.8 7.4C19.3 7.4 19.7 7.5 20 7.7L20.2 7.8L20.5 6.2Z" fill="#1A1F71"/>
    <path d="M23.5 6H21.8C21.4 6 21.1 6.1 20.9 6.5L17.5 14H19.8L20.3 12.5H23.2L23.5 14H25.5L23.5 6ZM21.8 10.8L22.8 8L23.3 10.8H21.8Z" fill="#1A1F71"/>
    <path d="M9.5 6L7.3 11.8L7 10.5C6.5 9 5.2 7.4 3.8 6.5L6.1 14H8.4L12 6H9.5Z" fill="#1A1F71"/>
    <path d="M6.5 6H3L3 6.2C5.8 6.9 7.8 8.8 8.5 11L8 6.5C7.9 6.1 7.6 6 7.2 6H6.5Z" fill="#F7B600"/>
  </svg>
);

// Mastercard icon
const MastercardIcon = () => (
  <svg width="24" height="20" viewBox="0 0 24 20" fill="none" style={{ marginLeft: '8px' }}>
    <circle cx="6" cy="10" r="6" fill="#EB001B"/>
    <circle cx="14" cy="10" r="6" fill="#F79E1B"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M10 14.5C11.2 13.3 12 11.7 12 10C12 8.3 11.2 6.7 10 5.5C8.8 6.7 8 8.3 8 10C8 11.7 8.8 13.3 10 14.5Z" fill="#FF5F00"/>
  </svg>
);

// PayPal icon
const PayPalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4.5 13L5 10H3L3.5 7H5.5C6.5 7 7.5 6.5 7.8 5.5C8.1 4.5 7.5 3.5 6.5 3.5H3.5L2 12H4.5V13Z" fill="#003087"/>
    <path d="M10.5 3.5C9.5 3.5 8.5 4 8.2 5L6.5 13H9L9.5 10.5H11.5C13.5 10.5 15 9 15.5 7C16 5 14.5 3.5 12.5 3.5H10.5Z" fill="#0070E0"/>
  </svg>
);

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get('subscriptionId');

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardHolderName: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({});

  // Add spin animation
  useEffect(() => {
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

  // Load subscription and plan data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const storedPlanId = sessionStorage.getItem('selectedPlanId');
        const storedSubscriptionData = sessionStorage.getItem('subscriptionData');

        let planIdToUse = storedPlanId;

        if (!planIdToUse && subscriptionId) {
          try {
            const resp = await getSubscriptionById(subscriptionId);
            if (resp?.success && resp?.data?.planId) {
              planIdToUse = resp.data.planId;
            }
          } catch (e) {
            console.warn('Backend fetch failed:', e);
          }
        }

        if (planIdToUse) {
          const plansRes = await fetchSubscriptionPlans();
          if (plansRes.success && plansRes.data) {
            const plan = plansRes.data.find((p) => p._id === planIdToUse);
            if (plan) {
              setSelectedPlan(plan);
            } else {
              setError('Selected plan not found.');
            }
          }
        } else {
          setError('No subscription data found. Please start from tier selection.');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load subscription details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [subscriptionId]);

  const validateForm = (): boolean => {
    const errors: Partial<UserFormData> = {};

    if (!formData.email.trim()) errors.email = 'Email required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = 'Invalid email';

    if (paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) errors.cardNumber = 'Card number required';
      else if (!/^\d{13,19}$/.test(formData.cardNumber.replace(/\s/g, '')))
        errors.cardNumber = 'Invalid card number';

      if (!formData.cardExpiry.trim()) errors.cardExpiry = 'Expiry date required';
      else if (!/^\d{2}\/\d{4}$/.test(formData.cardExpiry))
        errors.cardExpiry = 'Format: MM/YYYY';

      if (!formData.cardCVC.trim()) errors.cardCVC = 'CVC required';
      else if (!/^\d{3,4}$/.test(formData.cardCVC))
        errors.cardCVC = 'Invalid CVC';

      if (!formData.cardHolderName.trim()) errors.cardHolderName = 'Cardholder name required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let finalValue = value;
    if (name === 'cardNumber') {
      finalValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    else if (name === 'cardExpiry') {
      finalValue = value.replace(/\D/g, '').slice(0, 6);
      if (finalValue.length >= 2) {
        finalValue = finalValue.slice(0, 2) + '/' + finalValue.slice(2);
      }
    }
    else if (name === 'cardCVC') {
      finalValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (formErrors[name as keyof UserFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      setSuccess(true);
      sessionStorage.setItem('userFormData', JSON.stringify(formData));

      setTimeout(() => {
        router.push('/partners/tier-selection/success');
      }, 2000);
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Input styles
  const getInputStyle = (fieldName: keyof UserFormData, hasIcon: boolean = false): React.CSSProperties => ({
    width: '100%',
    padding: '0.75rem',
    paddingRight: hasIcon ? '80px' : '0.75rem',
    border: `1px solid ${formErrors[fieldName] ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '0.375rem',
    outline: 'none',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    transition: 'all 0.2s',
    fontFamily: fieldName === 'cardNumber' || fieldName === 'cardExpiry' || fieldName === 'cardCVC' ? 'monospace' : 'inherit'
  });

  const features = [
    `${selectedPlan?.limits.productListings || 10} products`,
    `${selectedPlan?.limits.serviceListings || 5} services`,
    `${selectedPlan?.limits.foodListings || 5} foods`,
    `${selectedPlan?.limits.imageLimit || 10} images`,
    `${selectedPlan?.limits.videoLimit || 2} videos`,
    'Marketing tools',
    'Featured placement',
    'Search priority',
    'AI recommendations',
  ];

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader style={{ width: '2rem', height: '2rem', color: '#1e3a8a', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
          <AlertCircle style={{ width: '3rem', height: '3rem', color: '#ef4444', margin: '0 auto 1rem' }} />
          <p style={{ textAlign: 'center', color: '#374151' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Plan not found</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
            Confirm your plan details and complete payment securely
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
          {/* Left Column - Plan Details */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', marginBottom: '1.5rem' }}>Selected Plan</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.25rem' }}>
                {selectedPlan.name}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Everything You Need To Begin</p>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {features.map((feature, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Total Price Box */}
            <div style={{ backgroundColor: '#fefce8', borderRadius: '0.5rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Total Price</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Billed Annually</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1e3a8a' }}>${selectedPlan.price}</span>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>/Month</span>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', marginBottom: '1.5rem' }}>Secure Payment</h2>

            {/* Payment Method Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${paymentMethod === 'card' ? '#1e3a8a' : '#d1d5db'}`,
                  backgroundColor: paymentMethod === 'card' ? '#eff6ff' : 'white',
                  color: paymentMethod === 'card' ? '#1e3a8a' : '#374151',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <CreditCard size={16} />
                Pay By Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${paymentMethod === 'paypal' ? '#1e3a8a' : '#d1d5db'}`,
                  backgroundColor: paymentMethod === 'paypal' ? '#eff6ff' : 'white',
                  color: paymentMethod === 'paypal' ? '#1e3a8a' : '#374151',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <PayPalIcon />
                Pay With PayPal
              </button>
            </div>

            {success ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <CheckCircle style={{ width: '3rem', height: '3rem', color: '#22c55e', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>Payment Successful!</h3>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Email & Card Number Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g.john@example.com"
                        disabled={isSubmitting}
                        style={getInputStyle('email')}
                      />
                      {formErrors.email && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>{formErrors.email}</p>}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
                        Card Number
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="0000 0000 0000 0000"
                          disabled={isSubmitting || paymentMethod !== 'card'}
                          maxLength={19}
                          style={{ ...getInputStyle('cardNumber', true), paddingRight: '80px' }}
                        />
                        <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                          <VisaIcon />
                          <MastercardIcon />
                        </div>
                      </div>
                      {formErrors.cardNumber && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>{formErrors.cardNumber}</p>}
                    </div>
                  </div>

                  {/* Expiry & CVC Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM / YYYY"
                        disabled={isSubmitting || paymentMethod !== 'card'}
                        maxLength={7}
                        style={getInputStyle('cardExpiry')}
                      />
                      {formErrors.cardExpiry && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>{formErrors.cardExpiry}</p>}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
                        Security Code
                      </label>
                      <input
                        type="text"
                        name="cardCVC"
                        value={formData.cardCVC}
                        onChange={handleInputChange}
                        placeholder="000"
                        disabled={isSubmitting || paymentMethod !== 'card'}
                        maxLength={4}
                        style={getInputStyle('cardCVC')}
                      />
                      {formErrors.cardCVC && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>{formErrors.cardCVC}</p>}
                    </div>
                  </div>

                  {/* Card Holder & Billing Cycle Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
                        Card Holder's Name
                      </label>
                      <input
                        type="text"
                        name="cardHolderName"
                        value={formData.cardHolderName}
                        onChange={handleInputChange}
                        placeholder="Enter Cardholder's Name"
                        disabled={isSubmitting || paymentMethod !== 'card'}
                        style={getInputStyle('cardHolderName')}
                      />
                      {formErrors.cardHolderName && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>{formErrors.cardHolderName}</p>}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
                        Billing Cycle
                      </label>
                      <div style={{ 
                        padding: '0.75rem', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '0.375rem', 
                        backgroundColor: '#f9fafb',
                        fontSize: '0.875rem',
                        color: '#374151',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        Billed Annually - {selectedPlan.price}/Year
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sub Total</span>
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>${selectedPlan.price}.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tax</span>
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>$0.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Total Amount</span>
                      <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>${selectedPlan.price}.00</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      backgroundColor: '#C9A962',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    {isSubmitting && <Spinner />}
                    Activate Subscription
                  </button>

                  {/* Security Note */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <Lock size={14} style={{ color: '#9ca3af' }} />
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Your payment is secured & encrypted</span>
                  </div>

                  {error && (
                    <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '0.375rem', marginTop: '0.5rem' }}>
                      <p style={{ fontSize: '0.875rem', color: '#dc2626', textAlign: 'center' }}>{error}</p>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}