"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight, PhoneCall, Pin } from "lucide-react";
import StarRating from "../../renderStars";

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
  number: string;
}

interface ServiceCardProps {
  service: Service;
  isActive: boolean;
  isMobile: boolean;
  onClick: (id: number) => void;
  redirect?: boolean;
}

const FarmsCard: React.FC<ServiceCardProps> = ({
  service,
  isActive,
  isMobile,
  onClick,
  redirect
}) => {
  return (
    <div
      onClick={() => onClick(service.id)}
      className={`cursor-pointer border rounded-md overflow-hidden shadow-sm transition-all duration-300 relative ${isActive ? "text-white" : "text-black"
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
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/3 h-48 sm:h-auto">
          <Image
            src={service.image}
            alt={service.title}
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full sm:w-2/3 p-4 space-y-2">
          <h3 className="font-semibold text-lg">{service.title}</h3>
          <div className="text-yellow-500">
            <StarRating rating={service.rating} />
          </div>
          <p className={`text-xs sm:text-sm ${isActive ? "text-white/80" : "text-gray-600"}`}>
            {service.tags.join(" | ")}
          </p>

          <div className="pt-2 space-y-2">
            <div className="flex gap-2 items-center text-custom-blue font-bold">
              <PhoneCall size={16} fill="#16A1C0" />
              <p className="text-sm text-custom-blue underline">{service.number}</p>
            </div>
            <div className="flex gap-2 items-start font-bold">
              <Pin size={20} fill="#5f5f5f" stroke="#5f5f5f" />
              <p className="text-sm">{service.description}</p>
            </div>

            {redirect && (
              <div>
                <Link
                  href={`/foods/resturant/${service.id}`}
                  className={`${isActive ? 'text-white' : 'text-black'} hover:underline text-sm`}
                  onClick={(e) => e.stopPropagation()}
                >
                  Read more →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map shown below card for mobile active view */}
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

export default FarmsCard;
