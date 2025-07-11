import React from "react";
import { Service } from "@/types/service"; // adjust path if needed
import Image from "next/image";
import Link from "next/link";


interface BookServicesProps {
  services: Service[];
}

const BookServices: React.FC<BookServicesProps> = ({ services }) => {
  return (
    <section className="px-6 py-10 mx-auto max-w-7xl">

      {services.length === 0 ? (
        <p className="text-center text-gray-600">No services found.</p>
      ) : (
        <>
          <h2 className="mb-4 text-2xl font-bold">Book Your Services</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service._id} className="overflow-hidden border rounded-lg shadow-sm">
                <Image
                  src={service.coverImage || "/Service/19099.png"}
                  alt={service.title}
                  width={600}
                  height={400}
                  className="object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <p className="text-sm text-gray-500">{service.contact?.address || 'No address'}</p>
                  <p className="mt-2 text-sm text-gray-700">
                    {service.description.slice(0, 100) || 'No description'}
                  </p>
                  <Link
                    href={`/service/${service.slug}`}
                    className="inline-block mt-3 text-primary hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default BookServices;
