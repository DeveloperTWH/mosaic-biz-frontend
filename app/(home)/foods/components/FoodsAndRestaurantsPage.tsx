import { useState } from 'react';
import TabsHeadingSection from './TabsHeadingSection';
import FoodFromShop from './FoodFromShop';
import FoodFromFarm from './FoodFromFarm';
import FoodFromRestaurant from './FoodFromRestaurant';

export default function FoodsAndRestaurantsPage() {
  const [selectedTab, setSelectedTab] = useState('Groceries');

  const renderSection = () => {
    if (selectedTab === 'Groceries') return <FoodFromFarm />;
    // if (selectedTab === 'Food from Farm') return <FoodFromFarm />;
    return <FoodFromRestaurant />;
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <TabsHeadingSection selected={selectedTab} onTabChange={setSelectedTab} />
      {renderSection()}
    </div>
  );
}
