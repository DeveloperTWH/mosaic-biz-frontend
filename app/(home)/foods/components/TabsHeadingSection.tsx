import React from 'react';

const tabs = ['Groceries', 'Restaurant'];

const TabsHeadingSection: React.FC<{
    selected: string;
    onTabChange: (tab: string) => void;
}> = ({ selected, onTabChange }) => {
    return (
        <div className="px-4 mb-8 text-center">
            <h2 className="mt-10 mb-3 text-2xl font-bold text-gray-800 sm:text-3xl heading">
                Choose Your Food
            </h2>
            <hr className="h-[2px] w-[100px] bg-green-900 mx-auto" />
            <hr className="h-[2px] w-[100px] bg-green-900 mt-[1px] mb-4 mx-auto" />
            <div className="w-full px-2 mx-auto mb-8">
                <p className="text-sm text-gray-600 sm:text-base">
                    Food is not just a meal—it's tradition, culture, and identity. Each recipe holds history. Each flavor holds a story. Minority-owned food companies bring those stories to life, giving communities rich cuisines.
                    <br />
                    At Mosaic Biz Hub, we provide minority-owned food companies with the stage they require to be noticed, encouraged, and celebrated.
                </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 pb-4 border-b md:flex-row md:gap-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`border px-10 sm:px-10 py-2 text-sm sm:text-base rounded-full font-medium transition duration-200 ${selected === tab
                                ? 'bg-custom-yellow text-white border-0'
                                : 'text-gray-600 hover:text-black hover:bg-gray-100 border border-black'
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
