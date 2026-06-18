"use client"

import React, { useState } from "react";
import VendorExpandCta from "../Components/VendorExpandCta";

const faqs = [
  {
    question: "What is Mosaic Biz Hub?",
    answer:
      "Mosaic Biz Hub is an inclusive online marketplace designed to empower minority-owned businesses by connecting them with consumers and helping them expand their reach, grow revenue, and build a vibrant community of entrepreneurs.",
  },
  {
    question: "How does Mosaic Biz Hub work for shoppers?",
    answer:
      "Shoppers can explore and support minority-owned businesses by browsing curated products and trusted services, comparing options, and connecting directly with vendors. Mosaic Biz Hub makes discovering diverse offerings easy and meaningful.",
  },
  {
    question: "How can businesses join the Mosaic community?",
    answer:
      "Business owners can sign up to become a vendor on Mosaic Biz Hub to gain visibility, drive traffic, and grow within our purpose-driven marketplace. Once verified, vendors are highlighted throughout the app and connected with consumers.",
  },
  {
    question: "Can I find services like salons, legal help, or consulting here?",
    answer:
      "Yes! Mosaic Biz Hub lets you browse and book trusted services in categories including salons and spas, legal services, health and wellness, business consulting, IT, marketing, and more.",
  },
  {
    question: "How do I search for businesses or products?",
    answer:
      "Use the search bar and filters to explore businesses by type, location, or minority status. You can also filter products, browse featured listings, and find services near you.",
  },
  {
    question: "Is every vendor on Mosaic Biz Hub verified?",
    answer:
      "Yes — vendors are verified so that you can shop and book services confidently. Verified minorities and trusted vendors help build credibility for both consumers and business owners.",
  },
  {
    question: "How long does verification take for businesses?",
    answer:
      "Verification times can vary, but once submitted, our team reviews the application and notifies you when your business is approved and listed live on the platform.",
  },
  {
    question: "Who can use Mosaic Biz Hub?",
    answer:
      "Everyone! Whether you're a shopper looking to support minority-owned businesses or an entrepreneur looking to grow your business, Mosaic Biz Hub provides tools and connections for all community members.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container-page max-w-[900px] py-8 font-sans sm:py-12">
      <h2 className="mb-8 text-center font-poppins text-2xl font-bold text-market-text sm:text-3xl">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#C7A040]"
            key={index}
            onClick={() => toggleFaq(index)}
          >
            <div className="flex justify-between items-center p-5 bg-white font-semibold text-gray-800">
              <span>{faq.question}</span>
              <span className="text-2xl text-[#C7A040] font-bold">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>
            {activeIndex === index && (
              <div className="p-5 bg-gray-50 text-gray-600 border-t border-gray-200">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <VendorExpandCta />
    </div>
  );
};

export default Faq;