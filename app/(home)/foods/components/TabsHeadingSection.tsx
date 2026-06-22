import React from "react";

const tabs = ["Groceries", "Restaurant"];

const TabsHeadingSection: React.FC<{
  selected: string;
  onTabChange: (tab: string) => void;
}> = ({ selected, onTabChange }) => {
  return (
    <div className="mb-8 px-4 text-center">
      <h2 className="market-section-heading mt-10 mb-3">Choose your food</h2>
      <div className="market-section-divider mx-auto" />
      <div className="mx-auto mb-8 w-full max-w-3xl px-2">
        <p className="font-montserrat text-sm leading-relaxed text-market-muted sm:text-base">
          Food is not just a meal—it&apos;s tradition, culture, and identity. Minority-owned food
          businesses bring those stories to life on Mosaic Biz Hub.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 border-b border-white/10 pb-4 md:flex-row md:gap-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`min-h-11 rounded-full border px-8 py-2 text-sm font-medium transition duration-200 sm:px-10 sm:text-base ${
              selected === tab
                ? "border-market-gold bg-market-gold text-market-header"
                : "border-white/20 text-market-muted hover:border-market-gold/40 hover:bg-market-elevated hover:text-market-text"
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabsHeadingSection;
