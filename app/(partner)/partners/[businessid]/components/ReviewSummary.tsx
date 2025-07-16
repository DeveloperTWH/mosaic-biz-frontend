'use client';

import React from 'react';
import { Star } from 'lucide-react';
import TopSellingRegionsMap from './TopSellingRegionsMap';
import { Business } from '@/types/business';

interface ReviewSummaryProps {
  business: Business;  // Add the prop type here
}

// Example data (can be fetched dynamically)
const ratingData: { stars: number; percentage: number }[] = [
  { stars: 5, percentage: 78 },
  { stars: 4, percentage: 52 },
  { stars: 3, percentage: 32 },
  { stars: 2, percentage: 40 },
  { stars: 1, percentage: 12 },
]; // Empty for new business

const topSellingPlaces: {
  city: string;
  lat: number;
  lng: number;
  region: string;
  percentage: number;
}[] = [
    {
      city: "New York",
      lat: 40.7128,
      lng: -74.0060,
      region: "North America",
      percentage: 32.2,
    },
    {
      city: "London",
      lat: 51.5074,
      lng: -0.1278,
      region: "Europe",
      percentage: 51.6,
    },
    {
      city: "Sydney",
      lat: -33.8688,
      lng: 151.2093,
      region: "Australia", // or Oceania
      percentage: 25.1,
    },
    {
      city: "Tokyo",
      lat: 35.6762,
      lng: 139.6503,
      region: "Asia",
      percentage: 32.2,
    },
    {
      city: "São Paulo",
      lat: -23.5505,
      lng: -46.6333,
      region: "South America",
      percentage: 41.2,
    },
  ]; // Empty for new business

  const averageRating = 4.5;

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ business }) => {
  const hasRatings = ratingData && ratingData.length > 0;
  const hasSalesData = topSellingPlaces && topSellingPlaces.length > 0;

  return (
    <div className="grid grid-cols-1 gap-6 p-6 bg-white rounded shadow lg:grid-cols-2">
      {/* LEFT - Review Summary */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Customer Feedback</h3>

        {hasRatings ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-custom-yellow">
                {[...Array(5)].map((_, i) => {
                  const full = i + 1 <= Math.floor(averageRating);
                  const half = i < averageRating && i + 1 > averageRating;

                  return (
                    <div key={i} className="relative w-5 h-5">
                      {/* Empty Star */}
                      <Star className="absolute w-5 h-5 text-gray-300" />

                      {/* Full Star */}
                      {full && (
                        <Star className="absolute w-5 h-5 fill-custom-yellow text-custom-yellow" />
                      )}

                      {/* Half Star */}
                      {half && (
                        <div className="absolute w-1/2 overflow-hidden">
                          <Star className="w-5 h-5 fill-custom-yellow text-custom-yellow" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="text-lg font-medium text-gray-700">
                {averageRating.toFixed(1)}
              </span>
            </div>

            {ratingData.map((item) => (
              <div key={item.stars} className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-700 w-14">
                  {item.stars} Stars
                </span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full">
                  <div
                    className="h-3 rounded-full bg-custom-orange"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="w-10 text-sm text-right text-gray-700">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-40 text-sm text-gray-500 rounded bg-gray-50">
            <p className="text-sm text-gray-500">No reviews yet</p>
          </div>
        )}
      </div>

      {/* RIGHT - Map + Regions */}
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        {hasSalesData ? (
          <>
            <div className="w-full lg:w-2/3">
              <TopSellingRegionsMap cities={topSellingPlaces} />
            </div>
            <div className="w-full space-y-2 lg:w-1/3">
              {topSellingPlaces.map((region) => (
                <div
                  key={region.city}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>{region.city}</span>
                  <span>{region.percentage}%</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-40 text-sm text-gray-500 rounded bg-gray-50">
            No sales data yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSummary;
