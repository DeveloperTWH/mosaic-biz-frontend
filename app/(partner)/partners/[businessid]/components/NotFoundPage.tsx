// components/NotFoundPage.tsx
import React from 'react';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
      <div className="mb-4 text-6xl font-bold text-gray-800">404</div>
      <p className="mb-4 text-2xl text-gray-700">Business not found</p>
      <p className="mb-6 text-lg text-gray-500">We couldn't find the business you're looking for. Please check the URL or go back to the homepage.</p>
      <Link href="/" className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
