import React from 'react';
import ShopProductCard from './ShopProductCard';

const shopItems = [
  {
    name: 'Urban Vegan Market',
    image: '/foods/product 1.png',
    price: '$8.99',
    quantity: '500g',
    rating: 4.7,
  },
  {
    name: 'Beat root',
    image: '/foods/product 2.png',
    price: '$4.50',
    quantity: '200Gm',
    rating: 4.6,
  },
  {
    name: 'Tangy Orange Juice',
    image: '/foods/product 3.png',
    price: '$4.50',
    quantity: '200Ml',
    rating: 4.6,
  },
  {
    name: 'Chocolate Cookies',
    image: '/foods/product 4.png',
    price: '$4.50',
    rating: 4.6,
  },
  {
    name: 'Chocolate Box',
    image: '/foods/product 5.png',
    price: '$4.50',
    rating: 4.6,
  },
];



const FoodFromShop = () => {
    const onAddToCart=(name:string) => console.log(`${name} added to cart`)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {shopItems.map((item) => (
        <ShopProductCard key={item.name} {...item} onAddToCart={() => onAddToCart(item.name)} />
      ))}
    </div>
  );
};

export default FoodFromShop;
