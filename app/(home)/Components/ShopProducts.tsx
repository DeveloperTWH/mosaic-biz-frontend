import { Star, StarHalf } from "lucide-react";

const products = [
    {
        id: 1,
        title: "Feature Product 1",
        price: 29.99,
        rating: 4.5,
        image: "/ShopProduct/Aria-SK6-Helmet 1 (3).png",
    },
    {
        id: 2,
        title: "Feature Product 2",
        price: 19.99,
        rating: 5,
        image: "/ShopProduct/Aria-SK6-Helmet 1 (2).png",
    },
    {
        id: 3,
        title: "Feature Product 3",
        price: 15.99,
        rating: 3.2,
        image: "/ShopProduct/Aria-SK6-Helmet 1 (1).png",
    },
    {
        id: 4,
        title: "Feature Product 4",
        price: 45.0,
        rating: 2.7,
        image: "/ShopProduct/Aria-SK6-Helmet 1.png",
    },
];

export default function ShopProducts() {
    return (
        <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3 uppercase heading">
                    Shop Products
                </h2>
                <div className="flex flex-col justify-center items-center mb-4">
                    <hr className="h-1 w-20 bg-green-900" />
                    <hr className="h-1 w-20 bg-green-900" />
                </div>
                <p className="text-gray-600 text-sm sm:text-base mb-10 px-2 sm:px-0">
                    Lorem ipsum dolor sit amet consectetur adipisicing elitsed eiusmod tempor
                    enim minim veniam quis notru exercit ation Lorem ipsum dolor sit amet.
                    Veniam quis notru exercit.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                    const fullStars = Math.floor(product.rating);
                    const fractional = product.rating % 1;
                    const hasHalfStar = fractional >= 0.25 && fractional < 0.75;
                    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

                    return (
                        <div
                            key={product.id}
                            className="border rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="relative w-full max-w-[200px] flex justify-center items-center mb-6">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-auto object-contain"
                                />
                                <img
                                    src="/ShopProduct/Mask group.png"
                                    alt="Cart icon"
                                    className="absolute right-2 bottom-2 w-10 h-10"
                                />
                            </div>

                            <h3 className="font-semibold text-base text-center mb-2">{product.title}</h3>

                            <div className="flex items-center text-yellow-500 mb-2 space-x-0.5">
                                {Array(fullStars)
                                    .fill(0)
                                    .map((_, idx) => (
                                        <Star
                                            key={`full-${idx}`}
                                            size={14}
                                            fill="currentColor"
                                            stroke="currentColor"
                                            className="text-yellow-400"
                                        />
                                    ))}
                                {hasHalfStar && (
                                    <StarHalf
                                        key="half"
                                        size={14}
                                        fill="currentColor"
                                        stroke="currentColor"
                                        className="text-yellow-400"
                                    />
                                )}
                                {Array(emptyStars)
                                    .fill(0)
                                    .map((_, idx) => (
                                        <Star
                                            key={`empty-${idx}`}
                                            size={14}
                                            fill="none"
                                            stroke="gray"
                                            className="text-gray-300"
                                        />
                                    ))}
                            </div>

                            <p className="text-gray-700 font-medium text-lg">${product.price.toFixed(2)}</p>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex md:justify-start justify-center">
                <button className="px-8 py-2 bg-custom-orange text-white md:mx-0 mx-auto">Show All Products</button>
            </div>

            <div className="h-full flex md:justify-end justify-center md:mt-0 mt-2">
                <hr className="h-[2px] w-1/2 bg-custom-blue mt-0" />
            </div>
        </section>
    );
}
