// app/(partners)/dashboard/page.tsx
'use client';

import React from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import OverviewCards from './components/OverviewCards';
import SalesSection from './components/SalesSection';
import SubscriptionPlan from './components/SubscriptionPlan';
import ProductTable from './components/ProductTable';
import ReviewSummary from './components/ReviewSummary';

const DashboardPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <OverviewCards />
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="w-full lg:w-3/4">
              <SalesSection />
            </div>
            <div className="w-full lg:w-1/4">
              <SubscriptionPlan />
            </div>
          </div>

          <ProductTable />
          <ReviewSummary />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
