"use client";

import React, { useRef, useState } from 'react';
import PublicPageHero from '../Components/PublicPageHero';
import VendorExpandCta from '../Components/VendorExpandCta';
import { Mail, PhoneCall, Facebook, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';
import { submitContactInquiry, ContactInquiryData } from '@/lib/api/contact';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormField } from '@/components/ui/form-field';
import { FormAlert } from '@/components/ui/form-alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  MarketingContactCard,
  MarketingSectionHeader,
} from '../Components/marketing/MarketingSections';

export default function ContactUsPage() {
  const [formData, setFormData] = useState<ContactInquiryData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    subject: '',
    howCanWeHelp: '',
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    try {
      const token = recaptchaRef.current?.getValue();

      if (!token) {
        setFormError('Please complete the verification check before submitting.');
        return;
      }

      await submitContactInquiry(formData);
      toast.success('Thank you for contacting us! We will get back to you soon.');
      recaptchaRef.current?.reset();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNo: '',
        subject: '',
        howCanWeHelp: '',
      });
    } catch (error: unknown) {
      console.error('Contact form error:', error);
      const message =
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : 'Failed to submit your inquiry. Please try again.';
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-market-bg">
      <PublicPageHero
        title="Contact"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact' },
        ]}
        imageUrl="/contact/banner.png"
      />

      <section className="public-section">
        <div className="container-page">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="marketing-form-panel">
              <MarketingSectionHeader
                align="left"
                title="Connect with us"
                description="Reach out anytime. We are here to support your journey, answer questions, and help your business thrive."
                className="mb-6 !text-left"
              />

              <form onSubmit={handleSubmit} className="public-form-stack">
                <div className="public-form-grid">
                  <FormField label="First name" htmlFor="firstName" required surface="market">
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      surface="market"
                      autoComplete="given-name"
                    />
                  </FormField>

                  <FormField label="Last name" htmlFor="lastName" required surface="market">
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Smith"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      surface="market"
                      autoComplete="family-name"
                    />
                  </FormField>

                  <FormField
                    label="Email"
                    htmlFor="email"
                    required
                    surface="market"
                    helperText="We'll reply to this address."
                  >
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      surface="market"
                      autoComplete="email"
                    />
                  </FormField>

                  <FormField label="Phone number" htmlFor="phoneNo" required surface="market">
                    <Input
                      id="phoneNo"
                      name="phoneNo"
                      type="tel"
                      placeholder="(555) 555-0123"
                      value={formData.phoneNo}
                      onChange={handleChange}
                      required
                      surface="market"
                      autoComplete="tel"
                    />
                  </FormField>
                </div>

                <FormField label="Subject" htmlFor="subject" required surface="market">
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What is this regarding?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    surface="market"
                  />
                </FormField>

                <FormField
                  label="How can we help?"
                  htmlFor="howCanWeHelp"
                  required
                  surface="market"
                  helperText="Share as much detail as you can so we can route your message quickly."
                >
                  <Textarea
                    id="howCanWeHelp"
                    name="howCanWeHelp"
                    placeholder="Tell us about your question or request…"
                    value={formData.howCanWeHelp}
                    onChange={handleChange}
                    required
                    surface="market"
                    rows={5}
                  />
                </FormField>

                <div className="max-w-full overflow-x-auto">
                  <ReCAPTCHA
                    sitekey="6LcA_nMsAAAAANFObRTZO__HF5YR4wCW3zxV3KuR"
                    ref={recaptchaRef}
                  />
                </div>

                {formError ? <FormAlert variant="error">{formError}</FormAlert> : null}

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="market-btn-primary min-h-11 w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[12rem]"
                  >
                    {loading ? 'Sending message…' : 'Send message'}
                  </button>
                </div>
              </form>
            </div>

            <div className="marketing-media-frame lg:sticky lg:top-24">
              <Image
                src="/contact/contactRight.png"
                alt="Contact Mosaic Biz Hub"
                width={700}
                height={800}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="public-section bg-market-surface pt-0">
        <div className="container-page grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <MarketingContactCard icon={<PhoneCall size={32} aria-hidden />} title="Call us">
            <p>+1 202.810.9450</p>
            <p>For vendors: 888.845.4210</p>
          </MarketingContactCard>

          <MarketingContactCard icon={<Mail size={32} aria-hidden />} title="Email us">
            <p>
              <a href="mailto:info@mosaicbizhub.com" className="text-market-gold hover:underline">
                info@mosaicbizhub.com
              </a>
            </p>
          </MarketingContactCard>

          <MarketingContactCard
            icon={
              <Image
                src="/contact/Untitled design.png"
                alt=""
                width={32}
                height={32}
                className="object-contain"
              />
            }
            title="Follow us"
          >
            <div className="flex gap-2 pt-1">
              <a
                href="#"
                aria-label="Facebook"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 text-market-muted transition hover:border-market-gold/30 hover:text-market-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 text-market-muted transition hover:border-market-gold/30 hover:text-market-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 text-market-muted transition hover:border-market-gold/30 hover:text-market-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </MarketingContactCard>
        </div>
      </section>

      <VendorExpandCta ctaHref="/become-a-vendor" />
    </div>
  );
}
