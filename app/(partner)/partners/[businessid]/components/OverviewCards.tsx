'use client';

import React from 'react';
import {
  AlertTriangle,
  PackageSearch,
  PlusCircle,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  DashboardActionLink,
  DashboardStatCard,
  type DashboardTone,
} from '@/components/ui/dashboard-primitives';

interface OverviewCardsProps {
  listingType: "product" | "service" | "food";
  total: number;
  totalReviews: number;
  totalOrdersOrBookings: number;
  outOfStockOrUnpublished: number;
}

const OverviewCards: React.FC<OverviewCardsProps> = ({
  listingType,
  total,
  totalReviews,
  totalOrdersOrBookings,
  outOfStockOrUnpublished,
}) => {
  const { businessid } = useParams();
  const listingLabel =
    listingType === "product"
      ? "products"
      : listingType === "service"
        ? "services"
        : "food items";

  const overviewData = [
    {
      label:
        listingType === "product"
          ? "Total Products"
          : listingType === "service"
            ? "Total Services"
            : "Total Food",
      value: total,
      icon: <PackageSearch className="h-5 w-5" />,
      tone: "gold" as DashboardTone,
      description: `Current ${listingLabel} reported by your inventory API.`,
    },
    {
      label: "Total Reviews",
      value: totalReviews,
      icon: <Star className="h-5 w-5" />,
      tone: "navy" as DashboardTone,
      description: "Review count currently available for this business.",
    },
    {
      label: listingType === "service" ? "Total Bookings" : "Total Orders",
      value: totalOrdersOrBookings,
      icon: <ShoppingBag className="h-5 w-5" />,
      tone: "orange" as DashboardTone,
      description:
        listingType === "service"
          ? "Booking activity available for this service business."
          : "Order activity available for this business.",
    },
    {
      label: listingType === "service" ? "Unpublished Services" : "Out Of Stock",
      value: outOfStockOrUnpublished,
      icon: <AlertTriangle className="h-5 w-5" />,
      tone: (outOfStockOrUnpublished > 0 ? "warning" : "neutral") as DashboardTone,
      description:
        outOfStockOrUnpublished > 0
          ? "Needs attention before customers can buy or book."
          : "No inventory attention needed right now.",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="dashboard-page-eyebrow">Operations</p>
          <h2 className="font-poppins text-lg font-semibold text-dashboard-text">
            Business overview
          </h2>
        </div>
        <DashboardActionLink href={`/partners/${businessid}/inventory`} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4" /> Manage inventory
        </DashboardActionLink>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewData.map((item) => (
          <DashboardStatCard
            key={item.label}
            label={item.label}
            value={item.value}
            description={item.description}
            icon={item.icon}
            tone={item.tone}
          />
        ))}
      </div>
    </section>
  );
};

export default OverviewCards;
