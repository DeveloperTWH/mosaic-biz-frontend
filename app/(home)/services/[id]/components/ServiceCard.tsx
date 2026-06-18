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
      className={`market-card relative cursor-pointer overflow-hidden transition-all duration-300 ${
        isActive
          ? "border-market-gold/40 bg-market-elevated ring-1 ring-market-gold/30"
          : "hover:border-white/20"
      }`}
    >
      {isActive ? (
        <div className="pointer-events-none absolute inset-0 bg-market-glow-radial opacity-60" aria-hidden />
      ) : null}
      <div className="relative grid grid-cols-3">
        <Image
          src={service.coverImage}
          alt={service.title}
          width={150}
          height={150}
          className="col-span-1 h-full w-full object-cover"
        />
        <div className="col-span-2 p-4">
          <h3 className="mb-1 text-lg font-semibold text-market-text">{service.title}</h3>
          {(service.averageRating > 0 || service.totalReviews > 0) && (
            <div className="my-1 text-sm text-market-muted">
              {service.averageRating} ({service.totalReviews} Reviews)
            </div>
          )}
          <div className="my-2 flex flex-wrap gap-2 text-xs">
            {service.services.map((tag) => (
              <span
                key={tag._id}
                className="rounded-full bg-market-elevated px-2 py-1 text-market-muted"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <p className="text-sm text-market-muted line-clamp-3">{service.description}</p>
          <Link
            href={`/vendor-profile/service-vendor/${service._id}`}
            className="mt-4 inline-flex items-center gap-1 text-sm text-market-gold hover:text-market-gold-hover hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Read More <MoveRight className="ml-1" size={14} />
          </Link>
        </div>
      </div>

      {isMobile && isActive && (
        <div className="relative mb-5 mt-4 h-64 w-full px-4">
          <iframe
            src={`https://www.google.com/maps?q=${service.contact.address}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="rounded border border-white/10"
          />
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
