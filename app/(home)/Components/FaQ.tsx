"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is Mosaic Biz Hub?",
    answer:
      "Mosaic Biz Hub is a digital marketplace empowering minority-owned businesses with tools for growth, marketing, and community engagement.",
  },
  {
    question: "How do I create a seller account?",
    answer:
      "You can create a seller account by signing up through our registration page and completing your business profile.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "We support major credit cards, PayPal, and other popular payment gateways to ensure smooth transactions.",
  },
  {
    question: "How can I get support?",
    answer:
      "Our support team is available 24/7 via chat and email. You can also access FAQs and help articles anytime.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative h-screen p-6 overflow-hidden md:p-12">
      {/* Background image */}
      {/* Background image as fixed size */}
      <img
        src="/Subtract.png"
        alt=""
        className="absolute left-0 bottom-0 h-auto max-h-[100vh] w-auto object-contain z-0"
        style={{ transform: "scaleX(-1)" }}
      />


      {/* Content */}
      <div className="md:w-[60%] mx-auto relative z-10">
        <h2 className="market-section-heading mt-4 mb-1 text-center text-3xl">
          Frequently Asked Questions
        </h2>
        <div className="market-section-divider" />
        <div className="mx-auto w-[60%] text-center">
          <p className="mb-5 text-[13px] text-market-muted">
            Have questions? We’re here to help. Learn more about how Mosaic Biz Hub works, how to list your business, and how to make the most of our platform.
          </p>
        </div>
        <div className="">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => toggleFAQ(index)}
              className="p-4 transition-colors duration-300 border rounded-md cursor-pointer"
            >
              <div
                className={`flex justify-between items-center p-3 ${openIndex === index ? "bg-custom-yellow" : "bg-custom-blue"
                  }`}
              >
                <h3 className="text-lg font-medium">{faq.question}</h3>
                <span className="text-2xl select-none">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>
              {openIndex === index && (
                <div className="bg-white px-5 pb-5 pt-2 shadow-md shadow-black/30">
                  <p className="market-card-light-body">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
