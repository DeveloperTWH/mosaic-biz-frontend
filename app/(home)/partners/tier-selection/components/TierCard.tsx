'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { SubscriptionPlanResponse } from '@/types/subscription-response';

interface TierCardProps {
  plan: SubscriptionPlanResponse;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: (planId: string) => void;
  badge?: string;
}

const TierCard: React.FC<TierCardProps> = ({
  plan,
  isSelected,
  isLoading,
  onSelect,
  badge,
}) => {
  const [showMore, setShowMore] = useState(false);

  const getPlanConfig = () => {
    const name = plan.name.toLowerCase();

    if (name === 'gold' || name === 'standard') {
      return {
        headerBg: 'bg-[#FDF8F0]',
        buttonBg: 'bg-[#D4AF37]',
        buttonHover: 'hover:bg-[#C4A030]',
        checkColor: 'bg-[#D4AF37]',
        borderColor: isSelected ? 'border-[#D4AF37]' : 'border-[#E5E7EB]',
        title: 'Gold Tier',
        price: 39.99,
        subtitle: 'Growth & Visibility',
        description: 'For growing brands ready to scale visibility and engagement.',
        featuresTitle: 'Everything in Silver, plus:',
        features: [
          'Enhanced Profile (600 characters)',
          '10 Products / 5 Services',
          '5 Images per Product',
          'Up to 3 Promotions (Sales, Bundles, Events)',
          'Product Catalog Upload (CSV)',
          'In-Platform Messaging (Web + App)',
          'Push Notifications to Followers',
          'Advanced Marketplace Placement',
          'Priority Customer Support',
          'SEO Optimization Tools',
        ],
        footerText:
          'Ideal for businesses ready to grow their audience and convert visibility into revenue.',
      };
    }

    if (name === 'platinum' || name === 'premium') {
      return {
        headerBg: 'bg-[#F3F4F6]',
        buttonBg: 'bg-[#1E3A8A]',
        buttonHover: 'hover:bg-[#1E40AF]',
        checkColor: 'bg-[#D4AF37]',
        borderColor: isSelected ? 'border-[#1E3A8A]' : 'border-[#E5E7EB]',
        title: 'Platinum Tier',
        price: 79.99,
        subtitle: 'Accelerated Reach & Automation',
        description:
          'For Established Brands Ready To Dominate Their Niche And Automate Growth.',
        featuresTitle: 'Everything in Gold, plus:',
        features: [
          'Premium Profile (1000 characters)',
          '20 Products / 10 Services',
          '7 Images per Product',
          'Video Upload',
          'PDF Upload',
          'Up to 5 Testimonial Videos',
          'Full CRM with Messaging',
          'Automated Reminders',
          'Advanced Analytics Dashboard',
          'AI Customer Recommendations',
          'Featured Marketplace Placement',
        ],
        footerText: 'Built for brands ready to lead, scale, and leave a legacy.',
      };
    }

    return {
      headerBg: 'bg-[#F3F4F6]',
      buttonBg: 'bg-[#1E3A8A]',
      buttonHover: 'hover:bg-[#1E40AF]',
      checkColor: 'bg-[#D4AF37]',
      borderColor: isSelected ? 'border-[#1E3A8A]' : 'border-[#E5E7EB]',
      title: 'Silver Tier',
      price: 19.99,
      subtitle: 'Essential Listing',
      description:
        'For start-ups, small size businesses and side hustlers ready to be discovered.',
      featuresTitle: 'Features:',
      features: [
        'Verified Vendor Profile (300 characters)',
        'List 5 Products / 3 Services',
        '3 Images per Product',
        'Verified Customer Reviews',
        'Generic Contact Form',
        'Silver Trust Badge',
        'Standard Marketplace Placement',
        'Basic Search Visibility',
        'Customer Messaging',
      ],
      footerText:
        'Perfect for building your digital footprint and gaining early traction.',
    };
  };

  const config = getPlanConfig();
  const visibleFeatures = showMore
    ? config.features
    : config.features.slice(0, 6);

  return (
    <div className="h-full w-full max-w-sm mx-auto">
      <div
        className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${config.borderColor} ${
          isSelected ? 'shadow-lg' : ''
        } hover:shadow-xl bg-white flex flex-col h-full min-w-[320px]`}
      >
        {/* Badge */}
        {badge && (
          <div className="absolute top-0 right-0 z-20 w-24 h-24 overflow-hidden">
            <div className="absolute top-6 -right-6 transform rotate-45 bg-gradient-to-r from-[#9333EA] to-[#C026D3] text-white text-[7px] font-bold py-1 px-8 shadow-md tracking-wider uppercase whitespace-nowrap">
              {badge}
            </div>
          </div>
        )}

        {/* Header */}
        <div
          className={`${config.headerBg} p-6 flex flex-col justify-between`}
          style={{ minHeight: '280px' }} /* Fixed minimum height for all headers */
        >
          <div>
            <h3 className="text-2xl font-bold text-[#1E3A8A] mb-1">
              {config.title}
              <span className="text-2px font-normal text-[#1E3A8A]"> - {config.subtitle}</span>
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              {config.description}
            </p>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-[#1E3A8A]">${config.price}</span>
              <span className="text-gray-600 text-sm">
                /Month (Billed Annually)
              </span>
            </div>
          </div>

          {/* Choose Plan Button - Always at the bottom of header */}
          <button
            onClick={() => onSelect(plan._id)}
            disabled={isLoading}
            className={`w-full mt-4 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${config.buttonBg} ${config.buttonHover} ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {isLoading ? 'Processing...' : 'Choose Plan'}
          </button>
        </div>

        {/* Features */}
        <div className="p-6 flex flex-col flex-1">
          <p className="text-sm font-semibold text-[#1E3A8A] mb-4">
            {config.featuresTitle}
          </p>

          <ul className="space-y-3">
            {visibleFeatures.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-gray-700"
              >
                <div
                  className={`w-5 h-5 rounded-full ${config.checkColor} flex items-center justify-center flex-shrink-0 mt-0.5`}
                >
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Dynamic Read More */}
          {config.features.length > 6 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-[#1E3A8A] text-sm font-semibold mt-3 hover:underline text-left"
            >
              {showMore ? 'Show Less' : '+ Read More Features'}
            </button>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 italic leading-relaxed">
              {config.footerText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierCard;











// 'use client';

// import React from 'react';
// import { Check, X } from 'lucide-react';
// import { SubscriptionPlanResponse } from '@/types/subscription-response';

// interface TierCardProps {
//   plan: SubscriptionPlanResponse;
//   isSelected: boolean;
//   isLoading: boolean;
//   onSelect: (planId: string) => void;
//   badge?: string;
// }

// const TierCard: React.FC<TierCardProps> = ({
//   plan,
//   isSelected,
//   isLoading,
//   onSelect,
//   badge,
// }) => {
//   // Determine colors based on plan name
//   const getPlanColors = () => {
//     const name = plan.name.toLowerCase();
//     if (name === 'gold' || name === 'standard') {
//       return {
//         headerBg: 'bg-[#FDF8F0]',
//         buttonBg: 'bg-[#D4AF37]',
//         buttonHover: 'hover:bg-[#C4A030]',
//         checkColor: 'bg-[#D4AF37]',
//         borderColor: isSelected ? 'border-[#D4AF37]' : 'border-[#E5E7EB]',
//       };
//     }
//     // Silver and Platinum (both use blue theme)
//     return {
//       headerBg: 'bg-[#F3F4F6]',
//       buttonBg: 'bg-[#1E3A8A]',
//       buttonHover: 'hover:bg-[#1E40AF]',
//       checkColor: 'bg-[#D4AF37]',
//       borderColor: isSelected ? 'border-[#1E3A8A]' : 'border-[#E5E7EB]',
//     };
//   };

//   const colors = getPlanColors();

//   // Get description based on plan name - this is UI text, not data
//   const getDescription = () => {
//     const name = plan.name.toLowerCase();
//     if (name === 'silver' || name === 'basic') {
//       return 'For small businesses starting their online presence';
//     }
//     if (name === 'gold' || name === 'standard') {
//       return 'For growing businesses that need more visibility';
//     }
//     return 'For Premium Brands And High-Visibility Businesses';
//   };

//   // Build features list dynamically from API data only
//   const buildFeaturesList = () => {
//     const features: { label: string; included: boolean }[] = [];

//     // Add limits from API data
//     features.push({ label: `${plan.limits.productListings} products`, included: true });
//     features.push({ label: `${plan.limits.serviceListings} services`, included: true });
//     features.push({ label: `${plan.limits.foodListings} foods`, included: true });
//     features.push({ label: `${plan.limits.imageLimit} images`, included: true });
//     features.push({ label: `${plan.limits.videoLimit} video${plan.limits.videoLimit !== 1 ? 's' : ''}`, included: true });

//     // Add boolean features from API - only if they exist in the features object
//     const featureMap: Record<string, string> = {
//       communityEvents: 'Community events',
//       pushNotifications: 'Push notifications',
//       marketingTools: 'Marketing tools',
//       featuredPlacement: 'Featured placement',
//       searchPriority: 'Search priority',
//       aiRecommendation: 'AI recommendations',
//       analyticsDashboard: 'Analytics dashboard',
//     };

//     // Add included features (true values)
//     Object.entries(plan.features).forEach(([key, value]) => {
//       if (value === true && featureMap[key]) {
//         features.push({ label: featureMap[key], included: true });
//       }
//     });

//     // Add excluded features (false values) - only for specific features that make sense to show as excluded
//     // This is optional - remove this block if you don't want to show negative features
//     if (plan.features.analyticsDashboard === false) {
//       features.push({ label: 'No analytics dashboard', included: false });
//     }
//     if (plan.features.aiRecommendation === false) {
//       features.push({ label: 'No-AI recommendations', included: false });
//     }

//     return features;
//   };

//   const featuresList = buildFeaturesList();

//   return (
//     <div
//       className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${colors.borderColor} ${isSelected ? 'shadow-lg' : ''} hover:shadow-xl bg-white`}
//     >
//       {/* Recommended Badge */}
//       {badge && (
//         <div className="absolute -top-0 right-0 overflow-hidden w-32 h-32 z-10">
//           <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-2 rotate-45 bg-gradient-to-r from-[#9333EA] to-[#C026D3] text-white text-xs font-bold py-1.5 px-10 shadow-md tracking-wider uppercase">
//             {badge}
//           </div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className={`${colors.headerBg} p-6 pb-8`}>
//         <h3 className="text-3xl font-bold text-[#1E3A8A] mb-2">{plan.name}</h3>
//         <p className="text-gray-600 text-sm leading-relaxed">
//           {getDescription()}
//         </p>

//         {/* Price - from API */}
//         <div className="mt-4">
//           <div className="flex items-baseline gap-1">
//             <span className="text-4xl font-bold text-[#1E3A8A]">
//               ${plan.price}
//             </span>
//             <span className="text-gray-600 text-sm">
//               /{plan.interval === 'year' ? 'Year' : 'Month'} (Billed {plan.interval === 'year' ? 'Annually' : 'Monthly'})
//             </span>
//           </div>
//         </div>

//         {/* Button */}
//         <button
//           onClick={() => onSelect(plan._id)}
//           disabled={isLoading}
//           className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${colors.buttonBg} ${colors.buttonHover} ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
//         >
//           {isLoading ? 'Processing...' : 'Choose Plan'}
//         </button>
//       </div>

//       {/* Features Section - All from API */}
//       <div className="p-6 pt-4">
//         <ul className="space-y-3">
//           {featuresList.map((feature, index) => (
//             <li
//               key={index}
//               className={`flex items-center gap-3 text-sm ${feature.included ? 'text-gray-700' : 'text-gray-500'}`}
//             >
//               {feature.included ? (
//                 <div className={`w-5 h-5 rounded-full ${colors.checkColor} flex items-center justify-center flex-shrink-0`}>
//                   <Check className="w-3 h-3 text-white" strokeWidth={3} />
//                 </div>
//                 ) : (
//                 <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
//                   <X className="w-3 h-3 text-white" strokeWidth={3} />
//                 </div>
//               )}
//               <span>{feature.label}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default TierCard;
