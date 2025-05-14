export default function ShopProducts() {
    return (
        <section className="pt-20 pb-10 w-4/5 mx-auto">
            <div className="w-[95%] mx-auto">
                <div className="w-1/2 mx-auto">
                    <h2 className="text-4xl font-bold mb-4 uppercase text-center">Shop Products</h2>
                    <hr className="h-[2px] w-[100px] bg-green-900 mx-auto" />
                    <hr className="h-[2px] w-[100px] bg-green-900 mx-auto mt-[1px]" />
                    <p className="text-gray-600 mb-6 text-center mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elitsed eiusmod tempor enim minim veniam quis notru exercit ation Lorem ipsum dolor sit amet. Veniam quis notru exercit.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20">
                    {[1, 2, 3, 4].map((_, i) => (
                        <div key={i} className="border rounded-lg p-4">
                            <img src="/product-placeholder.png" alt="Product" className="w-full h-40 object-cover mb-3" />
                            <h3 className="font-semibold text-sm">Feature Product Title</h3>
                            <p className="text-gray-500 text-sm">$00.00</p>
                        </div>
                    ))}
                </div>
                <button className="mt-6 px-4 py-2 bg-orange-500 text-white rounded">Show All Products</button>
                <div className="h-full flex justify-end">
                    <hr className="h-[2px] w-1/2 bg-blue-900 mt-0"/>
                </div>
            </div>

        </section>
    );
}