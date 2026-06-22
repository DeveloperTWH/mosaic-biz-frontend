import React from "react";
import Link from "next/link";
import PublicContentLayout from "../Components/PublicContentLayout";

const Dispute = () => {
  return (
    <PublicContentLayout
      title="Dispute Resolution"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Dispute Resolution" },
      ]}
      imageUrl="/about.png"
      proseVariant="legal"
    >
      <h1 className="mb-2 font-poppins text-3xl font-bold text-brand-navy">
        Dispute Resolution Process
      </h1>

      <p className="mb-8 text-sm text-brand-muted">
        Mosaic Biz Hub — A fair, transparent, and community-centered approach
        to resolving issues.
      </p>

      {/* Intro */}
      <section className="mb-6">
        <h2 className="mb-3">
          Introduction
        </h2>

        <p >
          Mosaic Biz Hub is committed to maintaining a trusted marketplace where
          Customers and Vendors can resolve concerns quickly, fairly, and
          respectfully.
        </p>

        <p className="text-gray-700 mt-4">
          This Dispute Resolution Process outlines the steps both parties must
          follow when issues arise related to orders, refunds, returns, or
          customer experiences.
        </p>
      </section>

      {/* Step 1 */}
      <section className="mb-8">
        <h2 className="mb-3">
          1. Step One — Customer Contacts the Vendor Directly
        </h2>

        <p className="text-gray-700 mb-4">
          Customers must first attempt to resolve the issue directly with the
          Vendor.
        </p>

        <div className="mb-5">
          <h3 className="text-lg font-semibold mb-2">
            Customer Responsibilities
          </h3>

          <ul className="list-disc pl-5">
            <li className="mb-2">
              Contact the Vendor using the information provided on the Vendor’s
              profile or website
            </li>

            <li className="mb-2">
              Provide order details, proof of purchase, and supporting evidence
            </li>

            <li className="mb-2">
              Allow the Vendor up to 48 hours to respond
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            Vendor Responsibilities
          </h3>

          <ul className="list-disc pl-5">
            <li className="mb-2">
              Acknowledge Customer communication within 48 hours
            </li>

            <li className="mb-2">
              Review the issue in good faith
            </li>

            <li className="mb-2">
              Apply their posted Return & Refund Policy
            </li>

            <li className="mb-2">
              Provide a clear resolution or next steps
            </li>
          </ul>
        </div>

        <p className="text-gray-700 mt-4">
          If the issue is resolved at this stage, the dispute is considered
          closed.
        </p>
      </section>

      {/* Step 2 */}
      <section className="mb-8">
        <h2 className="mb-3">
          2. Step Two — Vendor Provides a Resolution
        </h2>

        <p className="text-gray-700 mb-4">
          Vendors may provide one of the following resolutions:
        </p>

        <ul className="list-disc pl-5">
          <li className="mb-2">Replacement</li>
          <li className="mb-2">Refund</li>
          <li className="mb-2">Exchange</li>
          <li className="mb-2">
            Store credit (if allowed by Vendor policy)
          </li>
          <li className="mb-2">
            Policy-based denial with explanation
          </li>
        </ul>

        <p className="text-gray-700 mt-4">
          If the Customer accepts the resolution, the matter is closed.
        </p>
      </section>

      {/* Step 3 */}
      <section className="mb-8">
        <h2 className="mb-3">
          3. Step Three — Customer Escalates to Mosaic Biz Hub Support
        </h2>

        <p className="text-gray-700 mb-4">
          If the Vendor fails to respond within 48 hours or the Customer
          believes Platform policies were violated, the issue may be escalated
          to Mosaic Biz Hub Support.
        </p>

        <h3 className="text-lg font-semibold mb-2">
          Customer Must Provide
        </h3>

        <ul className="list-disc pl-5">
          <li className="mb-2">Order details</li>
          <li className="mb-2">Proof of purchase</li>
          <li className="mb-2">
            Screenshots of communication attempts
          </li>
          <li className="mb-2">
            Photos or supporting evidence
          </li>
          <li className="mb-2">
            Explanation of the unresolved issue
          </li>
        </ul>
      </section>

      {/* Step 4 */}
      <section className="mb-8">
        <h2 className="mb-3">
          4. Step Four — Mosaic Biz Hub Review
        </h2>

        <p className="text-gray-700 mb-4">
          Mosaic Biz Hub will review all submitted documentation and compare the
          Vendor’s actions against:
        </p>

        <ul className="pl-5 list-disc text-gray-700 mb-5">
          <li className="mb-2">
            Vendor Return & Refund Policies
          </li>

          <li className="mb-2">
            Mosaic Biz Hub Standard Policy
          </li>

          <li className="mb-2">
            Platform Terms & Conditions
          </li>

          <li className="mb-2">
            Platform performance standards
          </li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">
          Vendor Responsibilities During Review
        </h3>

        <ul className="list-disc pl-5">
          <li className="mb-2">
            Respond within 48 hours
          </li>

          <li className="mb-2">
            Provide requested documentation
          </li>

          <li className="mb-2">
            Cooperate in good faith
          </li>
        </ul>

        <p className="text-gray-700 mt-4">
          Failure to cooperate may result in badge downgrades, suspension, or
          removal from the Platform.
        </p>
      </section>

      {/* Step 5 */}
      <section className="mb-8">
        <h2 className="mb-3">
          5. Step Five — Determination & Guidance
        </h2>

        <p className="text-gray-700 mb-4">
          After reviewing the dispute, Mosaic Biz Hub may issue one of the
          following outcomes:
        </p>

        <ul className="list-disc pl-5">
          <li className="mb-2">
            Vendor must issue a refund
          </li>

          <li className="mb-2">
            Vendor must replace or resend the item
          </li>

          <li className="mb-2">
            Vendor must honor their posted policy
          </li>

          <li className="mb-2">
            Customer request denied with explanation
          </li>

          <li className="mb-2">
            Mutual compromise recommended
          </li>
        </ul>

        <p className="text-gray-700 mt-4">
          Mosaic Biz Hub does not process payments or directly issue refunds.
          Vendors remain responsible for completing all required actions.
        </p>
      </section>

      {/* Step 6 */}
      <section className="mb-8">
        <h2 className="mb-3">
          6. Step Six — Enforcement
        </h2>

        <p className="text-gray-700 mb-4">
          If a Vendor refuses to comply with a final determination, Mosaic Biz
          Hub may take corrective action including:
        </p>

        <ul className="list-disc pl-5">
          <li className="mb-2">Badge downgrade</li>
          <li className="mb-2">Temporary suspension</li>
          <li className="mb-2">Permanent termination</li>
          <li className="mb-2">
            Removal of non-compliant listings
          </li>
          <li className="mb-2">
            Performance remediation requirements
          </li>
        </ul>
      </section>

      {/* Step 7 */}
      <section className="mb-8">
        <h2 className="mb-3">
          7. Step Seven — Final Closure
        </h2>

        <p className="text-gray-700 mb-4">
          A dispute is considered closed when:
        </p>

        <ul className="list-disc pl-5">
          <li className="mb-2">
            The Vendor completes the required action
          </li>

          <li className="mb-2">
            The Customer confirms resolution
          </li>

          <li className="mb-2">
            Mosaic Biz Hub issues a final determination
          </li>
        </ul>

        <p className="text-gray-700 mt-4">
          All decisions made during dispute review are final.
        </p>
      </section>

      {/* Principles */}
      <section className="mb-10">
        <h2 className="mb-3">
          8. Guiding Principles
        </h2>

        <p className="text-gray-700 mb-4">
          Mosaic Biz Hub resolves disputes using the following principles:
        </p>

        <ul className="list-disc pl-5">
          <li className="mb-2">Fairness</li>
          <li className="mb-2">Transparency</li>
          <li className="mb-2">Documentation</li>
          <li className="mb-2">
            Vendor policy compliance
          </li>
          <li className="mb-2">
            Consumer protection best practices
          </li>
        </ul>

        <p className="text-gray-700 mt-4">
          Our goal is to maintain a marketplace built on trust,
          accountability, and community integrity.
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
                FAIR • TRANSPARENT • ACCOUNTABLE
              </h2>

              <h2 className="text-white text-3xl font-bold mb-4">
                RESOLVING DISPUTES WITH TRUST
              </h2>

              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto my-4" />
              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto mb-8" />

              <p className="text-white text-lg leading-relaxed max-w-[700px] mx-auto mb-10 opacity-95">
                Mosaic Biz Hub is committed to maintaining a transparent and
                community-centered marketplace where Customers and Vendors can
                resolve concerns respectfully and efficiently.
              </p>

              <Link
                href="/contact"
                className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-gray-800"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicContentLayout>
  );
};

export default Dispute;