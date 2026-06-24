import React from "react";
import Link from 'next/link';
import PublicContentLayout from "../Components/PublicContentLayout";

const Terms = () => {
  return (
    <PublicContentLayout
      title="Terms & Conditions"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Terms & Conditions" },
      ]}
      imageUrl="/about.png"
      proseVariant="legal"
    >
      <h1 className="mb-2 font-poppins text-3xl font-bold text-brand-navy">Terms & Conditions</h1>
      <p className="mb-8 text-sm text-brand-muted">Last updated: January 2026</p>

      <section className="mb-6">
        <h2 className="mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using Mosaic Biz Hub ("Platform", "we", "our", or
          "us"), including the website and application at
          <strong className="font-semibold"> mosaicbizhub.com</strong>, you agree to be bound by these
          Terms & Conditions. If you do not agree, you may not use the Platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2">2. Eligibility</h2>
        <p>
          You must be at least 18 years old to use Mosaic Biz Hub. By using the
          Platform, you represent and warrant that you meet this requirement and
          have the legal authority to enter into these Terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2">3. Account Registration</h2>
        <p>
          To access certain features, you may be required to create an account.
          You agree to provide accurate, current, and complete information and
          to keep your login credentials secure. You are responsible for all
          activity that occurs under your account.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2">4. Vendor Accounts & Listings</h2>
        <p>
          Vendors are responsible for the accuracy of their business
          information, services, and products listed on the Platform. Mosaic Biz
          Hub reserves the right to approve, verify, modify, or remove listings
          that violate these Terms or applicable laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2">5. Marketplace Transactions</h2>
        <p>
          Mosaic Biz Hub acts as a marketplace facilitator and is not a party to
          transactions between buyers and vendors. All purchases, services, and
          agreements are solely between users and vendors.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2">6. Payments & Fees</h2>
        <p>
          Payments may be processed through third-party payment providers. Any
          applicable fees, subscriptions, or commissions will be disclosed
          before purchase. Mosaic Biz Hub is not responsible for payment
          processing errors or disputes handled by third-party providers.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2">7. Prohibited Conduct</h2>
        <p className="text-gray-700 mb-2">You agree not to:</p>
        <ul className="pl-5 list-disc text-gray-700">
          <li className="mb-1">Use the Platform for unlawful or fraudulent purposes</li>
          <li className="mb-1">Post false, misleading, or harmful content</li>
          <li className="mb-1">Impersonate another person or business</li>
          <li className="mb-1">Interfere with the Platform's security or functionality</li>
          <li className="mb-1">Attempt to access accounts or data without authorization</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2">8. Intellectual Property</h2>
        <p>
          All content, branding, logos, and software on Mosaic Biz Hub are owned
          by or licensed to us and protected by intellectual property laws. You
          may not copy, modify, or distribute any content without prior written
          permission.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2">9. User Content</h2>
        <p>
          By submitting content to the Platform, you grant Mosaic Biz Hub a
          non-exclusive, royalty-free license to use, display, and distribute
          such content in connection with operating and promoting the Platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2">10. Account Suspension & Termination</h2>
        <p>
          We reserve the right to suspend or terminate accounts at our
          discretion, including for violations of these Terms, suspected fraud,
          or harm to the Platform or its users.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2">11. Disclaimers</h2>
        <p>
          The Platform is provided on an "as is" and "as available" basis.
          Mosaic Biz Hub makes no warranties regarding the accuracy, reliability,
          or availability of the Platform or vendor services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2">12. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Mosaic Biz Hub shall not be
          liable for any indirect, incidental, consequential, or punitive
          damages arising from your use of the Platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2">13. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Mosaic Biz Hub from any claims,
          damages, losses, or expenses arising out of your use of the Platform
          or violation of these Terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2">14. Governing Law</h2>
        <p>
          These Terms are governed by and construed in accordance with the laws
          of the jurisdiction in which Mosaic Biz Hub operates, without regard
          to conflict of law principles.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2">15. Changes to Terms</h2>
        <p>
          We may update these Terms at any time. Continued use of the Platform
          after changes are posted constitutes acceptance of the revised Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2">16. Contact Information</h2>
        <p>
          If you have questions about these Terms & Conditions, please contact us
          through the Mosaic Biz Hub platform.
        </p>
      </section>

      {/* Expand Your Reach Section - Full Width with Increased Height */}
      <div className="mt-12 w-full">
        <div 
          className="w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/contact/becomeVendor.png')" }}
        >
          <div className="bg-[#3333339E] px-4 py-16 text-center text-white sm:px-8 sm:py-24">
            <div className="max-w-[900px] mx-auto">
              <h2 className="text-white text-3xl font-bold mb-2">EXPAND YOUR REACH -</h2>
              <h2 className="text-white text-3xl font-bold mb-4">LIST YOUR BUSINESS ON OUR PLATFORM!</h2>
              
              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto my-4" />
              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto mb-8" />
              
              <p className="text-white text-lg leading-relaxed max-w-[700px] mx-auto mb-10 opacity-95">
                Take your business to new heights by listing it on Mosaic Biz Hub. 
                Connect with customers who value minority-owned brands, showcase your 
                unique products and services, and grow your presence in the digital 
                marketplace. Join a community dedicated to supporting your success 
                every step of the way.
              </p>
              
              <Link 
                href="/become-a-vendor" 
                className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-gray-800"
              >
                Become a vendor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicContentLayout>
  );
};

export default Terms;
