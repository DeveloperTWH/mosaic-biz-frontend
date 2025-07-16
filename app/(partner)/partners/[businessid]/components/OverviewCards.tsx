'use client';

import React from 'react';
import {
  PackageSearch,
  Star,
  ShoppingBag,
  AlertTriangle,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Business } from '@/types/business';

interface OverviewCardsProps {
  business: Business;  // Add the prop type here
}

const overviewData = [
  {
    label: 'Total Products',
    value: 2025,
    icon: <PackageSearch className="w-5 h-5 text-white" />,
    bg: 'bg-custom-yellow',
    border: 'border-l-4 border-custom-yellow',
  },
  {
    label: 'Total Reviews',
    value: 42,
    icon: <Star className="w-5 h-5 text-white" />,
    bg: 'bg-custom-blue',
    border: 'border-l-4 border-custom-blue',
  },
  {
    label: 'Total Orders',
    value: 4789,
    icon: <ShoppingBag className="w-5 h-5 text-white" />,
    bg: 'bg-custom-orange',
    border: 'border-l-4 border-custom-orange',
  },
  {
    label: 'Out Of Stock',
    value: 12,
    icon: <AlertTriangle className="w-5 h-5 text-white" />,
    bg: 'bg-gray-400',
    border: 'border-l-4 border-gray-400',
  },
];

const OverviewCards: React.FC<OverviewCardsProps> = ({ business }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <h2 className="text-lg font-semibold heading">Overview</h2>
        <Link
          href="business/new"
          className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white rounded bg-custom-orange hover:opacity-90 sm:w-auto"
        >
          <PlusCircle className="w-4 h-4" /> Add New Business
        </Link>
      </div>

      {/* ✅ Fully Responsive Grid */}
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {overviewData.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-4 bg-white rounded shadow ${item.border}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg}`}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className="text-xl font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewCards;
