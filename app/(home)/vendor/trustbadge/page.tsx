import React from "react";
import Link from "next/link";

const TrustBadges = () => {
  const badgeLevels = [
    {
      score: "0–29",
      badge: "Pending",
      meaning:
        "We’re still verifying your business. Your listing stays hidden.",
    },
    {
      score: "30–39",
      badge: "Silver",
      meaning:
        "You meet our basic trust standards. Your listing is visible.",
    },
    {
      score: "40–49",
      badge: "Gold",
      meaning:
        "You’re fully verified and appear higher in search results.",
    },
    {
      score: "50–79",
      badge: "Platinum",
      meaning: "You’re a top performer with strong visibility.",
    },
    {
      score: "80–100",
      badge: "💎 Diamond",
      meaning:
        "You’re an elite, community-driven business with premium placement.",
    },
  ];

  return (
    <div className="max-w-[900px] mx-auto p-8 font-sans leading-relaxed">
      <h1 className="mb-2 text-3xl font-bold">Trust Badges - Vendor</h1>

      <p className="text-gray-500 mb-8 text-sm">
        Last updated: January 2026
      </p>

      {/* Introduction */}
      <section className="mb-6">
        <p className="text-gray-700 font-bold">We aim to show customers your business is real, reliable, and ready.</p>
        <p className="text-gray-700">
          We aim to show customers your business is real, reliable, and ready.
          When you join <strong>Mosaic Biz Hub</strong>, you earn a Trust Badge.
          Your badge tells customers how complete your business verification is
          — similar to a verified checkmark on social media but built for our
          platform’s businesses.
        </p>

        <p className="text-gray-700 mt-4">
          The more information our vendors verify, the higher your badge level
          becomes.
        </p>
      </section>

      {/* Trust Score */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          1. How Your Trust Score Works
        </h2>

        <p className="text-gray-700 mb-4">
          You earn points by completing basic verification steps:
        </p>

        <ul className="pl-5 list-disc text-gray-700">
          <li className="mb-3">
            <span className="font-semibold">
              Legal & Compliance (10 points):
            </span>{" "}
            You get points when we confirm your EIN or business license.
          </li>

          <li className="mb-3">
            <span className="font-semibold">
              Complete Your Registration (10 points):
            </span>{" "}
            You earn points by completing Step 1 and confirming your information
            is accurate.
          </li>

          <li className="mb-3">
            <span className="font-semibold">
              Online Presence (5 points each):
            </span>{" "}
            Add your website or social media links. If they belong to your
            business and open correctly, you earn points.
          </li>
        </ul>

        <p className="text-gray-700 mt-4">
          These are the only categories used for MVP. Everything else comes
          later.
        </p>
      </section>

      {/* Badge Levels */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          2. Badge Levels (What Customers See)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-black text-white">
              <tr>
                <th className="text-left p-4">Your Score</th>
                <th className="text-left p-4">Badge</th>
                <th className="text-left p-4">What It Means</th>
              </tr>
            </thead>

            <tbody>
              {badgeLevels.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-4 text-gray-700 font-medium">
                    {item.score}
                  </td>

                  <td className="p-4 font-semibold text-gray-900">
                    {item.badge}
                  </td>

                  <td className="p-4 text-gray-700">{item.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Increase Badge */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          3. How to Increase Your Badge Level
        </h2>

        <p className="text-gray-700 mb-3">
          You can level up by:
        </p>

        <ul className="pl-5 list-disc text-gray-700">
          <li className="mb-2">
            Uploading your EIN or verifying your business license
          </li>

          <li className="mb-2">
            Adding your website or social media links
          </li>

          <li className="mb-2">
            Completing all required fields in Step 1
          </li>

          <li className="mb-2">
            (Future) Adding reviews, community impact, or performance data
          </li>
        </ul>

        <p className="text-gray-700 mt-4">
          Only the first three matter for launch. Everything else activates in
          future phases.
        </p>
      </section>

      {/* Why This Matters */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          4. Why This Matters for You
        </h2>

        <p className="text-gray-700 mb-3">
          Higher badges unlock:
        </p>

        <ul className="pl-5 list-disc text-gray-700">
          <li className="mb-2">Better visibility in search</li>
          <li className="mb-2">Featured placement</li>
          <li className="mb-2">More customer trust</li>
          <li className="mb-2">Spotlight opportunities</li>
          <li className="mb-2">Stronger credibility</li>
        </ul>

        <p className="text-gray-700 mt-4">
          Your badge is your trust signal — it helps customers feel confident
          buying from you.
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
                BUILD TRUST -
              </h2>

              <h2 className="text-white text-3xl font-bold mb-4">
                VERIFY YOUR BUSINESS TODAY!
              </h2>

              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto my-4" />
              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto mb-8" />

              <p className="text-white text-lg leading-relaxed max-w-[700px] mx-auto mb-10 opacity-95">
                Increase your visibility, earn customer confidence, and unlock
                premium placement opportunities by completing your business
                verification on Mosaic Biz Hub.
              </p>

              <Link
                href="/become-a-vendor"
                className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-gray-800"
              >
                Get Verified
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;