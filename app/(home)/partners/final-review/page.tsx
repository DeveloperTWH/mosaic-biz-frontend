"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ChevronDown, Check } from "lucide-react";
import TermsModal from "./components/TermsModal";
import Congratulations from "./components/Congratulations";

interface Business {
  _id: string;
  businessName: string;
  logo?: string;
}

export default function FinalReviewPage() {
  const router = useRouter();
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [agreeChecked, setAgreeChecked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"terms" | "privacy" | "directory">("terms");
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch business data
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/my`,
          { withCredentials: true }
        );
        
        if (response.data.businesses?.length > 0) {
          setBusiness(response.data.businesses[0]);
        }
      } catch (error) {
        console.error("Error fetching business:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, []);

const steps = [
  { number: "01", title: "Business Verification", status: "completed", link: "/partners/business-verification" },
  { number: "02", title: "Tier / Subscription Selection", status: "completed", link: "/partners/tier-selection" },
  { number: "03", title: "Subscription Payment", status: "completed", link: "/partners/payment" },
  { number: "04", title: "Business Profile Setup", status: "completed", link: "/partners/business-profile" },
  { number: "05", title: "Product / Service Creation", status: "completed", link: "/partners/products" },
  { number: "06", title: "Payout & Bank Setup", status: "incompleted", link: "/partners/payout-setup" },
];


  const openModal = (type: "terms" | "privacy" | "directory") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (confirmChecked && agreeChecked) {
      setShowCongratulations(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a227]"></div>
      </div>
    );
  }

  // If showing congratulations, render that component
  if (showCongratulations) {
    return <Congratulations business={business} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide">FINAL REVIEW</h1>
          <p className="text-gray-500 mt-2 text-sm">
            review and submit the profile
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3 mb-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-[#f5f5f0] rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Number Badge */}
                <span className="w-8 h-8 rounded-md bg-[#c9a227] flex items-center justify-center text-sm font-bold text-white">
                  {step.number}
                </span>
                
                {/* Title */}
                <span className="font-semibold text-gray-800 text-sm">
                  {step.title}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Badge */}
                <span className={`text-xs px-3 py-1 rounded-full border ${
                  step.status === 'completed' 
                    ? 'border-green-500 text-green-600 bg-green-50' 
                    : 'border-red-400 text-red-500 bg-red-50'
                }`}>
                  {step.status === 'completed' ? 'Completed' : 'Incompleted'}
                </span>
                
                {/* Manage Link with Chevron */}
                <Link href={step.link}>
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Checkboxes */}
        <div className="mb-8 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
            />
            <span className="text-xs text-gray-600 leading-relaxed">
              I Certify That All The Business Information Provided Is True, Accurate, And Complete To The Best Of My Knowledge.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeChecked}
              onChange={(e) => setAgreeChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
            />
            <span className="text-xs text-gray-600 leading-relaxed">
              I Agree To Abide By Hub's{" "}
              <button
                type="button"
                onClick={() => openModal("terms")}
                className="text-[#1e3a5f] hover:text-[#c9a227] underline font-medium transition-colors"
              >
                Terms And Conditions
              </button>{" "}
              And{" "}
              <button
                type="button"
                onClick={() => openModal("privacy")}
                className="text-[#1e3a5f] hover:text-[#c9a227] underline font-medium transition-colors"
              >
                Privacy Policy
              </button>
              {" "}And{" "}
              <button
                type="button"
                onClick={() => openModal("directory")}
                className="text-[#1e3a5f] hover:text-[#c9a227] underline font-medium transition-colors"
              >
                Directory Policy
              </button>.
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!confirmChecked || !agreeChecked}
            className={`px-8 py-2.5 rounded text-sm font-medium transition-colors ${
              confirmChecked && agreeChecked
                ? 'bg-[#1e3a5f] text-white hover:bg-[#152a45] cursor-pointer'
                : 'bg-[#1e3a5f] text-white opacity-50 cursor-not-allowed'
            }`}
          >
            Submit Response
          </button>
          <button
            onClick={() => {
              setConfirmChecked(false);
              setAgreeChecked(false);
            }}
            className="px-8 py-2.5 rounded text-sm font-medium bg-gray-400 text-white hover:bg-gray-500 transition-colors"
          >
            Clear Response
          </button>
        </div>
      </div>

      {/* Terms Modal */}
      <TermsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />
    </div>
  );
}