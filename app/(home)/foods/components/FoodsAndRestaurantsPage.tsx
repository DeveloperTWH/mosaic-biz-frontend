import { useState } from 'react';
import TabsHeadingSection from './TabsHeadingSection';
import FoodFromShop from './FoodFromShop';
import FoodFromFarm from './FoodFromFarm';
import FoodFromRestaurant from './FoodFromRestaurant';

export default function FoodsAndRestaurantsPage() {
  const [selectedTab, setSelectedTab] = useState('Food from Shop');

  const renderSection = () => {
    if (selectedTab === 'Food from Shop') return <FoodFromShop />;
    if (selectedTab === 'Food from Farm') return <FoodFromFarm />;
    return <FoodFromRestaurant />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <TabsHeadingSection selected={selectedTab} onTabChange={setSelectedTab} />
      {renderSection()}
    </div>
  );
}
