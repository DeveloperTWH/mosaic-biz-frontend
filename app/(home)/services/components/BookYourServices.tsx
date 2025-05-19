import Image from "next/image";
import React from "react";

const BookServices = () => {
  return (
     <section className="py-10 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Book Your Services</h2>
        <p className="text-gray-600 mb-6 max-w-2xl">
          Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod tempor enim minim veniam quis nostrud.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden shadow-sm">
              <Image
                src={`/images/service-${i + 1}.jpg`}
                alt="Service"
                width={600}
                height={400}
                className="object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Lorem Ipsum</h3>
                <p className="text-sm text-gray-500">Category</p>
                <p className="mt-2 text-sm text-gray-700">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Present vitae libero venenatis tristique.
                </p>
                <button className="mt-3 text-primary hover:underline">Read More →</button>
              </div>
            </div>
          ))}
        </div>
      </section>
  );
};

export default BookServices;
