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
    <section className="max-w-4xl mx-auto p-6 md:p-12">
      <h2 className="text-3xl font-semibold mb-8 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            onClick={() => toggleFAQ(index)}
            className={`border rounded-md p-4 cursor-pointer transition-colors duration-300 ${
              openIndex === index ? "bg-custom-blue" : "bg-custom-yellow"
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{faq.question}</h3>
              <span className="text-2xl select-none">
                {openIndex === index ? "−" : "+"}
              </span>
            </div>
            {openIndex === index && (
              <p className="mt-3 text-gray-700">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
