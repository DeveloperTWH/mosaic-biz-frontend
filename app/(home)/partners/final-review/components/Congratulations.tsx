"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowUpRight, Megaphone, Rocket, Sparkles
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface Business {
  _id: string;
  businessName: string;
  logo?: string;
}

interface Props {
  businessName?: string;
  business?: Business | null;
}

export default function Congratulations({ businessName, business }: Props) {
  const router = useRouter();
  
  const displayName = business?.businessName || businessName || "ABC Salon";
  const businessLogo = business?.logo || "/api/placeholder/120/120";
  const storefrontHref = business?._id
    ? `/vendor-profile/product-vendor/${business._id}`
    : null;

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Gold and navy blue colors matching the theme
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#c9a227', '#1e3a5f', '#ffd700', '#b8921f']
      });
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#c9a227', '#1e3a5f', '#ffd700', '#b8921f']
      });
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, []);

const steps = [
  { number: 1, label: "Business\nVerification", active: false },
  { number: 2, label: "Tier / Subscription\nSelection", active: false },
  { number: 3, label: "Subscription\nPayment", active: false },
  { number: 4, label: "Business Profile\nSetup", active: false },
  { number: 5, label: "Product / Service\nCreation", active: false },
  { number: 6, label: "Payout & Bank\nSetup", active: false },
  { number: 7, label: "Final Review", active: true },
  { number: 8, label: "Go Live\nConfirmation", active: true },
];


  return (
    <div className="min-h-screen bg-white py-8 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Progress Stepper */}
        <div className="flex items-start justify-between mb-16 px-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 ${
                step.active 
                  ? 'bg-[#c9a227] text-white' 
                  : index < 5 
                    ? 'bg-[#c9a227] text-white' 
                    : 'bg-white border-2 border-gray-300 text-gray-400'
              }`}>
                {step.number}
              </div>
              <p className={`text-xs text-center whitespace-pre-line ${
                step.active ? 'text-[#c9a227] font-medium' : 'text-gray-500'
              }`}>
                {step.label}
              </p>
              {index < steps.length - 1 && (
                <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                  index < 5 ? 'bg-[#c9a227]' : 'bg-gray-200'
                }`} style={{ transform: 'translateX(50%)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            CONGRATULATIONS !
          </h1>
          <p className="text-gray-600 text-sm">
            Your vendor storefront is now live and ready to reach customers !
          </p>
        </div>

        {/* Business Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-[#1e3a5f] rounded-lg p-6 flex items-center gap-6 relative overflow-hidden">
            {/* Gold Ribbon */}
            <div className="absolute top-0 right-0 w-24 h-24">
              <div className="absolute top-0 right-0 w-32 h-8 bg-[#c9a227] transform rotate-45 translate-x-8 -translate-y-2 shadow-lg" />
              <div className="absolute top-0 right-0 w-8 h-32 bg-[#c9a227] transform rotate-45 translate-x-2 -translate-y-4 shadow-lg" />
              <div className="absolute top-4 right-4 w-4 h-4 bg-[#b8921f] rounded-full" />
            </div>
            
            {/* Business Image */}
            <div className="w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 border-2 border-white/20">
              <img 
                src={businessLogo} 
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Business Info */}
            <div className="flex-1">
              <h2 className="text-white text-xl font-semibold mb-2">{displayName}</h2>
              <div className="flex items-center gap-1 mb-4">
                <span className="text-[#c9a227]">★★★★★</span>
                {/* <span className="text-gray-400">★</span> */}
                <span className="text-white text-sm ml-1">NO reviews yet</span>
              </div>
              <button
                type="button"
                onClick={() => storefrontHref && router.push(storefrontHref)}
                disabled={!storefrontHref}
                className="bg-[#c9a227] hover:bg-[#b8921f] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors"
              >
                View Your Storefront
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Next Steps Text */}
        <p className="text-center text-gray-600 text-sm mb-8">
          Take the next steps to boost your visibility and attract more customers.
        </p>

        {/* Next Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-5xl mx-auto">
          {/* Card 1 - Promote Storefront */}
          {/* <div className="bg-[#faf8f3] rounded-lg p-6">
            <div className="w-10 h-10 bg-[#f5f0e6] rounded-full flex items-center justify-center mb-4">
              <Megaphone className="w-5 h-5 text-[#c9a227]" />
            </div>
            <h3 className="text-base font-semibold text-[#1e3a5f] mb-2">
              Promote Your Storefront
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Utilizemarketing Tools To Drive Traffic To Your Storefront.
            </p>
            <button className="text-[#c9a227] text-xs font-medium hover:underline flex items-center gap-1">
              Explore Marketing Tools <ArrowUpRight className="w-3 h-3" />
            </button>
          </div> */}

          {/* Card 2 - Enhance Listings */}
          {/* <div className="bg-[#faf8f3] rounded-lg p-6">
            <div className="w-10 h-10 bg-[#f5f0e6] rounded-full flex items-center justify-center mb-4">
              <Rocket className="w-5 h-5 text-[#c9a227]" />
            </div>
            <h3 className="text-base font-semibold text-[#1e3a5f] mb-2">
              Enhance Your Listings
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Add More Product Images And Videos To Attract Buyers.
            </p>
            <button className="text-[#c9a227] text-xs font-medium hover:underline flex items-center gap-1">
              Edit Your Listings <ArrowUpRight className="w-3 h-3" />
            </button>
          </div> */}

          {/* Card 3 - AI Recommendations */}
          {/* <div className="bg-[#faf8f3] rounded-lg p-6">
            <div className="w-10 h-10 bg-[#f5f0e6] rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-[#c9a227]" />
            </div>
            <h3 className="text-base font-semibold text-[#1e3a5f] mb-2">
              Get AI Recommendation
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Use Personalized Suggestions To Improve Your Offerings
            </p>
            <button className="text-[#c9a227] text-xs font-medium hover:underline flex items-center gap-1">
              View AI Insights <ArrowUpRight className="w-3 h-3" />
            </button>
          </div> */}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          
    <Link href="/partners">
      <button className="px-10 py-3 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
        Go To Dashboard
      </button>
    </Link>
        </div>
      </div>
    </div>
  );
}
