import React from "react";
import Link from "next/link";
import PublicContentLayout from "../Components/PublicContentLayout";

const Privacy = () => {
  return (
    <PublicContentLayout
      title="Privacy Policy"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Privacy Policy" },
      ]}
      imageUrl="/about.png"
      proseVariant="legal"
    >
      <h1 className="mb-2 font-poppins text-3xl font-bold text-brand-navy">
        Mosaic Biz Hub Privacy Policy
      </h1>

      <p className="mb-8 text-sm text-brand-muted">
        Effective Date: September 6, 2025
      </p>

      {/* Introduction */}
      <section className="mb-6">
        <h2 className="mb-3">
          Introduction
        </h2>

        <p >
          Mosaic Biz Hub (“we,” “our,” or “us”) is committed to protecting your
          privacy and ensuring a safe online experience. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your
          information when you visit our website or use our services.
        </p>

        <p className="text-gray-700 mt-4">
          By accessing or using Mosaic Biz Hub, you agree to the terms of this
          Privacy Policy.
        </p>
      </section>

      {/* Information We Collect */}
      <section className="mb-6">
        <h2 className="mb-3">
          1. Information We Collect
        </h2>

        <p className="text-gray-700 mb-4">
          We collect information to provide better services, tailor our
          offerings, and maintain a secure platform.
        </p>

        <ul className="list-disc pl-5">
          <li className="mb-3">
            <span className="font-semibold">
              Personal Information:
            </span>{" "}
            Name, email address, phone number, business name, and profile
            details you provide when registering or contacting us.
          </li>

          <li className="mb-3">
            <span className="font-semibold">
              Financial and Payment Data:
            </span>{" "}
            Billing address, payment details, and transaction history for
            premium services.
          </li>

          <li className="mb-3">
            <span className="font-semibold">
              Usage Data:
            </span>{" "}
            Pages visited, features used, IP address, browser type, and device
            identifiers collected automatically.
          </li>

          <li className="mb-3">
            <span className="font-semibold">
              Communications Data:
            </span>{" "}
            Support inquiries, feedback, survey responses, and marketing
            preferences.
          </li>
        </ul>
      </section>

      {/* How We Use Information */}
      <section className="mb-6">
        <h2 className="mb-3">
          2. How We Use Your Information
        </h2>

        <p className="text-gray-700 mb-4">
          Your information powers our platform and helps us deliver relevant
          experiences.
        </p>

        <ul className="list-disc pl-5">
          <li className="mb-2">
            Operate, maintain, and improve Platform services
          </li>

          <li className="mb-2">
            Process transactions and manage billing
          </li>

          <li className="mb-2">
            Send updates, newsletters, and promotional communications
          </li>

          <li className="mb-2">
            Analyze usage trends and enhance security
          </li>

          <li className="mb-2">
            Detect and prevent fraud or technical issues
          </li>
        </ul>
      </section>

      {/* Cookies */}
      <section className="mb-6">
        <h2 className="mb-3">
          3. Cookies and Tracking Technologies
        </h2>

        <p className="text-gray-700 mb-4">
          We and our third-party partners use cookies and similar technologies
          to improve user experience and optimize platform performance.
        </p>

        <ul className="list-disc pl-5">
          <li className="mb-2">
            <span className="font-semibold">
              Session Cookies:
            </span>{" "}
            Enable core functionality and login sessions.
          </li>

          <li className="mb-2">
            <span className="font-semibold">
              Preference Cookies:
            </span>{" "}
            Remember language and appearance settings.
          </li>

          <li className="mb-2">
            <span className="font-semibold">
              Analytics Cookies:
            </span>{" "}
            Collect usage statistics to improve performance.
          </li>

          <li className="mb-2">
            <span className="font-semibold">
              Advertising Cookies:
            </span>{" "}
            Deliver relevant advertising experiences.
          </li>
        </ul>
      </section>

      {/* Sharing Information */}
      <section className="mb-6">
        <h2 className="mb-3">
          4. Sharing Your Information
        </h2>

        <p className="text-gray-700 mb-4">
          We do not sell or rent your personal information.
        </p>

        <p className="text-gray-700 mb-3">
          Information may be shared in the following situations:
        </p>

        <ul className="list-disc pl-5">
          <li className="mb-2">
            With trusted service providers and payment processors
          </li>

          <li className="mb-2">
            To comply with legal obligations
          </li>

          <li className="mb-2">
            To protect rights, safety, or Platform integrity
          </li>

          <li className="mb-2">
            With your explicit consent
          </li>
        </ul>
      </section>

      {/* Data Retention */}
      <section className="mb-6">
        <h2 className="mb-3">
          5. Data Retention
        </h2>

        <p >
          We retain your information only as long as necessary to fulfill the
          purposes outlined in this policy or as required by law. When data is
          no longer needed, we securely delete or anonymize it.
        </p>
      </section>

      {/* Security */}
      <section className="mb-6">
        <h2 className="mb-3">
          6. Data Security
        </h2>

        <p >
          We implement administrative, technical, and physical safeguards to
          protect your information against unauthorized access, disclosure,
          alteration, or destruction.
        </p>
      </section>

      {/* Rights */}
      <section className="mb-6">
        <h2 className="mb-3">
          7. Your Rights
        </h2>

        <p className="text-gray-700 mb-4">
          Depending on your jurisdiction, you may have the right to:
        </p>

        <ul className="list-disc pl-5">
          <li className="mb-2">
            Access, correct, or delete personal information
          </li>

          <li className="mb-2">
            Opt out of marketing communications
          </li>

          <li className="mb-2">
            Restrict or object to certain processing activities
          </li>

          <li className="mb-2">
            Receive a copy of your information
          </li>

          <li className="mb-2">
            Lodge a complaint with a supervisory authority
          </li>
        </ul>
      </section>

      {/* Third Party */}
      <section className="mb-6">
        <h2 className="mb-3">
          8. Third-Party Links and Services
        </h2>

        <p >
          Our platform may contain links to third-party websites or services.
          We are not responsible for their privacy practices and encourage you
          to review their policies before sharing information.
        </p>
      </section>

      {/* Children */}
      <section className="mb-6">
        <h2 className="mb-3">
          9. Children’s Privacy
        </h2>

        <p >
          Mosaic Biz Hub is not intended for children under 16. We do not
          knowingly collect personal information from users under this age.
        </p>
      </section>

      {/* Policy Changes */}
      <section className="mb-8">
        <h2 className="mb-3">
          10. Changes to This Privacy Policy
        </h2>

        <p >
          We may update this Privacy Policy periodically to reflect changes in
          our practices or legal requirements. Updated policies will include a
          revised effective date.
        </p>
      </section>

      {/* Contact */}
      <section className="mb-10">
        <h2 className="mb-3">
          Contact Us
        </h2>

        <p >
          If you have questions or requests regarding this Privacy Policy,
          please contact:
        </p>

        <div className="mt-4 text-gray-700">
          <p className="font-semibold">Mosaic Biz Hub Support</p>
          <p>Email: Info@mosaicbizhub.com</p>
        </div>

        <p className="text-gray-700 mt-6">
          We value your trust and are committed to protecting your privacy.
        </p>
      </section>

      {/* CTA Section */}
      <div className="mt-12 w-full">
        <div
          className="w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/contact/becomeVendor.png')" }}
        >
          <div className="bg-[#3333339E] px-4 py-16 text-center text-white sm:px-8 sm:py-24">
            <div className="max-w-[900px] mx-auto">
              <h2 className="text-white text-3xl font-bold mb-2">
                YOUR PRIVACY MATTERS -
              </h2>

              <h2 className="text-white text-3xl font-bold mb-4">
                SAFE • SECURE • TRANSPARENT
              </h2>

              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto my-4" />
              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto mb-8" />

              <p className="text-white text-lg leading-relaxed max-w-[700px] mx-auto mb-10 opacity-95">
                Mosaic Biz Hub is committed to protecting your data while
                delivering a secure and trusted marketplace experience for every
                customer and vendor.
              </p>

              <Link
                href="/vendors"
                className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-gray-800"
              >
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicContentLayout>
  );
};

export default Privacy;