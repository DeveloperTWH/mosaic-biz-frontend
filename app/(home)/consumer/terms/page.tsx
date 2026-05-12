import React from "react";
import Link from "next/link";

const CustomerTermsConditions = () => {
  return (
    <div className="max-w-[900px] mx-auto p-8 font-sans leading-relaxed">
      <h1 className="mb-2 text-3xl font-bold">
        Terms and Conditions of Service
      </h1>

      <p className="text-gray-500 mb-8 text-sm">
        Last updated: January 2026
      </p>

      {/* Introduction */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Introduction
        </h2>

        <p className="text-gray-700 mb-4">
          Mosaic Biz Hub is a digital platform designed to foster inclusive,
          trust-centered commerce between vendors and customers, underpinned by
          transparency, compliance, and user empowerment.
        </p>

        <p className="text-gray-700">
          This website is owned and operated by{" "}
          <span className="font-semibold">Mosaic Biz Hub, LLC</span>, a Virginia
          Limited Liability Company. Throughout this website references to
          “Company”, “We”, “Us”, and “Platform” refer to Mosaic Biz Hub.
        </p>

        <p className="text-gray-700 mt-4">
          By accessing and using this Platform, You acknowledge and agree to be
          legally bound by these Terms and Conditions of Service.
        </p>
      </section>

      {/* Community Standard */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          1. Community Standard
        </h2>

        <p className="text-gray-700">
          Platform is committed to creating an accessible and inclusive
          community for users of all backgrounds and abilities.
        </p>

        <p className="text-gray-700 mt-4">
          Customers and Vendors are entitled to experiences free from
          discriminatory or abusive behavior. Violations may result in
          suspension or termination of Platform privileges.
        </p>
      </section>

      {/* Permitted Uses */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          2. Permitted and Acceptable Uses
        </h2>

        <p className="text-gray-700">
          Company grants You a limited, non-exclusive, non-transferable,
          revocable license to use the Platform to browse, purchase products and
          services, and interact with Vendors and Customers in compliance with
          these Terms.
        </p>
      </section>

      {/* Prohibited Uses */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          3. Prohibited Uses
        </h2>

        <ul className="pl-5 list-disc text-gray-700">
          <li className="mb-2">
            Violating laws, regulations, or ordinances
          </li>

          <li className="mb-2">
            Fraudulent or misleading activity
          </li>

          <li className="mb-2">
            Harassment, discrimination, abuse, or intimidation
          </li>

          <li className="mb-2">
            Uploading malicious code or viruses
          </li>

          <li className="mb-2">
            Intellectual property infringement
          </li>

          <li className="mb-2">
            Reproducing or exploiting Platform content
          </li>
        </ul>
      </section>

      {/* Relationship */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          4. Company, Vendor, and Customer Relationship
        </h2>

        <p className="text-gray-700">
          These Terms do not create any agency, employment, franchise,
          partnership, or joint venture relationship between Company, Vendors,
          and Customers.
        </p>
      </section>

      {/* Account Setup */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          5. Account Setup
        </h2>

        <p className="text-gray-700">
          Customers and Vendors must provide accurate information when creating
          accounts. False or misleading information, impersonation, or offensive
          account names are prohibited.
        </p>

        <p className="text-gray-700 mt-4">
          Company reserves the right to deactivate or terminate any account that
          violates these Terms.
        </p>
      </section>

      {/* Badge System */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          6. Customer Badge System
        </h2>

        <p className="text-gray-700">
          Customers may earn badges based on purchasing milestones, referrals,
          reviews, and engagement activities as described in the Platform’s
          Trust Badge System.
        </p>
      </section>

      {/* Products */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          7. Products and Services Offered
        </h2>

        <p className="text-gray-700">
          Vendors are responsible for the accuracy of their product and service
          listings, including descriptions and photographs.
        </p>

        <p className="text-gray-700 mt-4">
          Company is not liable for distorted depictions caused by Customer
          devices or display settings.
        </p>
      </section>

      {/* Orders */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          8. Customer Orders and Purchases
        </h2>

        <p className="text-gray-700">
          Purchases initiated on the Platform are completed on Vendor websites.
          Customers are responsible for ensuring the accuracy of submitted
          information.
        </p>
      </section>

      {/* Modifications */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          9. Customer Order Modifications / Cancellations
        </h2>

        <p className="text-gray-700">
          Order modifications and cancellations must be directed to the Vendor
          and are subject to Vendor policies and procedures.
        </p>
      </section>

      {/* Shipping */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          10. Shipping
        </h2>

        <p className="text-gray-700">
          Customers are responsible for providing accurate shipping information.
          Company and Vendors are not liable for incorrect addresses submitted
          by Customers.
        </p>
      </section>

      {/* Refunds */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          11. Returns or Refund Policy
        </h2>

        <p className="text-gray-700 mb-4">
          Vendors must clearly display their return and refund policy on their
          profile.
        </p>

        <p className="text-gray-700 mb-3">
          The following items may not qualify for returns or refunds:
        </p>

        <ul className="pl-5 list-disc text-gray-700">
          <li className="mb-2">Service purchases</li>
          <li className="mb-2">Custom products</li>
          <li className="mb-2">Personal care products</li>
          <li className="mb-2">Sale items</li>
          <li className="mb-2">Gift cards</li>
          <li className="mb-2">
            Incorrect shipping address purchases
          </li>
        </ul>
      </section>

      {/* Disputes */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          12. Dispute Escalation
        </h2>

        <p className="text-gray-700">
          Customers and Vendors are encouraged to resolve disputes in good faith
          through the Platform’s messaging and support channels.
        </p>
      </section>

      {/* Privacy */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          13. Privacy Policy
        </h2>

        <p className="text-gray-700">
          Your use of the Platform constitutes consent to the data practices
          outlined in the Platform’s Privacy Policy.
        </p>
      </section>

      {/* Warranty */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          14. Disclaimer of Warranty
        </h2>

        <p className="text-gray-700">
          All Platform products and services are provided “as is” and “as
          available” without warranties of any kind.
        </p>
      </section>

      {/* Liability */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          15. Limitation of Liability
        </h2>

        <p className="text-gray-700">
          Company shall not be liable for any direct, indirect, incidental,
          punitive, special, or consequential damages arising from Platform use
          or transactions.
        </p>
      </section>

      {/* Class Action */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          16. Class Action Waiver
        </h2>

        <p className="text-gray-700">
          Claims may only be pursued individually and not as part of a class,
          representative, or collective action.
        </p>
      </section>

      {/* Dispute Resolution */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          17. Dispute Resolution
        </h2>

        <p className="text-gray-700">
          Any disputes arising under these Terms shall be resolved through
          third-party mediation or arbitration as determined by Platform.
        </p>
      </section>

      {/* Governing Law */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          18. Governing Law
        </h2>

        <p className="text-gray-700">
          These Terms and Conditions shall be governed and interpreted under the
          laws of the Commonwealth of Virginia.
        </p>
      </section>

      {/* Contact */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">
          Contact Information
        </h2>

        <p className="text-gray-700">
          Questions regarding these Terms and Conditions should be sent to:
        </p>

        <p className="text-gray-700 mt-3 font-medium">
          info@mosaicbizhub.com
        </p>
      </section>

      {/* CTA Section */}
      <div className="relative left-1/2 right-1/2 w-screen ml-[-50vw] mr-[-50vw] mt-12 mb-8">
        <div
          className="w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/contact/becomeVendor.png')" }}
        >
          <div className="bg-[#3333339E] py-24 px-8 text-center text-white">
            <div className="max-w-[900px] mx-auto">
              <h2 className="text-white text-3xl font-bold mb-2">
                SAFE • VERIFIED • TRUSTED
              </h2>

              <h2 className="text-white text-3xl font-bold mb-4">
                EXPERIENCE COMMERCE WITH CONFIDENCE
              </h2>

              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto my-4" />
              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto mb-8" />

              <p className="text-white text-lg leading-relaxed max-w-[700px] mx-auto mb-10 opacity-95">
                Mosaic Biz Hub is committed to creating a transparent,
                inclusive, and secure marketplace where Customers and Vendors
                can connect with confidence.
              </p>

              <Link
                href="/vendors"
                className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-gray-800"
              >
                Explore Vendors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTermsConditions;