import React from "react";
import Link from "next/link";

const ConsumerTrustBadges = () => {
  const badgeLevels = [
    {
      badge: "Pending",
      status: "Hidden",
      meaning:
        "Businesses are still being reviewed and cannot list products or services yet.",
    },
    {
      badge: "Silver",
      status: "Verified",
      meaning:
        "The business has passed core verification checks and is a legitimate registered business.",
    },
    {
      badge: "Gold",
      status: "Fully Verified",
      meaning:
        "The business has provided additional proof and has a stronger online presence.",
    },
    {
      badge: "Platinum",
      status: "High Trust",
      meaning:
        "Businesses completed additional verification steps and consistently meet platform standards.",
    },
    {
      badge: "💎 Diamond",
      status: "Top Tier",
      meaning:
        "Our highest level for businesses demonstrating excellence, reliability, and community impact.",
    },
  ];

  return (
    <div className="max-w-[900px] mx-auto p-8 font-sans leading-relaxed">
      <h1 className="mb-2 text-3xl font-bold">
        Trust Badges - Consumer
      </h1>

      <p className="text-gray-500 mb-4 text-sm">
        Last updated: January 2026
      </p>

      <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Badges indicate verified onboarding progress reviewed by Mosaic Biz Hub — not customer ratings or automated scores.
      </div>

      {/* Introduction */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Mosaic Biz Hub Trust Badges
        </h2>

        <p className="text-gray-700 mb-4">
          So you always know who you’re buying from.
        </p>

        <p className="text-gray-700">
          At Mosaic Biz Hub, every business you see has gone through a real
          verification process before they’re allowed to list products or
          services. Our Trust Badge system makes that process visible to you, so
          you can shop with confidence.
        </p>
      </section>

      {/* What Badge Means */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          1. What a Trust Badge Means
        </h2>

        <p className="text-gray-700 mb-4">
          A Trust Badge shows you how much of a business’s information has been
          verified by our team.
        </p>

        <p className="text-gray-700 mb-3">
          It’s our way of making sure:
        </p>

        <ul className="pl-5 list-disc text-gray-700">
          <li className="mb-2">The business is legitimate</li>
          <li className="mb-2">Their information is accurate</li>
          <li className="mb-2">They are who they say they are</li>
          <li className="mb-2">
            They meet our community standards
          </li>
        </ul>

        <p className="text-gray-700 mt-4">
          No business can appear on the platform until they pass our first
          level of verification.
        </p>
      </section>

      {/* Badge Levels */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          2. The Badge Levels (What You’ll See as a Shopper)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-black text-white">
              <tr>
                <th className="text-left p-4">Badge</th>
                <th className="text-left p-4">Level</th>
                <th className="text-left p-4">What It Means</th>
              </tr>
            </thead>

            <tbody>
              {badgeLevels.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-4 font-semibold text-gray-900">
                    {item.badge}
                  </td>

                  <td className="p-4 text-gray-700 font-medium">
                    {item.status}
                  </td>

                  <td className="p-4 text-gray-700">
                    {item.meaning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Verification */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          3. How We Verify Businesses
        </h2>

        <p className="text-gray-700 mb-4">
          Before a business can appear on Mosaic Biz Hub, we check:
        </p>

        <ul className="pl-5 list-disc text-gray-700">
          <li className="mb-2">Legal business information</li>
          <li className="mb-2">EIN and/or business license</li>
          <li className="mb-2">
            Accuracy of registration details
          </li>
          <li className="mb-2">
            Website or social media links
          </li>
          <li className="mb-2">Ownership information</li>
          <li className="mb-2">Contact details</li>
        </ul>

        <p className="text-gray-700 mt-4">
          Only after businesses pass these checks can they list products or
          services.
        </p>
      </section>

      {/* Why This Matters */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          4. Why This Matters for You
        </h2>

        <p className="text-gray-700 mb-4">
          Our Trust Badge system helps you:
        </p>

        <ul className="pl-5 list-disc text-gray-700">
          <li className="mb-2">Shop confidently</li>
          <li className="mb-2">
            Support real, verified minority-owned businesses
          </li>
          <li className="mb-2">
            Know who you’re buying from
          </li>
          <li className="mb-2">
            Discover top-performing vendors
          </li>
          <li className="mb-2">
            Avoid scams or unverified sellers
          </li>
        </ul>

        <p className="text-gray-700 mt-4">
          Your trust is the foundation of our marketplace — and we protect it
          at every step.
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
                SHOP WITH CONFIDENCE -
              </h2>

              <h2 className="text-white text-3xl font-bold mb-4">
                TRUST VERIFIED BUSINESSES!
              </h2>

              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto my-4" />
              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto mb-8" />

              <p className="text-white text-lg leading-relaxed max-w-[700px] mx-auto mb-10 opacity-95">
                Mosaic Biz Hub helps you discover verified, community-driven
                businesses you can trust. Every badge represents transparency,
                accountability, and confidence in your shopping experience.
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

export default ConsumerTrustBadges;