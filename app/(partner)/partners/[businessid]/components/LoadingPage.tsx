// components/LoadingPage.tsx
import React from 'react';

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-32 h-32 mb-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
      <p className="text-xl font-semibold text-gray-700">Loading Business Data...</p>
    </div>
  );
};

export default LoadingPage;
