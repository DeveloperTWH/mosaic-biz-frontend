import React from "react";
import Link from "next/link";
import PublicContentLayout from "../Components/PublicContentLayout";

const ReturnRefundPolicy = () => {
  return (
    <PublicContentLayout
      title="Return & Refund Policy"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Return & Refund Policy" },
      ]}
      imageUrl="/about.png"
      proseVariant="legal"
    >
      <h1 className="mb-2 font-poppins text-3xl font-bold text-brand-navy">
        Mosaic Biz Hub Return & Refund Policy
      </h1>

      <p className="mb-8 text-sm text-brand-muted">
        Effective upon platform launch — 2026
      </p>

      {/* Intro */}
      <section className="mb-6">
        <h2 className="mb-3">
          Introduction
        </h2>

        <p className="text-gray-700 mb-4">
          Mosaic Biz Hub is committed to creating a trusted, transparent, and
          customer-centered marketplace.
        </p>

        <p >
          Because purchases are completed directly on each Vendor’s website, all
          returns, exchanges, and refunds are governed first by the Vendor’s own
          posted Return & Refund Policy.
        </p>

        <p className="text-gray-700 mt-4">
          If a Vendor does not have a clearly posted policy on their website or
          Mosaic Biz Hub profile, the Mosaic Biz Hub Standard Return & Refund
          Policy will automatically apply.
        </p>
      </section>

      {/* Vendor Policy */}
      <section className="mb-6">
        <h2 className="mb-3">
          1. Vendor-Provided Return & Refund Policies
        </h2>

        <p className="text-gray-700 mb-4">
          Vendor policies take precedence when clearly posted and accessible.
        </p>

        <ul className="list-disc pl-5">
          <li className="mb-2">
            Vendors must maintain a clearly visible Return & Refund Policy
          </li>

          <li className="mb-2">
            Customers are responsible for reviewing Vendor policies before
            purchase
          </li>

          <li className="mb-2">
            Refund and return requests must be submitted directly to the Vendor
          </li>

          <li className="mb-2">
            Vendors must acknowledge requests within 48 hours
          </li>

          <li className="mb-2">
            Approved refunds must be processed within 7 business days
          </li>
        </ul>
      </section>

      {/* Default Policy */}
      <section className="mb-6">
        <h2 className="mb-3">
          2. Mosaic Biz Hub Standard Return & Refund Policy
        </h2>

        <p className="text-gray-700 mb-4">
          This policy applies only when a Vendor does not have a posted policy.
        </p>

        {/* Eligibility */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            2.1 Eligibility Window
          </h3>

          <p className="text-gray-700 mb-3">
            Customers must notify the Vendor within 48 hours of receiving the
            order if there are issues including:
          </p>

          <ul className="list-disc pl-5">
            <li className="mb-2">Missing items</li>
            <li className="mb-2">Incorrect items</li>
            <li className="mb-2">Damaged or defective products</li>
            <li className="mb-2">Products not as described</li>
          </ul>

          <p className="text-gray-700 mt-4">
            Requests submitted after 48 hours may not qualify for a return or
            refund.
          </p>
        </div>

        {/* Condition */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            2.2 Condition Requirements
          </h3>

          <p className="text-gray-700 mb-3">
            To qualify for a return or refund, products must be:
          </p>

          <ul className="list-disc pl-5">
            <li className="mb-2">Unused</li>
            <li className="mb-2">In original condition</li>
            <li className="mb-2">In original packaging</li>
            <li className="mb-2">
              With all tags, labels, and accessories included
            </li>
            <li className="mb-2">
              Accompanied by proof of purchase
            </li>
          </ul>
        </div>

        {/* Non Returnable */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            2.3 Non-Returnable / Non-Refundable Items
          </h3>

          <p className="text-gray-700 mb-3">
            The following items are not eligible for return or refund:
          </p>

          <ul className="list-disc pl-5">
            <li className="mb-2">Services</li>
            <li className="mb-2">Custom or personalized products</li>
            <li className="mb-2">
              Personal care or hygiene products
            </li>
            <li className="mb-2">Digital products</li>
            <li className="mb-2">Sale or clearance items</li>
            <li className="mb-2">Gift cards</li>
            <li className="mb-2">
              Orders shipped to incorrect addresses provided by Customers
            </li>
          </ul>
        </div>

        {/* Shipping Errors */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            2.4 Shipping Errors
          </h3>

          <p className="text-gray-700 mb-4">
            Customers are responsible for entering accurate shipping
            information.
          </p>

          <ul className="list-disc pl-5">
            <li className="mb-2">
              Mosaic Biz Hub and Vendors are not liable for incorrect addresses
              entered by Customers
            </li>

            <li className="mb-2">
              Customers may be responsible for reshipping fees
            </li>
          </ul>
        </div>

        {/* Refund Method */}
        <div>
          <h3 className="text-lg font-semibold mb-2">
            2.5 Refund Method
          </h3>

          <p >
            Approved refunds will be issued to the original form of payment
            within 7 business days of Vendor approval.
          </p>
        </div>
      </section>

      {/* Dispute */}
      <section className="mb-6">
        <h2 className="mb-3">
          3. Dispute Escalation
        </h2>

        <p className="text-gray-700 mb-4">
          If a Customer cannot resolve an issue directly with a Vendor:
        </p>

        <ul className="list-disc pl-5">
          <li className="mb-2">
            Customers may escalate disputes to Mosaic Biz Hub Support
          </li>

          <li className="mb-2">
            Mosaic Biz Hub will review disputes according to the Platform’s
            Dispute Resolution Process
          </li>

          <li className="mb-2">
            Vendors must cooperate in good faith during reviews
          </li>

          <li className="mb-2">
            Mosaic Biz Hub may mediate disputes but does not issue refunds
            directly
          </li>
        </ul>
      </section>

      {/* Vendor Compliance */}
      <section className="mb-6">
        <h2 className="mb-3">
          4. Vendor Compliance Requirements
        </h2>

        <ul className="list-disc pl-5">
          <li className="mb-2">
            Vendors must maintain an accurate and accessible policy
          </li>

          <li className="mb-2">
            Vendors without a policy automatically adopt the Mosaic Biz Hub
            Standard Policy
          </li>

          <li className="mb-2">
            Vendors must respond to Customer inquiries within 48 hours
          </li>

          <li className="mb-2">
            Vendors must process approved refunds within 7 business days
          </li>

          <li className="mb-2">
            Repeated violations may result in suspension or termination
          </li>
        </ul>
      </section>

      {/* Disclaimer */}
      <section className="mb-8">
        <h2 className="mb-3">
          5. Platform Disclaimer
        </h2>

        <p >
          Mosaic Biz Hub does not process payments, store payment information,
          or fulfill orders. All transactions occur directly between Customers
          and Vendors.
        </p>

        <p className="text-gray-700 mt-4">
          Mosaic Biz Hub provides dispute support but is not responsible for
          Vendor errors, product quality, or fulfillment issues.
        </p>
      </section>

      {/* Contact */}
      <section className="mb-10">
        <h2 className="mb-3">
          6. Contact Information
        </h2>

        <p >
          For dispute escalation or questions regarding this policy, contact:
        </p>

        <p className="text-gray-700 mt-4 font-medium">
          info@mosaicbizhub.com
        </p>
      </section>

      {/* CTA Section */}
      <div className="mt-12 w-full">
        <div
          className="w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/contact/becomeVendor.png')" }}
        >
          <div className="bg-[#3333339E] py-24 px-8 text-center text-white">
            <div className="max-w-[900px] mx-auto">
              <h2 className="text-white text-3xl font-bold mb-2">
                SHOP WITH CONFIDENCE -
              </h2>

              <h2 className="text-white text-3xl font-bold mb-4">
                TRANSPARENT RETURNS & REFUNDS
              </h2>

              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto my-4" />
              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto mb-8" />

              <p className="text-white text-lg leading-relaxed max-w-[700px] mx-auto mb-10 opacity-95">
                Mosaic Biz Hub is committed to maintaining a trusted marketplace
                by supporting clear return policies, fair dispute resolution,
                and transparent customer experiences.
              </p>

              <Link
                href="/vendors"
                className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-gray-800"
              >
                Browse Vendors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicContentLayout>
  );
};

export default ReturnRefundPolicy;