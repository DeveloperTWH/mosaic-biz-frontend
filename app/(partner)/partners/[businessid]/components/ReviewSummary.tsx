// components/partners/ReviewSummary.tsx
'use client';

import React from 'react';
import { Star } from 'lucide-react';

const ReviewSummary = () => {
  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="mb-4 text-lg font-semibold">Customer Feedback</h3>
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400" />
            ))}
          </div>
          <p className="mt-1 text-3xl font-bold">4.5</p>
          <p className="text-sm text-gray-500">Overall Rating</p>
        </div>
        <div className="flex-1">
          <p className="text-gray-600">
            "Great product quality and very responsive customer support. Highly recommend this store for quick orders."
          </p>
          <p className="mt-2 text-sm text-gray-400">- User123</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;