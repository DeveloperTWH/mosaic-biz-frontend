import { Star, StarHalf, StarOff } from 'lucide-react';

const products = [
    {
        id: 1,
        title: 'Feature Product 1',
        price: 29.99,
        rating: 4.5,
        image: '/ShopProduct/Aria-SK6-Helmet 1 (3).png',
    },
    {
        id: 2,
        title: 'Feature Product 2',
        price: 19.99,
        rating: 5,
        image: '/ShopProduct/Aria-SK6-Helmet 1 (2).png',
    },
    {
        id: 3,
        title: 'Feature Product 3',
        price: 15.99,
        rating: 3.2,
        image: '/ShopProduct/Aria-SK6-Helmet 1 (1).png',

    },
    {
        id: 4,
        title: 'Feature Product 4',
        price: 45.0,
        rating: 2.7,
        image: '/ShopProduct/Aria-SK6-Helmet 1.png',
    },
];

export default function ShopProducts() {
    return (
        <section className="pt-20 pb-10 w-4/5 mx-auto">
            <div className="w-[95%] mx-auto">
                <div className="w-1/2 mx-auto">
                    <h2 className="text-4xl font-bold mb-4 uppercase text-center heading">Shop Products</h2>
                    <hr className="h-[2px] w-[100px] bg-green-900 mx-auto" />
                    <hr className="h-[2px] w-[100px] bg-green-900 mx-auto mt-[1px]" />
                    <p className="text-gray-600 mb-6 text-center mt-4">
                        Lorem ipsum dolor sit amet consectetur adipisicing elitsed eiusmod tempor enim minim veniam quis notru exercit ation Lorem ipsum dolor sit amet. Veniam quis notru exercit.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 mb-20">
                    {products.map((product) => {
                        const fullStars = Math.floor(product.rating);
                        const hasHalfStar = product.rating % 1 >= 0.25 && product.rating % 1 < 0.75;
                        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

                        return (
                            <div key={product.id} className="border rounded-lg p-4">
                                <div className='w-[200px] relative flex justify-center items-center'>
                                    <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full  mb-10"
                                    />
                                    <img 
                                    src="/ShopProduct/Mask group.png" 
                                    alt="Cart icon"
                                    className='absolute right-0 bottom-0 w-[40px]' />
                                </div>
                                <h3 className="font-semibold text-sm">{product.title}</h3>

                                <div className="flex items-center text-yellow-500 mb-1">
                                    {Array(fullStars).fill(0).map((_, idx) => (
                                        <Star
                                            key={`full-${idx}`}
                                            size={10}
                                            fill="currentColor"
                                            stroke="currentColor"
                                        />
                                    ))}

                                    {hasHalfStar && (
                                        <StarHalf
                                            key="half"
                                            size={10}
                                            fill="currentColor"
                                            stroke="currentColor"
                                        />
                                    )}

                                    {Array(emptyStars).fill(0).map((_, idx) => (
                                        <Star
                                            key={`empty-${idx}`}
                                            size={12}
                                            fill="gray"
                                            stroke='gray'
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-500 text-sm">${product.price.toFixed(2)}</p>
                            </div>
                        );
                    })}
                </div>

                <button className="px-8 py-2 bg-custom-orange text-white">Show All Products</button>

                <div className="h-full flex justify-end">
                    <hr className="h-[2px] w-1/2 bg-custom-blue mt-0" />
                </div>
            </div>
        </section>
    );
}
