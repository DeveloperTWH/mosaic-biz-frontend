"use client"

import React, { useState } from "react";
import "./Faq.css"; // Create CSS for styling

const faqs = [
  {
    question: "What is Mosaic Biz Hub?",
    answer:
      "Mosaic Biz Hub is an inclusive online marketplace designed to empower minority-owned businesses by connecting them with consumers and helping them expand their reach, grow revenue, and build a vibrant community of entrepreneurs. :contentReference[oaicite:1]{index=1}",
  },
  {
    question: "How does Mosaic Biz Hub work for shoppers?",
    answer:
      "Shoppers can explore and support minority-owned businesses by browsing curated products and trusted services, comparing options, and connecting directly with vendors. Mosaic Biz Hub makes discovering diverse offerings easy and meaningful. :contentReference[oaicite:2]{index=2}",
  },
  {
    question: "How can businesses join the Mosaic community?",
    answer:
      "Business owners can sign up to become a vendor on Mosaic Biz Hub to gain visibility, drive traffic, and grow within our purpose-driven marketplace. Once verified, vendors are highlighted throughout the app and connected with consumers. :contentReference[oaicite:3]{index=3}",
  },
  {
    question: "Can I find services like salons, legal help, or consulting here?",
    answer:
      "Yes! Mosaic Biz Hub lets you browse and book trusted services in categories including salons and spas, legal services, health and wellness, business consulting, IT, marketing, and more. :contentReference[oaicite:4]{index=4}",
  },
  {
    question: "How do I search for businesses or products?",
    answer:
      "Use the search bar and filters to explore businesses by type, location, or minority status. You can also filter products, browse featured listings, and find services near you. :contentReference[oaicite:5]{index=5}",
  },
  {
    question: "Is every vendor on Mosaic Biz Hub verified?",
    answer:
      "Yes — vendors are verified so that you can shop and book services confidently. Verified minorities and trusted vendors help build credibility for both consumers and business owners. :contentReference[oaicite:6]{index=6}",
  },
  {
    question: "How long does verification take for businesses?",
    answer:
      "Verification times can vary, but once submitted, our team reviews the application and notifies you when your business is approved and listed live on the platform. :contentReference[oaicite:7]{index=7}",
  },
  {
    question: "Who can use Mosaic Biz Hub?",
    answer:
      "Everyone! Whether you're a shopper looking to support minority-owned businesses or an entrepreneur looking to grow your business, Mosaic Biz Hub provides tools and connections for all community members. :contentReference[oaicite:8]{index=8}",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            className="faq-item"
            key={index}
            onClick={() => toggleFaq(index)}
          >
            <div className="faq-question">
              {faq.question}
              <span className="faq-toggle">
                {activeIndex === index ? "-" : "+"}
              </span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
