"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";

interface Service {
  id: number;
  title: string;
  description: string;
  location: string;
  image: string;
  tags: string[];
  rating: number;
  reviews: number;
  mapQuery: string;
}

interface ServiceCardProps {
  service: Service;
  isActive: boolean;
  isMobile: boolean;
  onClick: (id: number) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isActive,
  isMobile,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(service.id)}
      className={`cursor-pointer border rounded-md overflow-hidden shadow-sm transition-all duration-300 relative ${
        isActive ? "text-white" : "text-black"
      }`}
      style={
        isActive
          ? {
              backgroundImage:
                "linear-gradient(216.65deg, rgba(0, 0, 0, 0.36) -10.96%, rgba(0, 0, 0, 0.87) 29.64%, #000000 70.76%), url('/Footer/footer-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      <div className="grid grid-cols-3">
        <Image
          src={service.image}
          alt={service.title}
          width={150}
          height={150}
          className="object-cover h-full w-full col-span-1"
        />
        <div className="col-span-2 p-4">
          <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
          <div className="my-1 text-sm">
            ⭐ {service.rating} ({service.reviews} Reviews)
          </div>
          <div className="flex flex-wrap gap-2 text-xs my-2">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm">{service.description}</p>
          <Link
            href={`/services/home-care-service/${service.id}`}
            className={`inline-flex items-center gap-1 mt-4 hover:underline text-[14px] ${
              isActive ? "text-custom-orange" : "text-black"
            }`}
          >
            Read More <MoveRight className="ml-1" size={14} />
          </Link>
        </div>
      </div>

      {isMobile && isActive && (
        <div className="w-full h-64 mt-4 px-4 mb-5">
          <iframe
            src={`https://www.google.com/maps?q=${service.mapQuery}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="rounded"
          />
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
