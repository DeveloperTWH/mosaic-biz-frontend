"use client";
import { useState } from "react";
import AddressComponent from "./Component/AddressComponent";

type CartItem = {
    id: string;
    name: string;
    price: number;
    discountedPrice: number;
    discount: number;
    quantity: number;
    imageUrl: string;
    seller: string;
    deliveryDate: string;
};

const cartItemsProduct: CartItem[] = [
    {
        id: "1",
        name: "DEELMO Men Printed Cotton Kurta",
        price: 1600,
        discountedPrice: 917,
        discount: 42,
        quantity: 1,
        imageUrl:
            "https://mosiac-biz-hub.s3.us-east-1.amazonaws.com/uploads/products/1755520615568-variant-0-img-1755520615557-1.jpg",
        seller: "SMPPProducts",
        deliveryDate: "Sat Aug 2",
    },
    {
        id: "2",
        name: "DEELMO Men Printed Cotton Kurta",
        price: 1600,
        discountedPrice: 917,
        discount: 42,
        quantity: 1,
        imageUrl:
            "https://mosiac-biz-hub.s3.us-east-1.amazonaws.com/uploads/products/1755520615568-variant-0-img-1755520615557-1.jpg",
        seller: "SMPPProducts",
        deliveryDate: "Sat Aug 2",
    },
    {
        id: "3",
        name: "DEELMO Men Printed Cotton Kurta",
        price: 1600,
        discountedPrice: 917,
        discount: 42,
        quantity: 1,
        imageUrl:
            "https://mosiac-biz-hub.s3.us-east-1.amazonaws.com/uploads/products/1755520615568-variant-0-img-1755520615557-1.jpg",
        seller: "SMPPProducts",
        deliveryDate: "Sat Aug 2",
    },
    {
        id: "4",
        name: "DEELMO Men Printed Cotton Kurta",
        price: 1600,
        discountedPrice: 917,
        discount: 42,
        quantity: 1,
        imageUrl:
            "https://mosiac-biz-hub.s3.us-east-1.amazonaws.com/uploads/products/1755520615568-variant-0-img-1755520615557-1.jpg",
        seller: "SMPPProducts",
        deliveryDate: "Sat Aug 2",
    },
];

const cartItemsFood: CartItem[] = [
    {
        id: "2",
        name: "Chicken Biryani",
        price: 500,
        discountedPrice: 450,
        discount: 10,
        quantity: 1,
        imageUrl: "https://via.placeholder.com/150",
        seller: "FoodVendor",
        deliveryDate: "Sat Aug 3",
    },
];

export default function CartPage() {
    const [selectedTab, setSelectedTab] = useState<"product" | "food">("product");
    const [itemsProduct, setItemsProduct] = useState<CartItem[]>(cartItemsProduct);
    const [itemsFood, setItemsFood] = useState<CartItem[]>(cartItemsFood);
    const [deliveryAddress, setDeliveryAddress] = useState(
        "John, 700078, 66 Sreepur Road Kolkata 78"
    );

    const totalAmountProduct = itemsProduct.reduce(
        (total, item) => total + item.discountedPrice * item.quantity,
        0
    );
    const totalAmountFood = itemsFood.reduce(
        (total, item) => total + item.discountedPrice * item.quantity,
        0
    );

    const totalDiscountProduct = itemsProduct.reduce(
        (total, item) => total + (item.price - item.discountedPrice) * item.quantity,
        0
    );
    const totalDiscountFood = itemsFood.reduce(
        (total, item) => total + (item.price - item.discountedPrice) * item.quantity,
        0
    );

    return (
        <div className="bg-[#ebecef]">
            <div className="flex flex-wrap gap-5 px-4 py-6 mx-auto max-w-7xl">
                {/* Tab Navigation */}
                <div className="w-full lg:w-2/3">
                    <div className="flex gap-5 px-5 mb-8 bg-white">
                        <button
                            className={`sm:p-5 p-2 pt-3 sm:text-lg text-sm font-semibold ${selectedTab === "product"
                                ? "border-b-4 border-blue-500"
                                : "text-gray-800"
                                }`}
                            onClick={() => setSelectedTab("product")}
                        >
                            Mosaic biz hub ({itemsProduct.length})
                        </button>
                        <button
                            className={`sm:p-5 p-2 pt-3 sm:text-lg text-sm font-semibold ${selectedTab === "food"
                                ? "border-b-4 border-blue-500"
                                : "text-gray-800"
                                }`}
                            onClick={() => setSelectedTab("food")}
                        >
                            Grocery ({itemsFood.length})
                        </button>
                    </div>

                    {/* Delivery Address */}
                    <AddressComponent />

                    {/* Cart Items */}
                    {selectedTab === "product" ? (
                        <div className="mt-6 space-y-6 bg-white">
                            {itemsProduct.map((item) => (
                                <div key={item.id} className="p-4 rounded-md">
                                    <div className="flex items-center gap-4">
                                        <img
                                            className="object-cover w-auto h-20"
                                            src={item.imageUrl}
                                            alt={item.name}
                                        />
                                        <div className="flex flex-col justify-between">
                                            <div className="font-semibold text-gray-800">{item.name}</div>
                                            <div className="text-xs text-gray-500">{`Seller: ${item.seller}`}</div>
                                            <div className="flex items-center gap-2 mt-5">
                                                <div className="text-base text-gray-800">
                                                    ₹{item.discountedPrice}
                                                </div>

                                                {item.discountedPrice < item.price && (
                                                    <>
                                                        <div className="text-sm text-gray-400 line-through">
                                                            ₹{item.price}
                                                        </div>
                                                        <div className="text-sm text-green-600">
                                                            {`${item.discount}% off`}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-5">
                                        <div className="flex items-center space-x-2">
                                            <button className="px-3 py-1 text-lg bg-gray-200 rounded-md">-</button>
                                            <div className="text-sm">{item.quantity}</div>
                                            <button className="px-3 py-1 text-lg bg-gray-200 rounded-md">+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6 space-y-6 bg-white">
                            {itemsFood.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                                    <div className="flex items-center">
                                        <img className="object-cover w-16 h-16" src={item.imageUrl} alt={item.name} />
                                        <div className="ml-4">
                                            <div className="font-medium text-gray-800">{item.name}</div>
                                            <div className="text-xs text-gray-500">{`Seller: ${item.seller}`}</div>
                                            <div className="text-xs text-gray-500">{`Delivery by ${item.deliveryDate}`}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-800">{`₹${item.discountedPrice} ₹${item.discount}`}</div>
                                    <div className="flex items-center space-x-2">
                                        <button className="px-2 py-1 bg-gray-200 rounded-full">-</button>
                                        <div className="text-sm">{item.quantity}</div>
                                        <button className="px-2 py-1 bg-gray-200 rounded-full">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Details */}
                <div className="w-full lg:w-1/4 lg:mt-0">
                    <div className="w-full bg-white border border-gray-200">
                        <div className="p-5 mb-2 text-lg text-gray-800 border-b-2 border-gray-200">
                            <h3 className="pt-2 pb-2 text-lg text-gray-800">Price Details</h3>
                        </div>
                        {selectedTab === "product" ? (
                            <div className="p-5">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <div>Price (1 item)</div>
                                    <div>₹499</div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <div>Discount</div>
                                    <div>₹280</div>
                                </div>
                                <div className="flex justify-between pt-2 pb-2 mt-4 text-lg text-gray-800 border-t-2 border-b-2 border-gray-200">
                                    <div>Total Amount</div>
                                    <div>₹223</div>
                                </div>
                                <div className="mt-2 text-sm text-green-600">
                                    {`You will save ₹276 on this order`}
                                </div>
                                <div className="flex items-center justify-end mt-5 space-x-2">
                                    <button className="px-4 py-2 text-white bg-blue-500">Place Order</button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-5">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <div>Price (1 item)</div>
                                    <div>₹499</div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <div>Discount</div>
                                    <div>₹280</div>
                                </div>
                                <div className="flex justify-between pt-2 pb-2 mt-4 text-lg text-gray-800 border-t-2 border-b-2 border-gray-200">
                                    <div>Total Amount</div>
                                    <div>₹223</div>
                                </div>
                                <div className="mt-2 text-sm text-green-600">
                                    {`You will save ₹276 on this order`}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
