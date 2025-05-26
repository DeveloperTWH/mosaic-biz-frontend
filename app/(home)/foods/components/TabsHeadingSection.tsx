import React from 'react';

const tabs = ['Food from Shop', 'Food from Farm', 'Food from Restaurant'];

const TabsHeadingSection: React.FC<{
    selected: string;
    onTabChange: (tab: string) => void;
}> = ({ selected, onTabChange }) => {
    return (
        <div className="mb-8 text-center px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 mt-10 text-gray-800 heading">
                Choose Your Food
            </h2>
            <hr className="h-[2px] w-[100px] bg-green-900 mx-auto" />
            <hr className="h-[2px] w-[100px] bg-green-900 mt-[1px] mb-4 mx-auto" />
            <div className="w-full max-w-2xl mx-auto mb-8 px-2">
                <p className="text-sm sm:text-base text-gray-600">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore, minima. Quo, hic eum deleniti nulla dolorem sapiente aliquid animi dolore.
                </p>
            </div>
            <div className="flex flex-col md:flex-row md:gap-4 gap-3 border-b pb-4 justify-center items-center">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`border px-10 sm:px-10 py-2 text-sm sm:text-base rounded-full font-medium transition duration-200 ${
                            selected === tab
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
