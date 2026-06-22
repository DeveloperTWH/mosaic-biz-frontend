import React from "react";
import Link from "next/link";
import PublicContentLayout from "../../Components/PublicContentLayout";
import { PolicyPageCta } from "../../Components/PolicyPageCta";

const TermsConditions = () => {
  return (
    <PublicContentLayout
      title="Vendor Terms"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Vendor Terms" },
      ]}
      imageUrl="/about.png"
      proseVariant="legal"
      footer={
        <PolicyPageCta
          headline="GROW WITH CONFIDENCE"
          subheadline="JOIN MOSAIC BIZ HUB TODAY!"
          body="Build trust, expand your reach, and connect with customers who value inclusive and community-driven businesses through Mosaic Biz Hub."
          href="/become-a-vendor"
          linkLabel="Become A Vendor"
        />
      }
    >
      <h1 className="mb-2 font-poppins text-3xl font-bold text-brand-navy">
        Terms and Conditions of Service
      </h1>

      <p className="mb-8 text-sm text-brand-muted">
        Last updated: January 2026
      </p>

      {/* Introduction */}
      <section className="mb-6">
        <h2 className="mb-3">Introduction</h2>

        <p className="mb-4">
          Mosaic Biz Hub is a digital platform designed to foster inclusive,
          trust-centered commerce between vendors and customers, underpinned by
          transparency, compliance, and user empowerment.
        </p>

        <p >
          This website is owned and operated by{" "}
          <span className="font-semibold">Mosaic Biz Hub, LLC</span>, a Virginia
          Limited Liability Company. Throughout this website references to
          “Company”, “We”, “Us”, and “Platform” refer to Mosaic Biz Hub.
          References to “Customer” refer to any person or entity accessing the
          Platform. References to “Vendor”, “You”, and “Your” refer to any
          person or entity authorized to sell products or services on the
          Platform.
        </p>
      </section>

      {/* Community Standard */}
      <section className="mb-6">
        <h2 className="mb-3">
          1. Community Standard
        </h2>

        <p >
          Platform is committed to language and practices that foster an
          accessible, inclusive community for users of all backgrounds and
          abilities. Vendors and Customers are entitled to Platform experiences
          free of discriminatory or exclusionary content.
        </p>

        <p className="text-gray-700 mt-4">
          All Vendors must conduct themselves with respect and refrain from
          harassment, discrimination, or abusive conduct. Violations may result
          in suspension or termination of Platform privileges.
        </p>
      </section>

      {/* Vendor Accounts */}
      <section className="mb-6">
        <h2 className="mb-3">
          2. Vendor Accounts
        </h2>

        <p className="mb-4">
          To become an authorized Vendor, an authorized representative of the
          business entity must complete Company’s onboarding process which
          includes providing accurate and complete business identification
          information and undergoing background verification checks.
        </p>

        <p >
          Vendors must provide accurate information about the business entity
          and owner(s). Providing false or misleading information or
          impersonating another person or entity is strictly prohibited.
        </p>
      </section>

      {/* Vendor Qualification */}
      <section className="mb-6">
        <h2 className="mb-3">
          3. Vendor Qualification
        </h2>

        <p >
          Vendor approval is contingent upon successfully completing Company’s
          onboarding process, meeting Platform standards for business operations
          and quality, accepting DEI and accessibility guidelines, and payment
          of required Vendor fees.
        </p>
      </section>

      {/* Vendor Payments */}
      <section className="mb-6">
        <h2 className="mb-3">
          4. Vendor Payments to Company
        </h2>

        <p >
          Vendors will be charged fees for using the Platform based on Vendor’s
          account selection. Additional fees may include background checks,
          profile setup, product/service listings, advertising, and premium
          Platform features.
        </p>
      </section>

      {/* Vendor Profiles */}
      <section className="mb-6">
        <h2 className="mb-3">
          5. Vendor Profiles and Listings
        </h2>

        <p className="text-gray-700 mb-3">
          Vendor listings must include:
        </p>

        <ul className="list-disc pl-5">
          <li className="mb-2">Accurate product or service descriptions</li>
          <li className="mb-2">
            Accurate labels, ingredients, and warnings
          </li>
          <li className="mb-2">
            Original photographs or videos (no stock content)
          </li>
          <li className="mb-2">Pricing in U.S. dollars</li>
          <li className="mb-2">Delivery timelines</li>
          <li className="mb-2">Warranty and return terms</li>
        </ul>

        <p className="text-gray-700 mt-4">
          Company reserves the right to remove misleading or noncompliant
          listings.
        </p>
      </section>

      {/* Vendor Performance */}
      <section className="mb-6">
        <h2 className="mb-3">
          6. Vendor Performance, Metrics, and Badges
        </h2>

        <div className="overflow-x-auto mt-4">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-black text-white">
              <tr>
                <th className="text-left p-4">Metric</th>
                <th className="text-left p-4">Baseline Standard</th>
                <th className="text-left p-4">Consequence for Breach</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-4">Order Fulfillment</td>
                <td className="p-4">98% on-time deliveries</td>
                <td className="p-4">Warning or suspension</td>
              </tr>

              <tr className="border-b border-gray-200">
                <td className="p-4">Quality / Accuracy</td>
                <td className="p-4">&lt;2% defect rate</td>
                <td className="p-4">Remediation plan</td>
              </tr>

              <tr className="border-b border-gray-200">
                <td className="p-4">Customer Rating</td>
                <td className="p-4">≥4.2/5.0 avg. last 90 days</td>
                <td className="p-4">Temporary badge downgrade</td>
              </tr>

              <tr>
                <td className="p-4">Dispute Response Time</td>
                <td className="p-4">48 business hours</td>
                <td className="p-4">Platform intervention</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Privacy */}
      <section className="mb-6">
        <h2 className="mb-3">
          7. Vendor Privacy and Data Processing
        </h2>

        <p >
          Vendor acknowledges and agrees to handle and process Customer data in
          accordance with Company’s Privacy Policy.
        </p>
      </section>

      {/* Prohibited Activities */}
      <section className="mb-6">
        <h2 className="mb-3">
          8. Vendor Prohibited Activities
        </h2>

        <ul className="list-disc pl-5">
          <li className="mb-2">Violating laws or regulations</li>
          <li className="mb-2">Fraudulent activity</li>
          <li className="mb-2">
            Harassment, abuse, discrimination, or intimidation
          </li>
          <li className="mb-2">
            Uploading viruses or malicious code
          </li>
          <li className="mb-2">
            Infringing intellectual property rights
          </li>
          <li className="mb-2">
            Providing false or misleading information
          </li>
        </ul>
      </section>

      {/* Orders */}
      <section className="mb-6">
        <h2 className="mb-3">
          9. Customer Orders and Purchases
        </h2>

        <p >
          Purchases initiated on the Platform will be directed to the Vendor’s
          website to complete the purchase. Vendors are responsible for
          processing payments securely and collecting applicable taxes.
        </p>
      </section>

      {/* Shipping */}
      <section className="mb-6">
        <h2 className="mb-3">10. Shipping</h2>

        <p >
          Customers are responsible for ensuring shipping information is
          accurate. Vendors must provide clear shipping and processing
          information on their profile.
        </p>
      </section>

      {/* Returns */}
      <section className="mb-6">
        <h2 className="mb-3">
          11. Returns or Refund Policy
        </h2>

        <p className="mb-4">
          Vendors must clearly display their return and refund policy. Approved
          refund requests should be issued to the original payment method within
          seven (7) business days.
        </p>

        <p className="text-gray-700 mb-3">
          Certain products may not be eligible for returns or refunds:
        </p>

        <ul className="list-disc pl-5">
          <li className="mb-2">Service purchases</li>
          <li className="mb-2">Custom products</li>
          <li className="mb-2">Personal care products</li>
          <li className="mb-2">Sale items</li>
          <li className="mb-2">Gift cards</li>
        </ul>
      </section>

      {/* Suspension */}
      <section className="mb-6">
        <h2 className="mb-3">
          12. Suspension, Termination, and Remedies
        </h2>

        <p >
          Company may suspend or terminate Vendor accounts for breaches of these
          Terms, repeated performance failures, noncompliance with laws, or
          conduct harmful to the Platform’s integrity.
        </p>
      </section>

      {/* Warranty */}
      <section className="mb-6">
        <h2 className="mb-3">
          13. Disclaimer of Warranty
        </h2>

        <p >
          All Platform services are provided “as is” and “as available” without
          warranties of any kind, either express or implied.
        </p>
      </section>

      {/* Liability */}
      <section className="mb-6">
        <h2 className="mb-3">
          14. Limitation of Liability
        </h2>

        <p >
          Company shall not be liable for any direct, indirect, incidental,
          punitive, special, or consequential damages arising from use of the
          Platform or Vendor transactions.
        </p>
      </section>

      {/* Governing Law */}
      <section className="mb-8">
        <h2 className="mb-3">
          15. Governing Law
        </h2>

        <p >
          These Terms and Conditions of Service shall be governed and construed
          in accordance with the laws of the Commonwealth of Virginia.
        </p>
      </section>

      {/* Contact */}
      <section className="mb-10">
        <h2 className="mb-3">
          Contact Information
        </h2>

        <p >
          Questions about these Terms and Conditions of Service should be sent
          to:
        </p>

        <p className="mt-3 font-medium">
          info@mosaicbizhub.com
        </p>
      </section>

    </PublicContentLayout>
  );
};

export default TermsConditions;