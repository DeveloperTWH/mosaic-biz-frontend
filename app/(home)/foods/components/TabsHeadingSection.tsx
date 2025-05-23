import React from 'react';

const tabs = ['Food from Shop', 'Food from Farm', 'Food from Restaurant'];

const TabsHeadingSection: React.FC<{
    selected: string;
    onTabChange: (tab: string) => void;
}> = ({ selected, onTabChange }) => {
    return (
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-3 mt-10 text-gray-800 heading">
                Choose Your Food
            </h2>
            <hr className="h-[2px] w-[100px] bg-green-900 mx-auto" />
            <hr className="h-[2px] w-[100px] bg-green-900 mt-[1px] mb-4 mx-auto" />
            <div className="w-3/5 mx-auto mb-10">
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore, minima. Quo, hic eum deleniti nulla dolorem sapiente aliquid animi dolore.
                </p>
            </div>
            <div className="inline-flex gap-2 border-b pb-2 justify-center items-center">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={` border-[1px] border-black px-16 mx-10 py-2 roboto rounded-full text-[20px] font-medium transition duration-200 ${selected === tab
                            ? 'bg-custom-yellow text-white border-0'
                            : 'text-gray-600 hover:text-black hover:bg-gray-100'
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
