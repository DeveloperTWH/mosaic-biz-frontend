'use client';

import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  UserCircle,
  Settings,
  LifeBuoy,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Inventory', icon: <Boxes className="w-5 h-5" /> },
    { label: 'Orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { label: 'My Account', icon: <UserCircle className="w-5 h-5" /> },
    { label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { label: 'Support', icon: <LifeBuoy className="w-5 h-5" /> },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-40 flex flex-col w-64 h-screen bg-[#333333] shadow transform transition-transform duration-300 md:static md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-hidden`}
      >
        {/* ✅ Close Button (Mobile Only) */}
        <div className="flex justify-end p-4 md:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-white rounded hover:bg-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center p-6">
          <div className="p-1 border-2 border-white rounded-full">
            <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white bg-red-600 rounded-full">
              R
            </div>
          </div>
          <h2 className="mt-2 text-lg font-semibold text-white">Ray Ban</h2>
        </div>

        <nav className="flex-1 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item, i) => (
            <button
              key={i}
              className="flex items-center w-full gap-3 px-4 py-4 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:bg-custom-blue"
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div>
          <button className="flex items-center w-full gap-3 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
