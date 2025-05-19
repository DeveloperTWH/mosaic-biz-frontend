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
    <section className="relative md:h-[90vh] p-6 md:p-12 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/Subtract.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
          backgroundSize: "contain",
          transform: "scaleX(-1)",
        }}
      />

      {/* Content */}
      <div className="md:w-[60%] mx-auto relative z-10">
        <h2 className="text-3xl font-semibold mb-1 text-center mt-4 heading">
          Frequently Asked Questions
        </h2>
        <div className="flex justify-center flex-col items-center">
          <hr className="h-[2px] w-[100px] bg-green-900" />
          <hr className="h-[2px] w-[100px] mt-[2px] mb-4 bg-green-900" />
        </div>
        <div className="w-[60%] mx-auto text-center">

        <p className="text-[13px] text-gray-600 mb-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit adipisci doloremque amet recusandae nostrum voluptates rem suscipit dolores magni velit?
        </p>
        </div>
        <div className="">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => toggleFAQ(index)}
              className="border rounded-md p-4 cursor-pointer transition-colors duration-300"
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
                <div className="shadow-md shadow-black/30 pb-10">
                  <p className="mt-5 px-5 text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
