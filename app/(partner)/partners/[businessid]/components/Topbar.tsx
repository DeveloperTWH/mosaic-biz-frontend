// components/partners/Topbar.tsx
'use client';

import React from 'react';
import { Bell, Globe, UserCircle2, Search } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="flex items-center justify-between w-full px-6 py-4 bg-white shadow">
      <h2 className="text-lg font-semibold">Welcome !</h2>
      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search here ..."
            className="py-1 pl-10 pr-4 text-sm border rounded-full focus:outline-none"
          />
          <Search className="absolute left-3 top-1.5 w-4 h-4 text-gray-400" />
        </div>

        {/* Language and Country */}
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-500" />
          <span className="text-sm">English</span>
          {/* <img src="/flags/uk.png" alt="UK Flag" className="w-5 h-3 ml-1" /> */}
        </div>

        {/* Notifications */}
        <button className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center justify-center w-8 h-8 font-semibold text-white rounded-full bg-sky-500">
          M
        </div>
      </div>
    </header>
  );
};

export default Topbar;
