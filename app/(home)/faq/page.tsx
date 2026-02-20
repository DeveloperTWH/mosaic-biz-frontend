"use client"

import React, { useState } from "react";
import Link from 'next/link';

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
    <div className="max-w-[900px] mx-auto p-8 font-sans">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      
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

      {/* Expand Your Reach Section - Full Width with Increased Height */}
      <div className="relative left-1/2 right-1/2 w-screen ml-[-50vw] mr-[-50vw] mt-12 mb-8">
        <div 
          className="w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/contact/becomeVendor.png')" }}
        >
          <div className="bg-[#3333339E] py-24 px-8 text-center text-white">
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
                Become A Vendor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;