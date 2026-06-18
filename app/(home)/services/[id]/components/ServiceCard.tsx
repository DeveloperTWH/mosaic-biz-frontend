"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { Service } from '@/types/service';

interface ServiceCardProps {
  service: Service;
  isActive: boolean;
  isMobile: boolean;
  onClick: (id: String) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isActive,
  isMobile,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(service._id)}
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
          src={service.coverImage}
          alt={service.title}
          width={150}
          height={150}
          className="object-cover w-full h-full col-span-1"
        />
        <div className="col-span-2 p-4">
          <h3 className="mb-1 text-lg font-semibold">{service.title}</h3>
          <div className="my-1 text-sm">
            ⭐ {service.averageRating} ({service.totalReviews} Reviews)
          </div>
          <div className="flex flex-wrap gap-2 my-2 text-xs">
            {service.services.map((tag) => (
              <span
                key={tag._id}
                className="px-2 py-1 text-gray-800 bg-gray-200 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <p className="text-sm">{service.description}</p>
          <Link
            href={`/vendor-profile/service-vendor/${service._id}`}
            onClick={(e) => e.stopPropagation()}
            className={`inline-flex items-center gap-1 mt-4 hover:underline text-[14px] ${
              isActive ? "text-custom-orange" : "text-black"
            }`}
          >
            Read More <MoveRight className="ml-1" size={14} />
          </Link>
        </div>
      </div>

      {isMobile && isActive && (
        <div className="w-full h-64 px-4 mt-4 mb-5">
          <iframe
            src={`https://www.google.com/maps?q=${service.contact.address}&output=embed`}
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
